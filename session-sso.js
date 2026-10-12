/**
 * Shared sign-in between gametok.co and games.gametok.co.
 *
 * Browsers keep localStorage per origin, so each site has its own copy of the session.
 * This talks to https://gametok.co/session-bridge.html in a hidden iframe (same site, so it
 * sees gametok.co's real storage) to read, store, or clear the shared session.
 *
 *   GameTokSSO.get()            -> Promise<{ token, user } | null>
 *   GameTokSSO.set(token, user) -> Promise<void>   (after signing in here)
 *   GameTokSSO.clear(token)     -> Promise<void>   (after signing out here)
 *
 * Every call resolves (never rejects) within TIMEOUT_MS, so a blocked iframe just means
 * "no shared session".
 */
(function () {
  'use strict';

  var BRIDGE_ORIGIN = 'https://gametok.co';
  var BRIDGE_URL = BRIDGE_ORIGIN + '/session-bridge.html';
  var TIMEOUT_MS = 4000;

  var framePromise = null;
  var pending = {};

  window.addEventListener('message', function (event) {
    if (event.origin !== BRIDGE_ORIGIN || !event.data || !event.data.requestId) return;
    var resolve = pending[event.data.requestId];
    if (resolve) {
      delete pending[event.data.requestId];
      resolve(event.data);
    }
  });

  function getFrame() {
    if (framePromise) return framePromise;
    framePromise = new Promise(function (resolve) {
      var iframe = document.createElement('iframe');
      iframe.src = BRIDGE_URL;
      iframe.title = 'GameTok session';
      iframe.setAttribute('aria-hidden', 'true');
      iframe.tabIndex = -1;
      iframe.style.cssText = 'position:absolute;width:0;height:0;border:0;visibility:hidden;';
      var done = false;
      var finish = function (value) {
        if (done) return;
        done = true;
        resolve(value);
      };
      window.addEventListener('message', function onReady(event) {
        if (event.origin === BRIDGE_ORIGIN && event.data && event.data.type === 'GAMETOK_SESSION_BRIDGE_READY') {
          window.removeEventListener('message', onReady);
          finish(iframe);
        }
      });
      setTimeout(function () { finish(null); }, TIMEOUT_MS);
      (document.body || document.documentElement).appendChild(iframe);
    });
    return framePromise;
  }

  function ask(message) {
    return getFrame().then(function (iframe) {
      if (!iframe || !iframe.contentWindow) return null;
      return new Promise(function (resolve) {
        var requestId = 'sso_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2);
        pending[requestId] = resolve;
        message.requestId = requestId;
        iframe.contentWindow.postMessage(message, BRIDGE_ORIGIN);
        setTimeout(function () {
          if (pending[requestId]) {
            delete pending[requestId];
            resolve(null);
          }
        }, TIMEOUT_MS);
      });
    });
  }

  window.GameTokSSO = {
    get: function () {
      return ask({ type: 'GAMETOK_SESSION_GET' }).then(function (reply) {
        return reply && reply.token ? { token: reply.token, user: reply.user || null } : null;
      });
    },
    set: function (token, user) {
      return ask({ type: 'GAMETOK_SESSION_SET', token: token, user: user || null }).then(function () {});
    },
    clear: function (token) {
      return ask({ type: 'GAMETOK_SESSION_CLEAR', token: token }).then(function () {});
    }
  };
})();
