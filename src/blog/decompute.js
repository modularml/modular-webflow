export function initDecompute() {
  function initAccordion() {
    let wrap = '.d-accordion_wrap';
    let mask = '.d-accordion_mask';
    let head = '.d-accordion_part.is-head';

    $(wrap).each(function () {
      let $currentWrap = $(this);
      let $currentMask = $currentWrap.find(mask);
      let $currentHead = $currentWrap.find(head);

      gsap.set($currentMask, { height: '0' });

      $currentHead.off('click.accordion').on('click.accordion', function () {
        if ($currentWrap.hasClass('is-open')) {
          gsap.to($currentMask, { height: '0' });
          $currentWrap.removeClass('is-open');
        } else {
          gsap.to($currentMask, { height: 'auto' });
          $currentWrap.addClass('is-open');
        }
      });

      let currentPage = window.location.pathname;
      $currentWrap.find('.d-accordion_list-item').each(function () {
        let linkHref = $(this).attr('href');
        if (linkHref === currentPage) {
          $(this).addClass('w--current');
        }
      });

      $currentWrap.find('[data-counter]').text($currentWrap.find('.d-accordion_item').length);
    });

    // Shorten the headlines
    $('[data-headline-short]').each(function () {
      var $headline = $(this);

      if ($headline.length) {
        var currentText = $headline.text();
        var cleanedText = currentText.replace(/\([^)]*\)/g, '').trim();
        $headline.text(cleanedText);
      }
    });
  }

  function initRelated() {
    var currentPath = window.location.pathname;
    $('.d-related_link-cols').each(function () {
      var $cols = $(this);
      var $links = $cols.find('.d-related_link-wrap .w-dyn-item a');
      var currentIndex = -1;

      $links.each(function (index) {
        if ($(this).attr('href') === currentPath) {
          currentIndex = index;
          return false;
        }
      });

      if (currentIndex !== -1) {
        if ($cols.hasClass('cc-prev')) {
          var prevIndex = currentIndex - 1;
          if (prevIndex < 0) {
            $cols.hide();
          } else {
            $links.each(function (index) {
              if (index !== prevIndex) {
                $(this).closest('.w-dyn-item').css({
                  position: 'absolute',
                  visibility: 'hidden',
                  height: '0',
                  overflow: 'hidden',
                });
              } else {
                var $label = $(this).closest('.w-dyn-item').find('[d-related-label]');
                $label.text('Part ' + String(prevIndex + 1).padStart(2, '0'));
                $label.removeAttr('d-related-label');
              }
            });
          }
        } else if ($cols.hasClass('cc-next')) {
          var nextIndex = currentIndex + 1;
          if (nextIndex >= $links.length) {
            $cols.hide();
          } else {
            $links.each(function (index) {
              if (index !== nextIndex) {
                $(this).closest('.w-dyn-item').css({
                  position: 'absolute',
                  visibility: 'hidden',
                  height: '0',
                  overflow: 'hidden',
                });
              } else {
                var $label = $(this).closest('.w-dyn-item').find('[d-related-label]');
                $label.text('Part ' + String(nextIndex + 1).padStart(2, '0'));
                $label.removeAttr('d-related-label');
              }
            });
          }
        }
      }
    });
  }

  window.initAccordion = initAccordion;
  window.initRelated = initRelated;
}
