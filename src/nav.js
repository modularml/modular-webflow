const $snackBar = $('.snackbar');
const $navWrapper = $('.nav-wrapper');
const $nav = $('.nav');
const $navWrap = $('.nav_menu-wrap');
const $navMenu = $('.nav_menu');
const $navItems = $navWrap.find('.nav_menu-item, .nav_part');
const $navBrand = $('.nav_part').eq(0);
const $navHam = $('.nav_menu-ham');
const $navLinks = $('.nav_menu-link');
const $menuInner = $('.nav_menu-inner');
const $menuBg = $('.nav_menu-inner-bg');
const $menuBack = $('.nav_menu-back');
const $allTriggers = $('[data-dropdown-trigger]');
const $allTargets = $('[data-dropdown-target]');
let currentTrigger = null;
let originalParent = null;

// __ Desktop
function killAllTweens() {
  gsap.killTweensOf($menuInner);
  gsap.killTweensOf($menuBg);
  $allTargets.each(function () {
    gsap.killTweensOf($(this));
    gsap.killTweensOf($(this).find('li'));
  });
}

function resetAllStyles() {
  gsap.set($navWrap, { clearProps: 'all' });
  gsap.set($navMenu, { clearProps: 'all' });
  gsap.set($navItems, { clearProps: 'all' });
  gsap.set($navBrand, { clearProps: 'all' });
  gsap.set($menuInner, { clearProps: 'all' });
  gsap.set($menuBg, { clearProps: 'all' });
  gsap.set($menuBack, { clearProps: 'all' });
  gsap.set($allTargets, { clearProps: 'all' });

  $allTargets.each(function () {
    const $target = $(this);
    $target.removeClass('is-active');
    gsap.set($target.find('li'), { clearProps: 'all' });

    const $triggerLi = $target.prev('li');
    if ($triggerLi.length) {
      const $siblings = $triggerLi.siblings('li');
      gsap.set($siblings, { clearProps: 'all' });
    }
  });

  $navLinks.each(function () {
    const $li = $(this).closest('li');
    gsap.set($li, { clearProps: 'all' });
  });
}

function hideAllTargets(callback) {
  $allTargets.each(function () {
    const $target = $(this);
    $target.removeClass('is-active');
    gsap.set($target, { autoAlpha: 0 });
    gsap.set($target.find('li'), { autoAlpha: 0, y: 0 });
  });
  if (callback) callback();
}

function resizeBackground($target) {
  $target.addClass('is-active');
  gsap.set($target, { autoAlpha: 1 });

  const targetWidth = $target.outerWidth();
  const targetHeight = $target.outerHeight();

  gsap.to($menuBg, {
    width: targetWidth,
    height: targetHeight,
    autoAlpha: 1,
    duration: 0.25,
    ease: 'power2.out',
  });
}

function showTarget($target) {
  resizeBackground($target);

  gsap.fromTo(
    $target.find('li'),
    { autoAlpha: 0, y: 10 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.2,
      stagger: 0.03,
      ease: 'power2.out',
      delay: 0.05,
    }
  );
}

function hideTarget($target, callback) {
  gsap.to($target.find('li'), {
    autoAlpha: 0,
    y: -10,
    duration: 0.15,
    stagger: 0.02,
    onComplete: () => {
      $target.removeClass('is-active');
      gsap.set($target, { autoAlpha: 0 });
      if (callback) callback();
    },
  });
}

function handleTriggerHover(targetName) {
  if (currentTrigger === targetName) return;

  killAllTweens();

  const $currentTarget = $(`[data-dropdown-target="${targetName}"]`);
  const $currentTriggerEl = $(`[data-dropdown-trigger="${targetName}"]`);
  const $prevTarget = $allTargets.filter('.is-active');

  currentTrigger = targetName;
  gsap.set($currentTarget, { autoAlpha: 1 });

  const parentRect = $menuInner.parent()[0].getBoundingClientRect();
  const triggerRect = $currentTriggerEl[0].getBoundingClientRect();
  const menuWidth = $menuInner.outerWidth();

  const triggerCenter = triggerRect.left + triggerRect.width / 2;
  const parentCenter = parentRect.left + parentRect.width / 2;
  let offsetFromCenter = triggerCenter - parentCenter;

  const finalLeft = parentRect.left + offsetFromCenter;
  const finalRight = finalLeft + menuWidth;
  const windowWidth = $(window).width();
  const edgePadding = 20;

  if (finalLeft < edgePadding) {
    offsetFromCenter += edgePadding - finalLeft;
  } else if (finalRight > windowWidth - edgePadding) {
    offsetFromCenter -= finalRight - (windowWidth - edgePadding);
  }

  gsap.to([$menuInner, $menuBg], {
    x: offsetFromCenter,
    duration: 0.3,
    ease: 'power2.out',
  });

  gsap.to($menuInner, { autoAlpha: 1, duration: 0.2 });

  if ($prevTarget.length) {
    hideAllTargets(() => showTarget($currentTarget));
  } else {
    showTarget($currentTarget);
  }
}

