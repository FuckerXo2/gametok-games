/**
 * GameTok Web Games SDK (v1.2.0)
 * https://games.gametok.co/sdk/v1.js
 *
 * The official client-side SDK for publishing HTML5 & WebGL games on GameTok.
 * - Zero dependencies, ~4KB footprint
 * - Instant Player Identity (auto-login without sign-in forms)
 * - In-app purchases and ads: NOT available yet (calls reject with code NOT_AVAILABLE)
 * - Global Leaderboards & Real-time Analytics
 * - Built-in Local Sandbox mode for seamless localhost development
 */
(function (global) {
  'use strict';

  // Read config from script tag
  var currentScript = document.currentScript || (function () {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      if (scripts[i].src && scripts[i].src.indexOf('/sdk/v1.js') !== -1) {
        return scripts[i];
      }
    }
    return null;
  })();

  var scriptGameId = (currentScript && currentScript.getAttribute('data-game-id')) || '';
  var scriptCreator = (currentScript && currentScript.getAttribute('data-creator-handle')) || '';

  // Determine if running inside GameTok player shell
  var isInIframe = (function () {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  })();

  // State & pending callbacks
  var config = {
    gameId: scriptGameId || 'dev_sandbox_game',
    creatorHandle: scriptCreator || '',
    sandbox: !isInIframe
  };

  var pendingRequests = {};
  var eventListeners = {
    pause: [],
    resume: [],
    mute: [],
    unmute: []
  };

  function notAvailable(feature) {
    var err = new Error(feature + ' are not available on GameTok yet.');
    err.code = 'NOT_AVAILABLE';
    return Promise.reject(err);
  }

  function generateReqId() {
    return 'gt_' + Date.now() + '_' + Math.floor(Math.random() * 1000000);
  }

  function postToParent(message) {
    if (isInIframe && window.parent) {
      window.parent.postMessage(message, '*');
    }
  }

  // Cross-origin message handler from GameTok player shell
  window.addEventListener('message', function (event) {
    var data = event.data;
    if (!data || typeof data !== 'object') return;

    // Handle responses for pending async requests
    if (data.requestId && pendingRequests[data.requestId]) {
      var req = pendingRequests[data.requestId];
      delete pendingRequests[data.requestId];

      if (data.success) {
        req.resolve(data.result || data);
      } else {
        req.reject(new Error(data.error || 'Request failed'));
      }
      return;
    }

    // Handle shell events
    switch (data.type) {
      case 'GAMETOK_PAUSE':
        eventListeners.pause.forEach(function (cb) { cb(); });
        break;
      case 'GAMETOK_RESUME':
        eventListeners.resume.forEach(function (cb) { cb(); });
        break;
      case 'GAMETOK_MUTE':
        eventListeners.mute.forEach(function (cb) { cb(); });
        break;
      case 'GAMETOK_UNMUTE':
        eventListeners.unmute.forEach(function (cb) { cb(); });
        break;
    }
  });

  var GameTok = {
    version: '1.2.0',
    isEmbedded: isInIframe,

    /**
     * Initialize SDK with credentials
     */
    init: function (options) {
      options = options || {};
      if (options.gameId) config.gameId = options.gameId;
      if (options.creatorHandle) config.creatorHandle = options.creatorHandle;
      if (options.sandbox !== undefined) config.sandbox = options.sandbox;

      postToParent({
        type: 'GAMETOK_INIT',
        gameId: config.gameId,
        creatorHandle: config.creatorHandle,
        title: document.title
      });

      return Promise.resolve({ success: true, gameId: config.gameId });
    },

    /**
     * Notify GameTok that assets are loaded and game is ready to play
     */
    ready: function () {
      postToParent({
        type: 'GAMETOK_READY',
        gameId: config.gameId,
        title: document.title
      });
      console.log('[GameTok SDK] Game is ready');
    },

    /**
     * Player Identity API
     */
    player: {
      getPlayer: function () {
        if (!isInIframe) {
          // Localhost dev mock
          return Promise.resolve({
            id: 'usr_sandbox_123',
            username: 'TestPlayer_Guest',
            displayName: 'Guest Player',
            avatarUrl: 'https://games.gametok.co/assets/adaptive-icon.png',
            coins: 250,
            isGuest: true
          });
        }

        return new Promise(function (resolve, reject) {
          var reqId = generateReqId();
          pendingRequests[reqId] = { resolve: resolve, reject: reject };
          postToParent({
            type: 'GAMETOK_GET_PLAYER',
            requestId: reqId
          });

          // Fallback timeout in case parent doesn't respond
          setTimeout(function () {
            if (pendingRequests[reqId]) {
              delete pendingRequests[reqId];
              resolve({
                id: 'usr_guest',
                username: 'Guest',
                displayName: 'GameTok Player',
                coins: 0,
                isGuest: true
              });
            }
          }, 2500);
        });
      }
    },

    /**
     * In-app purchases and ads are NOT available on GameTok yet. These used to simulate a
     * checkout / ad and return fake receipts; they now reject with code NOT_AVAILABLE so a
     * game never grants items for money that was never taken. Kept so existing calls fail
     * cleanly instead of throwing "undefined is not a function".
     */
    payments: {
      purchase: function () { return notAvailable('In-app purchases'); },
      getCatalog: function () { return Promise.resolve([]); }
    },

    ads: {
      showRewardedAd: function () { return notAvailable('Rewarded ads'); },
      showInterstitial: function () { return notAvailable('Interstitial ads'); }
    },

    /**
     * Global Leaderboard API
     */
    leaderboards: {
      submitScore: function (score) {
        var num = parseInt(score, 10);
        if (isNaN(num)) return;

        postToParent({
          type: 'GAMETOK_SCORE',
          score: num,
          gameId: config.gameId
        });
        console.log('[GameTok SDK] Score submitted: ' + num);
      }
    },

    /**
     * Lifecycle Listeners
     */
    on: function (eventName, callback) {
      if (eventListeners[eventName] && typeof callback === 'function') {
        eventListeners[eventName].push(callback);
      }
    },

    gameOver: function (finalScore) {
      var payload = { type: 'GAMETOK_GAME_OVER', gameId: config.gameId };
      if (typeof finalScore === 'number') {
        payload.score = finalScore;
      }
      postToParent(payload);
    }
  };

  // Expose globally
  global.GameTok = GameTok;

  // Auto-ready trigger once page finishes loading
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(GameTok.ready, 80);
  } else {
    window.addEventListener('load', function () {
      setTimeout(GameTok.ready, 80);
    });
  }

})(typeof window !== 'undefined' ? window : this);
