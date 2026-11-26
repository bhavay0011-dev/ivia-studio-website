/* =====================================================================
   ivia studio: motion + interactions (shared by every page)
   three r128 sky, gsap 3.12 + ScrollTrigger, lenis.
   Every library is optional; the page stays usable without them.
   ===================================================================== */
(function () {
'use strict';
window.__ivia = 1;

/* ---- Edit these once and every page updates ---- */
const CONFIG = { email: 'connect@bidvista.org', whatsapp: '918607070505', place: 'India' };

const touch = matchMedia('(hover: none)').matches;
const small = innerWidth < 760;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const sleep = ms => new Promise(r => setTimeout(r, ms));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const page = document.body.dataset.page || 'home';
const mouse = { x: innerWidth / 2, y: innerHeight / 2, nx: 0, ny: 0 };
addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.nx = e.clientX / innerWidth * 2 - 1; mouse.ny = -(e.clientY / innerHeight * 2 - 1); }, { passive: true });

/* =====================================================================
   ICONS
   ===================================================================== */
const I = {
  arrow: '<path d="M7 17 17 7M8 7h9v9"/>', code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  layout: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
  server: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20"/>',
  cloud: '<path d="M17.5 19H7a5 5 0 1 1 1-9.9A6 6 0 0 1 19.5 11a4 4 0 0 1-2 8z"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-2.4z"/>',
  spark: '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L3 21l1.9-6.4A8 8 0 1 1 21 12z"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/>',
  doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  users: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M16 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6.3"/>',
  cart: '<circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 12.4a1 1 0 0 0 1 .8h9.6a1 1 0 0 0 1-.8L21 7H6"/>',
  star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9z"/>',
  pin: '<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  cal: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 10h18M8 2v4M16 2v4"/>',
  bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8.5-8 9.5C7.5 20.5 4 17 4 12V6z"/><path d="m9 12 2 2 4-4"/>',
  send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
  lang: '<path d="M4 5h8M8 3v2M6 5c0 4 3 7 6 8M10 5c0 3-3 7-6 9M13 21l4-10 4 10M14.5 18h5"/>',
  photo: '<rect x="3" y="6" width="18" height="14" rx="2"/><circle cx="12" cy="13" r="3.5"/><path d="M8 6l1.5-2h5L16 6"/>',
  mega: '<path d="M3 11v2a1 1 0 0 0 1 1h3l6 5V5L7 10H4a1 1 0 0 0-1 1zM17 8a5 5 0 0 1 0 8"/>',
  ast: '<path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9 4.9 19.1"/>',
  refresh: '<path d="M21 12a9 9 0 0 1-15.5 6.2M3 12A9 9 0 0 1 18.5 5.8M21 3v6h-6M3 21v-6h6"/>'
};
const svg = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n] || ''}</svg>`;

/* =====================================================================
   SHARED CHROME: sky canvas, loader, tiles, cursor, nav, menu, footer
   ===================================================================== */
const LINKS = [['./', 'Home', 'home'], ['work', 'Our Work', 'work'], ['build', 'Websites & Apps', 'build'], ['ai', 'AI', 'ai'], ['whatsapp', 'WhatsApp Bots', 'whatsapp'], ['growth', 'Google Growth', 'growth'], ['contact', 'Contact', 'contact'], ['locations', 'Locations', 'locations'], ['blog', 'Blog', 'blog']];
const waHref = txt => { const d = CONFIG.whatsapp.replace(/\D/g, ''); return `https://wa.me/${d.length > 7 ? d : ''}?text=${encodeURIComponent(txt || 'Hi Ivia Studio, I want to talk about a project.')}`; };
let seen = false; try { seen = sessionStorage.getItem('ivst_seen') === '1'; sessionStorage.setItem('ivst_seen', '1'); } catch (e) {}
const useLoader = page === 'home' && !seen && !reduce;
const LOGO = '<img class="bone" src="assets/logo.png" alt="ivia" width="58" height="36"><img class="ink" src="assets/logo-ink.png" alt="" aria-hidden="true" width="58" height="36"><small>studio</small>';
document.body.insertAdjacentHTML('afterbegin', `
<div class="skyfb" aria-hidden="true"></div><div class="grain" aria-hidden="true"></div>
${useLoader ? '<div id="loader" aria-hidden="true"><div class="lc"><img src="assets/logo.png" alt=""><div class="bar">' + '<i></i>'.repeat(12) + '</div><div class="num">000</div></div></div>' : ''}
<div id="tiles" aria-hidden="true"><i></i></div>
<div id="cur" aria-hidden="true"></div><div id="ring" aria-hidden="true"><span></span></div><div id="prog" aria-hidden="true"></div>
<header class="nav">
  <a class="logo" href="./" aria-label="Ivia Studio home" data-label="ivia studio">${LOGO}</a>
  <nav aria-label="Main"><ul>${LINKS.slice(1, 6).map(([h, t, k]) => `<li><a href="${h}" class="${k === page ? 'on' : ''}">${t}</a></li>`).join('')}<li><a class="sister" href="https://www.iviasolutions.in/" target="_blank" rel="noopener"><i class="sd" aria-hidden="true"></i>Marketing<b aria-hidden="true">&#8599;</b></a></li></ul></nav>
  <div class="nav-r"><a class="nav-cta" href="contact">Start a project</a>
  <a class="sister-m" href="https://www.iviasolutions.in/" target="_blank" rel="noopener"><i class="sd" aria-hidden="true"></i>Marketing</a>
  <button class="menu-btn" id="menuBtn" aria-label="Open menu" aria-expanded="false"><span class="mlbl">Menu</span><span class="bars"><b></b><b></b></span></button></div>
</header>
<div id="overlay" aria-hidden="true"><ul>${LINKS.map(([h, t, k]) => `<li><a class="big ${k === page ? 'on' : ''}" href="${h}"><span class="t">${t}</span></a></li>`).join('')}<li><a class="big sister" href="https://www.iviasolutions.in/" target="_blank" rel="noopener"><span class="t">Marketing</span><sup>&#8599;</sup></a></li></ul>
<div class="ov-foot"><span>${esc(CONFIG.email)}</span><a href="${waHref()}" target="_blank" rel="noopener">WhatsApp ↗</a><span>${esc(CONFIG.place)}</span></div></div>`);
const foot = $('footer');
if (foot) foot.innerHTML = `<div class="wrap">
<div class="fcols"><div><a class="logo" href="./">${LOGO}</a>
<p class="muted" style="margin-top:18px;max-width:36ch">100+ websites and apps built from scratch, AI that works for you, WhatsApp bots that answer for you, and Google visibility that brings customers in.</p></div>
<div><h4>Build</h4><a href="work">Our Work</a><a href="build">Websites & Apps</a><a href="build#stores">Shopify & WooCommerce</a><a href="build#scope">Hosting & Domain</a></div>
<div><h4>Automate & Grow</h4><a href="ai">AI Integrations</a><a href="whatsapp">WhatsApp Bots</a><a href="growth">Google Business & Ads</a><a href="https://www.iviasolutions.in/" target="_blank" rel="noopener">Marketing &#8599;</a></div>
<div><h4>Talk to us</h4><a href="contact">Project form</a><a href="blog">Blog</a><a href="locations">Locations</a><a href="${waHref()}" target="_blank" rel="noopener">WhatsApp ↗</a><span class="muted" style="display:block;padding:5px 0">${esc(CONFIG.email)}</span></div></div>
<div class="floc"><span>We build websites for</span> <a href="website-development-mumbai">Mumbai</a> · <a href="website-development-delhi">Delhi NCR</a> · <a href="website-development-bangalore">Bengaluru</a> · <a href="website-development-pune">Pune</a> · <a href="website-development-hyderabad">Hyderabad</a> · <a href="website-development-chennai">Chennai</a> · <a href="website-development-kolkata">Kolkata</a> · <a href="website-development-ahmedabad">Ahmedabad</a> · <a href="website-development-jaipur">Jaipur</a> · <a href="website-development-chandigarh">Chandigarh</a> · <a href="website-development-usa">USA</a> · <a href="website-development-uk">UK</a> · <a href="website-development-uae">UAE</a> · <a href="website-development-australia">Australia</a> · <a href="website-development-canada">Canada</a> · <a href="website-development-singapore">Singapore</a></div>
<div class="bigword" aria-hidden="true">${'ivia studio'.split('').map((c, i) => `<span${i > 4 ? ' class="grad"' : ''}>${c === ' ' ? '&nbsp;' : c}</span>`).join('')}</div>
<div class="fbot"><span>© ${new Date().getFullYear()} Ivia Studio · ${esc(CONFIG.place)}</span><span>A sister studio of ivia solutions.</span></div></div>`;
$$('[data-ic]').forEach(e => e.innerHTML = svg(e.dataset.ic));
$$('[data-wa]').forEach(a => a.href = waHref(a.dataset.wa));
$$('[data-email]').forEach(e => e.textContent = CONFIG.email);


