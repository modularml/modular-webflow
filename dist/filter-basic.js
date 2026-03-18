"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/filter-basic.js
  function initFilterBasic() {
    $("[data-filter-group]").each(function() {
      const $group = $(this);
      const $buttons = $group.find("[data-filter-target]");
      const $items = $group.find("[data-filter-name]");
      const transitionDelay = 300;
      const updateStatus = (element, shouldBeActive) => {
        element.setAttribute("data-filter-status", shouldBeActive ? "active" : "not-active");
        element.setAttribute("aria-hidden", shouldBeActive ? "false" : "true");
      };
      const updateCounters = () => {
        $buttons.each(function() {
          const target = $(this).attr("data-filter-target");
          const $counter = $(this).find("[data-filter-counter]");
          const itemsLength = target === "all" ? $items.length : $items.filter(`[data-filter-name="${target}"]`).length;
          if ($counter.length) {
            $counter.text(itemsLength);
          }
          if (target !== "all" && itemsLength === 0) {
            $(this).hide();
          } else {
            $(this).show();
          }
        });
      };
      const handleFilter = (target) => {
        $items.each(function() {
          const item = this;
          const shouldBeActive = target === "all" || $(item).attr("data-filter-name") === target;
          const currentStatus = $(item).attr("data-filter-status");
          if (currentStatus === "active") {
            item.setAttribute("data-filter-status", "transition-out");
            setTimeout(() => updateStatus(item, shouldBeActive), transitionDelay);
          } else {
            setTimeout(() => updateStatus(item, shouldBeActive), transitionDelay);
          }
        });
        $buttons.each(function() {
          const isActive = $(this).attr("data-filter-target") === target;
          this.setAttribute("data-filter-status", isActive ? "active" : "not-active");
          this.setAttribute("aria-pressed", isActive ? "true" : "false");
        });
      };
      $buttons.on("click", function() {
        const target = $(this).attr("data-filter-target");
        if ($(this).attr("data-filter-status") === "active")
          return;
        handleFilter(target);
      });
      updateCounters();
    });
  }
  $(document).ready(() => {
    initFilterBasic();
  });
})();
//# sourceMappingURL=filter-basic.js.map
