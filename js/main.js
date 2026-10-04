window.observeReveal = () => {
  const io = window._io || (window._io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("show"); io.unobserve(e.target); }
  }), { threshold: .12 }));
  document.querySelectorAll(".reveal:not(.show)").forEach(el => io.observe(el));
};
observeReveal();

/* animated counters */
document.querySelectorAll("[data-count]").forEach(el => {
  const end = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0, suf = el.dataset.suffix || "";
  new IntersectionObserver((es, o) => es.forEach(en => {
    if (!en.isIntersecting) return; o.disconnect();
    const t0 = performance.now();
    (function tick(t) {
      const k = Math.min(1, (t - t0) / 1600);
      el.textContent = (end * k).toFixed(dec) + (k === 1 ? suf : "");
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  })).observe(el);
});

/* daily deal countdown (resets at midnight) */
const cd = document.getElementById("countdown");
if (cd) setInterval(() => {
  const n = new Date(), end = new Date(n); end.setHours(24, 0, 0, 0);
  const s = Math.floor((end - n) / 1000), p = x => String(x).padStart(2, "0");
  cd.textContent = `${p(Math.floor(s / 3600))}:${p(Math.floor(s % 3600 / 60))}:${p(s % 60)}`;
}, 1000);

/* ===== v2 effects ===== */
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* rainbow scroll-progress bar */
const sp = document.createElement("div"); sp.id = "sp"; document.body.appendChild(sp);
addEventListener("scroll", () => { const h = document.documentElement.scrollHeight - innerHeight; sp.style.width = (h > 0 ? scrollY / h * 100 : 0) + "%"; }, { passive: true });

/* floating beans in every hero */
if (!calm) document.querySelectorAll(".hero-slide").forEach(h => {
  const w = document.createElement("div"); w.className = "floaters"; w.setAttribute("aria-hidden", "true");
  ["☕", "🫘", "✨", "🍃", "🫘", "☕", "✨", "🫘"].forEach((e, i) => {
    const s = document.createElement("span"); s.textContent = e;
    s.style.cssText = `left:${(i * 13 + 7) % 95}%;animation-duration:${9 + i * 1.3}s;animation-delay:${-i * 1.7}s;font-size:${18 + i % 4 * 10}px`;
    w.appendChild(s);
  });
  h.appendChild(w);
});

/* product image flies into the cart */
function fly(src) {
  const t = [...document.querySelectorAll(".cart-count")].find(e => e.offsetParent);
  if (!src || !t || calm) return;
  const a = src.getBoundingClientRect(), z = t.getBoundingClientRect(), c = document.createElement("img");
  c.src = src.currentSrc || src.src;
  Object.assign(c.style, { position: "fixed", left: a.left + "px", top: a.top + "px", width: a.width + "px", height: a.height + "px", objectFit: "cover", borderRadius: "16px", zIndex: 3000, pointerEvents: "none", boxShadow: "0 10px 30px rgba(0,0,0,.3)" });
  document.body.appendChild(c);
  const dx = z.left + z.width / 2 - (a.left + a.width / 2), dy = z.top + z.height / 2 - (a.top + a.height / 2);
  c.animate([{ transform: "translate(0,0) scale(1)", opacity: 1 }, { transform: `translate(${dx}px,${dy}px) scale(.06)`, opacity: .5 }], { duration: 750, easing: "cubic-bezier(.55,-.2,.7,.5)" }).onfinish = () => c.remove();
}
document.addEventListener("click", e => {
  if (e.target.closest("#mAdd")) return fly(document.querySelector("#productModalBody img"));
  const b = e.target.closest("[data-add]"); if (b) fly(b.closest(".product-card")?.querySelector("img"));
});

/* 3D tilt on product cards (mouse only) */
let tilted = null;
document.addEventListener("pointermove", e => {
  if (e.pointerType !== "mouse" || calm) return;
  const c = e.target.closest?.(".product-card");
  if (tilted && tilted !== c) { tilted.style.removeProperty("--rx"); tilted.style.removeProperty("--ry"); }
  tilted = c; if (!c) return;
  const r = c.getBoundingClientRect();
  c.style.setProperty("--ry", ((e.clientX - r.left) / r.width - .5) * 9 + "deg");
  c.style.setProperty("--rx", -((e.clientY - r.top) / r.height - .5) * 9 + "deg");
});

/* confetti when an order or message goes through */
window.confetti = () => {
  if (calm) return;
  const cv = document.createElement("canvas");
  Object.assign(cv.style, { position: "fixed", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 3500 });
  cv.width = innerWidth; cv.height = innerHeight; document.body.appendChild(cv);
  const x = cv.getContext("2d"), cols = ["#f5a623", "#e07b39", "#c2185b", "#18a999", "#3b82f6", "#ffffff"];
  const ps = Array.from({ length: 140 }, () => ({ x: innerWidth / 2, y: innerHeight * .35, vx: (Math.random() - .5) * 16, vy: Math.random() * -14 - 4, s: Math.random() * 8 + 4, c: cols[Math.random() * cols.length | 0], r: Math.random() * 6, vr: (Math.random() - .5) * .4 }));
  let f = 0;
  (function t() {
    x.clearRect(0, 0, cv.width, cv.height);
    ps.forEach(p => { p.vy += .35; p.x += p.vx; p.y += p.vy; p.r += p.vr; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); x.restore(); });
    ++f < 150 ? requestAnimationFrame(t) : cv.remove();
  })();
};
document.addEventListener("shown.bs.modal", e => { if (["orderModal", "thanksModal"].includes(e.target.id)) confetti(); });
