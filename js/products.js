const slug = s => s.toLowerCase().replace(/\s+/g, "-");
const stars = n => "★".repeat(n) + "☆".repeat(5 - n);

function card(p) {
  return `<div class="col-12 col-sm-6 col-lg-4 col-xl-3 reveal"><div class="card product-card h-100 cat-${slug(p.cat)}">
    <span class="badge-tag">${p.badge}</span>
    <div class="img-wrap" data-view="${p.id}"><img src="${p.img}" data-emoji="${p.emoji}" alt="${p.name}" loading="lazy"></div>
    <div class="card-body d-flex flex-column">
      <small class="cat-label">${p.cat}</small><h5 class="mb-1">${p.name}</h5><div class="stars">${stars(p.rating)}</div>
      <p class="small text-muted mt-1">${p.short}</p>
      <div class="mt-auto"><div class="price">${money(p.price)}</div>
        <div class="d-flex gap-2"><button class="btn btn-fn flex-fill btn-sm" data-add="${p.id}">Add to Cart</button><button class="btn btn-outline-fn btn-sm" data-view="${p.id}">View Details</button></div></div>
    </div></div></div>`;
}

/* product modal */
function openProduct(id) {
  const p = PRODUCTS.find(x => x.id === id); let size = "Medium", qty = 1;
  const body = document.getElementById("productModalBody");
  body.innerHTML = `<div class="row g-0">
    <div class="col-md-6"><img src="${p.img}" data-emoji="${p.emoji}" alt="${p.name}" style="width:100%;height:100%;min-height:260px;object-fit:cover"></div>
    <div class="col-md-6 p-4"><small class="cat-label" style="color:var(--caramel)">${p.cat}</small>
      <h3 class="mb-1">${p.name}</h3><div class="stars">${stars(p.rating)}</div>
      <p class="mt-2">${p.desc}</p>
      <b>Ingredients:</b><ul class="small mb-2">${p.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
      <b>Size:</b><div class="d-flex gap-2 my-2" id="sizes">${Object.keys(SIZE_ADD).map(s => `<button class="btn btn-sm cat-btn ${s === size ? "active" : ""}" data-size="${s}">${s}</button>`).join("")}</div>
      <div class="d-flex align-items-center gap-3 my-3"><b>Quantity:</b><button class="qty-btn" id="mMinus">−</button><b id="mQty">1</b><button class="qty-btn" id="mPlus">+</button></div>
      <div class="price" id="mPrice"></div>
      <button class="btn btn-fn w-100 py-2" id="mAdd">Add To Cart</button></div></div>`;
  const upd = () => { body.querySelector("#mQty").textContent = qty; body.querySelector("#mPrice").textContent = "Price: " + money((p.price + SIZE_ADD[size]) * qty); };
  body.querySelectorAll("[data-size]").forEach(b => b.onclick = () => { size = b.dataset.size; body.querySelectorAll("[data-size]").forEach(x => x.classList.toggle("active", x === b)); upd(); });
  body.querySelector("#mMinus").onclick = () => { qty = Math.max(1, qty - 1); upd(); };
  body.querySelector("#mPlus").onclick = () => { qty++; upd(); };
  body.querySelector("#mAdd").onclick = () => { addToCart(p.id, size, qty); bootstrap.Modal.getInstance("#productModal").hide(); };
  upd(); bootstrap.Modal.getOrCreateInstance("#productModal").show();
}
document.addEventListener("click", e => { const v = e.target.closest("[data-view]"); if (v) openProduct(+v.dataset.view); });

/* home featured */
const feat = document.getElementById("featured");
if (feat) { feat.innerHTML = PRODUCTS.filter(p => p.featured).map(card).join(""); observeReveal(); }

/* products page: categories, search, sort */
const grid = document.getElementById("productGrid");
if (grid) {
  const state = { cat: "All", q: new URLSearchParams(location.search).get("q") || "", sort: "default" };
  const si = document.getElementById("searchInput"); si.value = state.q;
  const bar = document.getElementById("catBar");
  bar.innerHTML = ["All", ...new Set(PRODUCTS.map(p => p.cat))].map(c => `<button class="btn cat-btn c-${slug(c)} ${c === "All" ? "active" : ""}" data-cat="${c}">${c}</button>`).join("");
  function render() {
    let l = PRODUCTS.filter(p => (state.cat === "All" || p.cat === state.cat) && (p.name + " " + p.cat + " " + p.short).toLowerCase().includes(state.q.toLowerCase()));
    if (state.sort === "low") l.sort((a, b) => a.price - b.price);
    if (state.sort === "high") l.sort((a, b) => b.price - a.price);
    if (state.sort === "rating") l.sort((a, b) => b.rating - a.rating);
    grid.innerHTML = l.length ? l.map(card).join("") : `<div class="col-12 text-center py-5"><div class="display-3">🔍</div><h5>No coffee found for "${state.q.replace(/[<>]/g, "")}"</h5><p class="text-muted">Try another search or category.</p></div>`;
    observeReveal();
  }
  bar.addEventListener("click", e => { const b = e.target.closest("[data-cat]"); if (!b) return; state.cat = b.dataset.cat; bar.querySelectorAll(".cat-btn").forEach(x => x.classList.toggle("active", x === b)); render(); });
  si.addEventListener("input", () => { state.q = si.value; render(); });
  document.getElementById("sortSel").addEventListener("change", e => { state.sort = e.target.value; render(); });
  render();
}
