(function () {
  const page = location.pathname.split("/").pop() || "index.html";
  const links = [["index.html","Home"],["about.html","About"],["products.html","Products"],["contact.html","Contact"]];
  const logo = `<svg viewBox="0 0 32 32"><path d="M5 12h18v8a6 6 0 0 1-6 6h-6a6 6 0 0 1-6-6z" fill="currentColor"/><path d="M23 14h2a3 3 0 0 1 0 6h-2" stroke="currentColor" fill="none" stroke-width="2"/><path d="M10 3c0 2 2 2 2 5M16 3c0 2 2 2 2 5" stroke="#e07b39" fill="none" stroke-width="2" stroke-linecap="round"/></svg><span>FN<b>14</b></span>`;

  document.getElementById("site-header").innerHTML = `
  <div class="promo-bar">🚚 Free delivery over Rs. 3,000 &nbsp;|&nbsp; Use code <b>FN14</b> for 10% OFF</div>
  <nav class="navbar navbar-expand-lg navbar-dark fn-nav sticky-top"><div class="container">
    <a class="fn-logo" href="index.html">${logo}</a>
    <button aria-label="Toggle menu" class="navbar-toggler border-0" data-bs-toggle="collapse" data-bs-target="#mainNav"><span class="navbar-toggler-icon"></span></button>
    <div class="collapse navbar-collapse" id="mainNav">
      <ul class="navbar-nav mx-auto">${links.map(l => `<li class="nav-item"><a class="nav-link ${page === l[0] ? "active" : ""}" href="${l[0]}">${l[1]}</a></li>`).join("")}</ul>
      <form id="navSearch" class="d-flex my-2 my-lg-0 me-lg-3" role="search"><input id="searchInput" class="form-control form-control-sm rounded-pill" type="search" placeholder="🔍 Search coffee..."></form>
      <button class="btn btn-fn" data-bs-toggle="offcanvas" data-bs-target="#cartCanvas">🛒 Cart <span class="badge bg-light text-dark cart-count">0</span></button>
    </div>
  </div></nav>`;

  document.getElementById("site-footer").innerHTML = `
  <footer class="fn-footer"><div class="container"><div class="row g-4">
    <div class="col-12 col-md-6 col-lg-3"><a class="fn-logo mb-2" href="index.html">${logo}</a><p>Your perfect coffee, every day.</p></div>
    <div class="col-6 col-lg-2"><h6>Quick Links</h6>${links.map(l => `<a href="${l[0]}">${l[1]}</a>`).join("")}</div>
    <div class="col-6 col-lg-2"><h6>Customer Service</h6><a href="#" data-info="faq">FAQs</a><a href="#" data-info="privacy">Privacy Policy</a><a href="#" data-info="terms">Terms &amp; Conditions</a></div>
    <div class="col-6 col-lg-2"><h6>Follow Us</h6><a href="https://www.instagram.com/" target="_blank" rel="noopener">Instagram</a><a href="https://www.facebook.com/" target="_blank" rel="noopener">Facebook</a><a href="https://www.tiktok.com/" target="_blank" rel="noopener">TikTok</a></div>
    <div class="col-12 col-lg-3"><h6>Newsletter</h6><p class="small">Subscribe for exclusive offers.</p>
      <form id="newsForm" class="input-group"><input type="email" required class="form-control" placeholder="Enter your email..."><button class="btn btn-fn">Subscribe</button></form></div>
  </div><hr class="mt-4"><p class="text-center small mb-0">© ${new Date().getFullYear()} FN14 Coffee. All rights reserved.</p></div></footer>

  <div id="toasts"></div>

  <div class="offcanvas offcanvas-end" id="cartCanvas" tabindex="-1">
    <div class="offcanvas-header" style="background:linear-gradient(135deg,var(--dark),var(--brown));color:#fff"><h5 class="mb-0">🛒 MY CART</h5><button aria-label="Close" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button></div>
    <div class="offcanvas-body" id="cartBody"></div>
    <div class="p-3 border-top" id="cartFooter"></div>
  </div>

  <div class="modal fade" id="productModal" tabindex="-1"><div class="modal-dialog modal-lg modal-dialog-centered"><div class="modal-content border-0 rounded-4 overflow-hidden">
    <button aria-label="Close" class="btn-close position-absolute top-0 end-0 m-3" style="z-index:5" data-bs-dismiss="modal"></button><div id="productModalBody"></div></div></div></div>

  <div class="modal fade" id="checkoutModal" tabindex="-1"><div class="modal-dialog modal-dialog-centered"><div class="modal-content border-0 rounded-4">
    <div class="modal-header"><h5 class="modal-title">Checkout</h5><button aria-label="Close" class="btn-close" data-bs-dismiss="modal"></button></div>
    <form id="checkoutForm" novalidate><div class="modal-body row g-3">
      <div class="col-12"><input class="form-control" name="name" placeholder="Full Name"><div class="invalid-feedback">Please enter a valid name.</div></div>
      <div class="col-md-6"><input class="form-control" name="email" placeholder="Email"><div class="invalid-feedback">Please enter a valid email address.</div></div>
      <div class="col-md-6"><input class="form-control" name="phone" placeholder="Phone (03XXXXXXXXX)"><div class="invalid-feedback">Please enter a valid Pakistani phone number.</div></div>
      <div class="col-12"><textarea class="form-control" name="address" rows="2" placeholder="Delivery Address"></textarea><div class="invalid-feedback">Please enter your full address.</div></div>
      <div class="col-12"><div class="form-check"><input class="form-check-input" type="radio" name="pay" id="p1" checked><label class="form-check-label" for="p1">Cash on Delivery</label></div>
        <div class="form-check"><input class="form-check-input" type="radio" name="pay" id="p2"><label class="form-check-label" for="p2">Card Payment</label></div></div>
      <div class="col-12 fw-bold" id="checkoutTotal"></div>
    </div><div class="modal-footer"><button class="btn btn-fn w-100 py-2">Place Order</button></div></form>
  </div></div></div>

  <div class="modal fade" id="infoModal" tabindex="-1"><div class="modal-dialog modal-dialog-centered modal-dialog-scrollable"><div class="modal-content border-0 rounded-4">
    <div class="modal-header"><h5 class="modal-title" id="infoTitle"></h5><button aria-label="Close" class="btn-close" data-bs-dismiss="modal"></button></div>
    <div class="modal-body" id="infoBody"></div></div></div></div>

  <div class="modal fade" id="orderModal" tabindex="-1"><div class="modal-dialog modal-dialog-centered"><div class="modal-content text-center p-4 border-0 rounded-4">
    <div class="success-check">🎉</div><h3>Order Placed Successfully!</h3><p class="mb-1">Your order number</p><h4 id="orderNo" style="color:var(--caramel)"></h4>
    <p class="text-muted">We're preparing your coffee now.</p><button class="btn btn-fn mx-auto px-5" data-bs-dismiss="modal">Continue</button></div></div></div>`;

  window.showToast = msg => {
    const t = document.createElement("div");
    t.className = "toast align-items-center text-white border-0 fn-toast";
    t.innerHTML = `<div class="d-flex"><div class="toast-body">${msg}</div><button aria-label="Close" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
    document.getElementById("toasts").appendChild(t);
    new bootstrap.Toast(t, { delay: 2500 }).show();
    t.addEventListener("hidden.bs.toast", () => t.remove());
  };

  document.getElementById("navSearch").addEventListener("submit", e => {
    e.preventDefault();
    if (page !== "products.html") location.href = "products.html?q=" + encodeURIComponent(document.getElementById("searchInput").value);
  });
  const INFO = {
    faq: ["FAQs", "<b>How long does delivery take?</b><p>Usually 30 to 45 minutes, depending on your area.</p><b>What does delivery cost?</b><p>Rs. 150, and free on orders above Rs. 3,000.</p><b>Which payment methods do you accept?</b><p>Cash on Delivery and Card.</p><b>Is there a discount code?</b><p>Yes, use <b>FN14</b> in your cart for 10% off.</p>"],
    privacy: ["Privacy Policy", "<p>We collect only the details you give us (name, email, phone, address) to process orders and reply to your messages.</p><p>We never sell your information to third parties.</p><p>Your cart is kept in your own browser so it is still there when you come back.</p>"],
    terms: ["Terms &amp; Conditions", "<p>Prices are in Pakistani Rupees (Rs.) and may change without notice.</p><p>Orders are confirmed once the checkout form is submitted.</p><p>Promo codes cannot be combined and may be withdrawn at any time.</p>"]
  };
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-info]"); if (!a) return; e.preventDefault();
    document.getElementById("infoTitle").innerHTML = INFO[a.dataset.info][0];
    document.getElementById("infoBody").innerHTML = INFO[a.dataset.info][1];
    bootstrap.Modal.getOrCreateInstance("#infoModal").show();
  });

  const fav = document.createElement("link"); fav.rel = "icon";
  fav.href = "data:image/svg+xml," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>☕</text></svg>");
  document.head.appendChild(fav);

  document.getElementById("newsForm").addEventListener("submit", e => { e.preventDefault(); e.target.reset(); showToast("📧 Subscribed! Check your inbox for offers."); });
  window.addEventListener("scroll", () => document.querySelector(".fn-nav").classList.toggle("scrolled", scrollY > 20));
})();
