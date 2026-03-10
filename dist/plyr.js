"use strict";
(() => {
  // bin/live-reload.js
  new EventSource(`${"http://localhost:3000"}/esbuild`).addEventListener("change", () => location.reload());

  // src/plyr.js
  $(document).ready(function() {
    $(".plyr_video").each(function() {
      const $video = $(this);
      const $container = $video.closest("[data-plyr-video]");
      const player = new Plyr(this, {
        controls: ["play", "progress", "mute", "fullscreen"],
        muted: true,
        autoplay: true,
        loop: { active: true }
      });
      $container.find(".plyr__controls").hide();
      player.on("ready", function() {
        player.play();
        player.muted = true;
      });
      $container.find(".plyr__poster").on("click", function() {
        setTimeout(function() {
          player.restart();
          player.muted = false;
          $container.addClass("activated");
          $container.find(".plyr__controls").show();
          player.play();
          $container.find(".plyr__poster").off("click");
        }, 200);
      });
    });
  });
  $(document).ready(function() {
    const player = new Plyr(".plyr_video", {
      controls: ["play", "progress", "mute", "fullscreen"],
      muted: true,
      autoplay: true,
      loop: { active: true }
    });
    $(".plyr__controls").hide();
    player.on("ready", function() {
      player.play();
      player.muted = true;
    });
    $(".plyr__poster").on("click", function() {
      setTimeout(function() {
        player.restart();
        player.muted = false;
        $(".mammoth-hero_video").addClass("activated");
        $(".plyr__controls").show();
        player.play();
        $(".plyr__poster").off("click");
      }, 200);
    });
  });
})();
//# sourceMappingURL=plyr.js.map
