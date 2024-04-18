document.addEventListener('DOMContentLoaded', function() {

gsap.registerPlugin(ScrollTrigger);

// const Line1 = document.querySelector('.line1');
// const Line2 = document.querySelector('.line2');
// const Line3 = document.querySelector('.line3');

// gsap.to(Line1, {
//   duration: 2,
//   x:400,
//   stagger: 0.5,
//   scrollTrigger: {
//     trigger: Line1,
//     end: "+=300%",
//     scrub: true,
//     pin: true
//   }
// })


gsap.timeline({
  scrollTrigger: {
    trigger: ".grid-container",
    start: "top top",
    end: () => innerHeight * 4,
    scrub: true,
    pin: ".grid",
    anticipatePin: 1
  }
})
.set(".gridBlock:not(.centerBlock)", {autoAlpha: 0})
.to(".gridBlock:not(.centerBlock)", {duration: 0.1, autoAlpha: 1}, 0.001)
.from(".gridLayer", {
  scale: 3.3333,
  ease: "none",
});


// Images to make it look better, not related to the effect
const size = Math.max(innerWidth, innerHeight);
// gsap.set('.gridBlock', {backgroundImage: i => `url(https://picsum.photos/${size}/${size}?random=${i})`});

const bigImg = new Image;    
bigImg.addEventListener("load", function () {
  gsap.to(".centerPiece .gridBlock", {autoAlpha: 1, duration: 0.5});
});



});