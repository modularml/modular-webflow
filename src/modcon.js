gsap.registerPlugin(CustomEase);
function initCSSMarquee() {
  const pixelsPerSecond = 75; // Set the marquee speed (pixels per second)
  CustomEase.create('osmo', 'M0,0 C0.625,0.05 0,1 1,1');
  gsap.defaults({ ease: 'osmo' });

  // Pause/resume animation only for activated lists when in/out of view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.target.hasAttribute('data-transitioning')) return; // hands off during a flip
        const shouldRun = entry.isIntersecting && !prefersReducedMotion();
        entry.target
          .querySelectorAll('[data-css-marquee-list][data-status="activated"]')
          .forEach((list) => {
            list.style.animationPlayState = shouldRun ? 'running' : 'paused';
          });
      });
    },
    { threshold: 0 }
  );

  function activate(marquee) {
    if (marquee.dataset.mode === 'marquee') return;

    // Flip mode first so any grid-mode CSS is gone before we measure widths
    marquee.dataset.mode = 'marquee';

    // Duplicate lists once (tag clones so we can remove them later)
    if (!marquee.querySelector('[data-css-marquee-clone]')) {
      marquee.querySelectorAll('[data-css-marquee-list]:not(:empty)').forEach((list) => {
        const clone = list.cloneNode(true);
        clone.setAttribute('data-css-marquee-clone', '');
        marquee.appendChild(clone);
      });
    }

    marquee.querySelectorAll('[data-css-marquee-list]:not(:empty)').forEach((list) => {
      list.style.animationDuration = list.offsetWidth / pixelsPerSecond + 's';
      list.style.animationPlayState = 'paused';
      list.setAttribute('data-status', 'activated');
    });

    observer.observe(marquee);
  }

  function deactivate(marquee) {
    observer.unobserve(marquee);

    marquee.querySelectorAll('[data-css-marquee-clone]').forEach((c) => c.remove());
    marquee.querySelectorAll('[data-css-marquee-list]:not(:empty)').forEach((list) => {
      list.removeAttribute('data-status');
      list.style.animationDuration = '';
      list.style.animationPlayState = '';
    });

    marquee.dataset.mode = 'grid';
  }

  function pauseLists(marquee) {
    marquee.querySelectorAll('[data-css-marquee-list]:not(:empty)').forEach((list) => {
      list.style.animationPlayState = 'paused';
    });
  }

  function resumeListsIfVisible(marquee) {
    if (prefersReducedMotion()) return; // don't auto-scroll the marquee
    const rect = marquee.getBoundingClientRect();
    if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
    marquee.querySelectorAll('[data-css-marquee-list][data-status="activated"]').forEach((list) => {
      list.style.animationPlayState = 'running';
    });
  }

  const flipDuration = 0.5;
  const fadeDuration = 0.2;
  const flipStagger = 0.05; // delay between each card in the flip cascade

  const reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReducedMotion = () => reducedMotionMq.matches;

  const desktopMq = window.matchMedia('(min-width: 480px)');
  const isDesktop = () => desktopMq.matches;

  // Selector that matches the marquee wrap only — excludes [data-css-marquee="view-more"] triggers
  const MARQUEE_SELECTOR = '[data-css-marquee=""]';

  function animateSwitch(marquee, toMode) {
    if (typeof gsap === 'undefined' || typeof Flip === 'undefined' || prefersReducedMotion()) {
      // No-animation path: just snap to the target mode
      if (toMode === 'marquee') activate(marquee);
      else deactivate(marquee);
      pauseLists(marquee);
      return;
    }

    if (marquee.hasAttribute('data-transitioning')) return;

    marquee.setAttribute('data-transitioning', toMode);
    pauseLists(marquee);

    // One frame so the paused transform syncs to the main thread before we measure
    requestAnimationFrame(() => doSwitch(marquee, toMode));
  }

  function doSwitch(marquee, toMode) {
    // Snapshot rects from currently-visible originals (one per unique flip-id)
    const sources = new Map();
    marquee
      .querySelectorAll('[data-css-marquee-list]:not([data-css-marquee-clone]) > *')
      .forEach((card) => {
        const id = card.dataset.flipId;
        if (!id || sources.has(id)) return;
        sources.set(id, { rect: card.getBoundingClientRect(), el: card });
      });

    // Marquee → grid: fade proxies in over the OGs (looks nice on the way out).
    // Grid → marquee: drop proxies in at full opacity (avoids the flash).
    const startOpacity = toMode === 'grid' ? '0' : '1';

    // Use document-relative positioning so proxies scroll with the page mid-animation
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    const proxies = [];
    sources.forEach((src, id) => {
      const proxy = src.el.cloneNode(true);
      proxy.removeAttribute('data-flip-id');
      proxy.setAttribute('data-css-marquee-proxy', '');
      Object.assign(proxy.style, {
        position: 'absolute',
        left: '0',
        top: '0',
        margin: '0',
        boxSizing: 'border-box',
        width: src.rect.width + 'px',
        height: src.rect.height + 'px',
        transform: `translate(${src.rect.left + scrollX}px, ${src.rect.top + scrollY}px)`,
        pointerEvents: 'none',
        zIndex: '9999',
        opacity: startOpacity,
        transition: 'none', // suppress any CSS transition on the cloned class so it can't compound with the GSAP ease
      });
      document.body.appendChild(proxy);
      proxies.push({ proxy, id });
    });

    if (!proxies.length) {
      if (toMode === 'marquee') activate(marquee);
      else deactivate(marquee);
      marquee.removeAttribute('data-transitioning');
      return;
    }

    const proxyEls = proxies.map((p) => p.proxy);
    const lists = marquee.querySelectorAll('[data-css-marquee-list]:not(:empty)');

    const hideOGsThenFlip = () => {
      gsap.to(lists, {
        opacity: 0,
        duration: fadeDuration,
        onComplete: () => doFlip(marquee, toMode, proxies),
      });
    };

    if (startOpacity === '1') {
      hideOGsThenFlip();
    } else {
      gsap.to(proxyEls, {
        opacity: 1,
        duration: fadeDuration,
        onComplete: hideOGsThenFlip,
      });
    }
  }

  function doFlip(marquee, toMode, proxies) {
    const startHeight = marquee.offsetHeight;
    const prevOverflow = marquee.style.overflow;
    marquee.style.height = startHeight + 'px';
    marquee.style.overflow = 'hidden';

    // Switch mode — lists are at opacity 0; new clones inherit that via cloneNode
    if (toMode === 'marquee') activate(marquee);
    else deactivate(marquee);
    pauseLists(marquee);

    // Measure new natural height
    marquee.style.height = '';
    const endHeight = marquee.offsetHeight;
    marquee.style.height = startHeight + 'px';

    // Pair each proxy with its destination in the new mode
    const proxyDests = proxies
      .map(({ proxy, id }) => ({ proxy, destEl: marquee.querySelector(`[data-flip-id="${id}"]`) }))
      .filter((p) => p.destEl);

    const cleanup = () => {
      marquee.style.height = '';
      marquee.style.overflow = prevOverflow;

      const proxyEls = proxyDests.map((p) => p.proxy);
      const lists = marquee.querySelectorAll('[data-css-marquee-list]:not(:empty)');

      if (toMode === 'marquee') {
        // Reverse flow: reveal OGs under proxies, then hide proxies, then start marquee
        gsap.to(lists, {
          opacity: 1,
          duration: fadeDuration,
          onComplete: () => {
            gsap.to(proxyEls, {
              opacity: 0,
              duration: fadeDuration,
              onComplete: () => {
                proxyDests.forEach(({ proxy }) => proxy.remove());
                marquee.removeAttribute('data-transitioning');
                resumeListsIfVisible(marquee);
              },
            });
          },
        });
      } else {
        // Forward flow (→ grid): cross-fade — lists in, proxies out
        gsap.to(lists, {
          opacity: 1,
          duration: fadeDuration,
          onComplete: () => {
            marquee.removeAttribute('data-transitioning');
            resumeListsIfVisible(marquee);
          },
        });
        gsap.to(proxyEls, {
          opacity: 0,
          duration: fadeDuration,
          onComplete: () => proxyDests.forEach(({ proxy }) => proxy.remove()),
        });
      }
    };

    if (!proxyDests.length) {
      cleanup();
      return;
    }

    // Stretch the height tween to cover the full cascade so the container finishes with the last card
    const totalDuration = flipDuration + Math.max(0, proxyDests.length - 1) * flipStagger;
    gsap.to(marquee, { height: endHeight, duration: totalDuration, ease: 'power3.out' });

    let remaining = proxyDests.length;
    proxyDests.forEach(({ proxy, destEl }, i) => {
      Flip.fit(proxy, destEl, {
        duration: flipDuration,
        delay: i * flipStagger,
        ease: 'power3.out',
        onComplete: () => {
          if (--remaining === 0) cleanup();
        },
      });
    });
  }

  function updateIndicator(modesEl) {
    const indicator = modesEl.querySelector(':scope > :not([data-css-marquee-toggle])');
    const active = modesEl.querySelector('[data-css-marquee-toggle].cc-active');
    if (!indicator || !active) return;

    if (getComputedStyle(modesEl).position === 'static') {
      modesEl.style.position = 'relative';
    }
    indicator.style.position = 'absolute';
    indicator.style.top = '0';
    indicator.style.left = '0';
    indicator.style.width = active.offsetWidth + 'px';
    indicator.style.height = active.offsetHeight + 'px';
    indicator.style.transform = `translate(${active.offsetLeft}px, ${active.offsetTop}px)`;
  }

  function applyMode(modesEl, mode) {
    if (!isDesktop()) return; // marquee/grid mode is desktop-only
    const root = modesEl.closest('section') || document;
    const marquee = root.querySelector(MARQUEE_SELECTOR);
    if (!marquee) return;

    modesEl.querySelectorAll('[data-css-marquee-toggle]').forEach((btn) => {
      btn.classList.toggle('cc-active', btn.dataset.cssMarqueeToggle === mode);
    });

    updateIndicator(modesEl);

    if (marquee.dataset.mode && marquee.dataset.mode !== mode) {
      animateSwitch(marquee, mode);
    } else if (mode === 'marquee') {
      activate(marquee);
    } else {
      deactivate(marquee);
    }
  }

  // Tag each unique card with a stable id (clones inherit it via cloneNode)
  document.querySelectorAll(MARQUEE_SELECTOR).forEach((marquee, mi) => {
    marquee.querySelectorAll('[data-css-marquee-list] > *').forEach((card, ci) => {
      if (!card.dataset.flipId) card.dataset.flipId = `m${mi}-c${ci}`;
    });
  });

  // Mode toggle handlers — bound regardless of breakpoint; applyMode itself gates on isDesktop()
  document.querySelectorAll('[data-css-marquee-modes]').forEach((modesEl) => {
    modesEl.querySelectorAll('[data-css-marquee-toggle]').forEach((toggle) => {
      toggle.addEventListener('click', () => {
        applyMode(modesEl, toggle.dataset.cssMarqueeToggle);
      });
    });
  });

  function teardownMarquee(marquee) {
    observer.unobserve(marquee);
    marquee.querySelectorAll('[data-css-marquee-clone]').forEach((c) => c.remove());
    marquee.querySelectorAll('[data-css-marquee-list]:not(:empty)').forEach((list) => {
      list.removeAttribute('data-status');
      list.style.animationDuration = '';
      list.style.animationPlayState = '';
      list.style.opacity = '';
    });
    marquee.style.height = '';
    marquee.style.overflow = '';
    delete marquee.dataset.mode;
    delete marquee.dataset.expanded;
    marquee.removeAttribute('data-transitioning');
  }

  function setupForBreakpoint() {
    document.querySelectorAll(MARQUEE_SELECTOR).forEach((marquee) => {
      // Reset any view-more state from a prior mobile session
      marquee.querySelectorAll('.modcon-testimonials_overlay').forEach((o) => {
        o.style.display = '';
        o.style.opacity = '';
      });
      delete marquee.dataset.expanded;

      if (isDesktop()) {
        // Activate marquee + sync mode toggle to its initial active state
        if (marquee.dataset.mode !== 'marquee' && marquee.dataset.mode !== 'grid') {
          activate(marquee);
        }
        const root = marquee.closest('section') || document;
        const modesEl = root.querySelector('[data-css-marquee-modes]');
        if (modesEl) {
          const initial = modesEl.querySelector('[data-css-marquee-toggle].cc-active');
          if (initial && marquee.dataset.mode !== initial.dataset.cssMarqueeToggle) {
            applyMode(modesEl, initial.dataset.cssMarqueeToggle);
          } else {
            updateIndicator(modesEl); // sync indicator on first load even if no mode change
          }
        }
      } else {
        teardownMarquee(marquee);
      }
    });

    // Reset view-more triggers so they're available again if we re-enter mobile
    if (!isDesktop()) {
      document.querySelectorAll('[data-css-marquee="view-more"]').forEach((trigger) => {
        trigger.style.display = '';
        const wrap = trigger.closest('.show-mobile-portrait');
        if (wrap) wrap.style.display = '';
      });
    }
  }

  setupForBreakpoint();

  desktopMq.addEventListener('change', setupForBreakpoint);

  // Wire up view-more triggers (active on <480px; CSS keeps them hidden above)
  function expandMarquee(marquee, trigger) {
    if (marquee.dataset.expanded === 'true') return;
    marquee.dataset.expanded = 'true';

    const prevOverflow = marquee.style.overflow;
    const startHeight = marquee.offsetHeight;
    const overlays = marquee.querySelectorAll('.modcon-testimonials_overlay');

    marquee.style.height = 'auto';
    const endHeight = marquee.offsetHeight;
    marquee.style.height = startHeight + 'px';
    marquee.style.overflow = 'hidden';

    const hideOverlays = () => {
      overlays.forEach((o) => (o.style.display = 'none'));
    };

    const fadeOutOverlays = () => {
      if (!overlays.length) return;
      if (typeof gsap === 'undefined' || prefersReducedMotion()) {
        hideOverlays();
        return;
      }
      gsap.to(overlays, {
        opacity: 0,
        duration: fadeDuration,
        onComplete: hideOverlays,
      });
    };

    if (typeof gsap === 'undefined' || prefersReducedMotion()) {
      marquee.style.height = 'auto';
      marquee.style.overflow = prevOverflow;
      if (trigger) {
        const wrap = trigger.closest('.show-mobile-portrait') || trigger;
        wrap.style.display = 'none';
      }
      fadeOutOverlays();
      return;
    }

    gsap.to(marquee, {
      height: endHeight,
      duration: 0.5,
      onComplete: () => {
        marquee.style.height = 'auto';
        marquee.style.overflow = prevOverflow;
        if (trigger) {
          const wrap = trigger.closest('.show-mobile-portrait') || trigger;
          wrap.style.display = 'none';
        }
        fadeOutOverlays();
      },
    });
  }

  document.querySelectorAll('[data-css-marquee="view-more"]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const root = trigger.closest('section') || document;
      const marquee = root.querySelector(MARQUEE_SELECTOR);
      if (marquee) expandMarquee(marquee, trigger);
    });
  });

  // Keep indicator aligned on resize
  let resizeRaf;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(() => {
      document.querySelectorAll('[data-css-marquee-modes]').forEach(updateIndicator);
    });
  });

  // React to the user toggling reduced-motion mid-session
  reducedMotionMq.addEventListener('change', () => {
    document.querySelectorAll(MARQUEE_SELECTOR).forEach((marquee) => {
      if (prefersReducedMotion()) pauseLists(marquee);
      else resumeListsIfVisible(marquee);
    });
  });
}

