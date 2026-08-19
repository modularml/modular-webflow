export function setupHookForFormSubmission() {
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
  if (vowelRatio < 0.15 || vowelRatio > 0.7) score += 2;

  if (/asdf|qwer|zxcv|hjkl/i.test(name)) score += 3;

  if (/[^aeiou\s]{6,}/i.test(name)) score += 2;

  if (
    /[^a-zàáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿāăąćčďđēėęěğģīįķĺļľłńņňőœŕřśşšţťũūůűųźżžșțə\s'-]/i.test(
      name
    )
  )
    score += 3;

  const capsScore = checkCapitalization(name);
  score += capsScore;

  return score >= 3;
}

function checkCapitalization(name) {
  const words = name.split(/[\s-]+/);

  let suspiciousPatterns = 0;

  for (const word of words) {
    if (word.length === 0) continue;

    if (/[A-Z]{3,}/.test(word)) {
      suspiciousPatterns += 2;
    }

    if (word.length > 2) {
      const isException = /^(ma?c|o'|d'|de|van|von|la|le|di|da)[A-Z]/i.test(word);
      if (isException) {
        return suspiciousPatterns;
      }

      const startsWithLowerCase = /^[a-z]/.test(word);

      let transitions = 0;
      for (let i = 1; i < word.length; i++) {
        const prevIsUpper = /[A-Z]/.test(word[i - 1]);
        const currIsUpper = /[A-Z]/.test(word[i]);
        if (prevIsUpper !== currIsUpper) {
          transitions++;
        }
      }

      if (startsWithLowerCase && transitions > 0) {
        suspiciousPatterns += 3;
      } else if (!startsWithLowerCase && transitions > 2) {
        suspiciousPatterns += 3;
      }
    }
  }

  if (suspiciousPatterns >= 2) return 3;
  if (suspiciousPatterns === 1) return 1;
  return 0;
}
