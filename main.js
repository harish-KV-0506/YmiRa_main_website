/* =====================================================================
   YMIRA 3D website. Edit the CONFIG and DATA blocks below.
   ===================================================================== */
(() => {
'use strict';

/* ---------- CONFIG: connect your forms here ---------- */
const CONFIG = {
  email: 'kumarvinojari@gmail.com',   // CHANGE to your YMIRA contact email (used if no endpoint below)
  contactEndpoint: '',                // e.g. 'https://formspree.io/f/xxxxxxx'
  newsletterEndpoint: ''              // e.g. a Formspree / Mailchimp-compatible endpoint
};

/* ---------- DATA: edit freely ---------- */
const PROJECTS = [
  { name: 'BlinkBreak',     tag: 'Initiative 01', description: 'Daily awareness content',          c1: '#0A0A0B', c2: '#3A3A3E', href: '' },
  { name: 'YMIRA',          tag: 'Initiative 02', description: 'Tech & education initiatives',     c1: '#2B2B2E', c2: '#6B6B70', href: '' },
  { name: 'Baby Store',     tag: 'Initiative 03', description: 'Carefully curated baby products',  c1: '#8C8C86', c2: '#D2D2CD', href: '' },
  { name: 'Digital Studio', tag: 'Studio',        description: 'Design and build with YMIRA',      c1: '#000000', c2: '#2B2B2E', href: 'digitalStudio.html' }
];
const BLOGS = [
  { title: 'Why Health Awareness Matters in Daily Life',        category: 'Health',     date: 'Feb 2026' },
  { title: 'How Students Can Learn Faster Using Technology',    category: 'Students',   date: 'Feb 2026' },
  { title: 'AI Explained: Simple Guide for Beginners',          category: 'Technology', date: 'Jan 2026' }
];
const TEAM = [
  { name: 'Harish K V', role: 'Founder',
    desc: 'Founder of YMIRA, a technology and innovation platform. Final-year B.Tech student in Computer Science and Business Systems.',
    linkedin: 'https://www.linkedin.com/in/harish-k-v10' }
  // Add more people here: { name:'', role:'', desc:'', linkedin:'' }
];
const QUESTIONS = [
  { q: 'Is drinking enough water important?', a: true },
  { q: 'Is skipping sleep healthy?', a: false },
  { q: 'Does regular exercise help mental health?', a: true },
  { q: 'Are regular screen breaks good for your eyes?', a: true },
  { q: 'Should we share health tips without checking them first?', a: false }
];

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const TAU = Math.PI * 2;
const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches;
const hasGSAP = !!window.gsap;
const hasLenis = !!window.Lenis;
const root = document.documentElement;
let lenis = null;

/* =====================================================================
   DOM building
   ===================================================================== */
function buildContent() {
  $('#blogContainer').innerHTML = BLOGS.map(b => `
    <article class="blog-card reveal" data-cursor="hover">
      <span class="blog-category">${b.category}</span>
      <h3>${b.title}</h3>
      <span class="blog-date">${b.date}</span>
    </article>`).join('');

  $('#projectsList').innerHTML = PROJECTS.map(p =>
    `<li>${p.href ? `<a href="${p.href}">${p.name}</a>` : p.name}: ${p.description}</li>`).join('');

  const slider = $('#teamSlider');
  slider.innerHTML = TEAM.map((m, i) => `
    <button class="team-card" data-i="${i}" data-cursor="hover">
      <div class="team-avatar">${m.name.trim()[0]}</div>
      <h3>${m.name}</h3><p class="role">${m.role}</p><span class="more">View profile &rarr;</span>
    </button>`).join('') + `
    <a class="team-card invite" href="#contact" data-cursor="hover">
      <div class="team-avatar">+</div><h3>Join us</h3><p class="role">Collaborate with YMIRA</p><span class="more">Get in touch &rarr;</span>
    </a>`;

  $('#gameTotal').textContent = QUESTIONS.length;
}

/* split text into words for the reveal animation */
function splitWords(el) {
  const text = el.textContent.trim();
  el.setAttribute('aria-label', text);
  el.innerHTML = text.split(/\s+/).map(w => `<span class="w" aria-hidden="true"><span>${w}</span></span>`).join(' ');
}

/* =====================================================================
   WebGL: logo badge, glass orb, globe, project cards, particle galaxy
   ===================================================================== */
const NOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.); const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.; vec4 s1=floor(b1)*2.+1.; vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.); m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const ORB_V = `
uniform float uTime; uniform vec2 uMouse;
varying vec3 vN; varying vec3 vPos; varying float vD;
${NOISE}
float dispAt(vec3 q){
  vec3 n=normalize(q);
  float d=snoise(q*0.85+vec3(0.,uTime*0.22,0.))*0.30+snoise(q*2.1+vec3(uTime*0.3))*0.07;
  float m=max(0.,dot(n,normalize(vec3(uMouse.x,uMouse.y,0.8))));
  return d+pow(m,5.)*0.22;
}
vec3 surf(vec3 q){ return q+normalize(q)*dispAt(q); }
void main(){
  vec3 n=normalize(position); float r=length(position);
  vec3 tA=normalize(cross(n,vec3(0.,1.,0.0001))); vec3 tB=normalize(cross(n,tA)); float e=0.03;
  vec3 p0=surf(position);
  vec3 pA=surf(normalize(position+tA*e)*r); vec3 pB=surf(normalize(position+tB*e)*r);
  vec3 nn=normalize(cross(pA-p0,pB-p0)); if(dot(nn,n)<0.) nn=-nn;
  vD=dispAt(position);
  vN=normalize(normalMatrix*nn);
  vec4 mv=modelViewMatrix*vec4(p0,1.);
  vPos=mv.xyz;
  gl_Position=projectionMatrix*mv;
}`;
const ORB_F = `
uniform vec3 cA; uniform vec3 cB; uniform vec3 cC; uniform float uOpacity; uniform float uTime;
varying vec3 vN; varying vec3 vPos; varying float vD;
void main(){
  vec3 nrm=normalize(vN);
  vec3 V=normalize(-vPos);
  float fres=pow(1.-abs(dot(nrm,V)),2.0);
  vec3 base=mix(cA,cB,smoothstep(-.25,.35,vD));
  base=mix(base,cC,fres*0.55);
  vec3 irid=vec3(dot(0.5+0.5*cos(6.2831*(vec3(0.,0.33,0.67)+fres*0.7+vD*1.4+uTime*0.03)),vec3(0.3333)));
  vec3 col=mix(base,irid,0.35);
  vec3 L=normalize(vec3(-.4,.7,.8)); vec3 H=normalize(L+V);
  col+=pow(max(dot(nrm,H),0.),70.)*0.85;
  col=mix(col,vec3(1.),fres*0.35);
  gl_FragColor=vec4(col,mix(0.55,0.97,fres)*uOpacity);
}`;
const GLOW_V = `varying vec3 vN; varying vec3 vV; void main(){ vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }`;
const GLOW_F = `uniform vec3 uColor; uniform float uOpacity; varying vec3 vN; varying vec3 vV; void main(){ float f=pow(clamp(-dot(vN,vV),0.,1.),1.6); gl_FragColor=vec4(uColor,f*0.38*uOpacity); }`;

