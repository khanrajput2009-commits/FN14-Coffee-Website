(function () {
  const box = document.createElement("div");
  box.innerHTML = `<button id="botBtn" class="bot-btn" aria-label="Chat with us">💬</button>
  <div id="botWin" class="bot-win d-none">
    <div class="bot-head"><span>☕ FN14 Barista Bot</span><button id="botClose" class="btn-close btn-close-white"></button></div>
    <div id="botMsgs" class="bot-msgs"></div>
    <div class="bot-chips"><button>Recommend something</button><button>Discount code</button><button>Delivery info</button><button>Opening hours</button></div>
    <form id="botForm" class="bot-form"><input id="botIn" placeholder="Ask me anything..." autocomplete="off"><button>➤</button></form>
  </div>`;
  document.body.appendChild(box);
  const win = document.getElementById("botWin"), msgs = document.getElementById("botMsgs"), inp = document.getElementById("botIn");

  const say = (html, who = "bot", text = false) => {
    const d = document.createElement("div"); d.className = "msg " + who;
    text ? d.textContent = html : d.innerHTML = html; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
  };
  const list = arr => arr.map(p => `<div class="d-flex align-items-center gap-2 mt-2">${p.emoji}<div class="flex-grow-1"><b>${p.name}</b><br><small>${money(p.price)}</small></div><button class="btn btn-sm btn-fn" data-add="${p.id}">Add</button></div>`).join("");

  const KB = [
    [["hour", "open", "close", "timing"], "We're open daily from <b>10:00 AM to 11:00 PM</b> ☕"],
    [["deliver", "shipping", "delivery"], "Delivery is Rs. 150, and <b>FREE on orders above Rs. 3,000</b> 🚚"],
    [["coupon", "discount", "promo", "code", "offer", "deal"], "Use code <b>FN14</b> in your cart for <b>10% off</b>! 🎉"],
    [["pay", "cash", "card"], "You can pay by <b>Cash on Delivery</b> or <b>Card</b> at checkout."],
    [["contact", "phone", "email", "address", "location", "where"], "Find all our details on the <a href='contact.html'>Contact page</a>. We reply fast! 📞"]
  ];

  function reply(raw) {
    const t = raw.toLowerCase();
    const p = PRODUCTS.find(x => t.includes(x.name.toLowerCase()));
    if (p && /\b(add|buy|order|want|get|take)\b/.test(t)) {
      addToCart(p.id);
      return `Done! ${p.emoji} <b>${p.name}</b> is in your cart.<br><button class="btn btn-sm btn-fn mt-2" data-bs-toggle="offcanvas" data-bs-target="#cartCanvas">View cart</button>`;
    }
    if (p) return `${p.emoji} <b>${p.name}</b>: ${money(p.price)}<br>${p.short}<br><button class="btn btn-sm btn-fn mt-2" data-add="${p.id}">Add to cart</button>`;
    if (/\b(cold|iced|ice|summer|refresh\w*)\b/.test(t)) return "Beat the heat with these 🧊" + list(PRODUCTS.filter(x => ["Iced Coffee", "Cold Drinks"].includes(x.cat)).slice(0, 3));
    if (/\b(sweet|dessert|chocolate|caramel)\b/.test(t)) return "For something sweet 🍫" + list(PRODUCTS.filter(x => ["Specialty", "Bakery"].includes(x.cat)).slice(0, 3));
    if (/\b(strong|bold|energy|wake)\b/.test(t)) return "Go bold ☕" + list(PRODUCTS.filter(x => ["Espresso", "Cold Brew", "Flat White"].includes(x.name)));
    if (/recommend|suggest|best|popular|bestsell|what should/.test(t)) return "Our top picks right now 🔥" + list(PRODUCTS.filter(x => x.featured).slice(0, 3));
    for (const [k, a] of KB) if (k.some(w => t.includes(w))) return a;
    if (/\b(hi|hello|hey|salam|assalam\w*)\b/.test(t)) return "Hey there! 👋 I can recommend a drink, share offers, or add items to your cart. What are you craving?";
    if (/thank/.test(t)) return "You're welcome! Enjoy your coffee ☕";
    return "I can help with <b>recommendations</b>, <b>offers</b>, <b>delivery</b> and <b>adding items to your cart</b>. Try: <i>\"add a cappuccino\"</i>";
  }

  const send = text => { if (!text.trim()) return; say(text, "user", true); setTimeout(() => say(reply(text)), 450); };
  document.getElementById("botBtn").onclick = () => {
    win.classList.toggle("d-none");
    if (!msgs.children.length) say("Hi, I'm the FN14 Barista Bot ☕<br>Tell me your mood and I'll find your perfect cup. Use code <b>FN14</b> for 10% off!");
  };
  document.getElementById("botClose").onclick = () => win.classList.add("d-none");
  document.getElementById("botForm").onsubmit = e => { e.preventDefault(); send(inp.value); inp.value = ""; };
  win.querySelectorAll(".bot-chips button").forEach(b => b.onclick = () => send(b.textContent));
})();
