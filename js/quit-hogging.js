(function () {
  'use strict';

  // ── Default configuration ──────────────────────────────────────────

  const DEFAULTS = {
    block: false,
    blockTitle: 'AdBlock Detected!',
    blockContent: 'Please whitelist our website in order to view our content.',
    blockButtonText: '',
    blockButtonLink: '',

    displayMessage: false,
    displayMessageId: '',
    displayMessageContent: 'Please whitelist our website from AdBlock.',

    persistent: true,

    theme: {
      overlayBackground: 'rgba(0, 0, 0, 0.85)',
      boxBackground: '#3b6ccd',
      textColor: '#ffffff',
      titleColor: '#ffffff',
      fontFamily: 'Arial, Liberation Sans, DejaVu Sans, sans-serif',
      buttonBackground: '#ffffff',
      buttonColor: '#3b6ccd',
      borderRadius: '8px',
      maxWidth: '600px'
    },

    animation: 'fade',
    animationDuration: '0.3s',
    customClass: '',
    zIndex: 9999,

    onDetected: null,
    onDismissAttempt: null
  };

  // ── Utilities ──────────────────────────────────────────────────────

  function generateId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 8; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  function mergeConfig(user) {
    const config = Object.assign({}, DEFAULTS, user);
    config.theme = Object.assign({}, DEFAULTS.theme, user && user.theme);
    return config;
  }

  // ── CSS injection ──────────────────────────────────────────────────

  const STYLE_ID = 'quit-hogging-styles';

  function buildCSS(config) {
    const t = config.theme;
    return `
      .qh-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: ${t.overlayBackground};
        z-index: ${config.zIndex};
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .qh-box {
        background-color: ${t.boxBackground};
        color: ${t.textColor};
        font-family: ${t.fontFamily};
        font-weight: bold;
        text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
        padding: 2rem 3rem;
        border-radius: ${t.borderRadius};
        max-width: ${t.maxWidth};
        width: 90%;
        text-align: center;
        box-sizing: border-box;
      }
      .qh-title {
        color: ${t.titleColor};
        margin: 0 0 0.75rem 0;
        font-size: 1.5rem;
      }
      .qh-content {
        margin: 0 0 1rem 0;
        font-size: 1rem;
        line-height: 1.5;
      }
      .qh-button {
        display: inline-block;
        padding: 0.6rem 1.5rem;
        background-color: ${t.buttonBackground};
        color: ${t.buttonColor};
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        font-weight: bold;
        cursor: pointer;
        text-decoration: none;
        transition: opacity 0.2s;
      }
      .qh-button:hover {
        opacity: 0.85;
      }
      .qh-message {
        display: block;
      }
      .qh-fade-in {
        animation: qhFadeIn ${config.animationDuration} ease-in;
      }
      .qh-slide-in {
        animation: qhSlideIn ${config.animationDuration} ease-out;
      }
      @keyframes qhFadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes qhSlideIn {
        from { opacity: 0; transform: translateY(-30px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
  }

  function injectStyles(config) {
    let style = document.getElementById(STYLE_ID);
    if (style) {
      style.textContent = buildCSS(config);
      return style;
    }
    style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = buildCSS(config);
    document.head.appendChild(style);
    return style;
  }

  // ── DOM creation ───────────────────────────────────────────────────

  function createOverlay(config) {
    const id = generateId();

    const overlay = document.createElement('div');
    overlay.id = id;
    overlay.classList.add('qh-overlay');
    if (config.customClass) {
      overlay.classList.add(config.customClass);
    }

    // Animation class
    if (config.animation === 'fade') {
      overlay.classList.add('qh-fade-in');
    } else if (config.animation === 'slide') {
      overlay.classList.add('qh-slide-in');
    }

    const box = document.createElement('div');
    box.classList.add('qh-box');

    const title = document.createElement('h1');
    title.classList.add('qh-title');
    title.textContent = config.blockTitle;

    const content = document.createElement('p');
    content.classList.add('qh-content');
    content.textContent = config.blockContent;

    box.appendChild(title);
    box.appendChild(content);

    // Optional button
    if (config.blockButtonText) {
      const btn = document.createElement('button');
      btn.classList.add('qh-button');
      btn.textContent = config.blockButtonText;
      btn.addEventListener('click', function () {
        if (config.blockButtonLink) {
          window.location.href = config.blockButtonLink;
        } else {
          window.location.reload();
        }
      });
      box.appendChild(btn);
    }

    overlay.appendChild(box);
    return overlay;
  }

  function showInlineMessage(config) {
    const el = document.getElementById(config.displayMessageId);
    if (!el) return;
    el.innerHTML = config.displayMessageContent;
    el.style.display = '';
    el.classList.add('qh-message');
    if (config.animation === 'fade') {
      el.classList.add('qh-fade-in');
    } else if (config.animation === 'slide') {
      el.classList.add('qh-slide-in');
    }
  }

  // ── Deletion detection ─────────────────────────────────────────────

  function watchOverlay(config, overlayRef) {
    let currentOverlay = overlayRef;
    let bodyObserver = null;
    let headObserver = null;
    let fallbackTimer = null;

    function recreateOverlay() {
      if (!document.body) return;
      if (typeof config.onDismissAttempt === 'function') {
        config.onDismissAttempt();
      }
      currentOverlay = createOverlay(config);
      document.body.appendChild(currentOverlay);
    }

    function ensureStyles() {
      if (!document.head) return;
      if (!document.getElementById(STYLE_ID)) {
        injectStyles(config);
      }
    }

    // Layer 1: MutationObserver on body
    bodyObserver = new MutationObserver(function (mutations) {
      for (let i = 0; i < mutations.length; i++) {
        const removed = mutations[i].removedNodes;
        for (let j = 0; j < removed.length; j++) {
          if (removed[j] === currentOverlay) {
            bodyObserver.disconnect();
            recreateOverlay();
            bodyObserver.observe(document.body, { childList: true, subtree: true });
            return;
          }
        }
      }
    });
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    // Layer 2: MutationObserver on head for style tag
    headObserver = new MutationObserver(function () {
      ensureStyles();
    });
    headObserver.observe(document.head, { childList: true, subtree: true });

    // Layer 3: Fallback interval
    fallbackTimer = setInterval(function () {
      if (!document.body.contains(currentOverlay)) {
        recreateOverlay();
      }
      ensureStyles();
    }, 2000);

    // Return cleanup function
    return function destroy() {
      if (bodyObserver) bodyObserver.disconnect();
      if (headObserver) headObserver.disconnect();
      if (fallbackTimer) clearInterval(fallbackTimer);
      if (currentOverlay && currentOverlay.parentNode) {
        currentOverlay.parentNode.removeChild(currentOverlay);
      }
      const styleEl = document.getElementById(STYLE_ID);
      if (styleEl && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    };
  }

  // ── Detection ──────────────────────────────────────────────────────

  function detect(config) {
    if (typeof window.iExist !== 'undefined') return null;

    // AdBlock is enabled
    if (typeof config.onDetected === 'function') {
      config.onDetected();
    }

    let destroyFn = null;

    if (config.block) {
      injectStyles(config);
      const overlay = createOverlay(config);
      document.body.appendChild(overlay);

      if (config.persistent) {
        destroyFn = watchOverlay(config, overlay);
      } else {
        destroyFn = function () {
          if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
          const styleEl = document.getElementById(STYLE_ID);
          if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
        };
      }
    }

    if (config.displayMessage) {
      injectStyles(config);
      showInlineMessage(config);
    }

    return destroyFn;
  }

  // ── Public API ─────────────────────────────────────────────────────

  window.QuitHogging = function (options) {
    const config = mergeConfig(options);
    let destroyFn = null;

    function run() {
      destroyFn = detect(config);
    }

    if (document.readyState === 'complete') {
      run();
    } else {
      window.addEventListener('load', run);
    }

    return {
      detect: function () {
        destroyFn = detect(config);
      },
      destroy: function () {
        if (typeof destroyFn === 'function') {
          destroyFn();
          destroyFn = null;
        }
      }
    };
  };

})();
