# Animated spiral — complete outline asset pack

Defaults to neon green voxel edges, without triangle diagonals.
Includes the original detailed and lightweight GLB models, complete JavaScript,
a runnable HTML demo, static fallback image and original solid-model preview.
The outline geometry is extracted in JavaScript from the supplied GLBs.

## Run
Extract this ZIP, enter the spiral-outline-background folder, then run:

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. The demo needs internet access to fetch Three.js
0.180.0 from jsDelivr. Use the selector for neon outlines, rainbow triangular
wireframe, or solid rainbow. Motion includes a 5-second breathing cycle,
floating, pointer tilt, and one rotation every ~16 seconds.
Reduced Motion in your device settings disables animation. The pause control
also freezes motion. Animation pauses when hidden or offscreen.

## Integrate
```js
import { createSpiralBackground } from './spiral-background.js';
const bg = await createSpiralBackground(document.querySelector('#background'), {
  modelUrl: '/assets/spiral-lite.glb',
  style: 'edges',       // 'edges' | 'wireframe' | 'solid'
  edgeColor: 0x00ff99,
  motion: true,
});
// bg.setStyle('wireframe');
// bg.setMotion(false);
// bg.dispose(); // call when removing your component
```

Give the container a nonzero size, e.g. position:fixed; inset:0. Keep content
in a separate layer above it. For a bundled website install three@0.180.0,
copy the GLB into your public assets directory, and import the module above.
The sample HTML already includes the import map for a build-free preview.

## Included files
- assets/spiral-lite.glb: 2,029 voxels, ~2.0 MB; default for background use.
- assets/spiral.glb: 6,077 voxels, ~6.1 MB; detailed version.
- assets/logo.png: original colours, used as the fallback.
- spiral-background.js: complete controller; no snippet assembly required.
- index.html: demo with style selector and pause control.
- preview.png: offline preview of the original solid geometry, not the outlines.

The geometry is a pixelated relief reconstructed from the PNG embedded in your
SVG. It has depth but no bone rig. Outlines expose each voxel's edges, including
back edges through the empty surfaces. Resources are released by dispose().

Validation: original GLB structure and index bounds checked; updated JS and
HTML module syntax checked. Live browser/WebGL rendering is not tested here.