function initGallery() {
  const fadeDuration = 0.2;
  const reducedMotionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReducedMotion = () => reducedMotionMq.matches;

  document.querySelectorAll('[data-gallery="wrap"]').forEach((wrap) => {
    const visualsContainer = wrap.querySelector('[data-gallery="visuals"]');
    if (!visualsContainer) return;

    const visuals = Array.from(visualsContainer.children);
    const menuItems = Array.from(wrap.querySelectorAll('[data-gallery="menu-item"]'));
    if (!visuals.length || !menuItems.length) return;

    let activeIndex = menuItems.findIndex((item) => item.classList.contains('is-active'));
    if (activeIndex < 0) activeIndex = 0;

    const setActive = (index) => {
      if (index === activeIndex) return;
      if (index < 0 || index >= menuItems.length) return;

      const fromEl = visuals[activeIndex];
      const toEl = visuals[index];

      menuItems.forEach((item, i) => {
        item.classList.toggle('is-active', i === index);
      });

      activeIndex = index;
      if (!toEl) return;

      if (typeof gsap === 'undefined' || prefersReducedMotion()) {
        if (fromEl) {
          fromEl.style.display = 'none';
          fromEl.style.opacity = '';
        }
        toEl.style.display = 'flex';
        toEl.style.opacity = '';
        return;
      }

      // Reveal incoming at opacity 0 first so it can fade in over the outgoing one
      toEl.style.display = 'flex';
      gsap.set(toEl, { opacity: 0 });
      gsap.to(toEl, { opacity: 1, duration: fadeDuration, overwrite: true });

      if (fromEl) {
        gsap.to(fromEl, {
          opacity: 0,
          duration: fadeDuration,
          overwrite: true,
          onComplete: () => {
            fromEl.style.display = 'none';
            fromEl.style.opacity = '';
          },
        });
      }
    };

    menuItems.forEach((item, i) => {
      item.addEventListener('click', () => setActive(i));
    });
  });
}

