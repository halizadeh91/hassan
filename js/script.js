document.addEventListener("DOMContentLoaded", function() {
  // GSAP animation setup (unchanged)
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
  .set(".gridBlock:not(.centerBlock)", { autoAlpha: 0 })
  .to(".gridBlock:not(.centerBlock)", { duration: 0.1, autoAlpha: 1 }, 0.001)
  .from(".gridLayer", { scale: 3.3333, ease: "none" });

  gsap.fromTo(".box", {
    opacity: 0.3
  }, {
    opacity: 1,
    scrollTrigger: {
      trigger: ".grid-container",
      start: "top top",
      end: () => innerHeight * 4,
      scrub: true,
      toggleActions: "restart pause reverse pause"
    }
  });

  

  // Array describing each block: selector, model path, and link
  const threeBlocks = [
    {
      selector: ".gridLayer:nth-child(1) .gridBlock",
      modelPath: "/image/3d/design.gltf",
      // This link should match what's already in your <a> (but we'll set it anyway)
      href: "https://www.behance.net/hassanalizadeh",
      // Optional scale if you want each model different
      scale: [25, 25, 25]
    },
    {
      selector: ".gridLayer:nth-child(2) .gridBlock",
      modelPath: "/image/3d/photo.gltf",
      href: "/photography.html",
      scale: [22, 22, 22]
    },
    {
      selector: ".gridLayer:nth-child(3) .gridBlock",
      modelPath: "/image/3d/cv.gltf",
      href: "/res/Hassan_Alizadeh_Resume.pdf",
      scale: [22, 22, 22]
    },
    {
      selector: ".gridLayer:nth-child(4) .gridBlock",
      modelPath: "/image/3d/contact.gltf",
      href: "/contact.html",
      scale: [22, 22, 22]
    }
  ];

  threeBlocks.forEach(({ selector, modelPath, href, scale }) => {
    // 1) Find the block in the DOM
    const blockEl = document.querySelector(selector);
    if (!blockEl) return; // Skip if this element doesn't exist

    // 2) Grab the existing <a> inside the .gridBlock
    const linkEl = blockEl.querySelector("a");
    if (!linkEl) return;

    // Make sure the link goes where we want
    linkEl.href = href;
    linkEl.target = "_blank"; // or "_self" if you want same-window navigation

    // 3) Create the Three.js scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      blockEl.offsetWidth / blockEl.offsetHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);

    // Size the renderer to match the .gridBlock
    renderer.setSize(blockEl.offsetWidth, blockEl.offsetHeight);

    // 4) Append the renderer's canvas into the <a>
    linkEl.appendChild(renderer.domElement);

    // 5) Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // 6) Load the GLTF Model
    const loader = new THREE.GLTFLoader();
    loader.load(
      modelPath,
      function(gltf) {
        const model = gltf.scene;
        model.scale.set(scale[0], scale[1], scale[2]); 
        model.position.set(0, -1, 0);
        scene.add(model);

        // Animate the model
        function animate() {
          requestAnimationFrame(animate);
        
          // Use time-based rotation for a smooth wave effect
          const time = Date.now() * 0.001; // Convert ms to seconds
          model.rotation.y = Math.sin(time) * 0.2; 
          model.rotation.x = Math.cos(time * 0.5) * 0.1;
        
          renderer.render(scene, camera);
        }
        animate();
      },
      undefined,
      function(error) {
        console.error("Error loading GLTF:", error);
      }
    );

    // Position the camera so the model is visible
    camera.position.z = 4;

    // 7) Handle window resizing for responsiveness
    window.addEventListener("resize", () => {
      // Re-calc .gridBlock size
      const width = blockEl.offsetWidth;
      const height = blockEl.offsetHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
  });
});
