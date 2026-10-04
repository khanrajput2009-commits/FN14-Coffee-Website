const CART_KEY = "fn14Cart", COUPON_KEY = "fn14Coupon", DELIVERY = 150, FREE_OVER = 3000;

const getCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } };
const saveCart = c => { localStorage.setItem(CART_KEY, JSON.stringify(c)); renderCart(); };

function addToCart(id, size = "Medium", qty = 1) {
  const p = PRODUCTS.find(x => x.id === id); if (!p) return;
  const cart = getCart(), key = id + "-" + size, ex = cart.find(i => i.key === key);
  if (ex) ex.qty += qty;
  else cart.push({ key, id, name: p.name, emoji: p.emoji, size, price: p.price + SIZE_ADD[size], qty });
  saveCart(cart);
  showToast(`✓ ${p.emoji} ${p.name} has been added to your cart!`);
}
function changeQty(key, d) {
  let cart = getCart(); const i = cart.find(x => x.key === key); if (!i) return;
  i.qty += d; cart = cart.filter(x => x.qty > 0); saveCart(cart);
}
const removeItem = key => saveCart(getCart().filter(i => i.key !== key));

function totals() {
  const c = getCart();
  const sub = c.reduce((s, i) => s + i.price * i.qty, 0);
  const disc = localStorage.getItem(COUPON_KEY) === "FN14" ? Math.round(sub * 0.1) : 0;
  const after = sub - disc;
  const delivery = !c.length ? 0 : after >= FREE_OVER ? 0 : DELIVERY;
  return { sub, disc, after, delivery, total: after + delivery, count: c.reduce((s, i) => s + i.qty, 0) };
}

function renderCart() {
  const c = getCart(), t = totals();
  document.querySelectorAll(".cart-count").forEach(e => { e.textContent = t.count; e.classList.remove("bump"); void e.offsetWidth; e.classList.add("bump"); });
  const body = document.getElementById("cartBody"), foot = document.getElementById("cartFooter");
  if (!c.length) {
    body.innerHTML = `<div class="text-center py-5"><div class="display-1">🛒</div><h5>Your cart is empty.</h5><p class="text-muted">Add your favorite FN14 coffee and enjoy your order!</p><a href="products.html" class="btn btn-fn">Explore Products</a></div>`;
    foot.innerHTML = ""; return;
  }
  const need = Math.max(0, FREE_OVER - t.after), pct = Math.min(100, t.after / FREE_OVER * 100);
  const up = PRODUCTS.find(p => p.cat === "Bakery" && !c.some(i => i.id === p.id));
  body.innerHTML = `
    <div class="mb-3 small">${need ? `Add <b>${money(need)}</b> more for <b>FREE delivery</b> 🚚` : `🎉 You've unlocked <b>FREE delivery!</b>`}
      <div class="progress mt-1" style="height:8px"><div class="progress-bar fn-progress" style="width:${pct}%"></div></div></div>
    ${c.map(i => `<div class="cart-item"><div class="em">${i.emoji}</div>
      <div class="flex-grow-1"><b>${i.name}</b> <small class="text-muted">(${i.size})</small><div class="small">${money(i.price)} × ${i.qty} = <b>${money(i.price * i.qty)}</b></div>
        <div class="d-flex align-items-center gap-2 mt-1"><button class="qty-btn" data-qty data-key="${i.key}" data-d="-1">−</button><b>${i.qty}</b><button class="qty-btn" data-qty data-key="${i.key}" data-d="1">+</button>
        <button class="btn btn-sm text-danger ms-auto" data-remove="${i.key}">🗑 Remove</button></div></div></div>`).join("")}
    ${up ? `<div class="upsell d-flex align-items-center gap-2"><span class="fs-3">${up.emoji}</span><div class="flex-grow-1 small"><b>Complete your order!</b><br>Add a ${up.name} for ${money(up.price)}</div><button class="btn btn-sm btn-fn" data-add="${up.id}">+ Add</button></div>` : ""}`;
  const applied = localStorage.getItem(COUPON_KEY) === "FN14";
  foot.innerHTML = `
    <div class="input-group input-group-sm mb-2"><input id="couponIn" class="form-control" placeholder="Promo code (try FN14)" value="${applied ? "FN14" : ""}"><button class="btn btn-outline-fn" id="applyCoupon">Apply</button></div>
    <div class="d-flex justify-content-between"><span>Subtotal</span><span>${money(t.sub)}</span></div>
    ${t.disc ? `<div class="d-flex justify-content-between text-success"><span>Discount (FN14)</span><span>− ${money(t.disc)}</span></div>` : ""}
    <div class="d-flex justify-content-between"><span>Delivery</span><span>${t.delivery ? money(t.delivery) : "FREE"}</span></div>
    <div class="d-flex justify-content-between fs-5 fw-bold border-top pt-2 mt-2"><span>TOTAL</span><span>${money(t.total)}</span></div>
    <div class="d-flex gap-2 mt-3"><button class="btn btn-outline-fn" id="clearCart">Clear Cart</button><button class="btn btn-fn flex-grow-1" id="checkoutBtn">Checkout →</button></div>`;
}

document.addEventListener("click", e => {
  const add = e.target.closest("[data-add]"); if (add && add.dataset.add) addToCart(+add.dataset.add);
  const q = e.target.closest("[data-qty]"); if (q) changeQty(q.dataset.key, +q.dataset.d);
  const r = e.target.closest("[data-remove]"); if (r) removeItem(r.dataset.remove);
  if (e.target.id === "clearCart") { saveCart([]); localStorage.removeItem(COUPON_KEY); renderCart(); }
  if (e.target.id === "applyCoupon") {
    const v = document.getElementById("couponIn").value.trim().toUpperCase();
    if (v === "FN14") { localStorage.setItem(COUPON_KEY, "FN14"); showToast("🎉 Code FN14 applied: 10% off!"); }
    else { localStorage.removeItem(COUPON_KEY); showToast("❌ Invalid promo code"); }
    renderCart();
  }
  if (e.target.id === "checkoutBtn") {
    bootstrap.Offcanvas.getOrCreateInstance("#cartCanvas").hide();
    document.getElementById("checkoutTotal").textContent = "Order Total: " + money(totals().total);
    bootstrap.Modal.getOrCreateInstance("#checkoutModal").show();
  }
});

/* demo checkout */
document.getElementById("checkoutForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target, v = n => f.elements[n].value.trim();
  const rules = { name: /^[A-Za-z ]{3,50}$/, email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, phone: /^03[0-9]{9}$/, address: /^.{10,200}$/ };
  let ok = true;
  Object.keys(rules).forEach(k => { const good = rules[k].test(v(k)); f.elements[k].classList.toggle("is-invalid", !good); ok = ok && good; });
  if (!ok) return;
  const no = "FN14-" + (1000 + Math.floor(Math.random() * 9000));
  const orders = JSON.parse(localStorage.getItem("fn14Orders") || "[]");
  orders.push({ no, customer: v("name"), email: v("email"), phone: v("phone"), address: v("address"), items: getCart(), total: totals().total, date: new Date().toISOString() });
  localStorage.setItem("fn14Orders", JSON.stringify(orders));
  document.getElementById("orderNo").textContent = "Order #" + no;
  saveCart([]); localStorage.removeItem(COUPON_KEY); f.reset();
  bootstrap.Modal.getOrCreateInstance("#checkoutModal").hide();
  bootstrap.Modal.getOrCreateInstance("#orderModal").show();
});

renderCart();