// Stacking Cards
function initStackingStickyCardsBounce() {
  const cardsSections = document.querySelectorAll('[data-stacking-cards-init]');

  const currentTier = getCurrentViewportTier();
  window.viewportTier = currentTier;

  ScrollTrigger.getAll().forEach((trigger) => {
    cardsSections.forEach((section) => {
      if (section.contains(trigger.trigger)) trigger.kill();
    });
  });

  cardsSections.forEach((section) => {
    section.querySelectorAll('[data-stacking-card-target]').forEach((el) => {
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: 'all' });
    });
  });

  cardsSections.forEach((section) => {
    const tier = currentTier;

    const isEnabled =
      (tier === 'desktop' && section.dataset.stackingCardsDesktop === 'true') ||
      (tier === 'tablet' && section.dataset.stackingCardsTablet === 'true') ||
      ((tier === 'mobile-portrait' || tier === 'mobile-landscape') &&
        section.dataset.stackingCardsMobile === 'true');

    if (!isEnabled) return;

    const cards = Array.from(section.querySelectorAll('[data-stacking-card]'));
    if (!cards.length) return;

    const stickyTop = parseFloat(getComputedStyle(cards[0]).top) || 0;

    const rotateValues = (() => {
      if (tier === 'desktop')
        return parseRotateValues(section, 'data-stacking-cards-desktop-rotate');
      if (tier === 'tablet') return parseRotateValues(section, 'data-stacking-cards-tablet-rotate');
      return parseRotateValues(section, 'data-stacking-cards-mobile-rotate');
    })();

    const xValues = (() => {
      return 0;
    })();

    const yValues = (() => {
      if (tier === 'desktop') return parseAxisValues(section, 'data-stacking-cards-desktop-y');
      if (tier === 'tablet') return parseAxisValues(section, 'data-stacking-cards-tablet-y');
      return parseAxisValues(section, 'data-stacking-cards-mobile-y');
    })();

    cards.forEach((card, index) => {
      const targetEl = card.querySelector('[data-stacking-card-target]');
      if (!targetEl) return;

      const rotate = rotateValues[index % rotateValues.length];
      const x = xValues[index % xValues.length];
      const y = yValues[index % yValues.length];

      gsap.set(targetEl, {
        rotate: 0,
        x: 0,
        y: 0,
        scale: 1,
        zIndex: cards.length - index,
      });

      gsap.to(targetEl, {
        rotate,
        x,
        y,
        ease: 'power1.in',
        overwrite: 'auto',
        scrollTrigger: {
          id: `stacking-rotate-${index}`,
          trigger: card,
          start: 'top 75%',
          end: `top-=${stickyTop} top`,
          scrub: true,
        },
      });
    });
  });

  ScrollTrigger.refresh();

  function parseRotateValues(section, attr) {
    const fallback = [0, 4, -4];
    const values = (section.getAttribute(attr) || '')
      .split(',')
      .map((val) => parseFloat(val.trim()));
    return values.length >= 1 && values.every((v) => !isNaN(v)) ? values : fallback;
  }

  function parseAxisValues(section, attr) {
    const raw = section.getAttribute(attr);
    if (!raw) return ['0em', '0em', '0em'];
    const values = raw
      .split(',')
      .map((val) => val.trim())
      .filter((val) => val !== '');
    return values.length ? values : ['0em', '0em', '0em'];
  }

  if (!window._hasStackingResizeListener) {
    let last = getCurrentViewportTier();

    window.addEventListener(
      'resize',
      debounceOnWidthChange(() => {
        const next = getCurrentViewportTier();

        if (last !== next) {
          ScrollTrigger.getAll().forEach((t) => {
            if (t.vars?.id?.startsWith('stacking')) t.kill();
          });

          cardsSections.forEach((section) => {
            section.querySelectorAll('[data-stacking-card-target]').forEach((el) => {
              gsap.killTweensOf(el);
              gsap.set(el, { clearProps: 'all' });
            });
          });

          initStackingStickyCardsBounce();
        }

        last = next;
        window.viewportTier = next;
      }, 250)
    );

    window._hasStackingResizeListener = true;
  }

  // Helper: Get Current Viewport Tier
  function getCurrentViewportTier() {
    const width = window.innerWidth;

    if (width <= 479) return 'mobile-portrait';
    if (width <= 767) return 'mobile-landscape';
    if (width <= 991) return 'tablet';
    return 'desktop';
  }

  // Helper: Pulse pulse (Bounce Animation)
  function pulseElement(targetEl) {
    const width = targetEl.offsetWidth;
    const height = targetEl.offsetHeight;
    const fontSize = parseFloat(getComputedStyle(targetEl).fontSize);
    const stretchPx = 1.5 * fontSize;
    const targetScaleX = (width + stretchPx) / width;
    const targetScaleY = (height - stretchPx * 0.33) / height;

    const tl = gsap.timeline();
    tl.to(targetEl, {
      scaleX: targetScaleX,
      scaleY: targetScaleY,
      duration: 0.1,
      ease: 'power1.out',
    }).to(targetEl, {
      scaleX: 1,
      scaleY: 1,
      duration: 1,
      ease: 'elastic.out(1, 0.3)',
    });
  }
}
function debounceOnWidthChange(fn, ms) {
  let last = innerWidth;
  let timer;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (innerWidth !== last) {
        last = innerWidth;
        fn.apply(this, args);
      }
    }, ms);
  };
}

