export function initScrollToggle() {
  var $body = $(document.body);
  var scrollPosition = 0;
  var isScrollDisabled = false;
  var currentBreakpoint = '';

  function toggleScroll() {
    if (isScrollDisabled) {
      enableScroll();
    } else {
      disableScroll();
    }
  }

  function disableScroll() {
    var oldWidth = $body.innerWidth();
    scrollPosition = window.pageYOffset;
    $body.css({
      overflow: 'hidden',
      position: 'fixed',
      top: `-${scrollPosition}px`,
      width: oldWidth,
    });
    isScrollDisabled = true;
  }

  function enableScroll() {
    $body.css({
      overflow: '',
      position: '',
      top: '',
      width: '',
    });
    $(window).scrollTop(scrollPosition);
    isScrollDisabled = false;
  }

  // Click Event
  $('[data-scroll="toggle"]').on('click', toggleScroll);

  // Run on resize
  const breakpoints = [991, 767, 479];
  let lastWidth = window.innerWidth;

  function handleBreakpoint(breakpoint) {
    if (isScrollDisabled) {
      enableScroll();
    }
  }

  // Function to check breakpoints on window resize
  function checkBreakpoints() {
    const currentWidth = window.innerWidth;

    breakpoints.forEach((breakpoint) => {
      if (
        (lastWidth <= breakpoint && currentWidth > breakpoint) ||
        (lastWidth >= breakpoint && currentWidth < breakpoint)
      ) {
        handleBreakpoint(breakpoint);
      }
    });

    // Update lastWidth for the next call
    lastWidth = currentWidth;
  }

  // Event listener for window resize
  window.addEventListener('resize', checkBreakpoints);
}
