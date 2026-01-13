export function initModalBasic() {
  const modalGroup = document.querySelector('[data-modal-group-status]');
  const modals = document.querySelectorAll('[data-modal-name]');
  const modalTargets = document.querySelectorAll('[data-modal-target]');

  function initModalList($modal) {
    const $list = $modal.find('[data-modal-list]');
    if (!$list.length) return;

    $modal.off('wheel touchstart touchmove');
    $list.off('scroll');
    $(window).off('resize.modalCounter' + $modal.attr('data-modal-name'));

    const $items = $list.find('[data-modal-item]');
    const total = $items.length;

    $modal.find('[data-modal-counter="total"]').text(total);

    function updateCurrentCounter() {
      const listRect = $list[0].getBoundingClientRect();
      const threshold = listRect.bottom - listRect.height * 0.25;
      let currentIndex = 0;

      $items.each(function (index) {
        const itemRect = $(this)[0].getBoundingClientRect();
        if (itemRect.top <= threshold) {
          currentIndex = index;
        }
      });

      $modal.find('[data-modal-counter="current"]').text(currentIndex + 1);
    }

    updateCurrentCounter();
    $list.on('scroll', updateCurrentCounter);
    $(window).on('resize.modalCounter' + $modal.attr('data-modal-name'), updateCurrentCounter);

    $modal.on('wheel', function (e) {
      e.preventDefault();
      $list.scrollTop($list.scrollTop() + e.originalEvent.deltaY);
    });

    let touchStart = 0;
    $modal.on('touchstart', function (e) {
      touchStart = e.originalEvent.touches[0].clientY;
    });

    $modal.on('touchmove', function (e) {
      e.preventDefault();
      const touchCurrent = e.originalEvent.touches[0].clientY;
      const delta = touchStart - touchCurrent;
      $list.scrollTop($list.scrollTop() + delta);
      touchStart = touchCurrent;
    });
  }

  modalTargets.forEach((modalTarget) => {
    modalTarget.addEventListener('click', function () {
      const modalTargetName = this.getAttribute('data-modal-target');
      const index = $(this).parent().index();

      modalTargets.forEach((target) => target.setAttribute('data-modal-status', 'not-active'));
      modals.forEach((modal) => {
        modal.setAttribute('data-modal-status', 'not-active');
        $(modal).off('wheel touchstart touchmove');
        $(modal).find('[data-modal-list]').off('scroll');
      });

      document
        .querySelector(`[data-modal-target="${modalTargetName}"]`)
        .setAttribute('data-modal-status', 'active');

      const $activeModal = $(`[data-modal-name="${modalTargetName}"]`);
      $activeModal.attr('data-modal-status', 'active');

      if (modalGroup) {
        modalGroup.setAttribute('data-modal-group-status', 'active');
      }

      initModalList($activeModal);

      setTimeout(() => {
        const $list = $activeModal.find('[data-modal-list]');
        const $targetItem = $list.find('[data-modal-item]').eq(index);

        if ($targetItem.length) {
          const listRect = $list[0].getBoundingClientRect();
          const itemRect = $targetItem[0].getBoundingClientRect();
          const scrollOffset = itemRect.top - listRect.top + $list.scrollTop();
          $list.scrollTop(scrollOffset);
        }
      }, 0);
    });
  });

  document.querySelectorAll('[data-modal-close]').forEach((closeBtn) => {
    closeBtn.addEventListener('click', closeAllModals);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeAllModals();
    }
  });

  function closeAllModals() {
    modalTargets.forEach((target) => target.setAttribute('data-modal-status', 'not-active'));
    modals.forEach((modal) => {
      modal.setAttribute('data-modal-status', 'not-active');
      const modalName = modal.getAttribute('data-modal-name');
      $(modal).off('wheel touchstart touchmove');
      $(modal).find('[data-modal-list]').off('scroll');
      $(window).off('resize.modalCounter' + modalName);
    });

    if (modalGroup) {
      modalGroup.setAttribute('data-modal-group-status', 'not-active');
    }
  }
}
