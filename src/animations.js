function animateLines() {
  $('[data-line-dividers]').each(function () {
    let wrap = $(this);
    let lines = wrap.find('.line-divider');

    lines.each(function (index) {
      let scaleStart = $(this).attr('data-start-scale') || 0;
      let scaleEnd = $(this).attr('data-end-scale') || 0.2;

      gsap.set($(this), {
        scaleY: scaleStart,
        transformOrigin: 'bottom',
      });

      gsap.to($(this), {
        scaleY: scaleEnd,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: wrap,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    });
  });
}

animateLines();

export function initAnims() {
  animateLines();
}
