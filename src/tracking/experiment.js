import { Experiment } from '@amplitude/experiment-js-client';

import { waitUntil } from '../utils/wait';

export function initExperiment() {
  async function runExperiment() {
    if (!window.amplitude) return;
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
  }

  function revealHero() {
    document.querySelector('.section_hp-hero')?.style.setProperty('opacity', '1');
  }

  waitUntil(() => window.amplitude, 150) // ~2.2s cap instead of ~15s
    .then(runExperiment)
    .catch(() => undefined)
    .finally(revealHero);
}
