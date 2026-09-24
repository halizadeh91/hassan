import * as THREE from './vendor/three/three.module.js';
import { FBXLoader } from './vendor/three/FBXLoader.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const loader = new FBXLoader();

document.querySelectorAll('[data-model]').forEach(async preview => {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    const scene = new THREE.Scene();
    scene.add(new THREE.HemisphereLight(0xeaf6ff, 0x15345e, 1.8));
    const key = new THREE.DirectionalLight(0xffffff, 2.5);
    key.position.set(-3, 5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x8ccfff, 3);
    rim.position.set(4, 2, -3);
    scene.add(rim);

    const model = await loader.loadAsync(preview.dataset.model);
    const blue = new THREE.MeshStandardMaterial({
      color: 0xe0f3ff, emissive: 0x9dd5ff, emissiveIntensity: 0.18,
      metalness: 0.12, roughness: 0.34
    });
    model.traverse(object => {
      if (object.isMesh) object.material = blue;
    });
    model.updateMatrixWorld(true);
    const bounds = new THREE.Box3().setFromObject(model);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const scale = 2 / Math.max(size.x, size.y, size.z);
    model.scale.multiplyScalar(scale);
    model.position.sub(center.multiplyScalar(scale));
    const pivot = new THREE.Group();
    pivot.add(model);
    const restingX = -0.6;
    const restingY = -0.12;
    const restingZ = 0.2;
    pivot.rotation.set(restingX, restingY, restingZ);
    scene.add(pivot);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 4.8);
    const canvas = renderer.domElement;
    canvas.setAttribute('aria-hidden', 'true');
    preview.append(canvas);

    function render() { renderer.render(scene, camera); }
    const resize = new ResizeObserver(() => {
      const width = preview.clientWidth;
      const height = preview.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      render();
      preview.classList.add('model-loaded');
    });
    resize.observe(preview);

    // Render only while the link is being interacted with.
    const link = preview.closest('a');
    let hovered = false;
    let focused = false;
    let frame;
    function animate(time) {
      pivot.rotation.y = restingY + Math.sin(time * 0.0018) * 0.3;
      pivot.rotation.x = restingX + Math.sin(time * 0.0024) * 0.08;
      render();
      frame = requestAnimationFrame(animate);
    }
    function update() {
      cancelAnimationFrame(frame);
      if ((hovered || focused) && !reducedMotion.matches) {
        frame = requestAnimationFrame(animate);
      } else {
        pivot.rotation.set(restingX, restingY, restingZ);
        render();
      }
    }
    link.addEventListener('pointerenter', event => { hovered = event.pointerType !== 'touch'; update(); });
    link.addEventListener('pointerleave', () => { hovered = false; update(); });
    link.addEventListener('focus', () => { focused = link.matches(':focus-visible'); update(); });
    link.addEventListener('blur', () => { focused = false; update(); });
    reducedMotion.addEventListener('change', update);
  } catch (error) {
    renderer?.domElement.remove();
    renderer?.dispose();
    console.warn('Unable to display 3D icon:', preview.dataset.model, error);
  }
});