/* buttons: rolling label + directional fill (ivia solutions style) */
$$('.btn').forEach(b => {
  if ($('.lbl', b)) return;
  const t = b.textContent.replace(/\s+/g, ' ').trim() + (b.classList.contains('noarrow') ? '' : (b.getAttribute('href') || '').startsWith('#') ? ' ↓' : ' ↗');
  b.innerHTML = '';
  const fill = document.createElement('span'); fill.className = 'fill';
  const lbl = document.createElement('span'); lbl.className = 'lbl';
  const s1 = document.createElement('span'); s1.textContent = t; const s2 = document.createElement('span'); s2.textContent = t; s2.setAttribute('aria-hidden', 'true');
  lbl.append(s1, s2); b.append(fill, lbl); b.classList.add('mag');
  if (!b.dataset.cursor) b.dataset.cursor = b.classList.contains('solid') ? 'Go' : 'Open';
});
$$('.blob-btn').forEach(b => b.classList.add('mag'));

/* =====================================================================
   3D SKY: clouds, day → dusk → night, and the puffy 3D ivia logo
   ===================================================================== */
/* =====================================================================
   SCREENING ROOM: dark room, projector beam, wooden floor and floating
   screens of our work. Home: the camera dollies through them as you scroll.
   ===================================================================== */
const sky = { hp: 0, ok: true };
const room = { hp: 0, el: null, tvs: [] };
function initRoom() {
  const home = !!$('.skyhero'), host = home ? $('.skyhero-pin') : $('.hero');
  if (!host) return;
  /* x%, y%, width vw, depth px, y-rotation */
  const POS = home
    ? [[54, 8, 20, 520, -12], [78, 4, 21, 460, -24], [58, 50, 16, 300, -10], [80, 52, 17, 260, -20], [40, -6, 12, 780, 6], [66, 28, 12, 840, -12], [92, 30, 12, 720, -30], [46, 72, 11, 140, 4], [-8, -4, 13, 900, 26], [-8, 70, 12, 880, 26]]
    : [[62, 6, 18, 420, -14], [82, 30, 20, 380, -24], [70, 62, 14, 220, -16], [-8, 4, 13, 760, 24], [40, -6, 11, 700, 6], [92, -2, 11, 680, -28]];
  room.el = document.createElement('div'); room.el.className = 'room'; room.el.setAttribute('aria-hidden', 'true');
  room.el.innerHTML = `<div class="wall"></div><div class="beam"></div><div class="floor"></div><div class="screens">${POS.map((p, i) =>
    `<div class="tv-p" style="--x:${p[0]}%;--y:${p[1]}%;--w:${p[2]}vw;--d:${(p[3] / 900).toFixed(2)};--z:${-p[3]}px"><div class="tv flick" style="--ry:${p[4]}deg;--fd2:${(i * 1.7).toFixed(1)}s">${mockHTML(WORK[(i * 5) % WORK.length], true)}</div></div>`).join('')}</div><div class="dust"></div><div class="vig"></div>`;
  host.prepend(room.el);
  room.tvs = $$('.tv-p', room.el).map((el, i) => ({ el, z: -POS[i][3] }));
  if (reduce) return;
  let sx = 0, sy = 0;
  (function loop() {
    requestAnimationFrame(loop);
    const r = host.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return;
    sx += (mouse.nx - sx) * .06; sy += (mouse.ny - sy) * .06;
    room.el.style.setProperty('--mx', sx.toFixed(3)); room.el.style.setProperty('--my', (-sy).toFixed(3));
    room.el.style.setProperty('--lx', (50 + sx * 30).toFixed(1) + '%'); room.el.style.setProperty('--ly', (40 - sy * 20).toFixed(1) + '%');
    /* home: dolly the camera forward through the screens; inner pages: a gentle push as you leave */
    const push = home ? room.hp * 1500 : clamp(scrollY / innerHeight, 0, 1) * 420;
    for (const t of room.tvs) {
      const z = t.z + push, o = clamp((1000 - z) / 380, 0, 1);
      t.el.style.transform = `translateZ(${z.toFixed(1)}px)`; t.el.style.opacity = o.toFixed(3);
      t.el.style.visibility = o < .01 ? 'hidden' : '';
    }
    if (home) { room.el.style.setProperty('--hp', room.hp.toFixed(3)); }
  })();
}

/* =====================================================================
   WORK: illustrative project previews (swap with real screenshots)
   ===================================================================== */