function initGL() {
  const canvas = $('#gl');
  if (!window.THREE || !canvas) return null;
  const T = THREE;
  let renderer;
  try { renderer = new T.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' }); }
  catch (e) { return null; }
  renderer.setClearColor(0x000000, 0);

  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 8);
  const st = { mx: 0, my: 0, tx: 0, ty: 0, has: false, time: 0, last: 0, portrait: false, aspect: 1, intro: 0,
               drag: 0, dragV: 0, hover: -1, projP: 0, w: { hero: 1, orb: 0, globe: 0, cards: 0 } };
  const C = { blue: new T.Color('#0A0A0B'), coral: new T.Color('#8C8C86'), mint: new T.Color('#D9D9D4'), violet: new T.Color('#3A3A3E'), ink: new T.Color('#0A0A0B') };

  const fade = (g, w) => g.traverse(o => {
    if (!o.material) return;
    (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => {
      if (m.uniforms && m.uniforms.uOpacity) m.uniforms.uOpacity.value = w * (m.userData.b ?? 1);
      else { m.transparent = true; m.opacity = w * (m.userData.b ?? 1); }
    });
  });
  const mat = (color, b = 1) => { const m = new T.MeshBasicMaterial({ color, transparent: true }); m.userData.b = b; return m; };

  /* ----- 1. Hero: 3D logo badge ----- */
  const hero = new T.Group(); scene.add(hero);
  const discCanvas = document.createElement('canvas'); discCanvas.width = discCanvas.height = 256;
  { const x = discCanvas.getContext('2d'), g = x.createRadialGradient(100, 90, 10, 128, 128, 128);
    g.addColorStop(0, '#FFFFFF'); g.addColorStop(1, '#ECECE8'); x.fillStyle = g; x.fillRect(0, 0, 256, 256); }
  const disc = new T.Mesh(new T.CircleGeometry(1.5, 72), new T.MeshBasicMaterial({ map: new T.CanvasTexture(discCanvas), transparent: true }));
  hero.add(disc);
  const ringA = new T.Mesh(new T.TorusGeometry(1.58, 0.07, 24, 160), mat(C.blue)); ringA.position.z = 0.03; hero.add(ringA);
  const ringB = new T.Mesh(new T.TorusGeometry(2.0, 0.03, 16, 160), mat(C.coral, 0.9)); ringB.position.z = -0.25; ringB.rotation.x = 0.45; hero.add(ringB);
  const ringC = new T.Mesh(new T.TorusGeometry(2.5, 0.022, 16, 160), mat(C.violet, 0.8)); ringC.position.z = -0.5; ringC.rotation.x = -0.6; ringC.rotation.y = 0.3; hero.add(ringC);
  const orbiters = [];
  [[ringB, C.coral, 2.0, 0.12], [ringC, C.violet, 2.5, 0.1], [ringA, C.blue, 1.58, 0.1]].forEach(([r, col, rad, size], i) => {
    const s = new T.Mesh(new T.SphereGeometry(size, 24, 24), mat(col)); r.add(s); orbiters.push({ s, rad, sp: 0.5 + i * 0.25, ph: i * 2 });
  });
  const logoMat = new T.MeshBasicMaterial({ transparent: true }); logoMat.userData.b = 1;
  const logo = new T.Mesh(new T.PlaneGeometry(1.7, 1.7), logoMat); logo.position.z = 0.12; hero.add(logo);
  const logoImg = new Image();
  const fallbackLogo = () => { const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d');
    x.fillStyle = '#0A0A0B'; x.font = '700 190px Sora, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('Y', 128, 140);
    logoMat.map = new T.CanvasTexture(c); logoMat.needsUpdate = true; };
  fallbackLogo();
  logoImg.onload = () => {
    const tex = new T.Texture(logoImg); tex.needsUpdate = true; tex.anisotropy = 8; logoMat.map = tex; logoMat.needsUpdate = true;
    const a = logoImg.width / logoImg.height, s = 1.9; logo.scale.set(a >= 1 ? s : s * a, a >= 1 ? s / a : s, 1);
    logo.scale.multiplyScalar(1 / 1.7); logo.geometry.dispose(); logo.geometry = new T.PlaneGeometry(1.7, 1.7);
    redrawCards();
  };
  logoImg.src = 'assets/logo.png';

  /* ----- 2. Mission: glass orb ----- */
  const orbG = new T.Group(); scene.add(orbG);
  const orbMat = new T.ShaderMaterial({ transparent: true, depthWrite: false,
    uniforms: { uTime: { value: 0 }, uMouse: { value: new T.Vector2() }, uOpacity: { value: 1 }, cA: { value: C.blue }, cB: { value: C.coral }, cC: { value: C.mint } },
    vertexShader: ORB_V, fragmentShader: ORB_F });
  const orb = new T.Mesh(new T.IcosahedronGeometry(1.55, 36), orbMat); orbG.add(orb);
  const orbRing1 = new T.Mesh(new T.TorusGeometry(2.2, 0.018, 12, 160), mat(C.ink, 0.5)); orbRing1.rotation.x = 1.2; orbG.add(orbRing1);
  const orbRing2 = new T.Mesh(new T.TorusGeometry(2.55, 0.018, 12, 160), mat(C.blue, 0.6)); orbRing2.rotation.set(0.5, 0.8, 0); orbG.add(orbRing2);

  /* ----- 3. Impact: globe with awareness nodes ----- */
  const globe = new T.Group(); scene.add(globe);
  const R = 2.05;
  const ll = (lat, lon, r = R) => { const p = (90 - lat) * Math.PI / 180, t = (lon + 180) * Math.PI / 180;
    return new T.Vector3(-r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t)); };
  const spin = new T.Group(); globe.add(spin);
  { const N = st.portrait ? 1500 : 2600, pos = new Float32Array(N * 3), ga = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) { const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = ga * i;
      pos.set([Math.cos(th) * r * R, y * R, Math.sin(th) * r * R], i * 3); }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3));
    const pm = new T.PointsMaterial({ color: C.blue, size: 0.034, transparent: true, opacity: 0.8 }); pm.userData.b = 0.8; spin.add(new T.Points(g, pm)); }
  const core = new T.Mesh(new T.SphereGeometry(R * 0.985, 48, 48), mat(0xF1F1EE, 0.92)); spin.add(core);
  const glow = new T.Mesh(new T.SphereGeometry(R * 1.14, 48, 48), new T.ShaderMaterial({ transparent: true, side: T.BackSide, depthWrite: false,
    uniforms: { uColor: { value: C.blue }, uOpacity: { value: 1 } }, vertexShader: GLOW_V, fragmentShader: GLOW_F }));
  globe.add(glow);
  const HOME = [10.79, 79.14];
  const CITIES = [[13.08, 80.27], [51.5, -0.12], [40.7, -74], [52.5, 13.4], [1.35, 103.8], [-33.9, 151.2], [25.2, 55.3], [-1.29, 36.8], [-23.5, -46.6], [35.7, 139.7], [43.65, -79.4], [28.6, 77.2]];
  const nodeRings = [], pulses = [];
  const home = ll(HOME[0], HOME[1]);
  const mkNode = (p, col, size) => { const m = new T.Mesh(new T.SphereGeometry(size, 16, 16), mat(col)); m.position.copy(p); spin.add(m);
    const r = new T.Mesh(new T.RingGeometry(size * 1.5, size * 1.9, 32), new T.MeshBasicMaterial({ color: col, transparent: true, side: T.DoubleSide }));
    r.userData.b = 0.7; r.position.copy(p); r.lookAt(p.clone().multiplyScalar(2)); spin.add(r); nodeRings.push(r); };
  mkNode(home, C.blue, 0.075);
  CITIES.forEach((c, i) => {
    const b = ll(c[0], c[1]); mkNode(b, C.coral, 0.045);
    const mid = home.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R * (1 + home.distanceTo(b) * 0.2));
    const curve = new T.QuadraticBezierCurve3(home, mid, b);
    const lm = new T.LineBasicMaterial({ color: C.coral, transparent: true, opacity: 0.45 }); lm.userData.b = 0.45;
    spin.add(new T.Line(new T.BufferGeometry().setFromPoints(curve.getPoints(48)), lm));
    const pm = new T.Mesh(new T.SphereGeometry(0.035, 12, 12), mat(C.ink)); spin.add(pm); pulses.push({ m: pm, curve, off: i / CITIES.length });
  });

  /* ----- 4. Projects: floating 3D cards ----- */
  const cardsG = new T.Group(); scene.add(cardsG);
  const cards = [];
  function rr(x, px, py, w, h, r) { x.beginPath(); x.moveTo(px + r, py); x.arcTo(px + w, py, px + w, py + h, r); x.arcTo(px + w, py + h, px, py + h, r); x.arcTo(px, py + h, px, py, r); x.arcTo(px, py, px + w, py, r); x.closePath(); }
  function wrapText(x, text, px, py, maxW, lh) { const words = text.split(' '); let line = '', y = py;
    words.forEach(w => { const t = line + w + ' '; if (x.measureText(t).width > maxW && line) { x.fillText(line.trim(), px, y); line = w + ' '; y += lh; } else line = t; }); x.fillText(line.trim(), px, y); }
  function drawCard(c, p) {
    const x = c.getContext('2d'), m = 26, W = 512 - 2 * m, H = 720 - 2 * m;
    x.clearRect(0, 0, 512, 720);
    x.save(); x.shadowColor = 'rgba(10,10,11,.25)'; x.shadowBlur = 26; x.shadowOffsetY = 10; rr(x, m, m, W, H, 34); x.fillStyle = '#fff'; x.fill(); x.restore();
    x.save(); rr(x, m, m, W, H, 34); x.clip();
    const g = x.createLinearGradient(m, m, m + W, m + 340); g.addColorStop(0, p.c1); g.addColorStop(1, p.c2); x.fillStyle = g; x.fillRect(m, m, W, 340);
    x.strokeStyle = 'rgba(255,255,255,.3)'; x.lineWidth = 3; for (let i = 0; i < 4; i++) { x.beginPath(); x.arc(m + W - 40, m + 60, 50 + i * 46, 0, TAU); x.stroke(); }
    x.restore();
    x.fillStyle = '#fff'; x.beginPath(); x.arc(m + 92, m + 340, 62, 0, TAU); x.fill();
    if (logoImg.complete && logoImg.naturalWidth) { const a = logoImg.width / logoImg.height, s = 78; x.drawImage(logoImg, m + 92 - (a >= 1 ? s / 2 : s * a / 2), m + 340 - (a >= 1 ? s / a / 2 : s / 2), a >= 1 ? s : s * a, a >= 1 ? s / a : s); }
    else { x.fillStyle = p.c1; x.font = '700 60px Sora, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(p.name[0], m + 92, m + 344); }
    x.textAlign = 'left'; x.textBaseline = 'alphabetic';
    x.fillStyle = '#6B6B70'; x.font = '600 21px Sora, sans-serif'; x.fillText(p.tag.toUpperCase(), m + 34, m + 440);
    x.fillStyle = '#0A0A0B'; x.font = '700 50px Sora, sans-serif'; wrapText(x, p.name, m + 34, m + 500, W - 68, 54);
    x.fillStyle = '#6B6B70'; x.font = '400 25px "DM Sans", sans-serif'; wrapText(x, p.description, m + 34, m + 556, W - 68, 32);
    x.strokeStyle = '#0A0A0B'; x.lineWidth = 3; x.beginPath(); x.arc(m + W - 66, m + H - 64, 30, 0, TAU); x.stroke();
    x.beginPath(); x.moveTo(m + W - 78, m + H - 64); x.lineTo(m + W - 54, m + H - 64); x.moveTo(m + W - 64, m + H - 74); x.lineTo(m + W - 54, m + H - 64); x.lineTo(m + W - 64, m + H - 54); x.stroke();
  }
  PROJECTS.forEach((p, i) => {
    const c = document.createElement('canvas'); c.width = 512; c.height = 720;
    const tex = new T.CanvasTexture(c); tex.generateMinFilter = false; tex.generateMipmaps = false; tex.minFilter = T.LinearFilter; tex.anisotropy = 4;
    const m = new T.Mesh(new T.PlaneGeometry(2.4, 3.375), new T.MeshBasicMaterial({ map: tex, transparent: true, side: T.DoubleSide }));
    m.userData = { i, c, tex, p, s: 1, rx: 0, ry: 0 }; cardsG.add(m); cards.push(m);
  });
  function redrawCards() { cards.forEach(m => { drawCard(m.userData.c, m.userData.p); m.userData.tex.needsUpdate = true; }); }
  redrawCards();
  if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('700 50px Sora'), document.fonts.load('400 25px "DM Sans"')]).then(redrawCards).catch(() => {});

  /* ----- Galaxy of particles (always on) ----- */
  const galaxyTilt = new T.Group(); scene.add(galaxyTilt); const galaxy = new T.Group(); galaxyTilt.add(galaxy);
  { const N = window.innerWidth < 900 ? 1600 : 3200, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
    const pal = [C.blue, C.coral, C.violet, C.mint, C.ink];
    for (let i = 0; i < N; i++) { const r = Math.pow(Math.random(), 1.5) * 15 + 0.6, br = (i % 3) / 3 * TAU, sp = r * 0.5;
      const rx = (Math.random() - 0.5) * r * 0.22, ry = (Math.random() - 0.5) * (0.4 + r * 0.05), rz = (Math.random() - 0.5) * r * 0.22;
      pos.set([Math.cos(br + sp) * r + rx, ry, Math.sin(br + sp) * r + rz], i * 3);
      const c = pal[Math.floor(Math.pow(Math.random(), 1.6) * pal.length)]; col.set([c.r, c.g, c.b], i * 3); }
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('color', new T.BufferAttribute(col, 3));
    const dc = document.createElement('canvas'); dc.width = dc.height = 64; const dx = dc.getContext('2d'), gr = dx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.5, 'rgba(255,255,255,.7)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); dx.fillStyle = gr; dx.fillRect(0, 0, 64, 64);
    galaxy.add(new T.Points(g, new T.PointsMaterial({ size: 0.11, map: new T.CanvasTexture(dc), vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false })));
    galaxyTilt.position.set(0, -0.5, -7); galaxyTilt.rotation.x = 1.15; }

  /* ----- sizing ----- */
  function resize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, w < 900 ? 1.5 : 1.75));
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    st.aspect = w / h; st.portrait = w <= 900;
  }
  window.addEventListener('resize', resize); resize();

  /* ----- input ----- */
  window.addEventListener('pointermove', e => {
    st.tx = (e.clientX / window.innerWidth) * 2 - 1; st.ty = -((e.clientY / window.innerHeight) * 2 - 1); st.has = true;
    if (drag.on && e.pointerType === 'mouse') { const dx = e.clientX - drag.x; drag.x = e.clientX; st.drag += dx * 0.006; st.dragV = dx * 0.006; }
  }, { passive: true });
  const drag = { on: false, x: 0 };
  window.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse' && e.target.closest && e.target.closest('#projects')) { drag.on = true; drag.x = e.clientX; } });
  window.addEventListener('pointerup', () => { drag.on = false; });
  window.addEventListener('click', () => { const c = cards[st.hover]; if (st.hover >= 0 && c && c.userData.p.href && Math.abs(st.dragV) < 0.01) window.location.href = c.userData.p.href; });

  const ray = new T.Raycaster(), ndc = new T.Vector2();
  const visW = el => { const r = el.getBoundingClientRect(), vh = window.innerHeight; const p = (vh - r.top) / (vh + r.height);
    const tri = 1 - Math.abs(clamp(p, 0, 1) - 0.5) * 2, k = clamp(tri / 0.55, 0, 1); return { w: k * k * (3 - 2 * k), p }; };
  const secs = { hero: $('#home'), orb: $('#mission'), globe: $('#impact'), cards: $('#projects') };

  /* ----- per-frame ----- */
  function frame(time) {
    if (document.hidden) return;
    const t = reduce ? 0 : time, dt = Math.min(0.05, time - st.last || 0.016); st.last = time; st.time = t;
    const kM = 1 - Math.exp(-dt * 4), kW = 1 - Math.exp(-dt * 8);
    st.mx += (st.tx - st.mx) * kM; st.my += (st.ty - st.my) * kM;
    camera.position.x = st.mx * 0.45; camera.position.y = st.my * 0.3; camera.lookAt(0, 0, 0);

    const W = {};
    for (const k in secs) { const r = visW(secs[k]); W[k] = r.w; if (k === 'cards') { const rect = secs[k].getBoundingClientRect(), span = rect.height - window.innerHeight; st.projP = clamp(-rect.top / Math.max(span, 1), 0, 1); } }
    for (const k in W) st.w[k] += (W[k] - st.w[k]) * kW;
    const por = st.portrait, X = por ? 0 : clamp(3.31 * st.aspect - 2.85, 1.7, 3.1), Y = por ? 1.55 : 0, S = por ? 0.58 : 1, dim = por ? 0.45 : 1;

    /* hero */
    { const w = st.w.hero * st.intro; hero.visible = w > 0.01; if (hero.visible) {
      hero.position.set(X, (por ? 2.05 : 0.1) + Math.sin(t * 0.9) * 0.08, 0);
      hero.scale.setScalar((por ? 0.46 : 1) * (0.55 + 0.45 * w) * 0.9);
      hero.rotation.y = st.mx * 0.4 + Math.sin(t * 0.4) * 0.12 + (1 - st.intro) * Math.PI;
      hero.rotation.x = -st.my * 0.28; ringB.rotation.z = t * 0.25; ringC.rotation.z = -t * 0.18; ringA.rotation.z = t * 0.1;
      orbiters.forEach(o => { o.s.position.set(Math.cos(t * o.sp + o.ph) * o.rad, Math.sin(t * o.sp + o.ph) * o.rad, 0); });
      fade(hero, w); } }
    /* orb */
    { const w = st.w.orb * dim; orbG.visible = w > 0.01; if (orbG.visible) {
      orbG.position.set(X, Y, 0); orbG.scale.setScalar(S * 0.95 * (0.6 + 0.4 * st.w.orb)); orbG.rotation.y = t * 0.12; orbRing1.rotation.z = t * 0.2; orbRing2.rotation.z = -t * 0.15;
      orbMat.uniforms.uTime.value = t; orbMat.uniforms.uMouse.value.set(st.mx * 1.2, st.my * 1.2); fade(orbG, w); } }
    /* globe */
    { const w = st.w.globe * dim; globe.visible = w > 0.01; if (globe.visible) {
      globe.position.set(X, Y, 0); globe.scale.setScalar(S * 0.9 * (0.6 + 0.4 * st.w.globe)); globe.rotation.z = 0.2; spin.rotation.y = t * 0.14 - 1.2 + st.mx * 0.2;
      nodeRings.forEach((r, i) => { const s = 1 + ((t * 0.9 + i * 0.37) % 1) * 1.8; r.scale.setScalar(s); r.material.opacity = (1 - ((t * 0.9 + i * 0.37) % 1)) * 0.7 * w; });
      pulses.forEach(p => { p.m.position.copy(p.curve.getPoint((t * 0.16 + p.off) % 1)); });
      fade(globe, w); nodeRings.forEach((r, i) => { r.material.opacity = (1 - ((t * 0.9 + i * 0.37) % 1)) * 0.7 * w; }); } }
    /* cards */
    { const w = st.w.cards; cardsG.visible = w > 0.01; if (cardsG.visible) {
      st.drag += st.dragV; st.dragV *= 0.92; if (!drag.on) st.dragV *= 0.9;
      const base = st.projP * (cards.length - 1) * (TAU / cards.length) + st.drag, Rr = por ? 2.4 : 3.7, n = cards.length;
      cardsG.position.set(0, por ? -1.1 : -0.55, -1.0 - Rr * 1.0); cardsG.scale.setScalar((por ? 0.95 : S * 1.12) * (0.7 + 0.3 * w)); cardsG.rotation.y = base;
      ndc.set(st.tx, st.ty); ray.setFromCamera(ndc, camera);
      let hit = -1; if (st.has && w > 0.6) { const h = ray.intersectObjects(cards, false)[0]; if (h) hit = h.object.userData.i; }
      st.hover = hit;
      cards.forEach((m, i) => {
        const a = i * TAU / n; m.position.set(Math.sin(a) * Rr, Math.sin(t * 0.8 + i) * 0.1, Math.cos(a) * Rr);
        const front = (Math.cos(a + base) + 1) / 2, tgtS = hit === i ? 1.08 : 1;
        m.userData.s = lerp(m.userData.s, tgtS, 0.12);
        m.userData.ry = lerp(m.userData.ry, hit === i ? st.mx * 0.35 : 0, 0.1); m.userData.rx = lerp(m.userData.rx, hit === i ? -st.my * 0.3 : 0, 0.1);
        m.rotation.set(m.userData.rx, -base * 0.88 + m.userData.ry, 0); m.scale.setScalar(m.userData.s * (0.78 + 0.22 * front));
        m.material.opacity = w * (0.28 + 0.72 * front); m.renderOrder = Math.round(front * 10);
      });
      const lbl = hit >= 0 ? (cards[hit].userData.p.href ? 'Open' : '') : null;
      document.body.classList.toggle('cur-view', !!lbl); document.body.classList.toggle('cur-hover', hit >= 0 && !lbl);
      const cl = $('.c-label'); if (cl && lbl !== null) cl.textContent = lbl; } else if (st.hover !== -1) { st.hover = -1; document.body.classList.remove('cur-view', 'cur-hover'); } }
    /* galaxy */
    galaxy.rotation.y = t * 0.03 + window.scrollY * 0.0005; galaxyTilt.position.y = -0.5 + window.scrollY * 0.0004;

    renderer.render(scene, camera);
  }

  return { frame, st, intro: () => { if (hasGSAP) return gsap.fromTo(st, { intro: 0 }, { intro: 1, duration: 1.9, ease: 'power3.out' }); st.intro = 1; return null; }, renderer };
}

