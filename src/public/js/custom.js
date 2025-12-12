gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

// Create smooth scroll
if (ScrollSmoother) {
  ScrollSmoother.create({
    wrapper: ".smooth-wrapper",
    content: ".smooth-content",
    smooth: 1.2, // scroll speed (1 = normal, higher = slower)
    effects: true // allow effects like fade/slide
  });
}

// Your existing GSAP animations will still work
gsap.utils.toArray("section, .card, .experience-card, .edu-card, .project-card, .video-card").forEach(elem => {
  gsap.from(elem, {
    scrollTrigger: {
      trigger: elem,
      start: "top 85%",
      toggleActions: "play none none none"
    },
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power3.out",
    stagger: 0.2
  });
});

// Smooth anchor links with ScrollSmoother
$(".nav-link a").on("click", function(e){
  e.preventDefault();
  let target = $(this).attr("href");
  ScrollSmoother.get().scrollTo(target, true);
});
