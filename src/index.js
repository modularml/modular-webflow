import { Experiment } from '@amplitude/experiment-js-client';

import { codeAnimation, letterAnimation, typeText } from '$utils/globalFunctions';
import { SniffEmailForAmplitude } from '$utils/sniffEmail';
import { swiperCarousel, tabCarousel } from '$utils/tabCarousel';

import { waitUntil } from './utils/wait';

document.documentElement.classList.add('js-enabled');

document.querySelectorAll('h1,h2,h3').forEach((el) => {
  const id = el.innerText
    .toLowerCase()
    .split(' ')
    .map((a) => a.replace(/\W/g, ''))
    .join('-');
  el.style.position = 'relative';
  const anchorEl = document.createElement('div');

  anchorEl.style.position = 'absolute';
  anchorEl.style.top = '-90px';
  anchorEl.style.left = '0';

  anchorEl.id = id;
  el.appendChild(anchorEl);
});

$(document).ready(function () {
  // Register GSAP
  gsap.registerPlugin(ScrollTrigger);

  if (window.location.hash) {
    const hashEl = document.getElementById(window.location.hash.replace('#', ''));
    setTimeout(() => {
      window.scrollTo({
        top: hashEl.getBoundingClientRect().top + window.scrollY,
      });
    }, 100);
  }

  // #region Utilities

  // Hero - Copy to Clipboard
  let curlCopy = $('.curl_copy');
  let copyTimeout;

  if (curlCopy) {
    curlCopy.on('click', function (e) {
      e.preventDefault();

      let data = $(this).find('[data-copy]').text();
      copyTextToClipboard(data);

      amplitude.track('copyMojoDownload');
    });

    function copyTextToClipboard(text) {
      var textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        var successful = document.execCommand('copy');

        clearTimeout(copyTimeout);

        $('#copy-icon').hide();
        $('#copy-success').show();
        $('.curl_copy-tip-text').text('Copied!');

        copyTimeout = setTimeout(() => {
          $('#copy-icon').show();
          $('#copy-success').hide();
          $('.curl_copy-tip-text').text('Copy');
        }, 4000);
      } catch (err) {}
      document.body.removeChild(textArea);
    }
  }

  // Team has many images and does not appear to have problems when this is removed.
  if (window.location.pathname !== '/team') {
    // GSAP IMG SET
    $('img').each(function () {
      if ($(this).parent().hasClass('latest-blog_visual')) {
        return;
      }
      $(this).removeAttr('loading');
    });
    ScrollTrigger.refresh();
  }

  // RemoveScrollBar for all overflow elements
  function addNoScrollbarClass() {
    const allElements = document.querySelectorAll('*');

    for (const element of allElements) {
      // Exclude body and html elements
      if (element.tagName.toLowerCase() === 'body' || element.tagName.toLowerCase() === 'html') {
        continue;
      }

      const style = window.getComputedStyle(element);
      if (
        style.overflow === 'auto' ||
        style.overflow === 'scroll' ||
        style.overflowX === 'auto' ||
        style.overflowX === 'scroll' ||
        style.overflowY === 'auto' ||
        style.overflowY === 'scroll'
      ) {
        // Disable Scrollbar
        element.classList.add('no-scrollbar');
        // Fix for inner scroll inside swipers
        element.classList.add('swiper-no-swiping');
      }
    }
  }
  addNoScrollbarClass();

  // #endregion

  // #region Codes Animation
  // -- Code Blocks Animations to view
  $('.dashboard_inner[code-animation]').each(function () {
    const codeBlock = $(this).find('.dashboard_code-block');
    codeBlock.hide();

    ScrollTrigger.create({
      trigger: $(this),
      once: true,
      start: '50% bottom',
      invalidateOnRefresh: true,
      toggleActions: 'play null null null',
      onEnter: () => {
        codeBlock.show();
        codeAnimation($(this));
      },
    });
  });

  // #endregion

  // #region Menu

  // Base
  var menuOpenAnim = false;
  var dropdownOpen = false;
  const menuLinks = '.navbar_part.links';
  const menuLinksItems = '.navbar_link';
  const menuButton = '.navbar_menu-btn';
  const navLines = $('.navbar_ham-line');

  // Menu Animation
  let menuText = 'Close';
  function createNavReveal() {
    let navReveal = gsap
      .timeline({
        paused: true,
        onComplete: () => {
          disableScroll();
        },
      })
      .fromTo(navLines.eq(0), { y: '0px', rotate: '0deg' }, { y: '7px', rotate: '45deg' }, '<')
      .fromTo(navLines.eq(1), { opacity: 1 }, { opacity: 0 }, '<')
      .fromTo(navLines.eq(2), { y: '0px', rotate: '0deg' }, { y: '-7px', rotate: '-45deg' }, '<')
      .fromTo('.navbar_menu-close', { x: '0.4rem', opacity: 0 }, { x: '0', opacity: 1 }, '<')
      .fromTo(menuLinks, { display: 'none' }, { display: 'flex' }, '<')
      .fromTo(menuLinks, { yPercent: -100 }, { yPercent: 0 }, '<')
      .fromTo(
        [menuLinksItems, '.navbar_link-icon'],
        {
          y: '100%',
          opacity: 0,
        },
        {
          y: '0%',
          opacity: 1,
          stagger: {
            each: 0.05,
          },
        },
        '-=0.2'
      )
      .fromTo(menuLinksItems, { pointerEvents: 'none' }, { pointerEvents: 'auto' }, '<');
    return navReveal;
  }

  // Scroll Disabler
  let scrollPosition;
  const disableScroll = () => {
    if (!menuOpenAnim) {
      scrollPosition = $(window).scrollTop();
      $('html, body').scrollTop(0).addClass('overflow-hidden');
    } else {
      $('html, body').scrollTop(scrollPosition).removeClass('overflow-hidden');
    }
    menuOpenAnim = !menuOpenAnim;
  };

  let navReveal;

  // GSAP's matchMedia
  ScrollTrigger.matchMedia({
    '(max-width: 991px)': function () {
      // Apply the animation only on screens with a max-width of 991px
      navReveal = createNavReveal();
    },
  });

  // Actions
  // Open on Click
  $('.navbar_menu-btn').on('click', openMenu);

  // Functions
  function openMenu() {
    if (navReveal) {
      playMenuAnimation();
    }
  }

  function playMenuAnimation() {
    updateMenuText();

    if (!menuOpenAnim) {
      $('.navbar_menu-btn').addClass('open');
      navReveal.timeScale(1).play();
    } else {
      $('.navbar_menu-btn').removeClass('open');
      navReveal.timeScale(1.5).reverse();
      disableScroll();
    }
  }

  function updateMenuText() {
    menuText = menuOpenAnim ? 'Menu' : 'Close';
  }

  // Menu Dropdown Animation
  $('.navbar_dropdown').on('click', function () {
    if ($(window).width() < 992) {
      $('.navbar_dropdown').removeClass('is-active');
      $(this).addClass('is-active');
    }
  });

  // #endregion

  // #region Tabs
  if ($('.tabs.max-tab').length) {
    const activeClass = 'tab-active';
    const progressLine = '.tabs_block-progress-line';
    const duration = 4000;

    // Animates a card, by typing the text and filename.
    function cardAnimation(card) {
      return new Promise((resolve) => {
        card.addClass('active');
        resolve();
      });
    }
    // TABS 2
    tabCarousel({
      tabs: $('.tabs.max-tab .tabs_block-link-menu .tabs_block-link'),
      cards: $('.tabs.max-tab .max-products .max-products_grid-cell'),
      onCardLeave: (card) => {
        card.removeClass('active');
      },
      onTabLeave: (tab) => {
        tab.removeClass(activeClass);
        // If this is called mid animation (by a click) this will stop it.
        tab.find(progressLine).stop();
        tab.find(progressLine).css('width', '0');
      },
      onCardShow: cardAnimation,
      onTabShow: (tab) => {
        return new Promise((resolve) => {
          tab.addClass(activeClass);
          tab.find(progressLine).animate({ width: '100%' }, duration, resolve);
        });
      },
    });

    swiperCarousel({
      sliderSelector: '.tabs_slider.max-tab',
      // On init and when the swiper slides, we animate the progressbar and code
      // block, but only animate the code the first time it's shown.
      animateOnSlide(activeSlide) {
        // Set progressLine to 0 and then start an animation for it.

        activeSlide
          .find(progressLine)
          .stop(true, true)
          .css('width', '0')
          .animate({ width: '100%' }, duration);

        let cards = $('.tabs_slider.max-tab .max-products .max-products_grid-cell');

        cards.removeClass('active');
        cards.eq(activeSlide.index()).addClass('active');
      },
      onInit() {},
      duration,
    });
  }

  // #endregion

  // #region AmplitudeTrack
  SniffEmailForAmplitude();
  function amplitudeTrack(anchorTag, trackTitle) {
    return () => {
      amplitude.track(trackTitle, {
        href: window.location.href,
        location: anchorTag.dataset.analyticsLocation,
      });
    };
  }

  // Delay these calls to avoid blocking main thread
  setTimeout(() => {
    [...document.querySelectorAll('a')]
      .filter((a) => a.href === 'https://docs.modular.com/')
      .forEach((a) => {
        a.onclick = amplitudeTrack(a, 'DownloadMaxClicked');
      });
  }, 100);

  setTimeout(() => {
    [...document.querySelectorAll('a')]
      .filter((a) => a.href === 'https://modular.com/enterprise#form')
      .forEach((a) => {
        a.onclick = amplitudeTrack(a, 'ContactSalesClicked');
      });
  }, 200);
  setTimeout(() => {
    [...document.querySelectorAll('[data-analytics-onclick]')].forEach((a) => {
      a.onclick = amplitudeTrack(a, a.dataset.analyticsOnclick);
    });
  }, 300);
  let timeStartedOnPage = new Date();

  function trackTimeOnPage(pathname) {
    if (!timeStartedOnPage) {
      return;
    }
    const durationInSeconds = Math.round(new Date().getTime() - timeStartedOnPage.getTime()) / 1000;
    amplitude.track('TimeOnPage', {
      duration: `${Math.round(durationInSeconds)}`,
      minutes: `${Math.round(durationInSeconds / 60)}`,
      pathname,
    });
  }

  function scrollPercentage() {
    const { documentElement } = document,
      { body } = document;

    return Math.round(
      ((documentElement.scrollTop || body.scrollTop) /
        ((documentElement.scrollHeight || body.scrollHeight) - documentElement.clientHeight)) *
        100
    );
  }

  let maxScroll = 0;

  setInterval(() => {
    const curScroll = scrollPercentage();
    if (curScroll > maxScroll) {
      maxScroll = curScroll;
    }
  }, 500);

  window.addEventListener('beforeunload', () => {
    const { pathname } = window.location;
    trackTimeOnPage(pathname);
    amplitude.track('MaxScrollPercentage', { maxScroll, pathname });
    return undefined;
  });

  // #endregion

  async function experimentCode() {
    try {
      const isProd = new URL(window.location.href).host === 'modular-prod-dev.webflow.io';
      const apiKey = isProd
        ? 'client-ejPfaOrUEtTflNBKKrNtLWx5IB1QbAmy'
        : 'client-fhQfFdzMgOCoCAWmoV0W8KvnbhFe2dUu';
      const experiment = Experiment.initializeWithAmplitudeAnalytics(apiKey);
      await experiment.fetch();
      Object.entries(experiment.variants.getAll()).forEach(([key, val]) => {
        if (val.payload) {
          experiment.exposure(key);
          const hideStr = val.payload.hide
            ? `.${val.payload.hide} { display: none !important; }\n`
            : '';
          const showStr = val.payload.hide
            ? `.${val.payload.show} { display: flex !important; }`
            : '';
          const style = document.createElement('style');
          style.type = 'text/css';
          style.innerHTML = hideStr + showStr;
          document.getElementsByTagName('head')[0].appendChild(style);
        }
      });
    } catch (e) {}
    if (document.querySelector('.section_hp-hero')) {
      document.querySelector('.section_hp-hero').style.opacity = 1;
    }
  }

  waitUntil(() => window.amplitude).then(() => {
    const isProd = location.href.indexOf('www.modular.com') !== 0;
    const sessionReplayTracking = window.sessionReplay.plugin({ sampleRate: isProd ? 0.1 : 0 });
    window.amplitude.add(sessionReplayTracking);
    window.amplitude.init(
      isProd ? '3878a0571d1575870a7d0a5f7e644d23' : 'd8bf208ebdc1b1000d38da8b826a74c4'
    );
    experimentCode();
  });

  // Finds elements with `.inject-install` and then puts install instructions
  // inside of them. Sets some style properties too since I was a bit too lazy
  // for a class here. Additionally, the way it finds the inner text is a bit odd.
  // It's additionally lazy by being in an interval that just runs 4 times a
  // second instead of being more correct, but this crude logic is not causing
  // any issues.
  function installCommand(deviceId = '') {
    return `curl -ssL https://magic.modular.com/${deviceId} | bash`;
  }
  const cookieName = 'mod-id';
  const prevModId = getCookie(cookieName);
  let adblockId = null;
  if (prevModId && !prevModId.startsWith('www-')) {
    adblockId = prevModId;
  } else {
    const cookieValue = crypto.randomUUID().replace(/^..../, 'fed1');
    adblockId = cookieValue;
    document.cookie = `${cookieName}=${cookieValue}; expires=Fri, 31 Dec 9999 23:59:59 GMT; SameSite=Lax; Secure;Path=/;`;
  }
  const amplitudeIdInterval = setInterval(() => {
    let amplitudeId = amplitude.getDeviceId();
    const codeEl = document.querySelector('.inject-install > pre');
    const command = installCommand(amplitudeId ? amplitudeId : adblockId);
    if (codeEl) {
      for (let installBlock of document.querySelectorAll('.inject-install')) {
        installBlock.querySelector('code').style.textOverflow = 'ellipsis';
        installBlock.querySelector('code').style.overflow = 'hidden';
        installBlock.querySelector('code').innerHTML = installBlock.querySelector(
          'code'
        ).innerText = `<span class="line"><br/>${command}</span>`;
      }
      if (amplitudeId) {
        clearInterval(amplitudeIdInterval);
      }
    }
    const copyCurlEls = document.querySelectorAll('[fs-copyclip-element="copy-this"]');
    for (let copyCurlEl of copyCurlEls) {
      if (
        copyCurlEl &&
        copyCurlEl.innerText &&
        copyCurlEl.innerText.includes('curl -ssL https://magic.modular.com | bash')
      ) {
        copyCurlEl.innerText = command;
      }
    }
  }, 250);

  setupHookForFormSubmission();

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

// From https://www.w3schools.com/js/js_cookies.asp
function getCookie(cname) {
  let name = cname + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

function setupHookForFormSubmission() {
  console.log('setupHookForFormSubmission');
  const forms = document.querySelectorAll('form');
  if (!forms.length) return;

  forms.forEach((form) => {
    const honeypot = form.querySelector('#form-description');
    const submitButton = form.querySelector('input[type="submit"], button[type="submit"]');
    const firstNameInput = form.querySelector(
      'input[name*="First-Name"], input[name*="First-name"]'
    );
    const lastNameInput = form.querySelector('input[name*="Last-Name"], input[name*="Last-name"]');
    const emailInput = form.querySelector('input[data-domain-check]');

    if (honeypot) {
      honeypot.oninput = function () {
        if (honeypot.value.length > 0) {
          submitButton.disabled = true;
        }
      };
    }

    const fieldErrors = new Map();

    function showFieldError(field, message) {
      let errorElement = fieldErrors.get(field);
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-validation-error';
        errorElement.style.cssText = 'color: #e74c3c; font-size: 14px; margin-top: 5px;';
        field.parentNode.insertBefore(errorElement, field.nextSibling);
        fieldErrors.set(field, errorElement);
      }
      errorElement.textContent = message;
      errorElement.style.display = 'block';
    }

    function hideFieldError(field) {
      const errorElement = fieldErrors.get(field);
      if (errorElement) {
        errorElement.style.display = 'none';
      }
    }

    function setFieldInputError(field, hasError) {
      if (hasError) {
        field.style.outlineColor = '#e74c3c';
        field.style.outlineWidth = '2px';
      } else {
        field.style.outlineColor = '';
        field.style.outlineWidth = '';
      }
    }

    function setSubmitButtonState(disabled) {
      if (submitButton) {
        submitButton.disabled = disabled;
        submitButton.style.opacity = disabled ? '0.5' : '1';
        submitButton.style.cursor = disabled ? 'not-allowed' : 'pointer';
      }
    }

    if (firstNameInput) {
      firstNameInput.addEventListener('input', (ev) => {
        const name = ev.target.value.trim();
        if (isLikelyInvalidName(name)) {
          showFieldError(
            firstNameInput,
            'Please enter a valid name. Names should contain standard letters and spacing.'
          );
          setFieldInputError(firstNameInput, true);
          setSubmitButtonState(true);
        } else {
          hideFieldError(firstNameInput);
          setFieldInputError(firstNameInput, false);
          setSubmitButtonState(false);
        }
      });
    }

    if (lastNameInput) {
      lastNameInput.addEventListener('input', (ev) => {
        const name = ev.target.value.trim();
        if (isLikelyInvalidName(name)) {
          showFieldError(
            lastNameInput,
            'Please enter a valid name. Names should contain standard letters and spacing.'
          );
          setFieldInputError(lastNameInput, true);
          setSubmitButtonState(true);
        } else {
          hideFieldError(lastNameInput);
          setFieldInputError(lastNameInput, false);
          setSubmitButtonState(false);
        }
      });
    }

    if (!emailInput) {
      return;
    }

    function validateEmailDomain(emailDomain) {
      const blockedDomains = [
        'comcast.net',
        'gmail.com',
        'live.com',
        'yahoo.com',
        'hotmail.com',
        'mail.ru',
        'web.de',
        'gmx.net',
        'live.net',
        'mail.com',
        'aol.com',
        'msn.com',
        'outlook.com',
        'proton.me',
        'protonmail.com',
        'icloud.com',
        'me.com',
        'zoho.com',
        'yandex.com',
        'inbox.com',
      ];
      return blockedDomains.includes(emailDomain.toLowerCase());
    }

    emailInput.addEventListener('input', (ev) => {
      const email = ev.target.value.trim();
      const emailDomain = email.toLowerCase().split('@')[1];

      if (email && email.includes('@')) {
        const isBlocked = validateEmailDomain(emailDomain);

        if (isBlocked) {
          showFieldError(
            emailInput,
            `Please use a business email address. ${emailDomain} is not allowed.`
          );
          setFieldInputError(emailInput, true);
          setSubmitButtonState(true);
        } else {
          hideFieldError(emailInput);
          setFieldInputError(emailInput, false);
          setSubmitButtonState(false);
        }
      } else {
        hideFieldError(emailInput);
        setFieldInputError(emailInput, false);
        setSubmitButtonState(false);
      }
    });
  });
}

function isLikelyInvalidName(name) {
  let score = 0;

  if (/(.)\1{2,}/.test(name)) score += 3;

  const vowels = name.match(/[aeiou]/gi) || [];
  const vowelRatio = vowels.length / name.replace(/\s/g, '').length;
  if (vowelRatio < 0.15 || vowelRatio > 0.6) score += 2;

  if (/asdf|qwer|zxcv|hjkl/i.test(name)) score += 3;

  if (/[^aeiou\s]{6,}/i.test(name)) score += 2;

  if (/[^a-z\s'-]/i.test(name)) score += 2;

  const capsScore = checkCapitalization(name);
  score += capsScore;

  return score >= 3;
}

function checkCapitalization(name) {
  const words = name.split(/[\s-]+/);

  let suspiciousPatterns = 0;

  const allLowercase = !/[A-Z]/.test(name);

  for (const word of words) {
    if (word.length === 0) continue;

    const capitals = (word.match(/[A-Z]/g) || []).length;

    if (word.length > 2 && capitals === word.length) {
      suspiciousPatterns += 1;
    }

    if (word.length > 2) {
      const randomCaps = /^[a-z]+[A-Z][a-z]*[A-Z]|^[A-Z][a-z]+[A-Z][a-z]+[A-Z]/;
      const isException = /^(Ma?c|O'|D'|De|Van|Von|La|Le|Di|Da)[A-Z]/i.test(word);

      if (randomCaps.test(word) && !isException) {
        suspiciousPatterns += 1;
      }
    }
  }

  if (!allLowercase && words.length > 1) {
    const hasLowercaseWord = words.some((w) => w.length > 2 && /^[a-z]+$/.test(w));
    const hasUppercaseWord = words.some((w) => w.length > 2 && /^[A-Z]+$/.test(w));
    const hasProperCaseWord = words.some((w) => /^[A-Z][a-z]+$/.test(w));

    if ((hasUppercaseWord && hasLowercaseWord) || (hasProperCaseWord && hasLowercaseWord)) {
      suspiciousPatterns += 1;
    }
  }

  if (suspiciousPatterns >= 2) return 3;
  if (suspiciousPatterns === 1) return 1;
  return 0;
}
