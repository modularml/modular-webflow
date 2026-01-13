export function initBlogFilters() {
  window.FinsweetAttributes ||= [];
  window.FinsweetAttributes.push([
    'list',
    (listInstances) => {
      listInstances.forEach((listInstance) => {
        const elementsToHide = $('[data-hide-filter]');

        listInstance.watch(
          () => listInstance.filters.value,
          (filters) => {
            const hasActiveFilters = filters.groups.some((group) =>
              group.conditions.some(
                (condition) =>
                  condition.value &&
                  condition.value !== '' &&
                  (Array.isArray(condition.value) ? condition.value.length > 0 : true)
              )
            );

            if (hasActiveFilters) {
              elementsToHide.hide();
            } else {
              elementsToHide.show();
            }
          },
          { immediate: true, deep: true }
        );
      });
    },
  ]);
}
