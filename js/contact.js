const cf = document.getElementById("contactForm");
if (cf) {
  const R = {
    name: /^[A-Za-z ]{3,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^(03[0-9]{9})$/,
    subject: /^.{3,100}$/,
    message: /^[\s\S]{10,500}$/
  };
  const check = n => { const el = cf.elements[n], ok = R[n].test(el.value.trim()); el.classList.toggle("is-invalid", !ok); el.classList.toggle("is-valid", ok); return ok; };
  Object.keys(R).forEach(n => cf.elements[n].addEventListener("input", () => check(n)));
  cf.addEventListener("submit", e => {
    e.preventDefault();
    const ok = Object.keys(R).map(check).every(Boolean);
    if (!ok) return;
    const data = {}; Object.keys(R).forEach(n => data[n] = cf.elements[n].value.trim()); data.date = new Date().toISOString();
    const all = JSON.parse(localStorage.getItem("fn14ContactData") || "[]"); all.push(data);
    localStorage.setItem("fn14ContactData", JSON.stringify(all));
    bootstrap.Modal.getOrCreateInstance("#thanksModal").show();
    cf.reset(); cf.querySelectorAll(".is-valid,.is-invalid").forEach(x => x.classList.remove("is-valid", "is-invalid"));
  });
  document.getElementById("resetBtn").addEventListener("click", () => cf.querySelectorAll(".is-valid,.is-invalid").forEach(x => x.classList.remove("is-valid", "is-invalid")));
}
