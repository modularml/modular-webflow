export function initMojoAnimations() {
  gsap.registerPlugin(ScrollTrigger);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  $('h1, h2, h3, h4, h5, h6').each(function () {
    if ($(this).is('[data-emoji-exclude]') || $(this).closest('.w-richtext').length) {
      return;
    }

    const $heading = $(this);
    let html = $heading.html();

    if (html.includes('Mojo')) {
      const newHtml = html.replace(
        /Mojo/g,
        '<span style="display: inline-flex;align-items: center;"><span>Mojo</span><span style="width: 1em; display: inline-block;height: 1em" data-lottie data-lottie-src="https://cdn.prod.website-files.com/68c9c3107effc2ea46e1a81f/694322d8b5849da406718d9a_MojoEmoji.json"></span></span>'
      );
      $heading.html(newHtml);
    }
  });

  $('[data-lottie]').each(function () {
    const target = this;
    let anim;

    ScrollTrigger.create({
      trigger: target,
      start: 'top bottom+=50%',
      end: 'bottom top-=25%',
      onEnter: handleEnter,
      onEnterBack: handleEnter,
      onLeave: handleLeave,
      onLeaveBack: handleLeave,
    });

    function handleEnter() {
      if (!target.hasAttribute('data-lottie-fired')) {
        target.setAttribute('data-lottie-fired', 'true');
        anim = lottie.loadAnimation({
          container: target,
          renderer: 'svg',
          loop: true,
          autoplay: !reduceMotion,
          path: target.getAttribute('data-lottie-src'),
        });
        anim.setSpeed(1.5);
        anim.addEventListener('DOMLoaded', () => {
          if (reduceMotion) {
            const frame = parseInt(target.getAttribute('data-lottie-frame') || '0', 10);
            anim.goToAndStop(frame, true);
          }
        });
      } else if (anim && !reduceMotion) {
        anim.play();
      }
    }

    function handleLeave() {
      if (anim && !reduceMotion) {
        anim.pause();
      }
    }
  });
}