const MS = id => `assets/work/${id}.webp`;
/* Real sites from the MotionSites library: the motion-first style we build in */
const WORK = [
  { n: 'Orvante', c: 'Agency website', k: 'web', img: MS('hf_20261027_053930_87ab1421-7fc4-4597-a7ae-7039d2527f8b') },
  { n: 'Aperture Row', c: 'Camera store · Shopify', k: 'shop', img: MS('hf_20261123_104457_c0ea8833-256a-4b48-a20c-e9f4ae620faf') },
  { n: 'Penthouse Rain', c: 'Real-estate website', k: 'web', img: MS('hf_20261117_065919_b459fd24-ef98-4ef4-b6cd-68f1bfe1b10c') },
  { n: 'Data Signal', c: 'Analytics dashboard', k: 'dash', img: MS('hf_20260812_015959_62ae1d8c-21a0-4691-b0ca-9ec991f2fe34') },
  { n: 'Tea Blends', c: 'Tea store · Shopify', k: 'shop', img: MS('hf_20261124_054357_3e9e9293-9e9e-4b07-83df-e9cb118f6144') },
  { n: 'Travel Booking', c: 'Booking website', k: 'web', img: MS('hf_20261115_013620_005ba2d3-1ec9-451d-89df-8f6c8b8793fc') },
  { n: 'Reelmark', c: 'Creator web app', k: 'app', img: MS('hf_20261021_033850_f6a98168-2aa6-47b5-8fa8-6d28a9992580') },
  { n: 'Ice Monastery', c: 'Restaurant website', k: 'web', img: MS('hf_20261124_064446_b13290af-c72f-4370-a073-9df089145e9f') },
  { n: 'Style Studio', c: 'Fashion store · WooCommerce', k: 'shop', img: MS('hf_20261112_042122_cf936edb-b3fe-4c16-9376-65d04123b24e') },
  { n: 'Moss Island', c: 'SaaS product site', k: 'dash', img: MS('hf_20261106_032528_99eb9a00-a553-40b6-8b97-017e918971c6') },
  { n: 'Laptop Portfolio', c: 'Portfolio website', k: 'web', img: MS('hf_20261111_030305_aa366bc0-85e3-4f61-82c1-cbf8ae8217a3') },
  { n: 'Virtual Fitting', c: 'Try-on web app', k: 'app', img: MS('hf_20261105_044353_68703b49-82fd-480a-9809-3a3747e1fe7b') },
  { n: 'Protein Bars', c: 'Snack brand · Shopify', k: 'shop', img: MS('hf_20261116_165100_f97e5fa9-4f9f-418c-96aa-c5eb4869baa7') },
  { n: 'Quantum Core', c: 'Data platform', k: 'dash', img: MS('hf_20260815_191439_307f1c76-0696-4003-9186-fdd50bb30540') },
  { n: 'Coastal Cards', c: 'Agency website', k: 'web', img: MS('hf_20261118_070300_fbfb5672-a668-45a4-83b7-f52c95bb1320') },
  { n: 'Print Gallery', c: 'Art store · WooCommerce', k: 'shop', img: MS('hf_20261120_092118_e87bf2ac-38dd-413e-a9ed-17ba8a940916') },
  { n: 'Ledgely', c: 'Finance web app', k: 'app', img: MS('hf_20261023_010253_d1856960-d74b-42d4-9293-d710fa60e097') },
  { n: 'Runway Store', c: 'Fashion store · Shopify', k: 'shop', img: MS('hf_20261122_150938_719887ec-965b-4722-be5a-56ed29b8c30f') },
  { n: 'Job Board', c: 'Hiring dashboard', k: 'dash', img: MS('hf_20261115_061409_62da665a-6f17-4293-83a6-d343bdb815e1') },
  { n: 'Book Library', c: 'Online library website', k: 'web', img: MS('hf_20261121_035428_eb9aa86f-7f80-4f16-a4f8-f8f0703e805f') },
  { n: 'Lamp Shop', c: 'Lighting store · WooCommerce', k: 'shop', img: MS('hf_20261123_074649_7aa33c0f-ce09-4211-9ef3-1b2131434bc6') },
  { n: 'Fitness Tracker', c: 'Health web app', k: 'app', img: MS('hf_20260730_090700_2609c7d2-29a8-4880-9e59-84ebcb657b04') },
  { n: 'Vertex', c: 'Product store · Shopify', k: 'shop', img: MS('hf_20260912_163540_9f0f8a66-ec5f-46f7-adf8-e094a211d489') },
  { n: 'Peakline', c: 'SaaS dashboard', k: 'dash', img: MS('hf_20260827_183912_a5d791ed-2b71-4a25-9c82-61f432a27a53') },
  { n: 'Performance Run', c: 'Fitness brand website', k: 'web', img: MS('hf_20260807_011509_e042d124-2ef5-49fb-89e9-e2d7a8b1eb21') },
  { n: 'Workwear Co.', c: 'Workwear store · WooCommerce', k: 'shop', img: MS('hf_20261122_134817_4e1bfd8e-9e0d-44ce-be29-fce28633dee6') },
  { n: 'Label Workspace', c: 'Team workspace app', k: 'app', img: MS('hf_20261115_072503_5ee28ad5-58c0-4177-9d65-5df7825c1ea3') },
  { n: 'Clothing Rail', c: 'Apparel store · Shopify', k: 'shop', img: MS('hf_20261108_064619_5aab2bf3-3e14-41b3-9421-250f3c9eac47') },
  { n: 'Book Shelf', c: 'Publisher website', k: 'web', img: MS('hf_20261113_001238_d350986c-e035-432b-8a9f-abf9c6fc8bae') },
  { n: 'Eyewear Store', c: 'Eyewear store · WooCommerce', k: 'shop', img: MS('hf_20261117_061153_62099a93-6540-4a13-9818-4ec34e953040') },
  { n: 'Loops', c: '3D product store · Shopify', k: 'shop', img: MS('hf_20261024_010948_048422f0-152e-4f66-8f6e-88dd6aca7d9d') },
  { n: 'Smarter Growth', c: 'Marketing landing page', k: 'web', img: MS('hf_20261023_005013_f6d14b11-c6c1-4214-be5f-c8181fff9669') },
  { n: 'Spin', c: 'Product launch store · Shopify', k: 'shop', img: MS('hf_20261107_113531_66f5b631-47f4-45da-8094-29dc04544d61') },
  { n: 'Showroom', c: '3D showroom · Shopify', k: 'shop', img: MS('hf_20261114_015033_70380c67-4a70-464a-9b20-c3e15c39bdee') }
];
function mockHTML(w, eager) {
  return `<img class="shot" src="${w.img}" alt="${esc(w.n)}, ${esc(w.c)}" decoding="async">`;
}
function initWork() {
  /* 3D ring on the home page */
  const stage = $('.ring-stage');
  if (stage) {
    const ring = $('.ring', stage), RING = WORK.slice(0, 16), N = RING.length;
    ring.innerHTML = RING.map((w, i) => `<div class="ring-item" data-i="${i}"><div class="wcard" data-cursor="Drag">${mockHTML(w)}</div><div class="wcap"><b>${esc(w.n)}</b><span>${esc(w.c)}</span></div></div>`).join('');
    const items = $$('.ring-item', ring);
    let R = 0, cw = 0;
    const lay = () => {
      cw = $('.wcard', ring).offsetWidth; const ch = $('.wcard', ring).offsetHeight;
      R = Math.round(cw / (2 * Math.tan(Math.PI / N)) * 1.12);
      items.forEach((it, i) => { it.style.transform = `rotateY(${i * 360 / N}deg) translateZ(${R}px) translate(${-cw / 2}px,${-ch / 2}px)`; });
      stage.style.perspective = Math.max(1400, R * 2.6) + 'px';
    };
    lay(); addEventListener('resize', lay);
    let ang = 0, vel = .12, drag = false, lx = 0, inView = true;
    whenVisible(stage, () => inView = true, () => inView = false);
    stage.addEventListener('pointerdown', e => { drag = true; lx = e.clientX; stage.setPointerCapture(e.pointerId); });
    stage.addEventListener('pointermove', e => { if (!drag) return; const dx = e.clientX - lx; lx = e.clientX; vel = dx * .18; ang += dx * .18; });
    const up = () => { drag = false; }; stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', up);
    stage.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') vel -= 3; if (e.key === 'ArrowRight') vel += 3; });
    (function spin() {
      requestAnimationFrame(spin); if (!inView || reduce) return;
      if (!drag) { vel += ((scrollVelRef() * .004 + .12) - vel) * .03; ang += vel; }
      ring.style.transform = `translateZ(${-R}px) rotateX(-6deg) rotateY(${ang}deg)`;
      items.forEach((it, i) => { const a = ((i * 360 / N + ang) % 360 + 360) % 360, f = Math.cos(a * Math.PI / 180); it.style.visibility = f < -.05 ? 'hidden' : 'visible'; it.style.opacity = clamp(f * 1.6, 0, 1).toFixed(2); });
    })();
    if (reduce) { ring.style.transform = `translateZ(${-R}px) rotateX(-6deg)`; items.forEach((it, i) => { const f = Math.cos(i * 2 * Math.PI / N); it.style.visibility = f < -.05 ? 'hidden' : 'visible'; it.style.opacity = clamp(f * 1.6, 0, 1); }); }
  }
  /* grid + filters on the work page */
  const grid = $('.wgrid');
  if (grid) {
    grid.innerHTML = WORK.map(w => `<article class="witem" data-k="${w.k}" data-reveal><div class="frame" data-cursor="View">${mockHTML(w)}</div><div class="wcap"><b>${esc(w.n)}</b><span>${esc(w.c)}</span></div></article>`).join('');
    $$('.wfilter button').forEach(b => b.addEventListener('click', () => {
      $$('.wfilter button').forEach(x => x.setAttribute('aria-pressed', x === b)); const k = b.dataset.k;
      $$('.witem', grid).forEach(it => it.classList.toggle('hide', k !== 'all' && it.dataset.k !== k));
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }));
    $$('.witem .frame', grid).forEach(f => {
      f.addEventListener('pointermove', e => { const r = f.getBoundingClientRect(); f.style.transform = `perspective(900px) rotateX(${(e.clientY - r.top) / r.height * -10 + 5}deg) rotateY(${(e.clientX - r.left) / r.width * 12 - 6}deg) scale(1.02)`; });
      f.addEventListener('pointerleave', () => { f.style.transform = ''; });
      f.style.transition = 'transform .5s cubic-bezier(.19,1,.22,1)';
    });
  }
}
let scrollVel = 0; const scrollVelRef = () => scrollVel;


/* =====================================================================
   HELPERS
   ===================================================================== */
function splitChars(el) {
  const out = [];
  const walk = node => [...node.childNodes].forEach(c => {
    if (c.nodeType === 3) {
      const frag = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(w => {
        if (!w) return;
        if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(' ')); return; }
        const wd = document.createElement('span'); wd.className = 'wd';
        [...w].forEach(ch => { const s = document.createElement('span'); s.className = 'char'; s.textContent = ch; wd.appendChild(s); out.push(s); });
        frag.appendChild(wd);
      });
      c.replaceWith(frag);
    } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
  });
  if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
  walk(el); out.forEach(s => s.setAttribute('aria-hidden', 'true')); return out;
}
function splitWords(el) {
  let i = 0; el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
  const walk = n => [...n.childNodes].forEach(c => {
    if (c.nodeType === 3) {
      const f = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach(p => { if (!p) return; if (/^\s+$/.test(p)) { f.appendChild(document.createTextNode(' ')); return; }
        const w = document.createElement('span'); w.className = 'sw'; w.setAttribute('aria-hidden', 'true'); const s = document.createElement('span'); s.textContent = p; s.style.setProperty('--i', i++); w.appendChild(s); f.appendChild(w); });
      c.replaceWith(f);
    } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
  });
  walk(el); el.style.setProperty('--n', i);
}
const SCR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789%₹×#';
function scramble(el, final, dur = 600) {
  if (!el) return; final = final ?? el.dataset.final ?? el.textContent; el.dataset.final = final;
  const start = performance.now();
  (function f(n) { const p = Math.min((n - start) / dur, 1); let s = ''; for (let i = 0; i < final.length; i++) s += (i < p * final.length || final[i] === ' ') ? final[i] : SCR[Math.floor(Math.random() * SCR.length)]; el.textContent = s; if (p < 1) requestAnimationFrame(f); })(start);
}
function countTo(el) {
  const to = +el.dataset.count, suf = el.dataset.suf || '';
  if (typeof gsap === 'undefined') { el.textContent = to + suf; return; }
  const o = { v: 0 }; gsap.to(o, { v: to, duration: 1.6, ease: 'expo.out', onUpdate: () => el.textContent = Math.round(o.v) + suf });
}
const whenVisible = (el, on, off) => new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? on() : off && off()), { threshold: .2 }).observe(el);

