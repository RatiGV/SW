// Smart Agency v2 - three.js scenes
// One fixed WebGL canvas renders every [data-scene] element into its own screen rectangle (scissor views),
// so a page can hold many 3D objects with a single GPU context.
import * as THREE from './vendor/three.min.js';

const root = document.documentElement;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = matchMedia('(max-width: 900px)').matches || matchMedia('(pointer: coarse)').matches;
const COLORS = {
  accent: new THREE.Color('#2f8fff'),
  violet: new THREE.Color('#7b5cff'),
  pink: new THREE.Color('#ff5ca8'),
  white: new THREE.Color('#f4f3ee'),
  ink: new THREE.Color('#0b0b0f'),
};
const canvas = document.getElementById('gl');
const elements = Array.from(document.querySelectorAll('[data-scene]'));
let renderer = null;
if (canvas && elements.length) {
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (err) {
    renderer = null;
  }
}

/* ---------- shared helpers ---------- */

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

let envMap = null;
const MAT = {};

function initMaterials() {
  const pmrem = new THREE.PMREMGenerator(renderer);
  envMap = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  MAT.glass = new THREE.MeshPhysicalMaterial({
    color: 0x1b1b26, metalness: 0.15, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.06,
    iridescence: 1, iridescenceIOR: 1.6, iridescenceThicknessRange: [180, 820], envMapIntensity: 1.5,
  });
  MAT.glassFlat = MAT.glass.clone();
  MAT.glassFlat.flatShading = true;
  MAT.glassFlat.side = THREE.DoubleSide;
  MAT.chrome = new THREE.MeshPhysicalMaterial({ color: 0xd9d9e3, metalness: 1, roughness: 0.18, envMapIntensity: 1.2 });
  MAT.dark = new THREE.MeshPhysicalMaterial({ color: 0x14141c, metalness: 0.75, roughness: 0.28, clearcoat: 0.6, envMapIntensity: 1 });
  MAT.white = new THREE.MeshPhysicalMaterial({ color: 0xf4f3ee, metalness: 0, roughness: 0.25, clearcoat: 1, envMapIntensity: 1 });
  MAT.accent = new THREE.MeshPhysicalMaterial({
    color: COLORS.accent, emissive: COLORS.accent, emissiveIntensity: 0.45, roughness: 0.25, clearcoat: 1, envMapIntensity: 0.8,
  });
  MAT.violet = new THREE.MeshPhysicalMaterial({ color: COLORS.violet, emissive: COLORS.violet, emissiveIntensity: 0.25, roughness: 0.2, clearcoat: 1 });
}

function baseView(fov = 35, z = 6) {
  const scene = new THREE.Scene();
  scene.environment = envMap;
  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 100);
  camera.position.set(0, 0, z);
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(3, 4, 5);
  const rim = new THREE.PointLight(COLORS.violet, 30, 30);
  rim.position.set(-4, -2, 2);
  const warm = new THREE.PointLight(COLORS.pink, 18, 30);
  warm.position.set(4, -3, -2);
  scene.add(key, rim, warm, new THREE.AmbientLight(0xffffff, 0.2));
  return { scene, camera };
}

function roundedShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

function slab(w, h, r, depth) {
  const g = new THREE.ExtrudeGeometry(roundedShape(w, h, r), {
    depth, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3, curveSegments: 10,
  });
  g.center();
  return g;
}

function rr(g, x, y, w, h, r) {
  g.beginPath();
  if (g.roundRect) {
    g.roundRect(x, y, w, h, r);
  } else {
    g.rect(x, y, w, h);
  }
  g.fill();
}