/* =====================================================================
   Interactions
   ===================================================================== */
function initCursor() {
  if (!fine || reduce) return;
  document.body.classList.add('has-cursor');
  const cur = $('#cursor'); let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  window.addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; }, { passive: true });
  const loop = () => { cx = lerp(cx, x, 0.2); cy = lerp(cy, y, 0.2);
    cur.style.transform = `translate(${cx}px,${cy}px)`; cur.querySelector('.c-dot').style.transform = `translate(${x - cx}px,${y - cy}px)`; requestAnimationFrame(loop); };
  loop();
  document.addEventListener('pointerover', e => { if (e.target.closest && e.target.closest('a,button,[data-cursor],input,textarea') && !document.body.classList.contains('cur-view')) document.body.classList.add('cur-hover'); });
  document.addEventListener('pointerout', e => { if (e.target.closest && e.target.closest('a,button,[data-cursor],input,textarea')) document.body.classList.remove('cur-hover'); });
}

function initMagnetic() {
  if (!fine || reduce) return;
  $$('.magnetic').forEach(el => {
    el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.28}px,${(e.clientY - r.top - r.height / 2) * 0.4}px)`; });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}

function initTilt() {
  if (!fine || reduce) return;
  $$('.blog-card').forEach(c => {
    c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      c.style.transform = `rotateX(${(0.5 - py) * 9}deg) rotateY(${(px - 0.5) * 11}deg) translateZ(0)`; c.style.setProperty('--gx', px * 100 + '%'); c.style.setProperty('--gy', py * 100 + '%'); });
    c.addEventListener('pointerleave', () => { c.style.transform = ''; });
  });
}

function initHeader() {
  const h = $('#header'); let last = 0;
  const onScroll = () => { const y = window.scrollY; h.classList.toggle('scrolled', y > 40); h.classList.toggle('hide', y > last && y > 300 && !document.body.classList.contains('menu-open')); last = y;
    const max = document.documentElement.scrollHeight - innerHeight; $('#progress').style.transform = `scaleX(${max > 0 ? y / max : 0})`; };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const btn = $('#menuBtn');
  btn.addEventListener('click', () => { const open = document.body.classList.toggle('menu-open'); btn.setAttribute('aria-expanded', open); btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); });
  $$('.nav-links a').forEach(a => a.addEventListener('click', () => { document.body.classList.remove('menu-open'); btn.setAttribute('aria-expanded', 'false'); }));
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const id = a.getAttribute('href'); const el = id.length > 1 && $(id); if (!el) return; e.preventDefault();
    if (lenis) lenis.scrollTo(el, { offset: id === '#projects' ? 0 : -70, duration: 1.4 }); else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }));
}

function initMotion() {
  if (!hasGSAP || !window.ScrollTrigger) { root.classList.add('no-anim'); return; }
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.batch('.reveal', { start: 'top 90%', once: true, onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' }) });
  $$('.split').forEach(el => { const ws = $$('.w>span', el); gsap.set(ws, { yPercent: 115 });
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(ws, { yPercent: 0, duration: 1.05, stagger: 0.045, ease: 'power4.out' }) }); });
  if (!reduce) {
    gsap.fromTo('.film-frame', { scale: 0.8, borderRadius: 80 }, { scale: 1, borderRadius: 36, ease: 'none', scrollTrigger: { trigger: '.film', start: 'top 90%', end: 'center 55%', scrub: true } });
    gsap.fromTo('.film-frame video', { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.film', start: 'top 90%', end: 'bottom 30%', scrub: true } });
    gsap.to('.ribbon-track', { x: '-12%', ease: 'none', scrollTrigger: { trigger: '.ribbon', start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
  }
  $$('.num').forEach(n => { const end = +n.dataset.count, suf = n.dataset.suffix || ''; const o = { v: 0 };
    ScrollTrigger.create({ trigger: n, start: 'top 92%', once: true, onEnter: () => gsap.to(o, { v: end, duration: 2.2, ease: 'power3.out', onUpdate: () => { n.textContent = Math.round(o.v).toLocaleString() + suf; } }) }); });
}

function initChat() {
  const body = $('#chatBody'); if (!body) return;
  const script = [['bot', "Hi, I'm Volfelxim Berg. How can I help today?"], ['me', 'What does YMIRA do?'], ['bot', 'We build awareness, prevention and technology-driven solutions for real-world problems.']];
  const add = (who, text) => { const b = document.createElement('div'); b.className = 'bubble ' + who; b.textContent = text; body.appendChild(b); requestAnimationFrame(() => b.classList.add('in')); };
  if (reduce) { script.forEach(s => add(s[0], s[1])); return; }
  let running = false;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  async function play() { if (running) return; running = true;
    for (;;) { body.innerHTML = '';
      for (const [who, text] of script) { if (who === 'bot') { const t = document.createElement('div'); t.className = 'bubble bot typing in'; t.innerHTML = '<i></i><i></i><i></i>'; body.appendChild(t); await wait(900); t.remove(); } else await wait(700);
        add(who, text); await wait(1300); }
      await wait(3500); } }
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { play(); o.disconnect(); } }, { threshold: 0.3 }).observe(body);
}

function initGame() {
  let i = 0, score = 0, lock = false;
  const q = $('#gameQuestion'), res = $('#gameResult'), no = $('#gameNo'), sc = $('#gameScore');
  $$('[data-answer]').forEach(b => b.addEventListener('click', () => {
    if (lock) return; lock = true; const ans = b.dataset.answer === 'true', ok = QUESTIONS[i].a === ans;
    if (ok) score++; sc.textContent = score; res.textContent = ok ? 'Correct' : 'Not quite'; res.className = 'game-result ' + (ok ? 'ok' : 'no');
    setTimeout(() => { i++; if (i >= QUESTIONS.length) { q.textContent = `You scored ${score} out of ${QUESTIONS.length}. Play again?`; i = 0; score = 0; sc.textContent = 0; no.textContent = 1; res.textContent = ''; }
      else { q.textContent = QUESTIONS[i].q; no.textContent = i + 1; res.textContent = ''; } lock = false; }, 1100);
  }));
}

function initTeam() {
  const slider = $('#teamSlider'), modal = $('#profileModal'); let opener = null;
  const open = i => { const m = TEAM[i]; $('#modalName').textContent = m.name; $('#modalRole').textContent = m.role; $('#modalDesc').textContent = m.desc; $('#modalLinkedin').href = m.linkedin || '#';
    modal.hidden = false; if (lenis) lenis.stop(); $('#closeModal').focus(); };
  const close = () => { modal.hidden = true; if (lenis) lenis.start(); if (opener) opener.focus(); };
  slider.addEventListener('click', e => { const c = e.target.closest('.team-card[data-i]'); if (c && !slider.dataset.moved) { opener = c; open(+c.dataset.i); } });
  $('#closeModal').addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target.classList.contains('modal-overlay')) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) close(); });
  let down = false, sx = 0, sl = 0;
  slider.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = slider.scrollLeft; slider.dataset.moved = ''; });
  window.addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 5) { slider.classList.add('drag'); slider.dataset.moved = '1'; } slider.scrollLeft = sl - dx; });
  window.addEventListener('pointerup', () => { if (!down) return; down = false; slider.classList.remove('drag'); setTimeout(() => { slider.dataset.moved = ''; }, 0); });
  const step = d => slider.scrollBy({ left: d * 320, behavior: 'smooth' });
  $('#teamPrev').addEventListener('click', () => step(-1)); $('#teamNext').addEventListener('click', () => step(1));
}

/* forms: posts to your endpoint, or opens the visitor's email app addressed to CONFIG.email */
async function sendForm(endpoint, data, subject, statusEl, okMsg) {
  statusEl.textContent = 'Sending...';
  try {
    if (endpoint) {
      const r = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) });
      if (!r.ok) throw new Error('bad status'); statusEl.textContent = okMsg; return true;
    }
    const body = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join('\n');
    window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    statusEl.textContent = 'Opening your email app to send this message...'; return true;
  } catch (e) { statusEl.textContent = 'Sorry, that did not send. Please try again or email us directly.'; return false; }
}
function initForms() {
  const cf = $('#contactForm'), cs = $('#formStatus');
  cf.addEventListener('submit', async e => { e.preventDefault();
    if (!cf.checkValidity()) { cs.textContent = 'Please fill in your name, a valid email and a message.'; return; }
    const ok = await sendForm(CONFIG.contactEndpoint, { name: $('#cName').value, email: $('#cEmail').value, message: $('#cMessage').value }, 'YMIRA website message', cs, 'Thank you. Your message has been sent.'); if (ok) cf.reset(); });
  const nf = $('#newsForm'), ns = $('#newsStatus');
  nf.addEventListener('submit', async e => { e.preventDefault(); const em = $('#newsEmail');
    if (!em.checkValidity() || !em.value) { ns.textContent = 'Please enter a valid email address.'; return; }
    const ok = await sendForm(CONFIG.newsletterEndpoint, { email: em.value }, 'YMIRA newsletter signup', ns, 'You are subscribed. Welcome to YMIRA!');
    if (ok) { em.value = ''; burst(); } });
  function burst() { if (!hasGSAP || reduce) return; const box = $('#confetti'), cols = ['#FFFFFF', '#D9D9D4', '#8C8C86', '#FFFFFF', '#0A0A0B'];
    for (let i = 0; i < 36; i++) { const d = document.createElement('i'); d.style.background = cols[i % cols.length]; d.style.left = '34%'; d.style.top = '60%'; box.appendChild(d);
      gsap.to(d, { x: (Math.random() - 0.3) * 520, y: -Math.random() * 300 - 40, rotation: Math.random() * 540, opacity: 0, duration: 1.3 + Math.random() * 0.8, ease: 'power3.out', onComplete: () => d.remove() }); } }
}

/* =====================================================================
   Boot
   ===================================================================== */
function boot() {
  buildContent();
  $$('.split').forEach(splitWords); splitWords($('#heroTitle'));

  if (hasLenis && !reduce) {
    lenis = new Lenis({ duration: 1.15, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    if (window.ScrollTrigger) lenis.on('scroll', ScrollTrigger.update);
  }
  initHeader(); initMotion(); initCursor(); initMagnetic(); initTilt(); initChat(); initGame(); initTeam(); initForms();

  const gl = initGL();
  if (hasGSAP) { gsap.ticker.lagSmoothing(0); gsap.ticker.add(t => { if (lenis) lenis.raf(t * 1000); if (gl) gl.frame(t); }); }
  else if (gl) { const loop = t => { gl.frame(t / 1000); requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
  if (!gl) root.classList.add('no-webgl');

  /* preloader, then hero entrance */
  const loader = $('#loader'), num = $('#loaderNum'), bar = $('#loaderBar');
  const ready = Promise.race([Promise.all([document.fonts ? document.fonts.ready : 0, new Promise(r => { const i = new Image(); i.onload = i.onerror = r; i.src = 'assets/logo.png'; })]), new Promise(r => setTimeout(r, 4500))]);
  if (lenis) lenis.stop();
  const heroIn = () => {
    if (gl) gl.intro();
    if (hasGSAP) { const ws = $$('#heroTitle .w>span'); gsap.set(ws, { yPercent: 115 });
      gsap.timeline({ defaults: { ease: 'power4.out' } }).to(ws, { yPercent: 0, duration: 1.2, stagger: 0.08 }, 0.15)
        .to('.rise', { opacity: 1, y: 0, duration: 1, stagger: 0.12 }, 0.45);
    } else { $$('.rise,.reveal').forEach(e => { e.style.opacity = 1; e.style.transform = 'none'; }); }
  };
  if (!hasGSAP) { ready.then(() => setTimeout(() => { loader.style.display = 'none'; if (lenis) lenis.start(); heroIn(); }, 600)); return; }
  const o = { v: 0 }; const tl = gsap.timeline();
  tl.to(o, { v: 88, duration: 1.4, ease: 'power2.out', onUpdate: () => { num.textContent = Math.round(o.v); bar.style.width = o.v + '%'; } });
  ready.then(() => { tl.to(o, { v: 100, duration: 0.4, ease: 'power1.out', onUpdate: () => { num.textContent = Math.round(o.v); bar.style.width = o.v + '%'; } })
    .to('.loader-inner', { y: -30, opacity: 0, duration: 0.5, ease: 'power2.in' })
    .to(loader, { yPercent: -100, duration: 1, ease: 'power4.inOut', onStart: () => { root.classList.add('is-ready'); if (lenis) lenis.start(); heroIn(); }, onComplete: () => { loader.style.display = 'none'; } }, '-=0.1'); });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
