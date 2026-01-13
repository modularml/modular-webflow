function clickListener(event) {
  var images = document.querySelectorAll('.w-richtext img');
  // Prevent the event from bubbling up to the document
  event.stopPropagation();

  // bind the current image so it doesn't lose context
  const clickedImg = event.currentTarget;

  images.forEach(function (innerImg) {
    // Reset all other images to their original size
    if (innerImg !== clickedImg) {
      innerImg.classList.remove('img-enlarged');
      innerImg.style.transform = '';
    }
  });

  if (clickedImg.classList.contains('img-enlarged')) {
    clickedImg.classList.remove('img-enlarged');
    clickedImg.style.transform = ''; // Reset to original size
  } else {
    clickedImg.classList.add('img-enlarged');
    // Calculate scale factor based on window width and height
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;

    var scaleX = windowWidth / this.width;
    var scaleY = windowHeight / this.height;

    // Max scale factor is 2 or window dimension, whichever is smaller
    var scale = Math.min(scaleX, scaleY, 2);

    clickedImg.style.transform = 'scale(' + scale + ')';
  }
}

function minimizeImage() {
  var images = document.querySelectorAll('.w-richtext img');

  images.forEach((img) => {
    img.classList.remove('img-enlarged');
    img.style.transform = '';
  });
}
function keyupListener(evt) {
  if (evt.key === 'Escape') minimizeImage();
}

export function initImageZoom() {
  var images = document.querySelectorAll('.w-richtext img');
  images.forEach(function (img) {
    img.removeEventListener('click', clickListener);
    img.addEventListener('click', clickListener);
  });

  window.removeEventListener('keyup', keyupListener);
  window.addEventListener('keyup', keyupListener);
  // Listener for clicks outside the images
  document.removeEventListener('click', minimizeImage);
  document.addEventListener('click', minimizeImage);
}