// Counter
function initCountdown() {
  var reg = { items: [], timer: null };

  function parseIso(root) {
    var s = root.getAttribute('data-countdown-date') || '';
    var m = s.trim().match(/^(\d{4})-(\d{2})-(\d{2})\s(\d{1,2}):(\d{2})$/);
    if (!m) return null;
    var y = +m[1],
      mo = +m[2] - 1,
      d = +m[3],
      h = +m[4],
      mi = +m[5];
    var t = Date.UTC(y, mo, d, h, mi, 0, 0);
    var off = +(root.getAttribute('data-countdown-timezone-offset') || 0);
    if (off) t -= off * 3600000;
    var dt = new Date(t);
    if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo || dt.getUTCDate() !== d) return null;
    return t;
  }

  function splitByUnits(ms, u) {
    var secs = Math.max(0, Math.floor(ms / 1000));
    var out = {
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      done: ms <= 0,
    };
    var seq = [
      ['years', 31536000],
      ['months', 2592000],
      ['weeks', 604800],
      ['days', 86400],
      ['hours', 3600],
      ['minutes', 60],
      ['seconds', 1],
    ];
    for (var i = 0; i < seq.length; i++) {
      var k = seq[i][0],
        len = seq[i][1];
      if (u[k]) {
        out[k] = Math.floor(secs / len);
        secs %= len;
      }
    }
    return out;
  }

  var sing = {
    years: 'year',
    months: 'month',
    weeks: 'week',
    days: 'day',
    hours: 'hour',
    minutes: 'minute',
    seconds: 'second',
  };
  var abbr = {
    years: ['yr.', 'yrs.'],
    months: ['mo.', 'mos.'],
    weeks: ['wk.', 'wks.'],
    days: ['day', 'days'],
    hours: ['hr.', 'hrs.'],
    minutes: ['min.', 'mins.'],
    seconds: ['sec.', 'secs.'],
  };
  function lab(k, v) {
    return '' + v;
  }

  function make(root) {
    var u = {},
      order = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];
    root.querySelectorAll('[data-countdown-update]').forEach(function (n) {
      var k = (n.getAttribute('data-countdown-update') || '').toLowerCase();
      if (order.indexOf(k) > -1) u[k] = n;
    });
    var tgt = parseIso(root);
    if (tgt == null) {
      root.setAttribute('data-countdown-status', 'error');
      var first = null;
      for (var i = 0; i < order.length; i++) {
        if (u[order[i]]) {
          first = u[order[i]];
          break;
        }
      }
      if (first) first.textContent = 'Invalid Date, use: 2026-03-21 11:36';
      order.forEach(function (k) {
        var n = u[k];
        if (n && n !== first) n.textContent = '';
      });
      return null;
    }
    var f = (root.getAttribute('data-countdown-format') || 'plain').toLowerCase();

    var inst = {
      root: root,
      tgt: tgt,
      f: f,
      u: u,
      st: null,
      done: false,
      render: function (ms) {
        var d = splitByUnits(ms, this.u);
        this.done = d.done;
        this.root.setAttribute('data-countdown-status', d.done ? 'finished' : 'active');
        if (this.u.years) this.u.years.textContent = lab('years', d.years, this.f);
        if (this.u.months) this.u.months.textContent = lab('months', d.months, this.f);
        if (this.u.weeks) this.u.weeks.textContent = lab('weeks', d.weeks, this.f);
        if (this.u.days) this.u.days.textContent = lab('days', d.days, this.f);
        if (this.u.hours) this.u.hours.textContent = lab('hours', d.hours, this.f);
        if (this.u.minutes) this.u.minutes.textContent = lab('minutes', d.minutes, this.f);
        if (this.u.seconds) this.u.seconds.textContent = lab('seconds', d.seconds, this.f);
      },
      tickMin: function (nowMs) {
        if (this.done) return;
        this.render(this.tgt - nowMs);
        if (this.u.seconds && !this.done && !this.st) this.startSec();
        if (this.done) this.stopSec();
      },
      startSec: function () {
        var self = this;
        function t() {
          if (self.done) return self.stopSec();
          var ms = self.tgt - Date.now();
          if (ms <= 0) {
            self.render(0);
            return self.stopSec();
          }
          self.render(ms);
        }
        t();
        self.st = setInterval(t, 1000);
      },
      stopSec: function () {
        if (this.st) {
          clearInterval(this.st);
          this.st = null;
        }
      },
    };
    root.__cd = inst;
    return inst;
  }

  function startMinTimer() {
    if (reg.timer) return;
    reg.timer = setInterval(function () {
      var now = Date.now();
      for (var i = 0; i < reg.items.length; i++) reg.items[i].tickMin(now);
    }, 60000);
    var now = Date.now();
    for (var j = 0; j < reg.items.length; j++) reg.items[j].tickMin(now);
  }

  document.querySelectorAll('[data-countdown-date]').forEach(function (root) {
    var inst = make(root);
    if (inst) reg.items.push(inst);
  });
  if (reg.items.length) startMinTimer();
}

