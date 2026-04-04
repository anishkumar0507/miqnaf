/**
 * MIQNAF – Smooth Scroll Engine v2
 * Lenis-inspired: intercepts wheel events, lerps window.scrollY
 */

class SmoothScroll {
  constructor(options = {}) {
    this.lerp    = options.lerp    || 0.08;
    this.smooth  = options.smooth  !== false;
    this.current = window.scrollY;
    this.target  = window.scrollY;
    this.raf     = null;
    this._animating = false;

    this._onWheel = this._onWheel.bind(this);
    this._onTouch = this._onTouch.bind(this);
    this._onKey   = this._onKey.bind(this);

    if (this.smooth) this._init();
  }

  _init() {
    window.addEventListener('wheel', this._onWheel, { passive: false });
    window.addEventListener('touchstart', this._onTouch, { passive: true });
    window.addEventListener('touchmove', this._onTouchSync.bind(this), { passive: true });
    window.addEventListener('keydown', this._onKey, { passive: false });
    this._startLoop();
  }

  _clamp(v) {
    return Math.max(0, Math.min(v, document.body.scrollHeight - window.innerHeight));
  }

  _onWheel(e) {
    e.preventDefault();
    // Scale deltaY for different deltaMode values
    let delta = e.deltaY;
    if (e.deltaMode === 1) delta *= 40;   // line mode
    if (e.deltaMode === 2) delta *= window.innerHeight; // page mode
    this.target = this._clamp(this.target + delta);
  }

  _onTouch(e) {
    // Sync to actual scroll on touch (let native handle it)
    this.target  = window.scrollY;
    this.current = window.scrollY;
  }

  _onTouchSync() {
    this.target  = window.scrollY;
    this.current = window.scrollY;
  }

  _onKey(e) {
    const amt = window.innerHeight * 0.38;
    const map = {
      ArrowDown:  amt,  ArrowUp:   -amt,
      PageDown:   window.innerHeight * 0.9,
      PageUp:     -window.innerHeight * 0.9,
      Home:       -Infinity, End: Infinity
    };
    if (!(e.key in map)) return;
    e.preventDefault();
    if (e.key === 'Home') this.target = 0;
    else if (e.key === 'End') this.target = this._clamp(Infinity);
    else this.target = this._clamp(this.target + map[e.key]);
  }

  _startLoop() {
    const loop = () => {
      this.current += (this.target - this.current) * this.lerp;
      const delta = Math.abs(this.target - this.current);
      if (delta > 0.3) {
        window.scrollTo(0, this.current);
      } else {
        this.current = this.target;
      }
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  scrollTo(target, options = {}) {
    let y = 0;
    if (typeof target === 'number') {
      y = target;
    } else if (target instanceof Element) {
      y = target.getBoundingClientRect().top + window.scrollY - (options.offset || 80);
    } else if (typeof target === 'string') {
      const el = document.querySelector(target);
      if (el) y = el.getBoundingClientRect().top + window.scrollY - (options.offset || 80);
    }
    this.target = this._clamp(y);
  }

  destroy() {
    window.removeEventListener('wheel', this._onWheel);
    window.removeEventListener('touchstart', this._onTouch);
    window.removeEventListener('keydown', this._onKey);
    cancelAnimationFrame(this.raf);
  }
}

window.SmoothScroll = SmoothScroll;
