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
    $(".videCont1").css("z-index", "100002");
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

})(jQuery); // End of use strict