/* =====================================================================
   LIVE DEMOS (work with or without GSAP)
   ===================================================================== */
function initDemos() {
  /* code typing with highlight */
  const hl = src => {
    const re = /(\/\/[^\n]*|#[^\n]*|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`[^`]*`)|\b(const|let|await|async|return|import|from|export|default|function|if|else|new|for|of|true|false|null|run|on|uses|with)\b|\b(\d+(?:\.\d+)?)\b|(✓[^\n]*)|([A-Za-z_$][\w$]*)(?=\()/g;
    let out = '', last = 0, mm;
    while ((mm = re.exec(src))) { out += esc(src.slice(last, mm.index)); const [tok, s, k, n, ok] = mm; const cls = s ? (s[0] === '/' || s[0] === '#' ? 'c' : 's') : k ? 'k' : n ? 'n' : ok ? 'ok' : 'f'; out += `<span class="${cls}">${esc(tok)}</span>`; last = mm.index + tok.length; }
    return out + esc(src.slice(last));
  };
  async function typeCode(pre, src, token) {
    const term = pre.dataset.type === 'term';
    if (reduce) { pre.innerHTML = hl(src); return; }
    let shown = '';
    for (const line of src.split('\n')) {
      if (pre._tok !== token) return;
      if (!term || line.startsWith('$')) {
        for (let i = 0; i < line.length; i += term ? 1 : 3) { if (pre._tok !== token) return; pre.innerHTML = hl(shown + line.slice(0, i + 1)) + '<span class="caret"></span>'; await sleep(term ? 38 : 14); }
      } else await sleep(260);
      shown += line + '\n'; pre.innerHTML = hl(shown) + '<span class="caret"></span>';
      await sleep(term && line.startsWith('$') ? 420 : 30);
    }
  }
  $$('[data-code-box]').forEach(box => {
    const pre = $('pre.code', box), srcs = {};
    $$('script[data-code]', box).forEach(s => srcs[s.dataset.code] = s.textContent.replace(/^\n/, '').replace(/\s+$/, '').split('<\\/').join('</'));
    const tabs = $$('.tabs button', box); let started = false;
    const play = name => { pre._tok = Symbol(); tabs.forEach(b => b.classList.toggle('on', b.dataset.tab === name)); typeCode(pre, srcs[name], pre._tok); };
    tabs.forEach(b => b.addEventListener('click', () => play(b.dataset.tab)));
    whenVisible(box, () => { if (!started) { started = true; play(Object.keys(srcs)[0]); } });
  });
  /* live chat / WhatsApp demo */
  $$('[data-chat]').forEach(box => {
    const body = $('.chat-body', box), input = $('.chat-in span,.wa-in span', box);
    const script = JSON.parse($('script[type="application/json"]', box).textContent);
    const ph = input ? input.textContent : ''; let vis = false, running = false;
    const add = m => {
      const d = document.createElement('div'); d.className = 'msg ' + m.r; d.textContent = m.t;
      if (m.src) { const s = document.createElement('span'); s.className = 'src'; s.textContent = m.src; d.appendChild(s); }
      if (m.btns) { const b = document.createElement('div'); b.className = 'btns'; m.btns.forEach(x => { const s = document.createElement('span'); s.textContent = x; b.appendChild(s); }); d.appendChild(b); }
      body.appendChild(d); while (body.children.length > 6) body.firstElementChild.remove();
    };
    const run = async () => {
      if (running) return; running = true;
      while (vis) {
        body.innerHTML = '';
        for (const m of script) {
          if (!vis) break;
          if (m.r === 'u' && input) { for (let i = 1; i <= m.t.length; i++) { input.textContent = m.t.slice(0, i); await sleep(reduce ? 0 : 26); } await sleep(250); input.textContent = ph; }
          else if (m.r === 'b') { const d = document.createElement('div'); d.className = 'msg b dots'; d.innerHTML = '<i></i><i></i><i></i>'; body.appendChild(d); await sleep(reduce ? 0 : 900 + Math.min(1400, m.t.length * 12)); d.remove(); }
          add(m); await sleep(reduce ? 300 : 900);
        }
        await sleep(4200);
      }
      running = false;
    };
    whenVisible(box, () => { vis = true; run(); }, () => { vis = false; });
  });
  /* browser build mockup */
  $$('.browser[data-build]').forEach(b => {
    const st = $('.st span', b), url = $('.url .u', b), steps = ['Wireframing', 'Designing', 'Building', 'Live']; let k = 0, timer;
    const tick = () => { k = (k + 1) % 4; for (let j = 1; j <= 4; j++) b.classList.toggle('s' + j, j <= k + 1); st.textContent = steps[k]; url.textContent = k === 3 ? 'https://yourbrand.in' : 'localhost:3000'; };
    whenVisible(b, () => { clearInterval(timer); timer = setInterval(tick, 1700); }, () => clearInterval(timer));
  });
  /* Google map pack climb */
  $$('.biz-l').forEach(list => {
    let vis = false, running = false;
    const flip = mutate => { const items = $$('.biz', list), first = new Map(items.map(i => [i, i.getBoundingClientRect().top])); mutate(); items.forEach(i => { const d = first.get(i) - i.getBoundingClientRect().top; if (!d) return; i.style.transition = 'none'; i.style.transform = `translateY(${d}px)`; i.offsetHeight; i.style.transition = ''; i.style.transform = ''; }); };
    const renum = () => $$('.biz', list).forEach((b, i) => $('.n', b).textContent = i + 1);
    const run = async () => {
      if (running) return; running = true;
      while (vis) {
        const you = $('.biz.you', list); you.classList.remove('top'); flip(() => list.appendChild(you)); renum(); await sleep(1300);
        while (vis && you.previousElementSibling) { flip(() => list.insertBefore(you, you.previousElementSibling)); renum(); await sleep(reduce ? 200 : 760); }
        you.classList.add('top'); await sleep(3600);
      }
      running = false;
    };
    whenVisible(list, () => { vis = true; run(); }, () => { vis = false; });
  });
  /* search results */
  $$('.serp').forEach(s => {
    const q = $('.q', s), res = $$('.res', s), text = s.dataset.q; let vis = false, running = false;
    const run = async () => {
      if (running) return; running = true;
      while (vis) { res.forEach(r => r.classList.remove('show')); q.textContent = ''; for (let i = 1; i <= text.length; i++) { q.textContent = text.slice(0, i); await sleep(reduce ? 0 : 55); } await sleep(400); for (const r of res) { r.classList.add('show'); await sleep(320); } await sleep(4500); }
      running = false;
    };
    whenVisible(s, () => { vis = true; run(); }, () => { vis = false; });
  });
  /* contact form */
  const form = $('#brief');
  if (form) {
    $$('.chips button', form).forEach(b => b.addEventListener('click', () => b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true')));
    const pre = new URLSearchParams(location.search).get('s');
    if (pre) $$('.chips button', form).forEach(b => { if (b.dataset.k === pre) b.setAttribute('aria-pressed', 'true'); });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const v = id => $('#' + id, form).value.trim(), err = $('.err', form);
      if (!v('f-name') || !v('f-msg')) { err.textContent = 'Add your name and a line about the project.'; return; }
      err.textContent = '';
      const svc = $$('.chips button[aria-pressed=true]', form).map(b => b.textContent.trim());
      const txt = `Hi Ivia Studio,\n\nName: ${v('f-name')}\nBusiness: ${v('f-biz') || '-'}\nPhone / email: ${v('f-contact') || '-'}\nInterested in: ${svc.join(', ') || 'Not sure yet'}\nTimeline: ${v('f-time')}\n\n${v('f-msg')}`;
      const done = $('.done'); $('pre', done).textContent = txt; $('.wa-go', done).href = waHref(txt); $('.wa-go', done).dataset.track = 'brief_whatsapp';
      window.ivTrack && ivTrack('generate_lead', { method: 'project_brief', service: svc.join(', ') || undefined }); done.classList.add('show'); done.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    });
    const cp = $('.copy-brief');
    cp && cp.addEventListener('click', async () => { const l = $('.lbl span', cp) || cp; try { await navigator.clipboard.writeText($('.done pre').textContent); l.textContent = 'Copied'; } catch (e) { l.textContent = 'Select the text to copy'; } setTimeout(() => l.textContent = 'Copy message ↗', 2200); });
  }
}

/* =====================================================================
   CARD TUNNEL: a hexagonal corridor of cards you fly through
   ===================================================================== */
const tunnelState = { p: 0 };
function initTunnel() {
  const sec = $('.tunnel'); if (!sec) return;
  const world = $('.tunnel-world', sec), end = $('.tunnel-end', sec), copy = $('.tunnel-copy', sec);
  const items = [
    ['Build', 'layout', 'UX & interface', 'flows that convert'], ['AI', 'chat', 'AI assistant', 'answers from your content'],
    ['WhatsApp', 'send', 'WhatsApp bot', 'replies while you sleep'], ['Google', 'pin', 'Business Profile', 'climb the map pack'],
    ['Build', 'code', 'Frontend', 'fast on every phone'], ['AI', 'mic', 'Voice receptionist', 'picks up every call'],
    ['Infra', 'server', 'Backend & APIs', 'Node, Python, Postgres'], ['Google', 'search', 'Google Ads', 'the top spot, today'],
    ['WhatsApp', 'cal', 'Bookings', 'slots, reminders, sync'], ['Build', 'phone', 'iOS & Android', 'one codebase'],
    ['AI', 'target', 'Lead qualifier', 'straight into your CRM'], ['Infra', 'cloud', 'Hosting', 'fast, backed up, watched'],
    ['Google', 'star', 'Reviews engine', 'real reviews, faster'], ['Build', 'cart', 'E-commerce', 'UPI, cards, subscriptions'],
    ['WhatsApp', 'lang', 'Hinglish', 'talks like your customers'], ['Infra', 'globe', 'Domain & email', 'in your name'],
    ['AI', 'doc', 'Document reader', 'invoices into data'], ['Google', 'chart', 'Tracking', 'every call counted']
  ];
  const SIDES = 6, RINGS = small ? 7 : 9;
  const cards = [];
  for (let r = 0; r < RINGS; r++) for (let s = 0; s < SIDES; s++) {
    const idx = (r * 7 + s * 5) % items.length, [tag, ic, title, sub] = items[idx];
    const c = document.createElement('article'); c.className = 'tcard' + ((r * SIDES + s) % 7 === 3 ? ' o' : (r * SIDES + s) % 11 === 5 ? ' s' : '');
    const tin = document.createElement('div'); tin.className = 'tin';
    const tg = document.createElement('div'); tg.className = 'tg';
    const ib = document.createElement('span'); ib.className = 'ic'; ib.innerHTML = svg(ic);
    const tl = document.createElement('span'); tl.textContent = tag; tg.append(ib, tl);
    const bt = document.createElement('div'); const b = document.createElement('b'); b.textContent = title; const em = document.createElement('em'); em.textContent = sub; bt.append(b, em);
    tin.append(tg, bt); c.appendChild(tin); world.appendChild(c);
    cards.push({ el: c, tin, r, s, flip: null });
  }
  let R, apo, side, D, L;
  const layout = () => {
    R = Math.max(innerWidth * .5, innerHeight * .62); apo = R * Math.cos(Math.PI / 6); side = R; D = side * 1.15; L = RINGS * D;
    cards.forEach(c => { c.el.style.width = (side - 14) + 'px'; c.el.style.height = (D - 22) + 'px'; c.el.style.marginLeft = -(side - 14) / 2 + 'px'; c.el.style.marginTop = -(D - 22) / 2 + 'px'; });
  };
  layout(); addEventListener('resize', layout);
  if (reduce) return;
  let smx = 0, smy = 0;
  const NEAR = 420;
  const frame = () => {
    const rc = sec.getBoundingClientRect(), vh = innerHeight;
    if (rc.bottom > 0 && rc.top < vh) {
      const p = clamp(-rc.top / Math.max(1, rc.height - vh), 0, 1); tunnelState.p = p;
      const t = performance.now() / 1000, cam = p * L * 2.2 + t * 90, twist = p * 120 + t * 3;
      smx += (mouse.nx - smx) * .05; smy += (mouse.ny - smy) * .05;
      world.style.transform = `rotateY(${smx * 9}deg) rotateX(${smy * 7}deg) rotateZ(${smx * -4}deg)`;
      for (const c of cards) {
        const z = ((-c.r * D + cam) % L + L) % L - L + NEAR;
        const th = c.s * 60 + 30 + twist;
        const far = clamp((z + L - NEAR) / (D * 2.2), 0, 1), near = clamp((NEAR - z) / 260, 0, 1);
        c.el.style.opacity = (far * near).toFixed(3);
        c.el.style.transform = `translate3d(0,0,${z.toFixed(1)}px) rotateZ(${th.toFixed(2)}deg) translateY(${(-apo).toFixed(1)}px) rotateX(-90deg)`;
        const a = ((th % 360) + 360) % 360, flip = a > 90 && a < 270;
        if (flip !== c.flip) { c.flip = flip; c.tin.style.transform = flip ? 'rotate(180deg)' : ''; }
      }
      const out = p > .86; copy.style.opacity = out ? 0 : clamp(1 - Math.max(0, p - .7) * 6, 0, 1); end.classList.toggle('show', out);
      copy.style.transform = `scale(${1 + p * .25})`;
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

/* hero word rotator: words slide through a slot, out of a blur */
function initRotator() {
  $$('.rot').forEach(r => {
    const ws = $$(':scope > span', r); if (ws.length < 2) return;
    r.setAttribute('aria-label', ws.map(w => w.textContent).join(', ')); ws.forEach(w => w.setAttribute('aria-hidden', 'true'));
    let i = 0;
    const fit = () => { r.style.width = ws[i].offsetWidth + 'px'; };
    r.style.transition = 'width .6s cubic-bezier(.19,1,.22,1)'; fit(); addEventListener('resize', fit);
    if (reduce) return;
    setInterval(() => {
      const a = ws[i]; i = (i + 1) % ws.length; const b = ws[i];
      a.animate([{ transform: 'none', opacity: 1, filter: 'blur(0)' }, { transform: 'translateY(-100%)', opacity: 0, filter: 'blur(8px)' }], { duration: 650, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' });
      b.animate([{ transform: 'translateY(100%)', opacity: 0, filter: 'blur(8px)' }, { transform: 'none', opacity: 1, filter: 'blur(0)' }], { duration: 750, easing: 'cubic-bezier(.19,1,.22,1)', fill: 'forwards', delay: 120 });
      fit();
    }, 2300);
  });
}

/* =====================================================================
   PROGRESS-DRIVEN SECTIONS (stack, reel, timeline, scrub text)
   ===================================================================== */
function initProgress() {
  const hs = $('.hs'), track = hs && $('.hs-track', hs);
  const sizeHs = () => { if (!hs) return; hs.style.height = innerWidth > 900 ? (track.scrollWidth - innerWidth + innerHeight) + 'px' : ''; };
  addEventListener('resize', sizeHs); addEventListener('load', sizeHs); sizeHs();
  $$('.scrub').forEach(splitWords);
  const progEls = $$('[data-progress]');
  const sh = $('.skyhero'), navEl = $('.nav');
  const shCopy = sh && $('.skyhero-copy', sh), shNight = sh && $('.sky-night', sh), shFade = sh ? $$('.sky-badge,.sky-hint', sh) : [];
  let lastY = scrollY;
  const loop = () => {
    const vh = innerHeight, y = scrollY;
    navEl.classList.toggle('solid', y > 40);
    if (Math.abs(y - lastY) > 4) { navEl.classList.toggle('hide', y > lastY && y > innerHeight * (sh ? 2.8 : 1) && !document.documentElement.classList.contains('menu-lock')); lastY = y; }
    if (sh) {
      const r = sh.getBoundingClientRect(), hp = clamp(-r.top / Math.max(1, r.height - vh), 0, 1); sky.hp = hp;
      const a = clamp(1 - (hp - .04) / .24, 0, 1);
      shCopy.style.opacity = a; shCopy.style.transform = `translateY(${(1 - a) * -70}px)`; shCopy.style.filter = a < 1 ? `blur(${((1 - a) * 10).toFixed(1)}px)` : ''; shCopy.style.pointerEvents = a < .4 ? 'none' : '';
      shFade.forEach(e => { e.style.opacity = a; });
      const b = clamp((hp - .48) / .14, 0, 1) * clamp((1 - hp) / .14, 0, 1);
      shNight.style.opacity = b; shNight.style.transform = `scale(${(.9 + b * .1).toFixed(3)})`;
      room.hp = hp;
    }
    for (const el of progEls) {
      const r = el.getBoundingClientRect(); if (r.bottom < -vh || r.top > vh * 2) continue;
      const p = el.dataset.progress === 'pin' ? -r.top / Math.max(1, r.height - vh) : (vh - r.top) / (r.height + vh * .6);
      el.style.setProperty('--p', clamp(p, 0, 1).toFixed(4));
    }
    if (hs && innerWidth > 900) { const r = hs.getBoundingClientRect(), p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1); track.style.transform = `translate3d(${-p * (track.scrollWidth - innerWidth)}px,0,0)`; hs.style.setProperty('--p', p.toFixed(4)); }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

initRoom(); initDemos(); initTunnel(); initProgress(); initWork(); initRotator();
$$('.mq-t').forEach(t => { t.innerHTML += t.innerHTML; });

/* =====================================================================
   FALLBACK: no GSAP → show everything, keep page usable
   ===================================================================== */
const menuBtn = $('#menuBtn'), ov = $('#overlay');
if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
  document.documentElement.classList.add('no-motion');
  const l = $('#loader'); l && l.remove(); const c = $('#tiles'); c && c.remove();
  $$('[data-count]').forEach(countTo);
  menuBtn.addEventListener('click', () => { const o = ov.style.clipPath !== 'none'; ov.style.clipPath = o ? 'none' : ''; ov.setAttribute('aria-hidden', !o); });
  return;
}
try {
gsap.registerPlugin(ScrollTrigger);

/* smooth scroll */
let lenis = null;
if (typeof Lenis !== 'undefined' && !reduce) {
  lenis = new Lenis({ lerp: .085 });
  lenis.on('scroll', e => { ScrollTrigger.update(); scrollVel = e.velocity * 60; });
  gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
  lenis.stop();
} else {
  let ly = scrollY; gsap.ticker.add(() => { scrollVel += ((scrollY - ly) * 60 - scrollVel) * .2; ly = scrollY; });
}
const scrollToEl = el => { if (!el) return; lenis ? lenis.scrollTo(el, { duration: 1.6, offset: -20 }) : el.scrollIntoView({ behavior: 'smooth' }); };

/* page transitions: a grid of tiles flips in from where you clicked */
const tiles = $('#tiles'), tileEls = $$('i', tiles);
tiles.style.animation = 'none';
const isInternal = a => { const h = a.getAttribute('href') || ''; return /^(\.\/|[\w-]+(\.html)?)([?#].*)?$/.test(h) && !a.target; };
document.addEventListener('click', e => {
  if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
  const a = e.target.closest && e.target.closest('a[href]'); if (!a) return;
  const h = a.getAttribute('href');
  if (h.startsWith('#')) { let t = null; try { t = h.length > 1 ? $(h) : null; } catch (x) {} if (t) { e.preventDefault(); closeMenu(); setTimeout(() => scrollToEl(t), 300); } return; }
  if (!isInternal(a)) return;
  e.preventDefault();
  crtOff(() => { location.href = h; });
});
const crtEls = (nav) => ['main', 'footer', nav ? '.nav' : ''].filter(Boolean).map(q => $(q)).filter(Boolean);
const crtOrigin = el => gsap.set(el, { transformOrigin: `50% ${innerHeight / 2 - el.getBoundingClientRect().top}px` });
function crtOff(go) {
  const els = crtEls(true); els.forEach(crtOrigin); lenis && lenis.stop();
  gsap.timeline({ onComplete: go })
    .set(tiles, { visibility: 'visible', opacity: 0 })
    .to(els, { scaleY: .004, scaleX: 1.04, filter: 'brightness(5) saturate(0)', duration: .42, ease: 'power4.in' })
    .set(tiles, { opacity: 1 }).set(tileEls, { scaleX: 1, scaleY: 1, opacity: 1 })
    .to(tileEls, { scaleX: 0, duration: .26, ease: 'power3.in' });
}
addEventListener('pageshow', e => { if (e.persisted) { gsap.set(tiles, { visibility: 'hidden' }); gsap.set(crtEls(true), { clearProps: 'transform,filter' }); } });

/* cursor: dot + lagging ring with labels */
const cur = $('#cur'), ringEl = $('#ring'), ringLbl = $('span', ringEl);
if (!touch) {
  const dx = gsap.quickTo(cur, 'x', { duration: .08 }), dy = gsap.quickTo(cur, 'y', { duration: .08 });
  const rx = gsap.quickTo(ringEl, 'x', { duration: .45, ease: 'power3' }), ry = gsap.quickTo(ringEl, 'y', { duration: .45, ease: 'power3' });
  addEventListener('mousemove', e => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); }, { passive: true });
  const HOV = 'a,button,input,select,textarea,label,summary,[role=button]';
  document.addEventListener('mouseover', e => {
    const t = e.target.closest('[data-cursor]'), h = !t && e.target.closest(HOV);
    ringEl.classList.toggle('lab', !!t); ringEl.classList.toggle('hov', !!h); ringLbl.textContent = t ? t.dataset.cursor : '';
    gsap.to(cur, { scale: t ? 0 : h ? .5 : 1, duration: .3 });
  });
}
addEventListener('pointerdown', e => {
  if (e.target.closest('input,select,textarea,.ring-stage')) return;
  const cols = ['#ffd9a6', '#a9b8ff', '#f3f1ec', '#4f6bff'];
  for (let i = 0; i < 12; i++) {
    const d = document.createElement('div'); d.className = 'burst'; d.style.left = e.clientX - 3 + 'px'; d.style.top = e.clientY - 3 + 'px'; d.style.background = cols[i % 4]; document.body.appendChild(d);
    const a = Math.random() * Math.PI * 2, r = 40 + Math.random() * 70;
    gsap.to(d, { x: Math.cos(a) * r, y: Math.sin(a) * r, scale: 0, duration: .8 + Math.random() * .4, ease: 'expo.out', onComplete: () => d.remove() });
  }
});

/* menu overlay: drops like a blind, links rise */
const ovLinks = $$('a.big', ov); let menuOpen = false;
function openMenu() {
  menuOpen = true; menuBtn.classList.add('open'); menuBtn.setAttribute('aria-expanded', 'true'); ov.setAttribute('aria-hidden', 'false'); lenis && lenis.stop();
  gsap.to(ov, { clipPath: 'inset(0 0 0% 0)', duration: .9, ease: 'expo.inOut' });
  gsap.fromTo(ovLinks, { yPercent: 110, filter: 'blur(8px)' }, { yPercent: 0, filter: 'blur(0px)', stagger: .06, duration: 1, delay: .3, ease: 'expo.out' });
  gsap.fromTo('.ov-foot', { opacity: 0, y: 20 }, { opacity: 1, y: 0, delay: .7 });
  scramble($('.mlbl', menuBtn), 'Close');
}
function closeMenu() {
  if (!menuOpen) return; menuOpen = false; menuBtn.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); ov.setAttribute('aria-hidden', 'true'); lenis && lenis.start();
  gsap.to(ov, { clipPath: 'inset(0 0 100% 0)', duration: .7, ease: 'expo.inOut' });
  scramble($('.mlbl', menuBtn), 'Menu');
}
menuBtn.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });

/* magnetic buttons with directional fill */
if (!touch) $$('.mag').forEach(b => {
  const fill = $('.fill', b);
  b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .4, duration: .4, ease: 'power3' }); });
  if (fill) {
    b.addEventListener('mouseenter', e => { const r = b.getBoundingClientRect(); gsap.fromTo(fill, { yPercent: e.clientY < r.top + r.height / 2 ? -101 : 101 }, { yPercent: 0, duration: .45, ease: 'power3.out' }); });
    b.addEventListener('mouseleave', e => { const r = b.getBoundingClientRect(); gsap.to(fill, { yPercent: e.clientY < r.top + r.height / 2 ? -101 : 101, duration: .45, ease: 'power3.in' }); });
  }
  b.addEventListener('mouseleave', () => gsap.to(b, { x: 0, y: 0, duration: .9, ease: 'elastic.out(1,.35)' }));
});
$$('.card').forEach(c => {
  c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top; c.style.setProperty('--mx', x + 'px'); c.style.setProperty('--my', y + 'px'); if (!reduce && c.hasAttribute('data-tilt')) gsap.to(c, { rotateX: (y / r.height - .5) * -10, rotateY: (x / r.width - .5) * 10, transformPerspective: 900, duration: .5, ease: 'power3' }); });
  c.addEventListener('pointerleave', () => gsap.to(c, { rotateX: 0, rotateY: 0, duration: .8, ease: 'elastic.out(1,.4)' }));
});

