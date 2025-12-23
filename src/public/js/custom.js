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
        button.fadeOut();   // 🔥 hide play icon
      } else {
        video.pause();
        button.fadeIn();    // 🔥 show play icon
      }
    });

    // When video ends, show play icon again
    video.addEventListener('ended', function () {
      button.fadeIn();
      icon.removeClass('fa-pause').addClass('fa-play');
    });
 });
});

