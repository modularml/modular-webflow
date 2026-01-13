export function initMaxReplacements() {
  $('h1, h2, h3, h4, h5, h6').each(function () {
    const $heading = $(this);

    if (
      $heading.attr('data-max-processed') ||
      $heading.is('data-emoji-exclude') ||
      $heading.closest('.w-richtext').length
    ) {
      return;
    }

    let html = $heading.html();

    if (/\bMAX\b/.test(html)) {
      const maxSvg =
        '<svg width="100%" height="100%" viewBox="0 0 62 20" style="width: 2.2em; margin-left: 0.05em;" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M18.0849 5.92771C17.9874 5.92771 17.9084 5.8487 17.9084 5.75123V0.206055H15.4824L10.9206 13.7531H10.3676L5.80588 0.206055H0V19.559H3.59412V6.15017H4.14706L8.70882 19.559H12.5794L17.1341 6.1711C17.1388 6.11056 17.1895 6.06283 17.2513 6.06283L17.5794 6.06284C17.6339 6.06284 17.6797 6.09989 17.6931 6.15017H17.6941V6.15434C17.696 6.16275 17.697 6.1715 17.697 6.18049V11.8734C17.697 11.8823 17.696 11.8911 17.6941 11.8995V19.559H21.2882V5.92771H18.0849Z" fill="currentColor"></path><path d="M42.4204 19.559L49.0557 9.60606L42.8351 0.206055H47.1204L51.2675 6.56488H51.8204L55.9675 0.206055H60.2528L54.0322 9.60606L60.6675 19.559H56.3822L51.8204 12.6472H51.2675L46.7057 19.559H42.4204Z" fill="currentColor"></path><path d="M22.4322 19.559L29.344 0.206055H34.5969L41.5087 19.559H37.4998L36.0345 15.4119H27.9063L26.441 19.559H22.4322ZM29.0675 12.0943H34.8734L32.2469 4.35311H31.694L29.0675 12.0943Z" fill="currentColor"></path></svg>';
      const newHtml = html.replace(
        /\bMAX\b/g,
        '<span style="display: inline-block;"><span style="position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0);">MAX</span>' +
          maxSvg +
          '</span>'
      );
      $heading.html(newHtml);
      $heading.attr('data-max-processed', 'true');
    }
  });
}

$(document).ready(function () {
  initMaxReplacements();
});