// Disable browser scroll restoration ASAP so a mid-page reload doesn't drop the user past the hero
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

function initHeroLogoIntro() {
  const logoWrap = document.querySelector('.modcon-hero-logo-wrap');
  const starter = document.querySelector('.modcon-hero_starter');
  const pageWrapper = document.querySelector('.page-wrapper');
  const nav = document.querySelector('.nav-wrapper');
  const heroLis = document.querySelectorAll('.modcon-hero_list > li');
  const introSection = document.querySelector('.modcon-section.cc-intro');
  const heroVideo = document.querySelector('.modcon-hero_video');

  // Failsafe: always reveal the page-wrapper if we bail early so the page isn't permanently hidden
  const revealPageWrapper = () => {
    if (pageWrapper) pageWrapper.style.opacity = '1';
  };

  if (!logoWrap || !starter || typeof gsap === 'undefined') {
    revealPageWrapper();
    return;
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) {
    revealPageWrapper();
    return;
  }

  // Snap to top before measuring so a reloaded mid-page user starts from 0
  if (window.lenis?.scrollTo) {
    window.lenis.scrollTo(0, { immediate: true });
  } else {
    window.scrollTo(0, 0);
  }

  const logoRect = logoWrap.getBoundingClientRect();
  const starterRect = starter.getBoundingClientRect();
  if (!logoRect.width || !starterRect.width) {
    revealPageWrapper();
    return;
  }

  // Scale to match starter width; translate so the small logo lands at the viewport center
  // (was: starter's center — broke once starter stopped being 100dvh tall)
  const scale = starterRect.width / logoRect.width;
  const dx = window.innerWidth / 2 - (logoRect.left + logoRect.width / 2);
  const dy = window.innerHeight / 2 - (logoRect.top + logoRect.height / 2);

  const cols = logoWrap.querySelectorAll('.modcon-hero-logo-col');
  const lastCol = logoWrap.querySelector('.modcon-hero-logo-col.cc-last');
  const regularCols = logoWrap.querySelectorAll('.modcon-hero-logo-col:not(.cc-last)');

  const lockScroll = () => {
    if (window.lenis?.stop) window.lenis.stop();
    document.documentElement.style.overflow = 'hidden';
    logoWrap.style.pointerEvents = 'none';
  };
  const unlockScroll = () => {
    if (window.lenis?.start) window.lenis.start();
    document.documentElement.style.overflow = '';
    logoWrap.style.pointerEvents = '';
  };

  lockScroll();

  const tl = gsap.timeline({ onComplete: unlockScroll });

  // 1. Initial state for every animated element BEFORE the page-wrapper becomes visible
  tl.set(logoWrap, { x: dx, y: dy, scale, opacity: 1, transformOrigin: 'center center' }).set(
    regularCols,
    { yPercent: 100 }
  );
  if (lastCol) tl.set(lastCol, { xPercent: 100 });
  if (nav) tl.set(nav, { yPercent: -100 });
  if (heroLis.length) tl.set(heroLis, { y: 30, opacity: 0 });
  if (introSection) tl.set(introSection, { y: 30, opacity: 0 });
  if (heroVideo) tl.set(heroVideo, { y: 30, opacity: 0 });

  // 2. Reveal the page-wrapper (everything inside is now safely positioned)
  if (pageWrapper) tl.to(pageWrapper, { opacity: 1, duration: 0.3 });

  // 3. Stagger letters up (and slide the last "R" in from the right at the end of the cascade)
  tl.to(regularCols, {
    yPercent: 0,
    duration: 0.5,
    ease: 'power3.out',
    stagger: 0.06,
  });
  if (lastCol) {
    const lastDelay = Math.max(0, regularCols.length) * 0.06;
    tl.to(lastCol, { xPercent: 0, duration: 0.5, ease: 'power3.out' }, `<+=${lastDelay}`);
  }

  // 4. Hold, then fly logo back to its natural position
  tl.to(logoWrap, { x: 0, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }, '+=0.4');

  // 5. Reveal everything else after the logo lands
  tl.addLabel('reveal');
  if (nav) {
    tl.to(nav, { yPercent: 0, duration: 0.7, ease: 'power3.out' }, 'reveal');
  }
  if (heroLis.length) {
    tl.to(
      heroLis,
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' },
      'reveal+=0.1'
    );
  }
  if (introSection) {
    tl.to(introSection, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 'reveal+=0.15');
  }
  if (heroVideo) {
    tl.to(heroVideo, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, 'reveal+=0.1');
  }
}

