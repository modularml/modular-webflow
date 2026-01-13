export function SniffEmailForAmplitude() {
  const interval = setInterval(() => {
    const inputs = document.querySelectorAll('input[type=email]');
    if (inputs.length) {
      sniffEmail(inputs);
      clearInterval(interval);
    }
  }, 1000);
}

let lastFire = '';
function sniffEmail(inputs) {
  for (let input of inputs) {
    if (input.classList.contains('emailCheck')) {
      continue;
    }
    let formParent = input.parentElement;
    while (formParent && formParent.nodeName !== 'FORM' && formParent.nodeName !== 'BODY') {
      formParent = formParent.parentElement;
    }
    const { formId } = formParent.dataset;

    const debouncedAmpCall = debounce((input, formId) => {
      if (!isValid(input)) {
        return;
      }
      lastFire = input.value;
      amplitude.track('emailInput', { email: input.value, formId });
    }, 3000);
    input.addEventListener('input', (ev) => {
      if (ev.target.value === lastFire) {
        return;
      }
      if (isValid(ev.target)) {
        debouncedAmpCall(ev.target, formId);
      }
    });
    input.classList.add('emailCheck');
  }
}

function isValid(el) {
  return el.checkValidity() && !el.classList.contains('error') && el.value !== '';
}

const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
};
