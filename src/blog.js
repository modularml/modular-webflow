import { initBlogLiveReload } from './blog/blog-live-reload';
import { setupCodeBlocks } from './blog/code-highlight';
import { initCopyToClipboard } from './blog/copy-to-clipboard';
import { initDecompute } from './blog/decompute';
import { initBlogFilters } from './blog/filters';
import { initImageZoom } from './blog/image-zoom';

// init
$(document).ready(function () {
  setupCodeBlocks();
  initBlogLiveReload();
  initCopyToClipboard();
  initImageZoom();
  initBlogFilters();
  initDecompute();
});
