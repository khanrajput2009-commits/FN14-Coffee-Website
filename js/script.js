/* FN14 Coffee - shared script: layout, products, cart, forms, animations */
(() => {
'use strict';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => '$' + n.toFixed(2);
const page = document.body.dataset.page;
const CAT = { H: 'Hot Coffee', C: 'Cold Coffee', S: 'Specialty Coffee' };
const SIZES = { Small: -0.5, Medium: 0, Large: 1 };
const KEY = 'fn14_cart';

/* ---------- Product data ---------- */
const PRODUCTS = [
 [1,'Espresso','H',3.5,4.8,1,'#3b2218',0,'Rich double shot with a golden crema and deep cocoa notes. Strong, short, classic.'],
 [2,'Cappuccino','H',4.5,4.7,1,'#8a5a3c',0,'Equal parts espresso, steamed milk and velvety foam, dusted with cocoa.'],
 [3,'Café Latte','H',4.8,4.7,1,'#a9764f',0,'Smooth espresso with silky steamed milk and a thin layer of microfoam.'],
 [4,'Mocha','H',5.2,4.6,0,'#5a3326',0,'Espresso, dark chocolate and steamed milk topped with whipped cream.'],
 [5,'Americano','H',3.8,4.4,0,'#4a2c1d',0,'Espresso lengthened with hot water for a clean, bold black coffee.'],
 [6,'Caramel Macchiato','S',5.6,4.9,1,'#c98a3c',0,'Vanilla milk, espresso and buttery caramel drizzle. Sweet and layered.'],
 [7,'Vanilla Latte','S',5.4,4.6,0,'#d9b07a',0,'Creamy latte sweetened with real vanilla bean syrup.'],
 [8,'Hazelnut Coffee','S',5.3,4.5,0,'#8b5e3c',0,'Toasted hazelnut and espresso with steamed milk. Nutty and warm.'],
 [9,'Spanish Latte','S',5.7,4.8,1,'#e0b887',0,'Espresso with sweetened condensed milk. Rich, sweet and comforting.'],
 [10,'Flat White','H',4.6,4.7,0,'#9a6a45',0,'Double ristretto with thin, silky milk for a strong, smooth finish.'],
 [11,'Iced Latte','C',4.9,4.7,0,'#b98b62',1,'Chilled espresso poured over ice and cold milk. Refreshing and mellow.'],
 [12,'Cold Coffee','C',4.7,4.5,1,'#6b4128',1,'Slow-brewed cold coffee blended with milk and ice for a frosty classic.'],
 [13,'Affogato','S',6.2,4.8,0,'#d8c3a5',0,'A scoop of vanilla ice cream drowned in a hot shot of espresso.'],
 [14,'Chocolate Coffee','C',5.5,4.6,0,'#4b2a1e',1,'Iced espresso with dark chocolate sauce and cold milk. Dessert in a glass.'],
 [15,'FN14 Signature Coffee','S',6.9,5,1,'#d98e3a',0,'Our house blend with caramel, cocoa and a hint of cinnamon. Only at FN14.']
].map(([id,name,c,price,rate,pop,col,ice,desc]) => ({ id, name, cat: CAT[c], price, rate, pop, col, ice, desc }));
const byId = id => PRODUCTS.find(p => p.id === +id);
/* Optional real photo: assets/images/products/<slug>.jpg (falls back to the SVG art if the file is missing) */
const slug = p => p.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const photo = p => `<img class="ph" src="assets/images/products/${slug(p)}.jpg" alt="${p.name}" loading="lazy" onerror="this.remove()">`;

/* Illustrated cup/glass (SVG) used as product imagery */
const art = p => `<svg viewBox="0 0 120 120" role="img" aria-label="${p.name} illustration">` + (p.ice
 ? `<path d="M34 34h52l-6 62H40z" fill="${p.col}"/><path d="M34 34h52l-1.5 16h-49z" fill="#f3dfc1"/><rect x="48" y="58" width="14" height="14" rx="3" fill="#fff" opacity=".45"/><rect x="64" y="72" width="12" height="12" rx="3" fill="#fff" opacity=".35"/><rect x="66" y="10" width="5" height="40" rx="2" fill="#e4572e" transform="rotate(14 68 30)"/>`
 : `<rect x="28" y="48" width="52" height="44" rx="12" fill="${p.col}"/><rect x="28" y="48" width="52" height="12" rx="6" fill="#f3dfc1"/><path d="M80 58h8a10 10 0 010 24h-8" fill="none" stroke="${p.col}" stroke-width="7"/><rect x="22" y="94" width="68" height="7" rx="3.5" fill="#6f4e37"/><path class="steam" d="M44 40c-6-8 6-12 0-20M60 40c-6-8 6-12 0-20" fill="none" stroke="#c9a77c" stroke-width="3" stroke-linecap="round"/>`) + '</svg>';

const card = (p, cols = 'col-sm-6 col-lg-4 col-xl-3') => `<div class="${cols} rv"><article class="card pcard h-100"><div class="pimg">${art(p)}${photo(p)}<span class="badge">${p.cat}</span>${p.pop ? '<span class="badge pp">Popular</span>' : ''}</div><div class="card-body d-flex flex-column"><div class="d-flex justify-content-between gap-2"><h3 class="h5">${p.name}</h3><span class="price">${money(p.price)}</span></div><div class="stars" aria-label="Rated ${p.rate} out of 5">★ ${p.rate}</div><p class="small text-muted">${p.desc}</p><div class="mt-auto d-flex gap-2"><button class="btn btn-outline-fn btn-sm flex-fill" data-view="${p.id}">View Details</button><button class="btn btn-fn btn-sm flex-fill" data-add="${p.id}">Add to Cart</button></div></div></article></div>`;

/* ---------- Layout: header, footer, modals ---------- */
const NAV = [['index.html','Home','home'],['about.html','About','about'],['products.html','Products','products'],['contact.html','Contact','contact']];
const brand = `<a class="brand" href="index.html" aria-label="FN14 Coffee home"><img src="assets/logo/logo.svg" alt="FN14 Coffee logo"><span>FN14<small>COFFEE</small></span></a>`;
const fld = (id, n, label, type = 'text', ph = '') => `<div class="mb-3"><label class="form-label" for="${id}${n}">${label}</label>${type === 'textarea' ? `<textarea id="${id}${n}" name="${n}" rows="4" class="form-control" placeholder="${ph}"></textarea>` : `<input id="${id}${n}" name="${n}" type="${type}" class="form-control" placeholder="${ph}">`}<div class="invalid-feedback"></div></div>`;

function buildLayout() {
  $('#hdr').innerHTML = `<div id="loader" aria-hidden="true"><i class="bi bi-cup-hot-fill"></i></div>
<nav class="navbar navbar-expand-lg fixed-top fn-nav" aria-label="Main navigation"><div class="container">${brand}
<div class="d-flex align-items-center gap-2 order-lg-last"><button class="btn fn-cart" id="cartBtn" data-bs-toggle="offcanvas" data-bs-target="#cartCanvas" aria-label="Open cart"><i class="bi bi-cart3"></i> <span class="d-none d-sm-inline">Cart</span> <span class="badge rounded-pill" id="cartBadge">0</span></button>
<button class="navbar-toggler" data-bs-toggle="collapse" data-bs-target="#nv" aria-controls="nv" aria-label="Toggle menu"><span class="navbar-toggler-icon"></span></button></div>
<div class="collapse navbar-collapse" id="nv"><ul class="navbar-nav mx-auto my-2 my-lg-0">${NAV.map(([h,t,k]) => `<li class="nav-item"><a class="nav-link${k === page ? ' active" aria-current="page' : ''}" href="${h}">${t}</a></li>`).join('')}</ul>
<form id="navSearch" class="d-flex gap-2" role="search"><input id="navQ" class="form-control" type="search" placeholder="Search coffee..." aria-label="Search coffee"><button class="btn btn-fn" aria-label="Search"><i class="bi bi-search"></i></button></form></div></div></nav>`;

  const link = (h, t) => `<li class="mb-1"><a href="${h}">${t}</a></li>`;
  $('#ftr').innerHTML = `<footer><div class="container"><div class="row g-4 pb-4">
<div class="col-lg-4">${brand}<p class="mt-3">Premium small-batch coffee, crafted drinks and warm café culture, delivered to your door.</p><div class="soc"><a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook"><i class="bi bi-facebook"></i></a><a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram"><i class="bi bi-instagram"></i></a><a href="https://x.com" target="_blank" rel="noopener" aria-label="X"><i class="bi bi-twitter-x"></i></a><a href="https://youtube.com" target="_blank" rel="noopener" aria-label="YouTube"><i class="bi bi-youtube"></i></a></div></div>
<div class="col-6 col-lg-2"><h2>Quick links</h2><ul class="list-unstyled">${NAV.map(n => link(n[0], n[1])).join('')}</ul></div>
<div class="col-6 col-lg-2"><h2>Products</h2><ul class="list-unstyled">${link('products.html?cat=Hot%20Coffee','Hot coffee')}${link('products.html?cat=Cold%20Coffee','Cold coffee')}${link('products.html?cat=Specialty%20Coffee','Specialty')}${link('products.html?cat=Popular','Popular')}</ul></div>
<div class="col-lg-4"><h2>Visit &amp; contact</h2><p class="mb-1"><i class="bi bi-geo-alt"></i> 14 Roaster Lane, Your City</p><p class="mb-1"><i class="bi bi-telephone"></i> <a href="tel:+920000000000">+92 000 000 0000</a></p><p class="mb-1"><i class="bi bi-envelope"></i> <a href="mailto:hello@fn14coffee.example">hello@fn14coffee.example</a></p><p><i class="bi bi-clock"></i> Mon-Fri 7-22 &middot; Sat-Sun 8-23</p>
<form class="nl d-flex gap-2" novalidate><input type="email" class="form-control" placeholder="Newsletter email" aria-label="Newsletter email"><button class="btn btn-fn">Join</button></form></div></div>
<div class="border-top border-secondary py-3 text-center small">&copy; 2026 FN14 Coffee. All rights reserved.</div></div></footer>
<button id="btt" aria-label="Back to top"><i class="bi bi-arrow-up"></i></button>
<div class="toast-container position-fixed top-0 end-0 p-3" id="toasts" style="z-index:2000;margin-top:70px"></div>
<div class="offcanvas offcanvas-end" tabindex="-1" id="cartCanvas" aria-labelledby="cartTitle"><div class="offcanvas-header"><h2 class="h4 mb-0" id="cartTitle">Your cart <small class="text-muted fs-6">(<span id="cartItems">0</span> items)</small></h2><button class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button></div>
<div class="offcanvas-body" id="cartBody"></div><div class="p-3 border-top" id="cartFoot"><div class="d-flex justify-content-between fs-5 fw-bold mb-3"><span>Grand total</span><span id="cartTotal">$0.00</span></div><div class="d-grid gap-2"><button class="btn btn-fn" id="checkoutBtn">Checkout</button><div class="d-flex gap-2"><button class="btn btn-outline-fn flex-fill" data-bs-dismiss="offcanvas">Continue Shopping</button><button class="btn btn-outline-danger flex-fill rounded-pill" id="clearBtn">Clear Cart</button></div></div></div></div>
<div class="modal fade" id="pm" tabindex="-1" aria-labelledby="pmT" aria-hidden="true"><div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable"><div class="modal-content"><div class="modal-header"><h2 class="modal-title h4" id="pmT"></h2><button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body" id="pmB"></div></div></div></div>
<div class="modal fade" id="ckm" tabindex="-1" aria-labelledby="ckT" aria-hidden="true"><div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable"><div class="modal-content"><div class="modal-header"><h2 class="modal-title h4" id="ckT">Checkout</h2><button class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"><div class="row g-4"><div class="col-md-6"><form id="ckForm" novalidate>${fld('ck','name','Customer name','text','Your full name')}${fld('ck','email','Email','email','you@email.com')}${fld('ck','phone','Phone','tel','+92 300 1234567')}${fld('ck','address','Delivery address','textarea','Street, area, city')}</form></div><div class="col-md-6"><h3 class="h5">Order summary</h3><div id="ckSum"></div></div></div><p class="small text-muted mb-0">Demo checkout: no real payment is processed.</p></div><div class="modal-footer"><button class="btn btn-outline-fn" data-bs-dismiss="modal">Back</button><button class="btn btn-fn" id="confirmBtn">Confirm Order</button></div></div></div></div>
<div class="modal fade" id="im" tabindex="-1" aria-labelledby="imT" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content text-center p-3"><div class="modal-body"><div class="empty-ic big" id="imI"></div><h2 class="h3" id="imT"></h2><div id="imB"></div><button class="btn btn-fn mt-3" data-bs-dismiss="modal">Close</button></div></div></div></div>`;
}

/* ---------- Toasts & info modal ---------- */
function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast align-items-center text-bg-${type} border-0`;
  el.setAttribute('role', 'status');
  el.innerHTML = `<div class="d-flex"><div class="toast-body"><i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i> ${msg}</div><button class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button></div>`;
  $('#toasts').appendChild(el);
  el.addEventListener('hidden.bs.toast', () => el.remove());
  new bootstrap.Toast(el, { delay: 2600 }).show();
}
function showInfo(icon, title, html) {
  $('#imI').innerHTML = `<i class="bi bi-${icon}"></i>`; $('#imT').textContent = title; $('#imB').innerHTML = html;
  bootstrap.Modal.getOrCreateInstance('#im').show();
}

/* ---------- Cart (localStorage) ---------- */
let cart = [];
const loadCart = () => {
  try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch { cart = []; }
  cart = cart.filter(i => byId(i.id) && i.size in SIZES && i.qty > 0); // drop corrupt rows
};
const saveCart = () => localStorage.setItem(KEY, JSON.stringify(cart));
const unitPrice = i => byId(i.id).price + SIZES[i.size];
const calculateTotal = () => cart.reduce((s, i) => s + unitPrice(i) * i.qty, 0);
const updateCartCount = () => {
  const n = cart.reduce((s, i) => s + i.qty, 0), b = $('#cartBadge');
  b.textContent = n; $('#cartItems').textContent = n;
  b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
};
function updateCartUI() {
  updateCartCount();
  $('#cartTotal').textContent = money(calculateTotal());
  $('#cartFoot').classList.toggle('d-none', !cart.length);
  $('#cartBody').innerHTML = cart.length ? cart.map(i => { const p = byId(i.id); return `<div class="ci">${art(p)}<div class="flex-grow-1"><div class="fw-semibold">${p.name}</div><div class="small text-muted">${i.size} &middot; ${money(unitPrice(i))}</div><div class="qty mt-1"><button class="btn btn-outline-fn" data-act="dec" data-k="${i.k}" aria-label="Decrease quantity ${p.name}">&minus;</button><span aria-live="polite">${i.qty}</span><button class="btn btn-outline-fn" data-act="inc" data-k="${i.k}" aria-label="Increase quantity ${p.name}">+</button><button class="btn btn-sm text-danger ms-1" data-act="rm" data-k="${i.k}" aria-label="Remove ${p.name}"><i class="bi bi-trash"></i></button></div></div><div class="fw-bold">${money(unitPrice(i) * i.qty)}</div></div>`; }).join('')
    : `<div class="text-center py-5"><div class="empty-ic big"><i class="bi bi-bag-x"></i></div><h3 class="h5">No items in your cart</h3><p class="text-muted">Your next coffee is a click away.</p><a class="btn btn-fn" href="products.html">Explore Coffee</a></div>`;
}
function addToCart(id, size = 'Medium', qty = 1) {
  const k = id + '|' + size, f = cart.find(i => i.k === k);
  f ? f.qty += qty : cart.push({ k, id: +id, size, qty });
  saveCart(); updateCartUI(); toast(`${byId(id).name} added to cart!`);
  const c = $('#cartBtn'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
}
function removeFromCart(k) { cart = cart.filter(i => i.k !== k); saveCart(); updateCartUI(); toast('Product removed!', 'secondary'); }
function updateQuantity(k, d) {
  const i = cart.find(x => x.k === k); if (!i) return;
  i.qty += d; if (i.qty < 1) return removeFromCart(k);
  saveCart(); updateCartUI(); toast('Cart updated!', 'info');
}
function clearCart(silent) { cart = []; saveCart(); updateCartUI(); if (!silent) toast('Cart cleared!', 'secondary'); }

/* ---------- Product details modal ---------- */
function openDetails(id) {
  const p = byId(id); let qty = 1, size = 'Medium';
  $('#pmT').textContent = p.name;
  const draw = () => {
    $('#pmB').innerHTML = `<div class="row g-4 align-items-center"><div class="col-md-5"><div class="art-panel p-3">${art(p)}${photo(p)}</div></div><div class="col-md-7"><span class="badge bg-secondary">${p.cat}</span> <span class="stars">★ ${p.rate} / 5</span><p class="mt-2">${p.desc}</p><div class="h3 price" id="pmP">${money((p.price + SIZES[size]) * qty)}</div>
<div class="mb-3" role="group" aria-label="Size">${Object.keys(SIZES).map(s => `<button class="btn btn-outline-fn btn-sm me-1${s === size ? ' active' : ''}" data-size="${s}">${s}</button>`).join('')}</div>
<div class="qty mb-3"><button class="btn btn-outline-fn" data-q="-1" aria-label="Decrease">&minus;</button><span class="fs-5 px-2">${qty}</span><button class="btn btn-outline-fn" data-q="1" aria-label="Increase">+</button></div>
<div class="d-flex gap-2 flex-wrap"><button class="btn btn-fn flex-fill" id="pmAdd">Add to Cart</button><button class="btn btn-outline-fn" data-bs-dismiss="modal">Close</button></div></div></div>`;
    $$('[data-size]', $('#pmB')).forEach(b => b.onclick = () => { size = b.dataset.size; draw(); });
    $$('[data-q]', $('#pmB')).forEach(b => b.onclick = () => { qty = Math.min(20, Math.max(1, qty + +b.dataset.q)); draw(); });
    $('#pmAdd').onclick = () => { addToCart(p.id, size, qty); bootstrap.Modal.getInstance('#pm').hide(); };
  };
  draw(); bootstrap.Modal.getOrCreateInstance('#pm').show();
}

/* ---------- Validation (regex) ---------- */
const RULES = {
  name: [/^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ' .-]{1,59}$/, 'Enter your full name (letters only, at least 2 characters).'],
  email: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Enter a valid email, like name@example.com.'],
  phone: [/^\+?[0-9][0-9 ()-]{6,17}$/, 'Enter a valid phone number (7-18 digits, may start with +).'],
  subject: [/^.{3,80}$/, 'Subject must be 3-80 characters.'],
  message: [/^[\s\S]{10,1000}$/, 'Message must be at least 10 characters.'],
  address: [/^[\s\S]{8,200}$/, 'Enter your full delivery address (8+ characters).']
};
function checkField(el) {
  const r = RULES[el.name]; if (!r) return true;
  const ok = r[0].test(el.value.trim());
  el.classList.toggle('is-invalid', !ok); el.classList.toggle('is-valid', ok);
  el.parentElement.querySelector('.invalid-feedback').textContent = el.value.trim() ? r[1] : 'This field is required.';
  return ok;
}
const validate = f => { let ok = true; $$('[name]', f).forEach(el => { if (!checkField(el)) ok = false; }); if (!ok) $('.is-invalid', f)?.focus(); return ok; };
const liveValidate = f => f.addEventListener('input', e => { if (e.target.classList.contains('is-invalid') || e.target.classList.contains('is-valid')) checkField(e.target); });

/* ---------- Checkout & confirmation ---------- */
function openCheckout() {
  if (!cart.length) return toast('Your cart is empty. Add a coffee first!', 'warning');
  bootstrap.Offcanvas.getInstance('#cartCanvas')?.hide();
  $('#ckSum').innerHTML = cart.map(i => `<div class="d-flex justify-content-between small mb-1"><span>${byId(i.id).name} (${i.size}) &times; ${i.qty}</span><span>${money(unitPrice(i) * i.qty)}</span></div>`).join('') + `<hr><div class="d-flex justify-content-between fw-bold"><span>Total</span><span>${money(calculateTotal())}</span></div>`;
  bootstrap.Modal.getOrCreateInstance('#ckm').show();
}
function confirmOrder() {
  const f = $('#ckForm'); if (!cart.length) return toast('Your cart is empty.', 'warning');
  if (!validate(f)) return toast('Please fix the highlighted fields.', 'danger');
  const ref = 'FN14-' + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 90 + 10);
  const items = cart.map(i => `${byId(i.id).name} (${i.size}) &times; ${i.qty}`).join('<br>'), total = money(calculateTotal()), who = $('#ckname').value.trim().replace(/</g, '&lt;');
  bootstrap.Modal.getInstance('#ckm').hide();
  clearCart(true); f.reset(); $$('.is-valid', f).forEach(e => e.classList.remove('is-valid'));
  showInfo('check-circle-fill text-success', 'Order Confirmed!', `<p>Thank you, <b>${who}</b>! The FN14 Coffee team is preparing your order.</p><p class="mb-1">Order number: <b>${ref}</b></p><p class="small">${items}</p><p class="fw-bold">Total: ${total}</p>`);
  toast('Order confirmed!');
}

/* ---------- Products page: search + filter ---------- */
function initCatalog() {
  const FILTERS = ['All', 'Hot Coffee', 'Cold Coffee', 'Specialty Coffee', 'Popular'];
  const params = new URLSearchParams(location.search);
  let q = (params.get('q') || '').trim(), cat = FILTERS.includes(params.get('cat')) ? params.get('cat') : 'All';
  const fBox = $('#filters'), grid = $('#grid');
  const render = () => {
    fBox.innerHTML = FILTERS.map(f => `<button class="btn btn-outline-fn${f === cat ? ' active' : ''}" aria-pressed="${f === cat}" data-cat="${f}">${f}</button>`).join('');
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const list = PRODUCTS.filter(p => (cat === 'All' || (cat === 'Popular' ? p.pop : p.cat === cat)) && words.every(w => (p.name + ' ' + p.cat + ' ' + p.desc).toLowerCase().includes(w)));
    grid.innerHTML = list.map(p => card(p)).join(''); observe(grid);
    $('#none').classList.toggle('d-none', list.length > 0);
    $('#resCount').textContent = `${list.length} coffee${list.length === 1 ? '' : 's'} found`;
    $('#q').value = $('#navQ').value = q;
  };
  fBox.addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (b) { cat = b.dataset.cat; render(); } });
  [$('#q'), $('#navQ')].forEach(el => el.addEventListener('input', () => { q = el.value.trim(); render(); }));
  $('#clearQ').onclick = () => { q = ''; cat = 'All'; render(); };
  render();
}

/* ---------- Animations ---------- */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
const countIo = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; countIo.unobserve(e.target);
  const el = e.target, end = +el.dataset.count, dec = 'dec' in el.dataset; let t0;
  const step = t => { t0 ??= t; const k = Math.min((t - t0) / 1400, 1), v = end * k; el.textContent = dec ? (v / 10).toFixed(1) : Math.round(v).toLocaleString() + (end >= 1000 ? '+' : ''); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}), { threshold: .5 });
const observe = root => { $$('.rv:not(.in)', root).forEach(el => io.observe(el)); $$('[data-count]', root).forEach(el => countIo.observe(el)); };

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  buildLayout(); loadCart(); updateCartUI();

  // Static render targets (home page + about page art)
  const targets = { featured: PRODUCTS.filter(p => [15, 6, 9].includes(p.id)), popular: PRODUCTS.filter(p => p.pop).slice(0, 4) };
  $$('[data-render]').forEach(el => el.innerHTML = targets[el.dataset.render].map(p => card(p, el.dataset.render === 'featured' ? 'col-md-6 col-lg-4' : 'col-sm-6 col-lg-3')).join(''));
  $$('[data-art]').forEach(el => el.innerHTML = art(byId(el.dataset.art)) + photo(byId(el.dataset.art)));
  $$('[data-hero]').forEach(el => el.innerHTML = art(byId(15)));
  if ($('#contactForm')) {
    const f = $('#contactForm');
    f.innerHTML = fld('ct', 'name', 'Name', 'text', 'Your name') + fld('ct', 'email', 'Email', 'email', 'you@email.com') + fld('ct', 'phone', 'Phone', 'tel', '+92 300 1234567') + fld('ct', 'subject', 'Subject', 'text', 'How can we help?') + fld('ct', 'message', 'Message', 'textarea', 'Tell us more...') + '<button class="btn btn-fn btn-lg w-100">Send message</button>';
    liveValidate(f);
    f.addEventListener('submit', e => {
      e.preventDefault();
      if (!validate(f)) return toast('Please correct the highlighted fields.', 'danger');
      f.reset(); $$('.is-valid', f).forEach(x => x.classList.remove('is-valid'));
      showInfo('envelope-check', 'Message sent!', '<p>Thank you for contacting FN14 Coffee. Your message has been received.</p>');
    });
  }
  liveValidate($('#ckForm')); $('#ckForm').addEventListener('submit', e => { e.preventDefault(); confirmOrder(); });
  if (page === 'products') initCatalog();
  observe(document);

  // Navbar search: on Products it filters live (see initCatalog); elsewhere it opens the catalog
  $('#navSearch').addEventListener('submit', e => { e.preventDefault(); if (page !== 'products') location.href = 'products.html?q=' + encodeURIComponent($('#navQ').value.trim()); else bootstrap.Collapse.getInstance('#nv')?.hide(); });

  // Newsletter forms
  $$('.nl').forEach(f => f.addEventListener('submit', e => { e.preventDefault(); const i = $('input', f); if (RULES.email[0].test(i.value.trim())) { toast('Welcome to the FN14 club!'); f.reset(); i.classList.remove('is-invalid'); } else { i.classList.add('is-invalid'); toast('Enter a valid email address.', 'danger'); } }));

  // Delegated clicks: product + cart actions
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-add],[data-view],[data-act]'); if (!t) return;
    if (t.dataset.add) addToCart(t.dataset.add);
    else if (t.dataset.view) openDetails(t.dataset.view);
    else if (t.dataset.act === 'inc') updateQuantity(t.dataset.k, 1);
    else if (t.dataset.act === 'dec') updateQuantity(t.dataset.k, -1);
    else if (t.dataset.act === 'rm') removeFromCart(t.dataset.k);
  });
  $('#checkoutBtn').onclick = openCheckout; $('#confirmBtn').onclick = confirmOrder; $('#clearBtn').onclick = () => clearCart();
  window.addEventListener('storage', ev => { if (ev.key === KEY) { loadCart(); updateCartUI(); } }); // sync across tabs

  // Navbar shrink + back-to-top
  const nav = $('.fn-nav'), btt = $('#btt');
  const onScroll = () => { nav.classList.toggle('sc', scrollY > 30); btt.classList.toggle('on', scrollY > 400); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  btt.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });

  // Close the mobile menu after choosing a link
  $$('#nv .nav-link').forEach(a => a.addEventListener('click', () => bootstrap.Collapse.getInstance('#nv')?.hide()));
  const done = () => $('#loader').classList.add('off');
  document.readyState === 'complete' ? done() : addEventListener('load', done); setTimeout(done, 1500);
});
})();
