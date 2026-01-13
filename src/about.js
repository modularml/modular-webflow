gsap.registerPlugin(ScrollTrigger, SplitText);

function initHighlightText() {
  let splitHeadingTargets = document.querySelectorAll('[data-highlight-text]');
  splitHeadingTargets.forEach((heading) => {
    const scrollStart = heading.getAttribute('data-highlight-scroll-start') || 'top 70%';
    const scrollEnd = heading.getAttribute('data-highlight-scroll-end') || 'center 40%';
    const fadedValue = heading.getAttribute('data-highlight-fade') || 0.2; // Opacity of letter
    const staggerValue = heading.getAttribute('data-highlight-stagger') || 0.1; // Smoother reveal

    new SplitText(heading, {
      type: 'words, chars',
      autoSplit: true,
      onSplit(self) {
        let ctx = gsap.context(() => {
          let tl = gsap.timeline({
            scrollTrigger: {
              scrub: true,
              trigger: heading,
              start: scrollStart,
              end: scrollEnd,
            },
          });
          tl.from(self.chars, {
            autoAlpha: fadedValue,
            stagger: staggerValue,
            ease: 'linear',
          });
        });
        return ctx; // return our animations so GSAP can clean them up when onSplit fires
      },
    });
  });
}

// Initialize Highlight Text on Scroll
document.addEventListener('DOMContentLoaded', () => {
  initHighlightText();
});
