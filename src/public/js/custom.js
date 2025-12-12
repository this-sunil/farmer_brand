$(document).ready(function(){
    $(".menu").click(function(){
        $(".menu span").toggleClass('active');
        $(".row").slideToggle();
    });
});
// Reveal on scroll
function revealOnScroll() {
    let elements = document.querySelectorAll('.reveal');

    elements.forEach((el) => {
        let position = el.getBoundingClientRect().top;
        let screenHeight = window.innerHeight;

        if (position < screenHeight - 120) {
            el.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.onload = revealOnScroll;