function handleNavLeave() {
  killAllTweens();

  const $activeTarget = $allTargets.filter('.is-active');

  currentTrigger = null;

  if ($activeTarget.length) {
    hideTarget($activeTarget);

    gsap.to($menuBg, {
      autoAlpha: 0,
      duration: 0.2,
      delay: 0.1,
    });

    gsap.to($menuInner, {
      autoAlpha: 0,
      duration: 0.2,
      delay: 0.2,
    });
  }
}

// __ Mobile
function resetToDefault() {
  killAllTweens();

  gsap.set($menuBack, { autoAlpha: 0 });
  gsap.set($navBrand, { autoAlpha: 1 });
  gsap.set($allTargets, { display: 'none', autoAlpha: 0, clearProps: 'height' });
  $allTargets.removeClass('is-active');

  const $siblings = $navMenu.find('li').not('[data-dropdown-target]');
  gsap.set($siblings, { display: 'block', autoAlpha: 1 });
  gsap.set($navMenu, { autoAlpha: 1 });
}

function showTargetMobile($target, $triggerLi) {
  const $siblings = $triggerLi.siblings('li');

  gsap.set($navBrand, { autoAlpha: 0 });
  gsap.set($menuBack, { autoAlpha: 1 });

  gsap.to($navMenu, { autoAlpha: 0, duration: 0.15 });
  gsap.to([$siblings, $allTargets], {
    autoAlpha: 0,
    duration: 0.15,
    onComplete: () => {
      gsap.set($siblings, { display: 'none' });
      gsap.set($allTargets, { display: 'none' });
      $allTargets.removeClass('is-active');

      $target.addClass('is-active');
      gsap.set($target, { display: 'block', height: 'auto' });
      const targetHeight = $target.outerHeight();
      gsap.set($target, { height: 0 });

      gsap.to($navMenu, { autoAlpha: 1, duration: 0.1 });
      gsap.to($target, {
        height: targetHeight,
        autoAlpha: 1,
        duration: 0.25,
        ease: 'power2.out',
        onComplete: () => gsap.set($target, { height: 'auto' }),
      });

      gsap.fromTo(
        $target.find('li'),
        { autoAlpha: 0, x: -10 },
        { autoAlpha: 1, x: 0, duration: 0.2, stagger: 0.03, ease: 'power2.out', delay: 0.1 }
      );
    },
  });
}

function hideTargetMobile() {
  const $activeTarget = $allTargets.filter('.is-active');
  if (!$activeTarget.length) return;

  gsap.to($activeTarget.find('li'), {
    autoAlpha: 0,
    x: 10,
    duration: 0.15,
    stagger: 0.02,
  });

  gsap.to($activeTarget, {
    height: 0,
    autoAlpha: 0,
    duration: 0.2,
    ease: 'power2.in',
    onComplete: () => resetToDefault(),
  });
}

function handleTriggerClick(e, targetName) {
  e.preventDefault();
  killAllTweens();

  const $currentTarget = $(`[data-dropdown-target="${targetName}"]`);
  const $triggerLi = $(e.currentTarget).closest('li');

  if ($currentTarget.hasClass('is-active')) {
    hideTargetMobile();
  } else {
    showTargetMobile($currentTarget, $triggerLi);
  }
}

function setupDesktop() {
  killAllTweens();
  resetAllStyles();

  if (originalParent && originalParent.length) {
    $allTargets.each(function () {
      $(this).appendTo(originalParent);
    });
  }

  gsap.set($menuInner, { autoAlpha: 0 });
  gsap.set($menuBg, { autoAlpha: 0 });
  gsap.set($allTargets, { autoAlpha: 0 });
  gsap.set($menuBack, { autoAlpha: 0 });

  $navLinks.off('click mouseenter').on('mouseenter', function () {
    const targetName = $(this).attr('data-dropdown-trigger');
    if (targetName) handleTriggerHover(targetName);
    else {
      handleNavLeave();
    }
  });

  $nav.off('mouseleave').on('mouseleave', () => handleNavLeave());
  $menuBack.off('click');
}

