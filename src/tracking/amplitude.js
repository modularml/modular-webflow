import { SniffEmailForAmplitude } from '../forms/sniffEmail';
import { trackEvent } from '../utils/amplitude';

export function initAmplitude() {
  SniffEmailForAmplitude();
  function amplitudeTrack(anchorTag, trackTitle) {
    return () => {
      trackEvent(trackTitle, {
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