function initLogoColHover() {
  const logoWrap = document.querySelector('.modcon-hero-logo-wrap');
  if (!logoWrap || typeof gsap === 'undefined') return;

  // Duplicate is parked off-screen on the side defined by the attribute via top/left/right/bottom.
  // On hover, both original and duplicate translate by the SAME amount in the SAME direction,
  // so the duplicate slides into the slot and the original slides out the opposite side.
  // After the tween, snap both back to translate 0 — the duplicate returns to its parked spot,
  // ready for the next hover. Since dup is a clone of og, the swap is pixel-identical.
  const directions = {
    bottom: { axis: 'yPercent', exit: -100, dupPos: { top: '100%' } },
    top: { axis: 'yPercent', exit: 100, dupPos: { bottom: '100%' } },
    left: { axis: 'xPercent', exit: 100, dupPos: { right: '100%' } },
    right: { axis: 'xPercent', exit: -100, dupPos: { left: '100%' } },
  };

  logoWrap.querySelectorAll('.modcon-hero-logo-col[data-col-hover]').forEach((col) => {
    const cfg = directions[col.dataset.colHover];
    const img = col.querySelector('img');
    if (!cfg || !img) return;

    // Wrap the og image in a tight div with overflow:hidden so the slide is clipped
    // to the letter's bounds, not the (often larger) col bounds.
    const wrap = document.createElement('div');
    wrap.setAttribute('data-col-hover-wrap', '');
    Object.assign(wrap.style, {
      position: 'relative',
      overflow: 'hidden',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      verticalAlign: 'top',
    });
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);

    const dup = img.cloneNode(true);
    dup.setAttribute('data-col-hover-dup', '');
    Object.assign(dup.style, {
      position: 'absolute',
      ...cfg.dupPos,
      pointerEvents: 'none',
    });
    wrap.appendChild(dup);

    let animating = false;
    col.addEventListener('mouseenter', () => {
      if (animating) return;
      animating = true;

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set([img, dup], { [cfg.axis]: 0 });
          animating = false;
        },
      });
      tl.to([img, dup], {
        [cfg.axis]: cfg.exit,
        duration: 0.4,
        ease: 'power2.inOut',
      });
    });
  });
}

// Init
initCSSMarquee();
initGallery();
initStackingStickyCardsBounce();
initCountdown();
initHeroLogoIntro();
initLogoColHover();
