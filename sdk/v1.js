/**
 * GameTok Web Games SDK (v1.2.0)
 * https://games.gametok.co/sdk/v1.js
 *
 * The official client-side SDK for publishing HTML5 & WebGL games on GameTok.
 * - Zero dependencies, ~4KB footprint
 * - Instant Player Identity (auto-login without sign-in forms)
 * - In-App Purchases & Microtransactions with 1-click checkout
 * - Rewarded Ads & Interstitials
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
     * In-App Purchases & Payments API (Platform Revenue Split)
     */
    payments: {
      /**
       * Trigger a 1-click in-game purchase (Apple Pay, Card, GameTok Coins)
       * @param {Object} item - { itemId, title, amount, currency }
       * @returns {Promise<Object>} { success, receiptId, itemId, amount, timestamp }
       */
      purchase: function (item) {
        if (!item || !item.itemId || item.amount === undefined) {
          return Promise.reject(new Error('Invalid purchase item: itemId and amount are required.'));
        }

        var payload = {
          itemId: String(item.itemId),
          title: item.title || 'In-game item',
          amount: parseFloat(item.amount),
          currency: item.currency || 'USD',
          gameId: config.gameId
        };

        if (!isInIframe) {
          // Localhost dev simulation modal
          return new Promise(function (resolve) {
            var confirmed = confirm('[GameTok Sandbox Checkout]\n\n' +
              'Item: ' + payload.title + ' (' + payload.itemId + ')\n' +
              'Price: $' + payload.amount.toFixed(2) + ' ' + payload.currency + '\n\n' +
              'Approve simulated payment?');

            if (confirmed) {
              resolve({
                success: true,
                receiptId: 'rcpt_sandbox_' + Math.floor(Math.random() * 1000000),
                itemId: payload.itemId,
                amount: payload.amount,
                currency: payload.currency,
                sandbox: true,
                timestamp: Date.now()
              });
            } else {
              resolve({
                success: false,
                error: 'USER_CANCELLED',
                itemId: payload.itemId
              });
            }
          });
        }

        return new Promise(function (resolve, reject) {
          var reqId = generateReqId();
          pendingRequests[reqId] = { resolve: resolve, reject: reject };

          postToParent({
            type: 'GAMETOK_PURCHASE_REQUEST',
            requestId: reqId,
            payload: payload
          });
        });
      },

      /**
       * Get available items configured for this game
       */
      getCatalog: function () {
        return Promise.resolve([
          { itemId: 'gems_100', title: '100 Gems', amount: 0.99, currency: 'USD' },
          { itemId: 'gems_500', title: '500 Gems Bundle', amount: 3.99, currency: 'USD' },
          { itemId: 'vip_pass', title: 'Season VIP Pass', amount: 9.99, currency: 'USD' }
        ]);
      }
    },

    /**
     * Ads Monetization API (Rewarded Video & Interstitials)
     */
    ads: {
      showRewardedAd: function () {
        if (!isInIframe) {
          return new Promise(function (resolve) {
            console.log('[GameTok Sandbox] Rewarded video simulated');
            setTimeout(function () {
              resolve({ rewarded: true });
            }, 1000);
          });
        }

        return new Promise(function (resolve, reject) {
          var reqId = generateReqId();
          pendingRequests[reqId] = { resolve: resolve, reject: reject };
          postToParent({
            type: 'GAMETOK_SHOW_REWARDED_AD',
            requestId: reqId
          });
        });
      },

      showInterstitial: function () {
        if (!isInIframe) {
          return Promise.resolve({ complete: true });
        }

        return new Promise(function (resolve, reject) {
          var reqId = generateReqId();
          pendingRequests[reqId] = { resolve: resolve, reject: reject };
          postToParent({
            type: 'GAMETOK_SHOW_INTERSTITIAL',
            requestId: reqId
          });
        });
      }
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
