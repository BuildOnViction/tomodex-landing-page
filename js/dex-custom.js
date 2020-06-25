(function($) {
  "use strict"; // Start of use strict

  // Floating label headings for the contact form
  $("body").on("input propertychange", ".floating-label-form-group", function(e) {
    $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
  }).on("focus", ".floating-label-form-group", function() {
    $(this).addClass("floating-label-form-group-with-focus");
  }).on("blur", ".floating-label-form-group", function() {
    $(this).removeClass("floating-label-form-group-with-focus");
  });

  // Show the navbar when the page is scrolled up
  var MQL = 992;

  //primary navigation slide-in effect
  if ($(window).width() > MQL) {
    var headerHeight = $('#mainNav').height();
    $(window).on('scroll', {
        previousTop: 0
      },
      function() {
        var currentTop = $(window).scrollTop();
        //check if user is scrolling up
        if (currentTop < this.previousTop) {
          //if scrolling up...
          if (currentTop > 0 && $('#mainNav').hasClass('is-fixed')) {
            $('#mainNav').addClass('is-visible');
          } else {
            $('#mainNav').removeClass('is-visible is-fixed');
          }
        } else if (currentTop > this.previousTop) {
          //if scrolling down...
          $('#mainNav').removeClass('is-visible');
          if (currentTop > headerHeight && !$('#mainNav').hasClass('is-fixed')) $('#mainNav').addClass('is-fixed');
        }
        this.previousTop = currentTop;
      });
  }

  // scroll onClick
  $('#btn_scroll_to').on('click', function(event) {
    $('html, body').animate({scrollTop: $("#watch-videos").offset().top}, 500);
  });

  // play video
  $.fn.VideoPopUp = function (options) {
    var defaults = {
        backgroundColor: "#000000",
        opener: "video",
        maxweight: "640",
        pausevideo: false,
        idvideo: ""
    };
    var patter = this.attr('class');
    var settings = $.extend({}, defaults, options);
    var video = document.getElementsByClassName(settings.idvideo);
    function stopVideo() {
        var tag = $('.' + patter + '').get(0).tagName;
        if (tag == 'video') {
            video.pause();
            video.currentTime = 0;
        }
    }
    $('.' + patter + '').css("display", "none");
    $('.' + patter + '').append('<div class="opct"></div>');
    $('.opct').css("background", settings.backgroundColor);
    $('.' + patter + '').css("z-index", "100001");
    $('.' + patter + '').css("position", "fixed")
    $('.' + patter + '').css("top", "0");
    $('.' + patter + '').css("bottom", "0");
    $('.' + patter + '').css("right", "0");
    $('.' + patter + '').css("left", "0");
    $('.' + patter + '').css("padding", "auto");
    $('.' + patter + '').css("text-align", "center");
    $('.' + patter + '').css("background", "none");
    $('.' + patter + '').css("vertical-align", "vertical-align");
    $(".videoCont").css("z-index", "99");
    $('.' + patter + '').append('<div class="closer_videopopup">&otimes;</div>');
    $("." + settings.opener + "").on('click', function () {
      $('.' + patter + "").show();
      $('.'+settings.idvideo+'').trigger('play');
    });
    $(".closer_videopopup").on('click', function () {
      if(settings.pausevideo==true){
        $('.'+settings.idvideo+'').trigger('pause');
      }else{
        stopVideo();
      }
      $('.' + patter + "").hide();
    });
    return this.css({
    });
  };

  $('.vidBox1').VideoPopUp({
    backgroundColor: "#17212a",
    opener: "video1",
    maxheight: "340",
    idvideo: "v1"
  });
  $('.vidBox2').VideoPopUp({
    backgroundColor: "#17212a",
    opener: "video2",
    maxheight: "340",
    idvideo: "v2"
  });
  $('.vidBox3').VideoPopUp({
    backgroundColor: "#17212a",
    opener: "video3",
    maxheight: "340",
    idvideo: "v3"
  });
  $('.vidBox4').VideoPopUp({
    backgroundColor: "#17212a",
    opener: "video4",
    maxheight: "340",
    idvideo: "v4"
  });

  $('#play-video-one').on('click', function(ev) {
    $("#video-one")[0].src += "?autoplay=1";
    ev.preventDefault();
  });
  $('#play-video-two').on('click', function(ev) {
    $("#video-two")[0].src += "?autoplay=1";
    ev.preventDefault();
  });
  $('#play-video-three').on('click', function(ev) {
    $("#video-three")[0].src += "?autoplay=1";
    ev.preventDefault();
  });
  $('#play-video-four').on('click', function(ev) {
    $("#video-four")[0].src += "?autoplay=1";
    ev.preventDefault();
  });
  $(".vidBox1 .closer_videopopup").on('click', function () {
    var videoURL = $('#video-one').prop('src');
    videoURL = videoURL.replace("?autoplay=1", "");
    $('#video-one').prop('src','');
    $('#video-one').prop('src',videoURL);
  });
  $(".vidBox2 .closer_videopopup").on('click', function () {
    var videoURL = $('#video-two').prop('src');
    videoURL = videoURL.replace("?autoplay=1", "");
    $('#video-two').prop('src','');
    $('#video-two').prop('src',videoURL);
  });
  $(".vidBox3 .closer_videopopup").on('click', function () {
    var videoURL = $('#video-three').prop('src');
    videoURL = videoURL.replace("?autoplay=1", "");
    $('#video-three').prop('src','');
    $('#video-three').prop('src',videoURL);
  });
  $(".vidBox4 .closer_videopopup").on('click', function () {
    var videoURL = $('#video-four').prop('src');
    videoURL = videoURL.replace("?autoplay=1", "");
    $('#video-four').prop('src','');
    $('#video-four').prop('src',videoURL);
  });

  $(".variable").slick({
    dots: true,
    arrows: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 1000,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

})(jQuery); // End of use strict
