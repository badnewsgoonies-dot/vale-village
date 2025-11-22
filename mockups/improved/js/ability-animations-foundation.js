// Ability Animations Foundation (Mockup-ready, zero-dependency)
// Provides a simple, composable way to play GIF-based ability animations
// on top of the battlefield with precise anchoring and timing.

(function () {
  const LAYER_ID = 'abilityAnimationLayer';
  let layerEl = null;
  let preloaded = new Map();

  function ensureLayer(containerSelector) {
    if (layerEl) return layerEl;
    const container = document.querySelector(containerSelector) || document.body;
    layerEl = document.createElement('div');
    layerEl.id = LAYER_ID;
    Object.assign(layerEl.style, {
      position: 'absolute',
      inset: '0',
      pointerEvents: 'none',
      zIndex: 999,
    });
    container.style.position = container.style.position || 'relative';
    container.appendChild(layerEl);
    return layerEl;
  }

  function preloadGif(url) {
    if (preloaded.has(url)) return preloaded.get(url);
    const img = new Image();
    const promise = new Promise((resolve, reject) => {
      img.onload = () => resolve(url);
      img.onerror = reject;
    });
    img.src = url;
    preloaded.set(url, promise);
    return promise;
  }

  function getAnchorPosition(anchorSelector, offset = { x: 0, y: 0 }) {
    const anchor = typeof anchorSelector === 'string'
      ? document.querySelector(anchorSelector)
      : anchorSelector;
    if (!anchor) return { x: 0, y: 0 };
    const rect = anchor.getBoundingClientRect();
    const parentRect = layerEl.getBoundingClientRect();
    // Center of the anchor
    const centerX = rect.left - parentRect.left + rect.width / 2;
    const centerY = rect.top - parentRect.top + rect.height / 2;
    return { x: centerX + (offset.x || 0), y: centerY + (offset.y || 0) };
  }

  /**
   * Play an ability GIF at a given anchor on the battlefield.
   *
   * options: {
   *   containerSelector: string (absolute-positioned container to mount layer)
   *   gifUrl: string (path to GIF)
   *   anchorSelector: string | Element (where to anchor the animation)
   *   offset: { x: number, y: number }
   *   width: number (default 96)
   *   height: number (default 96)
   *   durationMs: number (default 1200)
   *   className: string (optional extra styles)
   * }
   */
  async function playAbilityAnimation(options) {
    const {
      containerSelector = '#battlefield',
      gifUrl,
      anchorSelector,
      offset = { x: 0, y: 0 },
      width = 96,
      height = 96,
      durationMs = 1200,
      className,
    } = options || {};

    if (!gifUrl || !anchorSelector) return;
    const layer = ensureLayer(containerSelector);
    await preloadGif(gifUrl).catch(() => null);

    const { x, y } = getAnchorPosition(anchorSelector, offset);
    const img = document.createElement('img');
    img.src = gifUrl;
    img.alt = 'ability-animation';
    img.draggable = false;
    if (className) img.className = className;
    Object.assign(img.style, {
      position: 'absolute',
      left: `${x - width / 2}px`,
      top: `${y - height / 2}px`,
      width: `${width}px`,
      height: `${height}px`,
      objectFit: 'contain',
      imageRendering: 'pixelated',
      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))',
      pointerEvents: 'none',
    });

    layer.appendChild(img);

    window.setTimeout(() => {
      if (img.parentElement === layer) {
        layer.removeChild(img);
      }
    }, durationMs);
  }

  /**
   * Batch play utility for sequences or multi-hit effects.
   * schedule: Array<{ delayMs, args: playAbilityAnimation args }>
   */
  function playAnimationSequence(schedule) {
    if (!Array.isArray(schedule)) return;
    let base = performance.now();
    schedule.forEach(item => {
      const when = (item && item.delayMs) || 0;
      window.setTimeout(() => playAbilityAnimation(item.args || {}), when);
    });
  }

  // Expose minimal API to window for mockups
  window.AbilityAnimations = {
    play: playAbilityAnimation,
    playSequence: playAnimationSequence,
    preload: preloadGif,
  };
})();




