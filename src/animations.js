function animateLines() {
  $('[data-line-dividers]').each(function () {
    let wrap = $(this);
    let lines = wrap.find('.line-divider');
    let transformOrigin = wrap.attr('data-transform-origin') || 'bottom';
    let isTopOrigin = transformOrigin === 'top';

    lines.each(function () {
      let scaleStart = parseFloat($(this).attr('data-start-scale') ?? 0);
      let scaleEnd = parseFloat($(this).attr('data-end-scale') ?? 0.2);

      // When origin is top, reverse direction so the line grows from top downward
      let fromScale = isTopOrigin ? scaleEnd : scaleStart;
      let toScale = isTopOrigin ? scaleStart : scaleEnd;

      gsap.set($(this), {
        scaleY: fromScale,
        transformOrigin: transformOrigin,
      });

      gsap.to($(this), {
        scaleY: toScale,
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
