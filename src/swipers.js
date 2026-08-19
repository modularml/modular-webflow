function initTestimonials() {
  $('.section_testimonials').each(function (index) {
    var currentSection = $(this);
    var slider = currentSection.find('.testimonials_slider');
    var items = currentSection.find('.testimonials_menu-item');
    var nextArrow = currentSection.find('.swiper-arrow.is-next');
    var prevArrow = currentSection.find('.swiper-arrow.is-prev');
    var csQuote = new Swiper(slider[0], {
      slidesPerView: 1,
      spaceBetween: 0,
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
      navigation: {
        nextEl: nextArrow[0],
        prevEl: prevArrow[0],
      },
      on: {
        init: function () {
          updateActiveNav(this);
        },
        slideChange: function () {
          updateActiveNav(this);
        },
      },
    });
    function updateActiveNav(swiper) {
      items.removeClass('is-active').eq(swiper.realIndex).addClass('is-active');
    }

    function slideToItem() {
      items.on('click', function () {
        csQuote.slideTo($(this).index());
      });
    }
    slideToItem();
  });
}

function initTestimonialCards() {
  $('.testimonial-cards_wrap').each(function (index) {
    var currentSection = $(this);
    var slider = currentSection.find('.testimonial-cards_slider');
    var nextArrow = currentSection.find('.swiper-arrow.is-next');
    var prevArrow = currentSection.find('.swiper-arrow.is-prev');

    var csQuote = new Swiper(slider[0], {
      slidesPerView: 1,
      effect: 'fade',
      fadeEffect: {
        crossFade: true,
      },
      navigation: {
        nextEl: nextArrow[0],
        prevEl: prevArrow[0],
      },
    });
  });
}
function initStoriesCards() {
  $('.cs_wrap').each(function (index) {
    var currentSection = $(this);
    var slider = currentSection.find('.cs-wrap_inner');
    var nextArrow = currentSection.find('.swiper-arrow.is-next');
    var prevArrow = currentSection.find('.swiper-arrow.is-prev');

    // Clone slides before Swiper init
    function cloneSlides(sliderEl, times = 2) {
      var $track = $('.cs-wrap_inner .swiper-wrapper'); // or '.swiper-wrapper'
      var $originals = $track.children().clone(true, true);
      console.log($originals);

      for (var i = 0; i < times; i++) {
        $track.append($originals.clone(true, true));
      }
    }

    cloneSlides(slider[0]);

    var csQuote = new Swiper(slider[0], {
      slidesPerView: 1,
      loop: true,
      centeredSlides: true,
      spaceBetween: 20,
      navigation: {
        nextEl: nextArrow[0],
        prevEl: prevArrow[0],
      },
    });
  });
}

function initLatestBlog() {
  $('.section_latest-blog').each(function (index) {
    var currentSection = $(this);
    var slider = currentSection.find('.latest-blog_slider');
    var nextArrow = currentSection.find('.swiper-arrow.is-next');
    var prevArrow = currentSection.find('.swiper-arrow.is-prev');

    var csQuote = new Swiper(slider[0], {
      slidesPerView: 'auto',
      spaceBetween: 20,
      navigation: {
        nextEl: nextArrow[0],
        prevEl: prevArrow[0],
      },
    });
  });
}

function initDeploy() {
  $('.section_deploy-slider').each(function (index) {
    var currentSection = $(this);
    var slider = currentSection.find('.deploy-slider');
    var nextArrow = currentSection.find('.swiper-arrow.is-next');
    var prevArrow = currentSection.find('.swiper-arrow.is-prev');

    var csQuote = new Swiper(slider[0], {
      slidesPerView: 'auto',
      spaceBetween: 20,
      navigation: {
        nextEl: nextArrow[0],
        prevEl: prevArrow[0],
      },
      pagination: {
        el: '.swiper-navigation',
        type: 'bullets',
        bulletActiveClass: 'is-active',
        bulletClass: 'swiper-dot',
        clickable: true,
      },
    });
  });
}

function initCareerGallery() {
  let slider = $('.about-company_slider');

  if (slider.length === 0) return;

  function initBasicCustomCursor() {
    gsap.set('.cursor-box_wrap', { xPercent: -50, yPercent: -50 });

    let xTo = gsap.quickTo('.cursor-box_wrap', 'x', { duration: 0.6, ease: 'power3' });
    let yTo = gsap.quickTo('.cursor-box_wrap', 'y', { duration: 0.6, ease: 'power3' });

    window.addEventListener('mousemove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    });
  }

  const swiperTestimonial = new Swiper('.about-company_slider', {
    slidesPerView: 1,
    loop: true,
    effect: 'fade',
    fadeEffect: {
      crossFade: true,
    },
    navigation: {
      nextEl: '.swiper-arrow.is-next',
      prevEl: '.swiper-arrow.is-prev',
    },
  });

  gsap.set('.cursor-box_wrap', { display: 'hidden' });
  gsap.set('.cursor-box', { scale: 0 });

  $('.about-company_desktop-box').on('mouseenter', function () {
    if ($(window).width() < 992) return;

    gsap.to('.cursor-box_wrap', { display: 'flex' });
    gsap.to('.cursor-box', { scale: 1, duration: 0.3, ease: 'back.out' });

    let next = $('[cursor-arrow="next"]');
    let prev = $('[cursor-arrow="prev"]');

    if ($(this).hasClass('is-right')) {
      next.show();
      prev.hide();
    } else if ($(this).hasClass('is-left')) {
      prev.show();
      next.hide();
    }
  });

  $('.about-company_desktop-box').on('mouseleave', function () {
    if ($(window).width() < 992) return;

    gsap.to('.cursor-box_wrap', { display: 'none' });
    gsap.to('.cursor-box', { scale: 0, duration: 0.3, ease: 'back.out' });
  });

  initBasicCustomCursor();
}

export function initSwipers() {
  initTestimonials();
  initLatestBlog();
  initDeploy();
  initTestimonialCards();
  initCareerGallery();
  initStoriesCards();
}
