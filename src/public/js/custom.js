$(document).ready(function(){
    $(".menu").click(function(){
        $(".menu span").toggleClass('active');
        $(".row").slideToggle();
    });

 
  $('.video-card').each(function () {
    const video = $(this).find('video')[0];
    const button = $(this).find('.play-button');
    const icon = button.find('i');

    button.on('click', function () {
      if (video.paused) {
        video.play();
        icon.removeClass('fa-play').addClass('fa-pause');
      } else {
        video.pause();
        icon.removeClass('fa-pause').addClass('fa-play');
      }
    });
  });


});

