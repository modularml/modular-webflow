let currentTimeline = null;

const wrapLetters = (element) => {
  const processNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      if (!node.parentNode.classList.contains('letter')) {
        const codeText = node.textContent;
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < codeText.length; i++) {
          const span = document.createElement('span');
          span.className = 'letter';
          span.textContent = codeText[i];
          fragment.appendChild(span);
        }

        node.parentNode.replaceChild(fragment, node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName !== 'BR') {
        const childNodes = Array.from(node.childNodes);
        childNodes.forEach(processNode);
      }
    }
  };

  $(element)
    .contents()
    .each(function () {
      processNode(this);
    });
};

const resetLetters = (elements) => {
  $(elements).each((elementIndex, element) => {
    const letters = $(element).find('.letter').not('.line-numbers-row .code-letter');
    const highlights = $(element).find('.word-highlight');

    gsap.set(letters, { visibility: 'hidden' });

    if (highlights.length) {
      const firstHighlight = highlights[0];
      const currentBgColor = window
        .getComputedStyle(firstHighlight)
        .getPropertyValue('background-color');
      const currentBoxShadow = window
        .getComputedStyle(firstHighlight)
        .getPropertyValue('box-shadow');

      const hexToRGBA = (hex, alpha) => {
        const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      };

      const rgbaToTransparent = (rgba) => {
        const rgbaArray = rgba
          .replace(/^rgba?\(/, '')
          .replace(/\)$/, '')
          .split(',');
        return `rgba(${rgbaArray[0]}, ${rgbaArray[1]}, ${rgbaArray[2]}, 0)`;
      };

      const isHex = (color) => /^#(?:[0-9a-f]{3}){1,2}$/i.test(color);

      const initialBackgroundColor = isHex(currentBgColor)
        ? hexToRGBA(currentBgColor, 0)
        : rgbaToTransparent(currentBgColor);
      const initialBoxShadow = currentBoxShadow.replace(/rgba?\([^)]+\)/g, (match) => {
        return isHex(match) ? hexToRGBA(match, 0) : rgbaToTransparent(match);
      });

      gsap.set(highlights, {
        backgroundColor: initialBackgroundColor,
        boxShadow: initialBoxShadow,
      });
    }
  });
};

const revealLetters = (elements, baseDelay = 0.01) => {
  const timeline = gsap.timeline();
  let globalLetterIndex = 0;
  let totalLetters = 0;
  let cumulativeTime = 0;

  $(elements).each((elementIndex, element) => {
    const letters = $(element).find('.letter').not('.line-numbers-row .code-letter');
    totalLetters += letters.length;
  });

  $(elements).each((elementIndex, element) => {
    const letters = $(element).find('.letter').not('.line-numbers-row .code-letter');
    const highlights = $(element).find('.word-highlight');

    letters.each((letterIndex, letter) => {
      const progress = globalLetterIndex / totalLetters;
      const exponentialDelay = baseDelay * Math.pow(0.3, progress * 3);

      timeline.fromTo(letter, { visibility: 'hidden' }, { visibility: 'initial' }, cumulativeTime);

      cumulativeTime += exponentialDelay;
      globalLetterIndex++;
    });

    if (highlights.length) {
      const firstHighlight = highlights[0];
      const currentBgColor = window
        .getComputedStyle(firstHighlight)
        .getPropertyValue('background-color');
      const currentBoxShadow = window
        .getComputedStyle(firstHighlight)
        .getPropertyValue('box-shadow');

      timeline.to(
        highlights,
        {
          backgroundColor: currentBgColor,
          boxShadow: currentBoxShadow,
          duration: 0.35,
        },
        '<'
      );
    }
  });

  return timeline;
};

const animateCode = ($codeBlock) => {
  const codeElement = $codeBlock.find('code');
  const lineNumbers = codeElement.find('.line-numbers-rows').eq(0).clone();

  codeElement.find('.line-numbers-rows').remove();

  if (!codeElement.find('.letter').length) {
    wrapLetters(codeElement);
  }

  resetLetters(codeElement);
  codeElement.css('visibility', 'visible');
  codeElement.prepend(lineNumbers);

  return revealLetters(codeElement);
};

export function initTabs() {
  $('[data-tabs="wrap"]').each(function () {
    const $wrap = $(this);
    const $menu = $wrap.find('[data-tabs="menu"]');
    const $menuItems = $menu.find('[data-tabs="menu-item"]');
    const $contents = $wrap.find('[data-tabs="content"]');
    const $codes = $wrap.find('[data-tabs="code"]');

    let wrapTimeline = null;

    $menuItems.on('click', function () {
      if (wrapTimeline) {
        wrapTimeline.kill();
        wrapTimeline = null;
      }

      $menuItems.removeClass('is-active');
      $(this).addClass('is-active');

      const index = $(this).closest('li').index();
      const currentHeight = $wrap.height();

      $contents.each(function () {
        $(this).hide();
      });
      $codes.hide();

      const $targetContent = $contents.eq(index);
      const $targetCode = $codes.eq(index);

      $targetContent.css('display', 'flex');
      $targetCode.css('display', 'flex');

      const newHeight = $wrap.height();

      $wrap.css('height', currentHeight);
      gsap.to($wrap, {
        height: newHeight,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => {
          $wrap.css('height', 'auto');
        },
      });

      if ($targetContent.is('ul, ol, li')) {
        const $items = $targetContent.find('li').add('[data-tabs="content-item"]');
        gsap.fromTo(
          $items,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, ease: 'power2.out', delay: 0.2 }
        );
      }

      wrapTimeline = animateCode($targetCode);
    });
  });
}
