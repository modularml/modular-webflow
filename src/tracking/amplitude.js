import { SniffEmailForAmplitude } from '../forms/sniffEmail';
import { trackEvent } from '../utils/amplitude';

export function initAmplitude() {
  SniffEmailForAmplitude();
  function amplitudeTrack(anchorTag, trackTitle, location = anchorTag.dataset.analyticsLocation) {
    return () => {
      trackEvent(trackTitle, {
        href: window.location.href,
        destination: anchorTag.href || anchorTag.getAttribute('href') || '',
        location,
      });
    };
  }

  // Untagged links to intent destinations still get tracked, named by where they go.
  function intentEventFor(anchorTag) {
    let url;
    try {
      url = new URL(anchorTag.href);
    } catch (e) {
      return null;
    }
    if (url.pathname.replace(/\/$/, '') === '/request-demo') {
      return 'RequestDemoClicked';
    }
    if (url.hostname === 'console.modular.com' && url.pathname.startsWith('/signup')) {
      return 'GetStartedClicked';
    }
    return null;
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
    [...document.querySelectorAll('[data-analytics-onclick]')]
      .filter((a) => a.dataset.analyticsOnclick)
      .forEach((a) => {
        a.onclick = amplitudeTrack(a, a.dataset.analyticsOnclick);
      });

    [...document.querySelectorAll('a')]
      .filter((a) => !a.dataset.analyticsOnclick)
      .forEach((a) => {
        const eventName = intentEventFor(a);
        if (eventName) {
          a.onclick = amplitudeTrack(a, eventName, `Inline-${window.location.pathname}`);
        }
      });
  }, 300);
  let timeStartedOnPage = new Date();

  function trackTimeOnPage(pathname) {
    if (!timeStartedOnPage) {
      return;
    }
    const durationInSeconds = Math.round(new Date().getTime() - timeStartedOnPage.getTime()) / 1000;
    trackEvent('TimeOnPage', {
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
    trackEvent('MaxScrollPercentage', { maxScroll, pathname });
    return undefined;
  });
}