function setupMobile() {
  killAllTweens();
  resetAllStyles();

  gsap.set($allTargets, { display: 'none', autoAlpha: 0 });
  gsap.set($menuBack, { autoAlpha: 0 });

  $navLinks.off('mouseenter');
  $navLinks.off('mouseleave');
  $nav.off('mouseleave');

  if (!originalParent) {
    originalParent = $allTargets.first().parent();
  }

  $navLinks.each(function () {
    const triggerName = $(this).attr('data-dropdown-trigger');
    if (triggerName) {
      const $triggerLi = $(this).closest('li');
      const $targetToMove = $(`[data-dropdown-target="${triggerName}"]`);
      if ($targetToMove.length && $triggerLi.length) {
        $targetToMove.insertAfter($triggerLi);
      }
    }
  });

  $navLinks.on('click', function (e) {
    const targetName = $(this).attr('data-dropdown-trigger');
    if (targetName) handleTriggerClick(e, targetName);
  });

  $menuBack.on('click', hideTargetMobile);
}

function animateNav() {
  if ($(window).width() < 992) {
    gsap.set($navWrap, { autoAlpha: 0, display: 'none' });
    gsap.set($navItems, { autoAlpha: 0, y: '1em' });
  } else {
    resetAllStyles();
  }

  function revealNav() {
    let tl = gsap.timeline();
    $snackBar.hide();
    tl.to($navWrap, { autoAlpha: 1, display: 'flex' });
    tl.to($navMenu, { autoAlpha: 1 });
    tl.to(
      $navItems,
      {
        autoAlpha: 1,
        y: '0em',
        duration: 0.4,
        stagger: 0.02,
        ease: 'power2.inOut',
      },
      '<'
    );
  }

  function hideNav() {
    resetToDefault();

    $snackBar.css('display', 'flex');
    let tl = gsap.timeline();
    tl.to($navMenu, { autoAlpha: 0 });
    tl.to(
      $navItems,
      {
        autoAlpha: 0,
        y: '1em',
        duration: 0.4,
        stagger: 0.02,
        ease: 'power2.inOut',
      },
      '<'
    );
    tl.to($navWrap, { autoAlpha: 0, display: 'flex' });
  }

  $navHam.on('click', function () {
    if (!$(this).hasClass('is-active')) {
      revealNav();
      $(this).addClass('is-active');
    } else {
      hideNav();
      $(this).removeClass('is-active');
    }
  });
}

// __ Scroll
function initNavScrollBorder() {
  var classAdd = 'fixed';

  if ($nav.hasClass(classAdd)) return;

  $(window).on('scroll load', function () {
    var scroll = $(window).scrollTop();

    //console.log(scroll);
    if (scroll >= 80) {
      if (!$nav.hasClass(classAdd)) {
        //console.log('a');
        $nav.addClass(classAdd);
      }
    } else {
      //console.log('a');
      $nav.removeClass(classAdd);
    }
  });
}
function initNavScroll() {
  const shouldRun = $(window).width() > 992 && $('.subnav').length > 0;

  if (!shouldRun) return;

  let lastScroll = 0;
  const navHeight = $nav.outerHeight();

  $(window).on('scroll', function () {
    const currentScroll = $(this).scrollTop();

    if (currentScroll > lastScroll && currentScroll > navHeight) {
      gsap.to($navWrapper, {
        y: -navHeight,
        duration: 0.6,
        ease: 'power2.out',
      });
    } else if (currentScroll < lastScroll) {
      gsap.to($navWrapper, {
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          $navWrapper.attr('style', '');
        },
      });
    }

    lastScroll = currentScroll;
  });
}

// __ Snackbar
function initSnackbar() {
  function truncateSnackbar() {
    $('[data-snackbar-text]').each(function () {
      const $el = $(this);
      const fullText = $el.data('original-text') || $el.text().trim();

      if (!$el.data('original-text')) {
        $el.data('original-text', fullText);
      }

      const dashIndex = fullText.lastIndexOf('-');

      if (dashIndex === -1) return;

      let beforeDash = fullText.substring(0, dashIndex);
      const afterDash = fullText.substring(dashIndex);

      const lineHeight = parseFloat($el.css('line-height'));
      const maxHeight = lineHeight * 2.1;

      $el.css('overflow', 'hidden');
      $el.html(beforeDash + afterDash);

      if ($el.prop('scrollHeight') <= maxHeight) return;

      const words = beforeDash.split(' ');

      while ($el.prop('scrollHeight') > maxHeight && words.length > 0) {
        words.pop();
        beforeDash = words.join(' ');
        $el.html(beforeDash + '... ' + afterDash);
      }

      $el.css('max-height', maxHeight + 'px');
    });
  }

  truncateSnackbar();

  let resizeTimer;
  $(window).on('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(truncateSnackbar, 150);
  });
}

export function initNav() {
  const mm = gsap.matchMedia();

  mm.add('(min-width: 992px)', setupDesktop);
  mm.add('(max-width: 991px)', setupMobile);

  animateNav();
  initNavScrollBorder();
  initNavScroll();
  initSnackbar();
}
