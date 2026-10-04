const SIZE_ADD = { Small: -100, Medium: 0, Large: 150 };
const money = n => "Rs. " + n.toLocaleString("en-PK");

const P = (id, name, cat, price, rating, emoji, badge, short, ingredients, featured = false) => ({
  id, name, cat, price, rating, emoji, badge, short, ingredients, featured,
  img: `images/p${id}.jpg`,
  desc: `${short} Crafted fresh to order by FN14 baristas using premium beans and quality ingredients.`
});

const PRODUCTS = [
  P(1,"Cappuccino","Hot Coffee",650,5,"☕","Bestseller","Smooth espresso with creamy steamed milk.",["Espresso","Steamed Milk","Milk Foam"],true),
  P(2,"Espresso","Hot Coffee",450,4,"☕","Strong","A bold, concentrated shot of pure coffee.",["Premium Espresso Beans"]),
  P(3,"Latte","Hot Coffee",600,5,"🥛","Popular","Silky espresso blended with plenty of steamed milk.",["Espresso","Steamed Milk"]),
  P(4,"Flat White","Hot Coffee",620,4,"☕","New","Velvety microfoam over a double ristretto.",["Ristretto","Microfoam Milk"]),
  P(5,"Iced Latte","Iced Coffee",700,5,"🧊","Bestseller","Chilled espresso and milk over ice. Pure refreshment.",["Espresso","Cold Milk","Ice"],true),
  P(6,"Cold Brew","Iced Coffee",680,5,"🧊","Smooth","Slow-steeped for 18 hours for a naturally sweet finish.",["Cold Brew Concentrate","Ice"]),
  P(7,"Iced Mocha","Iced Coffee",750,4,"🍫","Chocolatey","Espresso, chocolate and milk served ice cold.",["Espresso","Chocolate Sauce","Milk","Ice"]),
  P(8,"Caramel Macchiato","Specialty",780,5,"🍮","Bestseller","Vanilla, steamed milk, espresso and a caramel drizzle.",["Espresso","Vanilla Syrup","Steamed Milk","Caramel"],true),
  P(9,"Mocha","Specialty",720,5,"🍫","Fan Favorite","Rich espresso meets velvety chocolate and cream.",["Espresso","Chocolate","Steamed Milk","Whipped Cream"],true),
  P(10,"Hazelnut Latte","Specialty",760,4,"🌰","Nutty","Toasted hazelnut swirled into a creamy latte.",["Espresso","Hazelnut Syrup","Steamed Milk"]),
  P(11,"Mango Frappe","Cold Drinks",590,5,"🥭","Summer Hit","Blended mango, ice and cream. Tropical and thick.",["Mango Pulp","Ice","Cream"],true),
  P(12,"Oreo Shake","Cold Drinks",640,5,"🍪","Kids Love It","Thick milkshake loaded with crushed cookies.",["Milk","Ice Cream","Cookie Crumbs"],true),
  P(13,"Choco Brownie","Bakery",350,5,"🍫","Add-On","Warm, fudgy brownie. The perfect coffee partner.",["Dark Chocolate","Butter","Walnuts"]),
  P(14,"Butter Croissant","Bakery",300,4,"🥐","Fresh Baked","Flaky, golden and baked fresh every morning.",["Butter","Flour","Yeast"])
];

/* colorful fallback illustration if an image file is missing */
const placeholder = e => "data:image/svg+xml," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f5a623"/><stop offset="1" stop-color="#c2185b"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><text x="200" y="195" font-size="120" text-anchor="middle">${e}</text></svg>`);
document.addEventListener("error", ev => {
  const i = ev.target;
  if (i.tagName === "IMG" && i.dataset.emoji && !i.dataset.fb) { i.dataset.fb = 1; i.src = placeholder(i.dataset.emoji); }
}, true);
