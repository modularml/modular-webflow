// index.js
import { installAndScrollAnchorTags } from './anchor-tags.js';
import { initAnims } from './animations.js';
import { setupHookForFormSubmission } from './forms/form.js';
import { initMojoAnimations } from './lottie.js';
import { initMaxReplacements } from './max.js';
import { initModalBasic } from './modal.js';
import { initNav } from './nav.js';
import { initScrollToggle } from './scroll.js';
import { initSwipers } from './swipers.js';
import { initTabs } from './tabs.js';
import { initAmplitude } from './tracking/amplitude.js';
import { initCookie } from './tracking/cookie.js';
import { initExperiment } from './tracking/experiment.js';
import { initCheckSectionThemeScroll } from './scroll-themes.js';

$(document).ready(function () {
  initScrollToggle();
  initNav();
  initTabs();
  initSwipers();
  initModalBasic();
  initMojoAnimations();
  initMaxReplacements();
  initAnims();
  initCookie();
  initAmplitude();
  setupHookForFormSubmission();
  initExperiment();
  installAndScrollAnchorTags();
  initCheckSectionThemeScroll();
});

$(document).ready(function () {
  // CTA Button animation
  const ctaButton = document.querySelector('.cta-button');
  const contentSection = document.querySelector('.section-content-blog-template');

  if (ctaButton && contentSection) {
    ctaButton.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    ctaButton.style.opacity = 0;

    let contentSectionVisible = false;
    let nextSiblingVisible = false;

    function updateCTAVisibility() {
      if (contentSectionVisible && !nextSiblingVisible) {
        ctaButton.style.opacity = 1;
      } else {
        ctaButton.style.opacity = 0;
      }
    }

    const contentObserver = new IntersectionObserver((entries) => {
      contentSectionVisible = entries[0].isIntersecting;
      updateCTAVisibility();
    });

    contentObserver.observe(contentSection);

    const nextSibling = contentSection.nextElementSibling;
    if (nextSibling) {
      const nextSiblingObserver = new IntersectionObserver((entries) => {
        nextSiblingVisible = entries[0].isIntersecting;
        updateCTAVisibility();
      });

      nextSiblingObserver.observe(nextSibling);
    }
  }
});
