document.addEventListener('DOMContentLoaded', function() {

gsap.registerPlugin(ScrollTrigger);

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
gsap.set('.gridBlock', {backgroundImage: i => `url(https://picsum.photos/${size}/${size}?random=${i})`});

const bigImg = new Image;    
bigImg.addEventListener("load", function () {
  gsap.to(".centerPiece .gridBlock", {autoAlpha: 1, duration: 0.5});
});


gsap.registerPlugin(ScrollTrigger);

gsap.fromTo('.box', {
  opacity: .3 // Starting opacity
}, {
  opacity: 1, // Ending opacity
  scrollTrigger: {
    trigger: ".grid-container",
    start: 'top top',
    end: () => innerHeight * 4,
    scrub: true,
    toggleActions: 'restart pause reverse pause' // This makes the animation go back and forth
  }
});


});



const handleSubmit = (event) => {
  event.preventDefault();

  const myForm = event.target;
  const formData = new FormData(myForm);
  
  fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(formData).toString(),
  })
    .then(() => console.log("Form successfully submitted"))
    .catch((error) => alert(error));
};

document
  .querySelector("form")
  .addEventListener("submit", handleSubmit);