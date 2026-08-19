export function initCheckSectionThemeScroll() {
  const navBarHeight = document.querySelector('[data-nav-bar-height]');
  const themeObserverOffset = navBarHeight ? navBarHeight.offsetHeight / 2 : 0;

  function initializeAttributes() {
    const { body } = document;

    if (!body.hasAttribute('data-theme-nav')) {
      body.setAttribute('data-theme-nav', 'light');
    }

    const sections = document.querySelectorAll('section');
    sections.forEach(function (section) {
      if (!section.hasAttribute('data-theme-section')) {
        section.setAttribute('data-theme-section', 'light');
      }
    });
  }

  function checkThemeSection() {
    const themeSections = document.querySelectorAll('[data-theme-section]');

    themeSections.forEach(function (themeSection) {
      const rect = themeSection.getBoundingClientRect();
      const themeSectionTop = rect.top;
      const themeSectionBottom = rect.bottom;

      if (themeSectionTop <= themeObserverOffset && themeSectionBottom >= themeObserverOffset) {
        const themeSectionActive = themeSection.getAttribute('data-theme-section');
        document.querySelectorAll('[data-theme-nav]').forEach(function (elem) {
          if (elem.getAttribute('data-theme-nav') !== themeSectionActive) {
            elem.setAttribute('data-theme-nav', themeSectionActive);
          }
        });
      }
    });
  }

  function startThemeCheck() {
    document.addEventListener('scroll', checkThemeSection);
  }

  initializeAttributes();
  checkThemeSection();
  startThemeCheck();
}
