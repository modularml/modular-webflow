export function initCopyToClipboard() {
  window.copyToClipboard = function copyToClipboard(buttonElement) {
    const codeCell = buttonElement.previousElementSibling;
    const textarea = document.createElement('textarea');

    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';

    textarea.value = codeCell.textContent;

    document.body.appendChild(textarea);

    textarea.select();

    try {
      document.execCommand('copy');

      // Change the button's text to 'Copied'
      buttonElement.textContent = 'Copied...';

      // Revert the button's text back to 'Copy Code' after some time
      setTimeout(() => {
        buttonElement.textContent = 'Copy';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }

    document.body.removeChild(textarea);
  };
}
