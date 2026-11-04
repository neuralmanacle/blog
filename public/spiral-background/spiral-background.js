import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/** Attach to an empty, sized container. Returns { dispose, setMotion, setStyle }. */
export async function createSpiralBackground(container, {
  modelUrl = new URL('./assets/spiral-lite.glb', import.meta.url).href,
  style = 'edges', edgeColor = 0x00ff99,
  motion = true, pixelRatio = 1.5, brightness = 1.1,
} = {}) {
  if (!['edges', 'wireframe', 'solid'].includes(style)) throw new Error('Unknown style');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 50);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, pixelRatio));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = brightness;
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%;pointer-events:none';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.append(renderer.domElement);
  scene.add(new THREE.AmbientLight(0xffffff, 1.8));
  const key = new THREE.DirectionalLight(0xffffff, 3);key.position.set(-3, 4, 8);scene.add(key);
  let model;
  try { model = (await new GLTFLoader().loadAsync(modelUrl)).scene; }
  catch(error) { renderer.dispose(); renderer.domElement.remove(); throw error; }
  const meshes = [];
  model.traverse(o => { if (o.isMesh) meshes.push(o); });
  const outlines = [];
  for (const mesh of meshes) {
    const outline = new THREE.LineSegments(
      new THREE.EdgesGeometry(mesh.geometry, 20),
      new THREE.LineBasicMaterial({ color: edgeColor, transparent: true, opacity: .8 })
    );
    mesh.add(outline);
    outlines.push(outline);
  }
  const setStyle = value => {
    if (!['edges', 'wireframe', 'solid'].includes(value)) throw new Error('Unknown style');
    meshes.forEach((mesh, i) => {
      for (const m of (Array.isArray(mesh.material) ? mesh.material : [mesh.material])) {
        m.visible = value !== 'edges';
        m.wireframe = value === 'wireframe';
        m.needsUpdate = true;
      }
      outlines[i].visible = value === 'edges';
    });
    renderer.render(scene, camera);
  };
  const group = new THREE.Group(); group.add(model);scene.add(group);
  const box = new THREE.Box3().setFromObject(model); model.position.sub(box.getCenter(new THREE.Vector3()));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let enabled = motion, visible = true, time = 0, previous = 0, dead = false;
  const pointer = new THREE.Vector2();
  const resize = () => {
    const w = Math.max(1,container.clientWidth), h = Math.max(1,container.clientHeight);
    renderer.setSize(w, h, false);camera.aspect = w/h;
    camera.position.z = Math.max(10.8, 10.8 / camera.aspect);camera.updateProjectionMatrix();
    renderer.render(scene,camera);
  };
  const move = e => { pointer.set(e.clientX / innerWidth * 2 - 1, e.clientY / innerHeight * 2 - 1); };
  const frame = now => {
    if(dead) return;
    const dt = previous ? Math.min((now-previous)/1000,.05) : 0;previous=now;
    if(enabled && !reduce.matches){
      time += dt;
      const breath = Math.sin(time * Math.PI * 2 / 5);
      group.scale.setScalar(1 + breath * .08);
      group.position.x = Math.sin(time * .28) * .12;
      group.position.z = Math.sin(time * .33) * .12;
      group.rotation.z = time * .4;
      key.intensity = 3 + breath * .35;
      const lerp = 1-Math.exp(-dt*3);
      group.rotation.y += (pointer.x*.16 + .10*Math.sin(time*.2)-group.rotation.y)*lerp;
      group.rotation.x += (-pointer.y*.12-.12-group.rotation.x)*lerp;
      group.position.y = Math.sin(time*.42)*.18;
    }
    renderer.render(scene,camera);
  };
  const sync = () => {
    previous=0;
    renderer.setAnimationLoop(enabled && !reduce.matches && visible && !document.hidden ? frame : null);
    renderer.render(scene,camera);
  };
  const ro = new ResizeObserver(resize);ro.observe(container);
  const io = new IntersectionObserver(entries => {visible=entries[0].isIntersecting;sync();});io.observe(container);
  window.addEventListener('pointermove',move,{passive:true});document.addEventListener('visibilitychange',sync);reduce.addEventListener('change',sync);
  group.rotation.x=-.12;setStyle(style);resize();sync();
  return {
    setStyle,
    setMotion(value){ enabled=Boolean(value);sync(); },
    dispose(){
      if(dead)return;dead=true;renderer.setAnimationLoop(null);ro.disconnect();io.disconnect();
      window.removeEventListener('pointermove',move);document.removeEventListener('visibilitychange',sync);reduce.removeEventListener('change',sync);
      model.traverse(o=>{if(o.isMesh || o.isLineSegments){o.geometry.dispose();for(const m of (Array.isArray(o.material)?o.material:[o.material]))m.dispose();}});
      renderer.dispose();renderer.domElement.remove();
    }
  };
}
