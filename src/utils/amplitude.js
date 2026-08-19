export function trackEvent(name, properties) {
  window.amplitude?.track(name, properties);
}
