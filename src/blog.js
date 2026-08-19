import { setupCodeBlocks } from './blog/code-highlight';
import { initBlogLiveReload } from './blog/blog-live-reload';
import { initCopyToClipboard } from './blog/copy-to-clipboard';
import { initImageZoom } from './blog/image-zoom';
import { initBlogFilters } from './blog/filters';
import { initDecompute } from './blog/decompute';

// init
$(document).ready(function () {
  setupCodeBlocks();
  initBlogLiveReload();
  initCopyToClipboard();
  initImageZoom();
  initBlogFilters();
  initDecompute();
});