/* word reveal: each word rises out of a blur. Ends fully sharp and opaque. */
function wordsOf(el) {
  const out = []; if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
  const walk = n => [...n.childNodes].forEach(c => {
    if (c.nodeType === 3) { const f = document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach(p => { if (!p) return; if (/^\s+$/.test(p)) { f.appendChild(document.createTextNode(' ')); return; } const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true'); w.textContent = p; const m = document.createElement('span'); m.className = 'wm'; m.appendChild(w); f.appendChild(m); out.push(w); }); c.replaceWith(f); }
    else if (c.nodeType === 1 && c.tagName !== 'BR' && !c.classList.contains('rot')) walk(c);
  });
  walk(el); return out;
}
const reveal = (ws, o = {}) => gsap.fromTo(ws, { yPercent: 118, rotate: 7, opacity: 0 }, { yPercent: 0, rotate: 0, opacity: 1, stagger: .055, duration: 1.25, ease: 'expo.out', clearProps: 'transform',
  onComplete() { const h = ws[0] && ws[0].closest('h1,h2'); h && h.classList.add('lit'); }, ...o });

/* =====================================================================
   INTRO: loader on first home visit, otherwise tiles clear away
   ===================================================================== */
const heroH = $('.hero .display, .skyhero h1');
const heroWords = heroH ? wordsOf(heroH) : [];
{ const rotEl = heroH && $('.rot', heroH); if (rotEl) heroWords.splice(2, 0, rotEl); }
const heroBits = $$('.hero .kick, .hero .hero-foot > *, .skyhero .kick, .skyhero .lead, .skyhero .row');
gsap.set(heroBits, { opacity: 0, y: 30 }); gsap.set(heroWords, { opacity: 0 }); gsap.set('.nav', { opacity: 0, y: -20 });
const heroIn = () => gsap.timeline()
  .add(reveal(heroWords, { stagger: .08 }))
  .to('.nav', { opacity: 1, y: 0, duration: .8, ease: 'expo.out' }, 0)
  .to(heroBits, { opacity: 1, y: 0, stagger: .08, duration: .9, ease: 'power3.out' }, .35);
const tilesOut = () => { const els = crtEls(); els.forEach(crtOrigin); return gsap.timeline()
  .set(tiles, { visibility: 'visible', opacity: 1 }).set(els, { scaleY: .004, filter: 'brightness(5) saturate(0)' })
  .fromTo(tileEls, { scaleX: 0, scaleY: 1, opacity: 1 }, { scaleX: 1, duration: .38, ease: 'expo.out' })
  .to(tileEls, { scaleY: 60, opacity: 0, duration: .35, ease: 'power2.in' })
  .set(tiles, { opacity: 0 })
  .to(els, { scaleY: 1, filter: 'brightness(1) saturate(1)', duration: .9, ease: 'expo.out', clearProps: 'transform,filter' }, '-=.12')
  .set(tiles, { visibility: 'hidden' }); };
const loader = $('#loader');
const intro = gsap.timeline({ delay: .1 });
if (loader) {
  const bars = $$('.bar i', loader), num = $('.num', loader), cnt = { v: 0 };
  intro.from('#loader img', { y: 40, opacity: 0, scale: .8, duration: .9, ease: 'expo.out' })
    .to(cnt, { v: 100, duration: 1.6, ease: 'power2.inOut', onUpdate: () => { num.textContent = String(Math.round(cnt.v)).padStart(3, '0'); bars.forEach((b, i) => b.classList.toggle('on', cnt.v / 100 * 12 > i)); } }, .2)
    .to('#loader .lc', { scale: 1.08, opacity: 0, filter: 'blur(10px)', duration: .5, ease: 'power3.in' })
    .add(tilesOut(), '-=.1')
    .set(loader, { display: 'none' })
    .add(heroIn(), '-=.5');
} else {
  intro.add(tilesOut()).add(heroIn(), '-=.35');
}
intro.add(() => { lenis && lenis.start(); ScrollTrigger.refresh(); }, '-=1');

/* =====================================================================
   GLOBAL SCROLL EFFECTS
   ===================================================================== */
gsap.to('#prog', { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: .3 } });
const skewEls = $$('.grid, .faq, .tl, .stats, .pipe, .wgrid');
const skewSet = skewEls.map(el => gsap.quickTo(el, 'skewY', { duration: .6, ease: 'power3' }));
gsap.ticker.add(() => { const sk = small ? 0 : clamp(scrollVel / 500, -4, 4); skewSet.forEach(f => f(sk)); });
$$('.mq-t').forEach((el, i) => {
  const dir = i % 2 ? -1 : 1; let x = 0;
  gsap.ticker.add(() => { const boost = 1 + Math.abs(scrollVel) / 180; x += dir * -1.1 * boost * (scrollVel < 0 ? -1 : 1); const h = el.scrollWidth / 2; if (x <= -h) x += h; if (x > 0) x -= h; gsap.set(el, { x, skewX: clamp(-scrollVel / 140, -14, 14) * dir }); });
});
$$('h2.t, .cta .display, .tunnel-copy h2, .sky-night h2').forEach(h => {
  const ws = wordsOf(h); h.classList.add('rv');
  if (h.closest('.sky-night')) { gsap.set(ws, { opacity: 1 }); return; }
  reveal(ws, { scrollTrigger: { trigger: h, start: 'top 88%', toggleActions: 'play none none none' } });
});
$$('[data-reveal]').forEach(el => { if (el.closest('.hero,.skyhero')) return; gsap.from(el, { y: 50, opacity: 0, duration: 1.1, delay: (parseFloat(el.style.getPropertyValue('--d')) || 0) / 1000, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%' } }); });
$$('[data-count]').forEach(el => ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => countTo(el) }));
$$('.step').forEach(s => ScrollTrigger.create({ trigger: s, start: 'top 70%', onEnter: () => s.classList.add('in') }));
/* sub-page hero: words drift up and soften as you leave */
if ($('.hero') && heroH && !reduce) gsap.fromTo(heroH, { y: 0, opacity: 1 }, { y: -60, opacity: .15, ease: 'none', immediateRender: false, scrollTrigger: { trigger: '.hero', start: '35% top', end: 'bottom top', scrub: 1 } });
/* stacking service cards: each one sinks back as the next slides over it */
const sc = $$('.scards .panel');
if (innerWidth > 900) sc.forEach((p, i) => { if (i === sc.length - 1) return; gsap.to(p, { scale: .9, filter: 'brightness(.55)', ease: 'none', scrollTrigger: { trigger: sc[i + 1], start: 'top bottom', end: 'top 120px', scrub: true } }); });
/* footer word */
const bw = $$('.bigword span');
if (bw.length) gsap.fromTo(bw, { yPercent: 100, y: 0, opacity: 0 }, { yPercent: 0, y: 0, opacity: 1, stagger: .04, duration: 1, ease: 'expo.out', clearProps: 'transform', onComplete: () => $('.bigword').classList.add('in'), scrollTrigger: { trigger: '.bigword', start: 'top 98%' } });
/* ---- fx: screens power on like a CRT ---- */
const tvIn = $$('.room .tv');
if (tvIn.length && !reduce) {
  gsap.set(tvIn, { scaleY: .006, scaleX: .4, opacity: 0 });
  intro.to(tvIn, { opacity: 1, scaleX: 1, duration: .25, ease: 'power2.out', stagger: { each: .07, from: 'random' } }, '-=1.1')
    .to(tvIn, { scaleY: 1, duration: .8, ease: 'expo.out', stagger: { each: .07, from: 'random' }, clearProps: 'transform,opacity' }, '<.12');
}
/* ---- fx: hero service chips pop in after the headline ---- */
if ($('.svc-chips') && !reduce) intro.from('.svc-chips li', { y: 18, opacity: 0, stagger: .07, duration: .8, ease: 'power3.out' }, '-=.9');
/* ---- fx: every product visual switches on as it scrolls in ---- */
$$('.panel .vis, .term, .stack-vis, .wgrid .wcard, .phone, .browser, .chat, .demo, .mapcard, .serp, .bmock, .embed').forEach(el => {
  if (reduce || el.closest('.hero,.skyhero,.ring')) return;
  gsap.fromTo(el, { clipPath: 'inset(49.5% 0% 49.5% 0%)', filter: 'brightness(4) saturate(0)' },
    { clipPath: 'inset(0% 0% 0% 0%)', filter: 'brightness(1) saturate(1)', duration: 1.15, ease: 'expo.inOut', clearProps: 'clipPath,filter',
      scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
});
/* ---- fx: the ring of work glides in from depth ---- */
const rs = $('.ring-stage');
if (rs && !reduce) gsap.fromTo(rs, { scale: .7, opacity: 0, rotateX: 30, filter: 'blur(8px)' }, { scale: 1, opacity: 1, rotateX: 0, filter: 'blur(0px)', duration: 1.6, ease: 'expo.out', clearProps: 'filter', scrollTrigger: { trigger: rs, start: 'top 85%', once: true } });
/* ---- fx: home hero, the room brightens and the stage light swings as the camera moves ---- */
const shp = $('.skyhero-pin');
if (shp && !reduce) gsap.to('.room .beam', { rotate: 8, opacity: .35, ease: 'none', scrollTrigger: { trigger: '.skyhero', start: 'top top', end: 'bottom bottom', scrub: 1 } });
/* ---- fx: inner hero, words drift and the room sinks behind ---- */
const subRoom = $('.hero .room');
if (subRoom && !reduce) gsap.to(subRoom, { yPercent: 18, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
/* ---- fx: cursor spotlight on panels, cards and steps ---- */
if (!touch) $$('.panel, .faq details, .stat').forEach(c => {
  c.classList.add('spot');
  c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); c.style.setProperty('--sx', (e.clientX - r.left) + 'px'); c.style.setProperty('--sy', (e.clientY - r.top) + 'px'); });
});
/* ---- fx: chat bubbles appear in order, hold, then clear together and replay ---- */
$$('.bubbles').forEach(bx => {
  const sp = $$('span', bx);
  if (reduce) { gsap.set(sp, { opacity: 1 }); return; }
  const tl = gsap.timeline({ repeat: -1, repeatDelay: .4, paused: true })
    .fromTo(sp, { opacity: 0, y: 16, scale: .92 }, { opacity: 1, y: 0, scale: 1, duration: .5, ease: 'back.out(1.6)', stagger: .75 })
    .to(sp, { opacity: 0, y: -8, duration: .4, ease: 'power2.in' }, '+=2.6');
  ScrollTrigger.create({ trigger: bx, start: 'top 90%', end: 'bottom top', onToggle: st => st.isActive ? tl.play() : tl.pause() });
});
/* ---- fx: stats flicker on like a scoreboard ---- */
$$('.stat b').forEach(b => { if (!reduce) gsap.fromTo(b, { opacity: 0, filter: 'blur(10px) brightness(3)' }, { opacity: 1, filter: 'blur(0px) brightness(1)', duration: 1, ease: 'steps(6)', clearProps: 'filter', scrollTrigger: { trigger: b, start: 'top 90%', once: true } }); });
/* ---- fx: CTA headline pulls in from huge as you arrive ---- */
$$('.cta .display').forEach(h => { if (!reduce) gsap.fromTo(h, { scale: 1.35, letterSpacing: '.04em' }, { scale: 1, letterSpacing: '-.03em', ease: 'none', scrollTrigger: { trigger: h, start: 'top bottom', end: 'center 55%', scrub: 1 } }); });

/* ---- fx8: example sites come alive on hover and open in a viewer ---- */
{
  const FR = '.wgrid .witem .frame, .store-shots .frame';
  const hasG = typeof gsap !== 'undefined' && !reduce;
  const capOf = f => { const it = f.closest('.witem, figure'); const b = it && $('.wcap b, figcaption b', it), s = it && $('.wcap span, figcaption span', it);
    return { n: b ? b.textContent : '', c: s ? s.textContent : '', k: it && it.dataset.k ? it.dataset.k : (f.closest('.store-shots') ? 'shop' : '') }; };
  $$(FR).forEach(f => {
    const d = capOf(f), im = $('img', f);
    f.setAttribute('data-cursor', 'View'); f.tabIndex = 0; f.setAttribute('role', 'button'); f.setAttribute('aria-label', `View ${d.n}${d.c ? ', ' + d.c : ''}`);
    f.insertAdjacentHTML('beforeend', '<span class="pv-pill" aria-hidden="true">View design <b>&#8599;</b></span>');
    if (!hasG || !im) return;
    f.addEventListener('pointerenter', () => gsap.to(im, { scale: 1.16, xPercent: -3, yPercent: -5, duration: 7, ease: 'sine.inOut', overwrite: true }));
    f.addEventListener('pointerleave', () => gsap.to(im, { scale: 1, xPercent: 0, yPercent: 0, duration: .9, ease: 'expo.out', overwrite: true }));
  });

  const pv = document.createElement('div'); pv.id = 'pv'; pv.hidden = true;
  pv.setAttribute('role', 'dialog'); pv.setAttribute('aria-modal', 'true'); pv.setAttribute('aria-label', 'Design preview');
  pv.innerHTML = '<div class="pv-bg"></div><div class="pv-win"><div class="pv-bar"><i></i><i></i><i></i><span class="pv-url"></span><button class="pv-x" type="button" aria-label="Close preview">&#x2715;</button></div><div class="pv-view"><img class="pv-img" alt="" decoding="async"></div></div>'
    + '<div class="pv-foot"><div class="pv-cap"><b></b><span></span></div><div class="pv-nav"><span class="pv-n"></span><button type="button" class="pv-arrow pv-prev" aria-label="Previous design">&#8592;</button><button type="button" class="pv-arrow pv-next" aria-label="Next design">&#8594;</button><a class="btn solid pv-cta" href="contact">Start a project like this</a></div></div>';
  document.body.appendChild(pv);
  const win = $('.pv-win', pv), img = $('.pv-img', pv), bg = $('.pv-bg', pv), foot = $('.pv-foot', pv);
  let list = [], idx = 0, back = null;
  const pad = n => String(n).padStart(2, '0');
  const show = i => {
    idx = (i + list.length) % list.length; const f = list[idx], d = capOf(f), src = $('img', f);
    img.src = src.currentSrc || src.src; img.alt = `${d.n}${d.c ? ', ' + d.c : ''}`;
    $('.pv-cap b', pv).textContent = d.n; $('.pv-cap span', pv).textContent = d.c;
    $('.pv-url', pv).textContent = f.closest('.store-shots') ? `${d.c} · ${d.n}` : d.n;
    $('.pv-n', pv).textContent = `${pad(idx + 1)} / ${pad(list.length)}`;
    $('.pv-cta', pv).href = 'contact' + (d.k === 'shop' ? '?s=store' : '?s=build');
    $$('.pv-arrow', pv).forEach(b => b.hidden = list.length < 2);
    img.classList.remove('kb'); void img.offsetWidth; if (!reduce) img.classList.add('kb');
    if (hasG) gsap.fromTo(img, { opacity: 0 }, { opacity: 1, duration: .5, ease: 'power2.out' });
  };
  const flip = f => { const a = f.getBoundingClientRect(), b = win.getBoundingClientRect();
    return { x: a.left - b.left, y: a.top - b.top, scaleX: a.width / b.width, scaleY: a.height / b.height, transformOrigin: '0 0' }; };
  const open = f => {
    const root = f.closest('.wgrid, .store-shots');
    list = $$('.frame', root).filter(x => !x.closest('.hide')); idx = Math.max(0, list.indexOf(f)); back = f;
    pv.hidden = false; document.documentElement.classList.add('pv-open'); lenis && lenis.stop(); show(idx);
    if (hasG) { gsap.fromTo(win, flip(f), { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: .85, ease: 'expo.inOut', clearProps: 'transform' });
      gsap.fromTo(bg, { opacity: 0 }, { opacity: 1, duration: .5 });
      gsap.fromTo(foot, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6, delay: .45, ease: 'power3.out' }); }
    $('.pv-x', pv).focus({ preventScroll: true });
  };
  const close = () => {
    if (pv.hidden) return;
    const done = () => { typeof gsap !== 'undefined' && gsap.set([win, bg, foot], { clearProps: 'all' }); pv.hidden = true; img.classList.remove('kb');
      document.documentElement.classList.remove('pv-open'); lenis && lenis.start(); const t = list[idx] || back; t && t.focus({ preventScroll: true }); };
    if (!hasG) return done();
    const f = list[idx], r = f.getBoundingClientRect(), seen = r.bottom > 0 && r.top < innerHeight;
    gsap.to(foot, { opacity: 0, duration: .2 }); gsap.to(bg, { opacity: 0, duration: .45, delay: .2 });
    gsap.to(win, seen ? { ...flip(f), duration: .65, ease: 'expo.inOut', onComplete: done } : { opacity: 0, scale: .94, duration: .35, onComplete: done });
  };
  document.addEventListener('click', e => { const f = e.target.closest(FR); if (f) { e.preventDefault(); open(f); } });
  document.addEventListener('keydown', e => {
    const f = e.target.closest && e.target.closest(FR);
    if (f && pv.hidden && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(f); return; }
    if (pv.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') show(idx + 1);
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'Tab') { const fs = $$('button:not([hidden]), a', pv), i = fs.indexOf(document.activeElement);
      e.preventDefault(); fs[(i + (e.shiftKey ? -1 : 1) + fs.length) % fs.length].focus(); }
  });
  bg.addEventListener('click', close); $('.pv-x', pv).addEventListener('click', close);
  $('.pv-prev', pv).addEventListener('click', () => show(idx - 1)); $('.pv-next', pv).addEventListener('click', () => show(idx + 1));
}

addEventListener('load', () => ScrollTrigger.refresh());
} catch (err) {
  /* if anything in the motion layer fails, never leave the page hidden */
  console.error(err);
  document.documentElement.classList.add('no-motion');
  ['#loader', '#tiles'].forEach(q => { const e = $(q); e && e.remove(); });
  $$('.w,.nav,.hero .kick,.hero .hero-foot > *,.skyhero .kick,.skyhero .lead,.skyhero .row,.sky-badge,.sky-hint,[data-reveal]').forEach(e => { e.style.opacity = ''; e.style.transform = ''; e.style.filter = ''; e.style.visibility = ''; });
}
})();
