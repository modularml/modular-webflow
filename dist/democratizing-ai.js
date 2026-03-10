"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/democratizing-ai.js
  gsap.registerPlugin(InertiaPlugin);
  !function(e, s) {
    "object" === typeof exports && "undefined" !== typeof module ? module.exports = s() : "function" === typeof define && define.amd ? define(s) : (e = "undefined" !== typeof globalThis ? globalThis : e || self).EffectCarousel = s();
  }(void 0, function() {
    "use strict";
    return function({ swiper: e, on: s, extendParams: t }) {
      t({ carouselEffect: { opacityStep: 0.33, scaleStep: 0.2, sideSlides: 2 } }), s("beforeInit", () => {
        if ("carousel" !== e.params.effect)
          return;
        e.classNames.push(`${e.params.containerModifierClass}carousel`);
        const s2 = { watchSlidesProgress: true, centeredSlides: true };
        Object.assign(e.params, s2), Object.assign(e.originalParams, s2);
      }), s("progress", () => {
        if ("carousel" !== e.params.effect)
          return;
        const { scaleStep: s2, opacityStep: t2 } = e.params.carouselEffect, a = Math.max(Math.min(e.params.carouselEffect.sideSlides, 3), 1), r = { 1: 2, 2: 1, 3: 0.2 }[a], i = { 1: 50, 2: 50, 3: 67 }[a], o = e.slides.length;
        for (let l = 0; l < e.slides.length; l += 1) {
          const n = e.slides[l], c = e.slides[l].progress, f = Math.abs(c);
          let u = 1;
          f > 1 && (u = 0.3 * (f - 1) * r + 1);
          const d = n.querySelectorAll(".swiper-carousel-animate-opacity"), p = c * u * i * (e.rtlTranslate ? -1 : 1) + "%", m = 1 - f * s2, y = o - Math.abs(Math.round(c));
          n.style.transform = `translateX(${p}) scale(${m})`, n.style.zIndex = y, n.style.opacity = f > a + 1 ? 0 : 1, d.forEach((e2) => {
            e2.style.opacity = 1 - f * t2;
          });
        }
      }), s("resize", () => {
        e.virtual && e.params.virtual && e.params.virtual.enabled && requestAnimationFrame(() => {
          e.destroyed || (e.updateSlides(), e.updateProgress());
        });
      }), s("setTransition", (s2, t2) => {
        if ("carousel" === e.params.effect)
          for (let s3 = 0; s3 < e.slides.length; s3 += 1) {
            const a = e.slides[s3], r = a.querySelectorAll(".swiper-carousel-animate-opacity");
            a.style.transitionDuration = `${t2}ms`, r.forEach((e2) => {
              e2.style.transitionDuration = `${t2}ms`;
            });
          }
      });
    };
  });
  $(".d-compute_slider .swiper-wrapper").append($(".d-compute_slider .swiper-slide").clone());
  var swiper = new Swiper(".d-compute_slider", {
    // pass EffectCarousel module to modules
    modules: [EffectCarousel],
    // specify "carousel" effect
    effect: "carousel",
    // carousel effect parameters
    carouselEffect: {
      // opacity change per side slide
      opacityStep: 0.33,
      // scale change per side slide
      scaleStep: 0.2,
      // amount of side slides visible, can be 1, 2 or 3
      sideSlides: 3
    },
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    loopAdditionalSlides: 2,
    slidesPerView: "auto",
    autoplay: {
      delay: 3e3
    },
    on: {
      init: () => {
        $(".d-compute_slider").addClass("active");
      }
    }
  });
  function initCSSMarquee() {
    const pixelsPerSecond = 75;
    const marquees = document.querySelectorAll("[data-css-marquee]");
    marquees.forEach((marquee) => {
      marquee.querySelectorAll("[data-css-marquee-list]").forEach((list) => {
        const duplicate = list.cloneNode(true);
        marquee.appendChild(duplicate);
      });
    });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const $marquee = $(entry.target);
          if (!$marquee.data("clicked-paused")) {
            entry.target.querySelectorAll("[data-css-marquee-list]").forEach((list) => {
              list.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
            });
          }
        });
      },
      { threshold: 0 }
    );
    marquees.forEach((marquee) => {
      const $marquee = $(marquee);
      marquee.querySelectorAll("[data-css-marquee-list]").forEach((list) => {
        list.style.animationDuration = list.offsetWidth / pixelsPerSecond + "s";
        list.style.animationPlayState = "paused";
      });
      $marquee.hover(
        function() {
          if (!$(this).data("clicked-paused")) {
            $(this).find("[data-css-marquee-list]").css("animation-play-state", "paused");
          }
        },
        function() {
          if (!$(this).data("clicked-paused")) {
            $(this).find("[data-css-marquee-list]").css("animation-play-state", "running");
          }
        }
      );
      $marquee.on("click touchstart", function(e) {
        e.preventDefault();
        const $this = $(this);
        const isCurrentlyPaused = $this.data("clicked-paused");
        $this.data("clicked-paused", !isCurrentlyPaused);
        const newState = !isCurrentlyPaused ? "paused" : "running";
        $this.find("[data-css-marquee-list]").css("animation-play-state", newState);
      });
      observer.observe(marquee);
    });
  }
  $(document).ready(function() {
    $("[data-headline-short]").each(function() {
      var $headline = $(this);
      if ($headline.length) {
        var currentText = $headline.text();
        var cleanedText = currentText.replace(/\([^)]*\)/g, "").trim();
        $headline.text(cleanedText);
      }
    });
    initCSSMarquee();
  });
})();
//# sourceMappingURL=democratizing-ai.js.map
