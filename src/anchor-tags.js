export function installAndScrollAnchorTags() {
  // Automatically adds IDs to every heading so we can anchor link automatically.
  document.querySelectorAll('h1,h2,h3').forEach((el) => {
    const id = el.innerText
      .toLowerCase()
      .split(' ')
      .map((a) => a.replace(/\W/g, ''))
      .join('-');
    el.style.position = 'relative';
    const anchorEl = document.createElement('div');

    anchorEl.style.position = 'absolute';
    anchorEl.style.top = '-90px';
    anchorEl.style.left = '0';

    anchorEl.id = id;
    el.appendChild(anchorEl);

    // If the hash is set, make sure to scroll to it.
    requestAnimationFrame(() => {
      if (window.location.hash) {
        const hashEl = document.getElementById(window.location.hash.replace('#', ''));
        window.scrollTo({
          top: hashEl.getBoundingClientRect().top + window.scrollY,
        });
      }
    }, 1);
  });
}
