"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/about.js
  gsap.registerPlugin(ScrollTrigger, SplitText);
  function initHighlightText() {
    let splitHeadingTargets = document.querySelectorAll("[data-highlight-text]");
    splitHeadingTargets.forEach((heading) => {
      const scrollStart = heading.getAttribute("data-highlight-scroll-start") || "top 70%";
      const scrollEnd = heading.getAttribute("data-highlight-scroll-end") || "center 40%";
      const fadedValue = heading.getAttribute("data-highlight-fade") || 0.2;
      const staggerValue = heading.getAttribute("data-highlight-stagger") || 0.1;
      new SplitText(heading, {
        type: "words, chars",
        autoSplit: true,
        onSplit(self) {
          let ctx = gsap.context(() => {
            let tl = gsap.timeline({
              scrollTrigger: {
                scrub: true,
                trigger: heading,
                start: scrollStart,
                end: scrollEnd
              }
            });
            tl.from(self.chars, {
              autoAlpha: fadedValue,
              stagger: staggerValue,
              ease: "linear"
            });
          });
          return ctx;
        }
      });
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    initHighlightText();
  });
})();
//# sourceMappingURL=about.js.map
