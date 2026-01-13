import { waitUntil } from '../utils/wait';
import { Experiment } from '@amplitude/experiment-js-client';

export function initExperiment() {
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
}
