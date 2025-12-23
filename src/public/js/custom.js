$(document).ready(function(){
    $(".menu").click(function(){
        $(".menu span").toggleClass('active');
        $(".row").slideToggle();
    });

 
  $('.play-btn').click(function () {
    const video = $(this).siblings('video')[0];

    if (video.paused) {
      video.play();
      $(this).hide();
    } else {
      video.pause();
      $(this).show();
    }
  });

  $('video').on('pause ended', function () {
    $(this).siblings('.play-btn').show();
  });


});