// Small UI mockups drawn on a 2D canvas and used as textures
function uiTexture(kind) {
  const c = document.createElement('canvas');
  const phone = kind === 'phone';
  c.width = phone ? 360 : 640;
  c.height = phone ? 740 : 400;
  const g = c.getContext('2d');
  const W = c.width;
  const H = c.height;
  g.fillStyle = '#101017';
  rr(g, 0, 0, W, H, phone ? 46 : 22);
  const grad = g.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#7b5cff');
  grad.addColorStop(1, '#ff5ca8');
  if (phone) {
    g.fillStyle = 'rgba(255,255,255,.5)';
    rr(g, 30, 30, 60, 10, 5);
    rr(g, W - 80, 30, 50, 10, 5);
    g.fillStyle = 'rgba(255,255,255,.85)';
    rr(g, 30, 80, 190, 22, 11);
    g.fillStyle = 'rgba(255,255,255,.3)';
    rr(g, 30, 114, 130, 12, 6);
    g.fillStyle = grad;
    rr(g, 30, 150, W - 60, 210, 24);
    g.fillStyle = 'rgba(255,255,255,.3)';
    g.beginPath();
    g.arc(W - 90, 210, 26, 0, Math.PI * 2);
    g.fill();
    for (let i = 0; i < 3; i++) {
      const y = 390 + i * 78;
      g.fillStyle = 'rgba(255,255,255,.07)';
      rr(g, 30, y, W - 60, 64, 16);
      g.fillStyle = i === 0 ? '#2f8fff' : 'rgba(255,255,255,.25)';
      g.beginPath();
      g.arc(62, y + 32, 16, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = 'rgba(255,255,255,.6)';
      rr(g, 92, y + 20, 140, 10, 5);
      g.fillStyle = 'rgba(255,255,255,.25)';
      rr(g, 92, y + 38, 90, 8, 4);
    }
    g.fillStyle = '#2f8fff';
    rr(g, 30, H - 110, W - 60, 52, 26);
    g.fillStyle = 'rgba(255,255,255,.5)';
    rr(g, W / 2 - 50, H - 30, 100, 8, 4);
  } else {
    g.fillStyle = 'rgba(255,255,255,.25)';
    [0, 1, 2].forEach((i) => {
      g.beginPath();
      g.arc(26 + i * 20, 22, 6, 0, Math.PI * 2);
      g.fill();
    });
    rr(g, 220, 14, 200, 16, 8);
    g.fillStyle = 'rgba(255,255,255,.08)';
    g.fillRect(0, 44, W, 1);
    g.fillStyle = 'rgba(255,255,255,.7)';
    rr(g, 34, 70, 70, 12, 6);
    g.fillStyle = 'rgba(255,255,255,.3)';
    for (let i = 0; i < 4; i++) rr(g, 380 + i * 62, 72, 44, 8, 4);
    g.fillStyle = 'rgba(255,255,255,.85)';
    rr(g, 34, 120, 250, 24, 12);
    rr(g, 34, 154, 200, 24, 12);
    g.fillStyle = 'rgba(255,255,255,.28)';
    rr(g, 34, 196, 230, 9, 4);
    rr(g, 34, 214, 190, 9, 4);
    g.fillStyle = '#2f8fff';
    rr(g, 34, 244, 110, 34, 17);
    g.fillStyle = grad;
    rr(g, 330, 110, 270, 170, 16);
    for (let i = 0; i < 3; i++) {
      g.fillStyle = 'rgba(255,255,255,.07)';
      rr(g, 34 + i * 194, 306, 180, 72, 12);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

// Soft round particles with per-point size and color
function makePoints(positions, colors, sizes, opts = {}) {
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('aColor', new THREE.Float32BufferAttribute(colors, 3));
  geo.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPR: { value: renderer.getPixelRatio() }, uOpacity: { value: opts.opacity ?? 1 } },
    vertexShader: `
      attribute float aSize; attribute vec3 aColor;
      uniform float uTime; uniform float uPR;
      varying vec3 vColor; varying float vA;
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.);
        gl_PointSize = aSize * uPR * (30. / -mv.z);
        gl_Position = projectionMatrix * mv;
        vColor = aColor;
        vA = .55 + .45 * sin(uTime * 1.6 + position.x * 7. + position.y * 3.);
      }`,
    fragmentShader: `
      uniform float uOpacity; varying vec3 vColor; varying float vA;
      void main(){
        float d = length(gl_PointCoord - .5);
        float a = smoothstep(.5, .05, d) * vA * uOpacity;
        gl_FragColor = vec4(vColor, a);
        #include <colorspace_fragment>
      }`,
  });
  return new THREE.Points(geo, mat);
}

function pickColor(weights) {
  const r = Math.random();
  let acc = 0;
  for (const [color, w] of weights) {
    acc += w;
    if (r <= acc) return color;
  }
  return weights[0][0];
}

function gauss() {
  return (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
}

function damp(current, target, lambda, dt) {
  return THREE.MathUtils.damp(current, target, lambda, dt);
}

function fibSphere(n, r) {
  const out = [];
  const g = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const rad = Math.sqrt(1 - y * y);
    const th = g * i;
    out.push(new THREE.Vector3(Math.cos(th) * rad * r, y * r, Math.sin(th) * rad * r));
  }
  return out;
}

/* ---------- scenes ---------- */

const SCENES = {
  // Home hero: liquid iridescent blob with a particle halo and orbiting satellites
  hero(v) {
    const { scene, camera } = baseView(35, 6.4);
    const group = new THREE.Group();
    scene.add(group);
    const uniforms = {
      uTime: { value: 0 }, uAmp: { value: 0.26 }, uFreq: { value: 0.95 }, uDim: { value: 1 },
      uAccent: { value: COLORS.accent }, uViolet: { value: COLORS.violet }, uPink: { value: COLORS.pink },
    };
    const blob = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.25, small ? 40 : 80),
      new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `
          uniform float uTime; uniform float uAmp; uniform float uFreq;
          varying vec3 vNormal; varying vec3 vView; varying float vNoise;
          ${NOISE}
          float field(vec3 d){
            return snoise(d * uFreq + vec3(0., uTime * .22, uTime * .12)) * uAmp
              + snoise(d * uFreq * 2.4 - vec3(uTime * .15)) * uAmp * .32;
          }
          vec3 surf(vec3 d, float r){ return d * (r + field(d)); }
          void main(){
            float r = length(position);
            vec3 d = normalize(position);
            vec3 t = normalize(cross(d, abs(d.y) > .99 ? vec3(1.,0.,0.) : vec3(0.,1.,0.)));
            vec3 b = normalize(cross(d, t));
            float e = .012;
            vec3 p0 = surf(d, r);
            vec3 p1 = surf(normalize(d + t * e), r);
            vec3 p2 = surf(normalize(d + b * e), r);
            vec3 n = normalize(cross(p1 - p0, p2 - p0));
            if (dot(n, d) < 0.) n = -n;
            vNoise = field(d) / uAmp;
            vec4 mv = modelViewMatrix * vec4(p0, 1.);
            vNormal = normalize(normalMatrix * n);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: `
          uniform float uTime; uniform float uDim; uniform vec3 uAccent; uniform vec3 uViolet; uniform vec3 uPink;
          varying vec3 vNormal; varying vec3 vView; varying float vNoise;
          vec3 pal(float t){
            t = fract(t);
            vec3 c = mix(uViolet, uPink, smoothstep(0., .4, t));
            c = mix(c, uAccent, smoothstep(.4, .7, t));
            return mix(c, uViolet, smoothstep(.7, 1., t));
          }
          void main(){
            vec3 n = normalize(vNormal); vec3 v = normalize(vView);
            float fres = pow(1. - max(dot(n, v), 0.), 2.4);
            vec3 irid = pal(dot(n, vec3(.35, .7, .2)) * .45 + vNoise * .3 + uTime * .04);
            vec3 L = normalize(vec3(.5, .8, .6));
            float diff = max(dot(n, L), 0.);
            float spec = pow(max(dot(n, normalize(L + v)), 0.), 70.);
            float spec2 = pow(max(dot(n, normalize(normalize(vec3(-.7, -.3, .5)) + v)), 0.), 30.) * .35;
            vec3 col = vec3(.03, .03, .05) + irid * (.12 + diff * .22);
            col = mix(col, irid * 1.25, fres);
            col += vec3(1.) * spec * .9 + uPink * spec2;
            col += uAccent * pow(fres, 5.) * .5;
            gl_FragColor = vec4(col * uDim, 1.);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }`,
      }),
    );
    group.add(blob);
    // particle halo
    const N = small ? 900 : 2200;
    const pos = [];
    const col = [];
    const siz = [];
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 2.15 + gauss() * 0.42;
      pos.push(Math.cos(a) * r, gauss() * 0.14, Math.sin(a) * r);
      const c = pickColor([[COLORS.white, 0.6], [COLORS.accent, 0.2], [COLORS.violet, 0.2]]);
      col.push(c.r, c.g, c.b);
      siz.push(0.6 + Math.random() * 2.2);
    }
    const halo = makePoints(pos, col, siz, { opacity: 0.9 });
    const haloWrap = new THREE.Group();
    haloWrap.rotation.set(1.15, 0, 0.35);
    haloWrap.add(halo);
    group.add(haloWrap);
    // satellites
    const sats = [
      { mesh: new THREE.Mesh(new THREE.IcosahedronGeometry(0.16, 0), MAT.glassFlat), r: 1.95, s: 0.35, o: 0, y: 0.5 },
      { mesh: new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.045, 16, 48), MAT.accent), r: 2.35, s: -0.25, o: 2.2, y: -0.4 },
      { mesh: new THREE.Mesh(new THREE.SphereGeometry(0.09, 32, 16), MAT.chrome), r: 1.7, s: 0.5, o: 4.1, y: -0.1 },
    ];
    sats.forEach((s) => group.add(s.mesh));
    let amp = 0.26;
    return {
      scene, camera,
      update(t, dt) {
        uniforms.uTime.value = t;
        halo.material.uniforms.uTime.value = t;
        const wide = v.w / v.h > 1.1;
        const speed = Math.min(Math.hypot(v.vx, v.vy) * 40, 0.25);
        amp = damp(amp, 0.24 + speed, 3, dt);
        uniforms.uAmp.value = amp;
        const scroll = Math.max(0, -v.progress);
        // On narrow screens the blob moves into the empty top of the hero, away from the text
        group.position.x = damp(group.position.x, wide ? 1.45 : 0.4, 4, dt);
        group.position.y = (wide ? 0.05 : 1.3) + scroll * 1.4;
        uniforms.uDim.value = wide ? 1 : 0.8;
        const sc = (wide ? 1 : 0.52) * (1 - scroll * 0.18);
        group.scale.setScalar(sc);
        group.rotation.y = damp(group.rotation.y, v.px * 0.55 + t * 0.05, 3, dt);
        group.rotation.x = damp(group.rotation.x, -v.py * 0.35, 3, dt);
        haloWrap.rotation.y = t * 0.06;
        sats.forEach((s, i) => {
          const a = t * s.s + s.o;
          s.mesh.position.set(Math.cos(a) * s.r, s.y + Math.sin(t * 0.8 + i) * 0.15, Math.sin(a) * s.r);
          s.mesh.rotation.x = t * (0.6 + i * 0.2);
          s.mesh.rotation.y = t * 0.8;
        });
      },
    };
  },

  // Service objects (home cards + services page)
  svc(v) {
    const { scene, camera } = baseView(32, 6);
    const outer = new THREE.Group();
    const group = new THREE.Group();
    outer.add(group);
    scene.add(outer);
    const build = SERVICE_OBJECTS[v.el.dataset.variant] || SERVICE_OBJECTS['web-design'];
    const anim = build(group, camera);
    let spin = 0;
    let hoverAmt = 0;
    return {
      scene, camera,
      update(t, dt) {
        hoverAmt = damp(hoverAmt, v.hover ? 1 : 0, 5, dt);
        spin += dt * (0.25 + hoverAmt * 0.9);
        outer.rotation.y = damp(outer.rotation.y, v.px * 0.6, 4, dt);
        outer.rotation.x = damp(outer.rotation.x, -v.py * 0.35, 4, dt);
        outer.scale.setScalar(1 + hoverAmt * 0.06);
        anim(t, dt, spin, hoverAmt);
      },
    };
  },

  // Process section: undulating "data landscape" of points that ripples under the cursor
  terrain(v) {
    const { scene, camera } = baseView(40, 6);
    camera.position.set(0, 2.4, 6.2);
    camera.lookAt(0, -0.2, -1);
    const cols = small ? 80 : 150;
    const rows = small ? 34 : 56;
    const pos = [];
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        pos.push((i / (cols - 1) - 0.5) * 22, 0, -(j / (rows - 1)) * 12 + 3);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    const uniforms = {
      uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(0, -2) }, uPR: { value: renderer.getPixelRatio() },
      uAccent: { value: COLORS.accent }, uViolet: { value: COLORS.violet },
    };
    const pts = new THREE.Points(geo, new THREE.ShaderMaterial({
      uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `
        uniform float uTime; uniform vec2 uMouse; uniform float uPR;
        varying float vH; varying float vEdge; varying float vRip;
        ${NOISE}
        void main(){
          vec3 p = position;
          float h = sin(p.x * .45 + uTime * .7) * .28 + sin(p.z * .8 + uTime * .5) * .22 + snoise(vec3(p.xz * .18, uTime * .12)) * .45;
          float d = distance(p.xz, uMouse);
          float rip = exp(-d * d * .35);
          h += rip * .9 + sin(d * 3. - uTime * 4.) * .08 * rip;
          p.y = h;
          vH = h; vRip = rip;
          vEdge = (1. - smoothstep(6., 11., abs(p.x))) * smoothstep(-9., -4., p.z);
          vec4 mv = modelViewMatrix * vec4(p, 1.);
          gl_PointSize = (2.4 + h * 1.6 + rip * 2.5) * uPR * (9. / -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform vec3 uAccent; uniform vec3 uViolet;
        varying float vH; varying float vEdge; varying float vRip;
        void main(){
          float d = length(gl_PointCoord - .5);
          float a = smoothstep(.5, .1, d) * vEdge;
          vec3 c = mix(vec3(.55), uViolet, smoothstep(-.2, .5, vH));
          c = mix(c, uAccent, smoothstep(.55, 1.1, vH + vRip * .4));
          gl_FragColor = vec4(c, a * (.5 + smoothstep(-.3, .9, vH) * .5));
          #include <colorspace_fragment>
        }`,
    }));
    scene.add(pts);
    const mouse = new THREE.Vector2(0, -2);
    return {
      scene, camera,
      update(t, dt) {
        uniforms.uTime.value = t;
        mouse.x = damp(mouse.x, v.hover ? v.px * 9 : Math.sin(t * 0.3) * 5, 3, dt);
        mouse.y = damp(mouse.y, v.hover ? -2 - v.py * 4 : -2.5, 3, dt);
        uniforms.uMouse.value.copy(mouse);
      },
    };
  },

  // CTA: gyroscope of glass rings around a crystal, inside a particle shell
  portal(v) {
    const { scene, camera } = baseView(35, 9);
    const group = new THREE.Group();
    scene.add(group);
    const rings = [
      new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.03, 16, 160), MAT.chrome),
      new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.055, 24, 160), MAT.glass),
      new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.018, 16, 160), MAT.accent),
    ];
    rings.forEach((r) => group.add(r));
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55, 0), MAT.glassFlat);
    group.add(core);
    const pos = [];
    const col = [];
    const siz = [];
    const N = small ? 600 : 1400;
    for (let i = 0; i < N; i++) {
      const p = new THREE.Vector3().randomDirection().multiplyScalar(3.2 + Math.random() * 1.6);
      pos.push(p.x, p.y, p.z);
      const c = pickColor([[COLORS.white, 0.7], [COLORS.violet, 0.2], [COLORS.accent, 0.1]]);
      col.push(c.r, c.g, c.b);
      siz.push(0.5 + Math.random() * 1.6);
    }
    const shell = makePoints(pos, col, siz, { opacity: 0.7 });
    group.add(shell);
    return {
      scene, camera,
      update(t, dt) {
        shell.material.uniforms.uTime.value = t;
        rings[0].rotation.set(t * 0.21, t * 0.13, 0);
        rings[1].rotation.set(-t * 0.17 + 1, 0, t * 0.11);
        rings[2].rotation.set(0.6, t * 0.31, -t * 0.19);
        core.rotation.set(t * 0.4, t * 0.55, 0);
        shell.rotation.y = t * 0.03;
        group.rotation.y = damp(group.rotation.y, v.px * 0.35, 3, dt);
        group.rotation.x = damp(group.rotation.x, -v.py * 0.25, 3, dt);
        const wide = v.w / v.h > 1.2;
        group.scale.setScalar(wide ? 1 : 0.75);
      },
    };
  },

  // Portfolio hero: real project screenshots orbiting on a helix
  helix(v) {
    const { scene, camera } = baseView(35, 11);
    scene.fog = new THREE.Fog(0x07070b, 9.5, 16);
    const group = new THREE.Group();
    scene.add(group);
    let images = [];
    try {
      images = JSON.parse(v.el.dataset.images || '[]');
    } catch (err) {
      images = [];
    }
    const loader = new THREE.TextureLoader();
    const mask = (() => {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 152;
      const g = c.getContext('2d');
      g.fillStyle = '#000';
      g.fillRect(0, 0, 256, 152);
      g.fillStyle = '#fff';
      rr(g, 0, 0, 256, 152, 14);
      return new THREE.CanvasTexture(c);
    })();
    const plane = new THREE.PlaneGeometry(1.9, 1.122, 1, 1);
    const perRow = Math.ceil(images.length / 2);
    const R = 4.3;
    images.forEach((src, i) => {
      const tex = loader.load(src, () => markDirty());
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 4;
      const m = new THREE.Mesh(plane, new THREE.MeshBasicMaterial({ map: tex, alphaMap: mask, transparent: true, side: THREE.DoubleSide }));
      const row = i % 2;
      const k = Math.floor(i / 2);
      const a = (k / perRow) * Math.PI * 2 + row * (Math.PI / perRow);
      m.position.set(Math.sin(a) * R, row ? -0.68 : 0.68, Math.cos(a) * R);
      m.rotation.y = a;
      group.add(m);
    });
    const pos = [];
    const col = [];
    const siz = [];
    for (let i = 0; i < 500; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = R + 0.5 + Math.random() * 2.2;
      pos.push(Math.sin(a) * r, (Math.random() - 0.5) * 5, Math.cos(a) * r);
      const c = pickColor([[COLORS.white, 0.6], [COLORS.accent, 0.2], [COLORS.violet, 0.2]]);
      col.push(c.r, c.g, c.b);
      siz.push(0.6 + Math.random() * 1.5);
    }
    const dust = makePoints(pos, col, siz, { opacity: 0.8 });
    group.add(dust);
    let rot = 0;
    return {
      scene, camera,
      update(t, dt) {
        dust.material.uniforms.uTime.value = t;
        rot += dt * (0.14 + v.px * (v.hover ? 0.35 : 0));
        group.rotation.y = rot;
        group.rotation.x = damp(group.rotation.x, 0.16 - v.py * 0.12, 3, dt);
        group.rotation.z = -0.05;
        const aspect = v.w / v.h;
        camera.position.z = aspect > 1.4 ? 10.2 : 10.2 + (1.4 - aspect) * 9;
      },
    };
  },

  // Pricing hero: four iridescent gems, one per package, the online store in the accent blue
  crystal(v) {
    const { scene, camera } = baseView(35, 6.6);
    const group = new THREE.Group();
    scene.add(group);
    const accentGem = new THREE.MeshPhysicalMaterial({
      color: COLORS.accent, emissive: COLORS.accent, emissiveIntensity: 0.35, roughness: 0.15, metalness: 0.05,
      clearcoat: 1, clearcoatRoughness: 0.1, iridescence: 0.25, iridescenceThicknessRange: [100, 300], envMapIntensity: 0.6, flatShading: true,
    });
    const defs = [
      { g: new THREE.OctahedronGeometry(0.5, 0), m: MAT.glassFlat, x: -2.3, y: -0.5 },
      { g: new THREE.OctahedronGeometry(0.66, 0), m: MAT.glassFlat, x: -0.8, y: 0.3 },
      { g: new THREE.DodecahedronGeometry(0.66, 0), m: MAT.glassFlat, x: 0.75, y: -0.25 },
      { g: new THREE.IcosahedronGeometry(0.88, 0), m: accentGem, x: 2.35, y: 0.45 },
    ];
    const gems = defs.map((d, i) => {
      const mesh = new THREE.Mesh(d.g, d.m);
      mesh.position.set(d.x, d.y, 0);
      mesh.userData = { y: d.y, ph: i * 1.3 };
      group.add(mesh);
      return mesh;
    });
    const pos = [];
    const col = [];
    const siz = [];
    for (let i = 0; i < 400; i++) {
      pos.push((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 3);
      const c = pickColor([[COLORS.white, 0.6], [COLORS.accent, 0.25], [COLORS.violet, 0.15]]);
      col.push(c.r, c.g, c.b);
      siz.push(0.4 + Math.random() * 1.4);
    }
    const sparks = makePoints(pos, col, siz);
    group.add(sparks);
    return {
      scene, camera,
      update(t, dt) {
        sparks.material.uniforms.uTime.value = t;
        gems.forEach((g, i) => {
          g.rotation.y = t * (0.35 + i * 0.08) + g.userData.ph;
          g.rotation.x = Math.sin(t * 0.5 + g.userData.ph) * 0.4;
          g.position.y = g.userData.y + Math.sin(t * 0.9 + g.userData.ph) * 0.18;
        });
        group.rotation.y = damp(group.rotation.y, v.px * 0.4, 3, dt);
        group.rotation.x = damp(group.rotation.x, -v.py * 0.25, 3, dt);
        const wide = v.w / v.h > 1.3;
        group.scale.setScalar(wide ? 1 : 0.7);
      },
    };
  },

  // Contact hero: dotted globe with Tbilisi highlighted in blue and arcs to cities we work with
  globe(v) {
    const { scene, camera } = baseView(35, 7);
    const group = new THREE.Group();
    const spin = new THREE.Group();
    scene.add(group);
    group.add(spin);
    const R = 1.6;
    const toVec = (lat, lon, r = R) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const th = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
    };
    spin.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.985, 64, 32), new THREE.MeshBasicMaterial({ color: 0x0c0c14 })));
    const dots = fibSphere(small ? 1800 : 3600, R);
    const pos = [];
    const col = [];
    const siz = [];
    dots.forEach((p) => {
      pos.push(p.x, p.y, p.z);
      const c = Math.random() < 0.06 ? COLORS.violet : COLORS.white;
      col.push(c.r * 0.7, c.g * 0.7, c.b * 0.7);
      siz.push(0.9);
    });
    const dotPts = makePoints(pos, col, siz);
    dotPts.material.blending = THREE.NormalBlending;
    dotPts.material.depthWrite = false;
    spin.add(dotPts);
    const home = { lat: 41.7151, lon: 44.8271 };
    const cities = [[51.5, -0.12], [40.71, -74.0], [25.2, 55.27], [52.52, 13.4], [41.0, 28.98], [48.85, 2.35], [50.45, 30.52], [35.68, 139.7]];
    const homeV = toVec(home.lat, home.lon);
    const marker = new THREE.Mesh(new THREE.SphereGeometry(0.045, 24, 12), MAT.accent);
    marker.position.copy(homeV);
    spin.add(marker);
    const pulse = new THREE.Mesh(new THREE.RingGeometry(0.06, 0.08, 48), new THREE.MeshBasicMaterial({ color: COLORS.accent, transparent: true, side: THREE.DoubleSide }));
    pulse.position.copy(homeV.clone().multiplyScalar(1.002));
    pulse.lookAt(homeV.clone().multiplyScalar(2));
    spin.add(pulse);
    const arcs = cities.map(([lat, lon], i) => {
      const end = toVec(lat, lon);
      const mid = homeV.clone().add(end).multiplyScalar(0.5);
      const lift = 1 + homeV.distanceTo(end) * 0.28;
      mid.setLength(R * lift);
      const curve = new THREE.QuadraticBezierCurve3(homeV, mid, end);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)),
        new THREE.LineBasicMaterial({ color: i % 2 ? COLORS.violet : COLORS.white, transparent: true, opacity: 0.45 }),
      );
      spin.add(line);
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 8), MAT.accent);
      spin.add(dot);
      const city = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 8), MAT.white);
      city.position.copy(end);
      spin.add(city);
      return { curve, dot, off: i / cities.length, speed: 0.22 + (i % 3) * 0.05 };
    });
    const baseY = -Math.atan2(homeV.x, homeV.z);
    const baseX = Math.atan2(homeV.y, Math.hypot(homeV.x, homeV.z)) * 0.75;
    return {
      scene, camera,
      update(t, dt) {
        dotPts.material.uniforms.uTime.value = t;
        spin.rotation.y = baseY + Math.sin(t * 0.18) * 0.6 + v.px * 0.4;
        group.rotation.x = damp(group.rotation.x, baseX - v.py * 0.25, 3, dt);
        const k = (t * 0.9) % 1;
        pulse.scale.setScalar(1 + k * 3);
        pulse.material.opacity = 1 - k;
        arcs.forEach((a) => {
          a.dot.position.copy(a.curve.getPoint((t * a.speed + a.off) % 1));
        });
        const wide = v.w / v.h > 1;
        group.scale.setScalar(wide ? 1 : 0.85);
      },
    };
  },

  // Services hero: a field of glass blocks that lifts and turns around the cursor
  cubes(v) {
    const { scene, camera } = baseView(35, 9);
    const cols = small ? 8 : 10;
    const rows = small ? 8 : 9;
    const gap = 0.58;
    const count = cols * rows;
    const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), MAT.glass.clone(), count);
    mesh.material.color.set(0xffffff);
    const cells = [];
    const color = new THREE.Color();
    for (let j = 0; j < rows; j++) {
      for (let i = 0; i < cols; i++) {
        const k = j * cols + i;
        const x = (i - (cols - 1) / 2) * gap;
        const y = (j - (rows - 1) / 2) * gap;
        const r = Math.random();
        if (r < 0.07) color.copy(COLORS.accent);
        else if (r < 0.14) color.copy(COLORS.violet);
        else color.setRGB(0.16, 0.16, 0.2);
        mesh.setColorAt(k, color);
        cells.push({ x, y, ph: Math.random() * Math.PI * 2 });
      }
    }
    scene.add(mesh);
    const dummy = new THREE.Object3D();
    const mouse = new THREE.Vector2();
    return {
      scene, camera,
      update(t, dt) {
        mouse.x = damp(mouse.x, v.hover ? v.px * (cols * gap) * 0.6 : Math.cos(t * 0.4) * 1.6, 4, dt);
        mouse.y = damp(mouse.y, v.hover ? v.py * (rows * gap) * 0.6 : Math.sin(t * 0.55) * 1.2, 4, dt);
        cells.forEach((c, k) => {
          const n = Math.sin(c.x * 0.9 + t * 0.9) * Math.cos(c.y * 0.8 + t * 0.6);
          const d = Math.hypot(c.x - mouse.x, c.y - mouse.y);
          const push = Math.exp(-d * d * 0.7);
          dummy.position.set(c.x, c.y, n * 0.22 + push * 1.3);
          dummy.rotation.set(n * 0.5 + push * 1.4, n * 0.4 + push * 1.1 + c.ph * push, 0);
          dummy.scale.setScalar(0.8 + push * 0.45 + n * 0.06);
          dummy.updateMatrix();
          mesh.setMatrixAt(k, dummy.matrix);
        });
        mesh.instanceMatrix.needsUpdate = true;
        mesh.rotation.y = damp(mesh.rotation.y, -0.35 + v.px * 0.15, 3, dt);
        mesh.rotation.x = damp(mesh.rotation.x, -0.25 - v.py * 0.1, 3, dt);
      },
    };
  },

  // 404: an iridescent sphere that keeps breaking into shards and reassembling
  shards(v) {
    const { scene, camera } = baseView(35, 7);
    const group = new THREE.Group();
    scene.add(group);
    const src = new THREE.IcosahedronGeometry(1.4, 1);
    const p = src.attributes.position;
    const shards = [];
    for (let f = 0; f < p.count; f += 3) {
      const a = new THREE.Vector3().fromBufferAttribute(p, f);
      const b = new THREE.Vector3().fromBufferAttribute(p, f + 1);
      const c = new THREE.Vector3().fromBufferAttribute(p, f + 2);
      const center = a.clone().add(b).add(c).divideScalar(3);
      const g = new THREE.BufferGeometry().setFromPoints([a.sub(center), b.sub(center), c.sub(center)]);
      g.computeVertexNormals();
      const m = new THREE.Mesh(g, Math.random() < 0.12 ? MAT.accent : MAT.glassFlat);
      m.userData = { c: center, k: 0.5 + Math.random() * 1.4, axis: new THREE.Vector3().randomDirection(), s: Math.random() * 3 };
      group.add(m);
      shards.push(m);
    }
    const q = new THREE.Quaternion();
    return {
      scene, camera,
      update(t, dt) {
        const e = Math.pow(0.5 + 0.5 * Math.sin(t * 0.7), 1.6);
        shards.forEach((m) => {
          const u = m.userData;
          m.position.copy(u.c).multiplyScalar(1 + e * u.k);
          q.setFromAxisAngle(u.axis, e * u.s);
          m.quaternion.copy(q);
        });
        group.rotation.y = t * 0.15 + v.px * 0.5;
        group.rotation.x = damp(group.rotation.x, -v.py * 0.4, 3, dt);
        const wide = v.w / v.h > 1.2;
        group.position.x = damp(group.position.x, wide ? 1.9 : 0, 4, dt);
        group.position.y = wide ? 0 : 0.9;
        group.scale.setScalar(wide ? 0.82 : 0.75);
      },
    };
  },
};

/* ---------- service objects ---------- */

const SERVICE_OBJECTS = {
  // Layered browser windows separating in depth
  'web-design'(group) {
    const tex = uiTexture('browser');
    const panels = [0, 1, 2].map((i) => {
      const p = new THREE.Group();
      const back = new THREE.Mesh(slab(2.24, 1.42, 0.12, 0.03), i === 0 ? MAT.dark : MAT.glass);
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.375), new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: i === 0 ? 1 : 0.35 }));
      screen.position.z = 0.04;
      p.add(back, screen);
      group.add(p);
      return p;
    });
    const btn = new THREE.Mesh(slab(0.44, 0.15, 0.07, 0.05), MAT.accent);
    group.add(btn);
    return (t) => {
      const sep = 0.5 + Math.sin(t * 0.9) * 0.12;
      panels.forEach((p, i) => p.position.set(i * 0.32, i * 0.24, -i * sep));
      btn.position.set(-0.6, -0.37 + Math.sin(t * 1.6) * 0.04, 0.35 + Math.sin(t * 1.6) * 0.08);
      group.rotation.z = -0.04;
      group.children.forEach((c) => (c.rotation.y = -0.35 + Math.sin(t * 0.4) * 0.15));
    };
  },
  // A phone with a live UI and a floating notification
  'app-development'(group) {
    const phone = new THREE.Group();
    phone.add(new THREE.Mesh(slab(1.05, 2.1, 0.17, 0.1), MAT.dark));
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.96, 1.98), new THREE.MeshBasicMaterial({ map: uiTexture('phone') }));
    screen.position.z = 0.083;
    phone.add(screen);
    group.add(phone);
    const note = new THREE.Group();
    note.add(new THREE.Mesh(slab(1.0, 0.3, 0.1, 0.04), MAT.glass));
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 24, 12), MAT.accent);
    dot.position.set(-0.36, 0, 0.05);
    note.add(dot);
    group.add(note);
    return (t, dt, spin) => {
      phone.rotation.y = Math.sin(spin * 0.8) * 0.45;
      phone.rotation.x = Math.sin(t * 0.5) * 0.08;
      note.position.set(0.62, 0.62 + Math.sin(t * 1.3) * 0.08, 0.45);
      note.rotation.y = phone.rotation.y * 0.6;
    };
  },
  // Brand shapes: torus, sphere, cone and cube in a slow composition
  branding(group) {
    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.24, 48, 120), MAT.glass);
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.3, 48, 24), MAT.accent);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6, 48), MAT.white);
    const cube = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.34, 0.34), MAT.chrome);
    group.add(torus, sphere, cone, cube);
    return (t, dt, spin) => {
      torus.rotation.set(0.9 + Math.sin(t * 0.4) * 0.2, spin * 0.8, 0);
      sphere.position.set(Math.cos(spin) * 0.95, 0.15 + Math.sin(t) * 0.12, Math.sin(spin) * 0.95);
      cone.position.set(-0.95, 0.75 + Math.sin(t * 0.8) * 0.1, -0.2);
      cone.rotation.set(0.3, t * 0.6, 0.2);
      cube.position.set(0.95, -0.8 + Math.sin(t * 0.9 + 1) * 0.1, 0.1);
      cube.rotation.set(t * 0.5, t * 0.7, 0);
    };
  },
  // Connected network with pulses travelling between people
  'social-media'(group) {
    const net = new THREE.Group();
    group.add(net);
    const nodes = fibSphere(18, 1.15).map((p) => p.add(new THREE.Vector3((Math.random() - 0.5) * 0.15, (Math.random() - 0.5) * 0.15, 0)));
    const inst = new THREE.InstancedMesh(new THREE.SphereGeometry(0.075, 24, 12), MAT.white.clone(), nodes.length);
    const dummy = new THREE.Object3D();
    nodes.forEach((p, i) => {
      dummy.position.copy(p);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
      inst.setColorAt(i, i % 5 === 0 ? COLORS.pink : i % 4 === 0 ? COLORS.violet : COLORS.white);
    });
    net.add(inst);
    const center = new THREE.Vector3();
    const edges = [];
    const pts = [];
    nodes.forEach((a, i) => {
      nodes.map((b, j) => ({ j, d: a.distanceTo(b) })).filter((o) => o.j !== i).sort((x, y) => x.d - y.d).slice(0, 3).forEach(({ j }) => {
        if (!edges.some((e) => e[0] === j && e[1] === i)) {
          edges.push([i, j]);
          pts.push(a, nodes[j]);
        }
      });
      edges.push([i, -1]);
      pts.push(a, center);
    });
    net.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18 })));
    const hub = new THREE.Mesh(new THREE.SphereGeometry(0.22, 48, 24), MAT.accent);
    net.add(hub);
    const point = (idx) => (idx < 0 ? center : nodes[idx]);
    const pulses = Array.from({ length: 7 }, (_, i) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 8), MAT.accent);
      net.add(m);
      return { m, e: edges[(i * 5) % edges.length], k: Math.random() };
    });
    return (t, dt, spin) => {
      net.rotation.y = spin * 0.6;
      net.rotation.x = Math.sin(t * 0.3) * 0.15;
      hub.scale.setScalar(1 + Math.sin(t * 3) * 0.08);
      pulses.forEach((p) => {
        p.k += dt * 0.7;
        if (p.k >= 1) {
          p.k = 0;
          p.e = edges[Math.floor(Math.random() * edges.length)];
        }
        p.m.position.lerpVectors(point(p.e[0]), point(p.e[1]), p.k);
      });
    };
  },
  // Camera lens with rotating rings and a accent focus ring
  'photo-video'(group) {
    const lens = new THREE.Group();
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.0, 0.9, 72, 1, true), MAT.dark);
    barrel.rotation.x = Math.PI / 2;
    const grip = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.085, 12, 96), MAT.dark);
    grip.position.z = -0.1;
    const front = new THREE.Mesh(new THREE.TorusGeometry(0.97, 0.06, 24, 96), MAT.chrome);
    front.position.z = 0.45;
    const inner = new THREE.Mesh(new THREE.TorusGeometry(0.8, 0.025, 16, 96), MAT.chrome);
    inner.position.z = 0.4;
    const focus = new THREE.Mesh(new THREE.TorusGeometry(0.88, 0.018, 16, 96), MAT.accent);
    focus.position.z = 0.47;
    const glass = new THREE.Mesh(new THREE.SphereGeometry(0.8, 64, 32, 0, Math.PI * 2, 0, 0.62), MAT.glass);
    glass.rotation.x = Math.PI / 2;
    glass.position.z = -0.18;
    const blades = new THREE.Group();
    for (let i = 0; i < 7; i++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.16, 0.01), MAT.dark);
      b.position.set(Math.cos((i / 7) * Math.PI * 2) * 0.32, Math.sin((i / 7) * Math.PI * 2) * 0.32, 0);
      b.rotation.z = (i / 7) * Math.PI * 2 + Math.PI / 2.6;
      blades.add(b);
    }
    blades.position.z = 0.05;
    lens.add(barrel, grip, front, inner, focus, glass, blades);
    group.add(lens);
    return (t, dt, spin) => {
      lens.rotation.y = -0.45 + Math.sin(spin * 0.7) * 0.35;
      lens.rotation.x = 0.15 + Math.sin(t * 0.5) * 0.08;
      front.rotation.z = spin;
      focus.material.emissiveIntensity = 0.35 + Math.sin(t * 2.4) * 0.25;
      const open = 0.8 + Math.sin(t * 0.9) * 0.2;
      blades.scale.setScalar(open);
      blades.rotation.z = -spin * 0.5;
    };
  },
  // 3D bar chart growing in a wave, tallest bar in accent
  seo(group, camera) {
    camera.position.set(3.4, 2.7, 4.6);
    camera.lookAt(0, -0.1, 0);
    const n = 6;
    const bars = new THREE.InstancedMesh(new THREE.BoxGeometry(0.26, 1, 0.26), MAT.white.clone(), n * n);
    group.add(bars);
    const dummy = new THREE.Object3D();
    const col = new THREE.Color();
    const base = new THREE.Mesh(slab(2.2, 2.2, 0.12, 0.04), MAT.glass);
    base.rotation.x = -Math.PI / 2;
    base.position.y = -0.82;
    group.add(base);
    return (t, dt, spin) => {
      group.rotation.y = Math.sin(spin * 0.5) * 0.4;
      let k = 0;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const grow = (i + j) / (2 * (n - 1));
          const h = 0.12 + grow * 1.5 * (0.78 + 0.22 * Math.sin(t * 1.4 - i * 0.55 - j * 0.35));
          dummy.position.set((i - (n - 1) / 2) * 0.33, -0.8 + h / 2, (j - (n - 1) / 2) * 0.33);
          dummy.scale.set(1, h, 1);
          dummy.updateMatrix();
          bars.setMatrixAt(k, dummy.matrix);
          if (i === n - 1 && j === n - 1) col.copy(COLORS.accent);
          else col.setRGB(0.22, 0.22, 0.28).lerp(COLORS.violet, grow * 0.7);
          bars.setColorAt(k, col);
          k++;
        }
      }
      bars.instanceMatrix.needsUpdate = true;
      bars.instanceColor.needsUpdate = true;
    };
  },
  // Wireframe globe with orbiting satellites and live status lights
  'website-care'(group) {
    const R = 0.95;
    group.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.985, 48, 24), MAT.dark));
    const pts = [];
    for (let m = 0; m < 10; m++) {
      const a = (m / 10) * Math.PI;
      for (let s = 0; s < 64; s++) {
        const b1 = (s / 64) * Math.PI * 2;
        const b2 = ((s + 1) / 64) * Math.PI * 2;
        pts.push(
          new THREE.Vector3(Math.cos(b1) * Math.cos(a) * R, Math.sin(b1) * R, Math.cos(b1) * Math.sin(a) * R),
          new THREE.Vector3(Math.cos(b2) * Math.cos(a) * R, Math.sin(b2) * R, Math.cos(b2) * Math.sin(a) * R),
        );
      }
    }
    for (let p = 1; p < 8; p++) {
      const lat = (p / 8) * Math.PI - Math.PI / 2;
      const r = Math.cos(lat) * R;
      const y = Math.sin(lat) * R;
      for (let s = 0; s < 64; s++) {
        const b1 = (s / 64) * Math.PI * 2;
        const b2 = ((s + 1) / 64) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(b1) * r, y, Math.sin(b1) * r), new THREE.Vector3(Math.cos(b2) * r, y, Math.sin(b2) * r));
      }
    }
    const wire = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.28 }));
    group.add(wire);
    const lights = fibSphere(9, R * 1.01).map((p, i) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), MAT.accent.clone());
      m.position.copy(p);
      m.userData.ph = i;
      wire.add(m);
      return m;
    });
    const orbitA = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.008, 8, 160), MAT.chrome);
    orbitA.rotation.set(1.25, 0.35, 0);
    const orbitB = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.006, 8, 160), MAT.violet);
    orbitB.rotation.set(1.9, -0.5, 0);
    const satA = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 12), MAT.accent);
    const satB = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), MAT.chrome);
    orbitA.add(satA);
    orbitB.add(satB);
    group.add(orbitA, orbitB);
    return (t, dt, spin) => {
      wire.rotation.y = spin * 0.6;
      group.children[0].rotation.y = wire.rotation.y;
      satA.position.set(Math.cos(t * 0.9) * 1.45, Math.sin(t * 0.9) * 1.45, 0);
      satB.position.set(Math.cos(-t * 0.7 + 2) * 1.25, Math.sin(-t * 0.7 + 2) * 1.25, 0);
      satB.rotation.set(t, t * 1.3, 0);
      lights.forEach((m) => {
        m.material.emissiveIntensity = 0.2 + (0.5 + 0.5 * Math.sin(t * 2.5 + m.userData.ph * 1.7)) * 0.9;
      });
    };
  },
};

/* ---------- engine ---------- */

let dirty = true;
function markDirty() {
  dirty = true;
}

function start() {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.setClearColor(0x000000, 0);
  renderer.autoClear = false;
  initMaterials();
  const mouse = { x: -9999, y: -9999, has: false };
  const views = [];
  elements.forEach((el) => {
    const factory = SCENES[el.dataset.scene];
    if (!factory) return;
    const v = {
      el, hoverEl: el.closest('[data-hover]') || el, revealEl: el.closest('.reveal'), appear: 0,
      w: 1, h: 1, px: 0, py: 0, vx: 0, vy: 0, hover: false, progress: 0, visible: false,
    };
    try {
      Object.assign(v, factory(v));
      views.push(v);
      el.classList.add('scene-ready');
    } catch (err) {
      console.error('Scene failed:', el.dataset.scene, err);
    }
  });
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const v = views.find((x) => x.el === e.target);
        if (v) v.visible = e.isIntersecting;
      });
      markDirty();
    }, { rootMargin: '100px 0px' });
    views.forEach((v) => io.observe(v.el));
  } else {
    views.forEach((v) => (v.visible = true));
  }
  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.has = e.pointerType === 'mouse';
    markDirty();
  }, { passive: true });
  window.addEventListener('scroll', markDirty, { passive: true });
  window.addEventListener('resize', markDirty);
  let last = performance.now();
  let time = 3;
  let lastW = 0;
  let lastH = 0;
  function frame() {
    requestAnimationFrame(frame);
    const now = performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (reduceMotion && !dirty) return;
    dirty = false;
    if (!reduceMotion) time += dt;
    const W = window.innerWidth;
    const H = window.innerHeight;
    if (W !== lastW || H !== lastH) {
      renderer.setSize(W, H, false);
      lastW = W;
      lastH = H;
    }
    renderer.setScissorTest(false);
    renderer.clear();
    renderer.setScissorTest(true);
    for (const v of views) {
      if (!v.visible) continue;
      const r = v.el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > H || r.width < 2 || r.height < 2) continue;
      if (v.revealEl && !v.revealEl.classList.contains('in')) continue;
      v.appear = reduceMotion ? 1 : Math.min(1, v.appear + dt * 1.2);
      v.scene.scale.setScalar(0.55 + 0.45 * (1 - Math.pow(1 - v.appear, 3)));
      v.w = r.width;
      v.h = r.height;
      const hr = v.hoverEl === v.el ? r : v.hoverEl.getBoundingClientRect();
      v.hover = mouse.has && mouse.x >= hr.left && mouse.x <= hr.right && mouse.y >= hr.top && mouse.y <= hr.bottom;
      const tx = mouse.has ? THREE.MathUtils.clamp(((mouse.x - hr.left) / hr.width) * 2 - 1, -1.5, 1.5) : 0;
      const ty = mouse.has ? THREE.MathUtils.clamp(-(((mouse.y - hr.top) / hr.height) * 2 - 1), -1.5, 1.5) : 0;
      const npx = damp(v.px, tx, 4, dt);
      const npy = damp(v.py, ty, 4, dt);
      v.vx = npx - v.px;
      v.vy = npy - v.py;
      v.px = npx;
      v.py = npy;
      v.progress = (r.top + r.height / 2 - H / 2) / (H / 2 + r.height / 2);
      v.update(time, reduceMotion ? 0 : dt);
      v.camera.aspect = r.width / r.height;
      v.camera.updateProjectionMatrix();
      const bottom = H - r.bottom;
      renderer.setViewport(r.left, bottom, r.width, r.height);
      renderer.setScissor(r.left, bottom, r.width, r.height);
      renderer.render(v.scene, v.camera);
    }
  }
  frame();
}

if (!renderer) {
  root.classList.add('no-webgl');
} else {
  root.classList.add('has-webgl');
  start();
}
