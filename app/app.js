const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let cart = [];

const products = [
  { id: 1, name: "Laptop", price: 1000 },
  { id: 2, name: "Phone", price: 500 }
];

// --- API ---
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    return res.json({ token: "fake-token", user: { email } });
  }
  res.status(401).json({ error: "Invalid credentials" });
});

app.get("/products", (req, res) => res.json(products));
app.get("/product/:id", (req, res) => {
  const p = products.find(x => x.id == req.params.id);
  res.json(p);
});
app.post("/cart/items", (req, res) => {
  cart.push(req.body);
  res.json({ success: true });
});
app.get("/cart", (req, res) => res.json(cart));

// --- UI ---
app.get("/", (req, res) => res.redirect("/products"));

app.get("/products", (req, res) => {
  const html = `
  <h1>Products</h1>
  <ul>
    ${products.map(p => `
      <li>
        <a data-testid="product-link-${p.id}" href="/product/${p.id}">
          ${p.name} - $${p.price}
        </a>
      </li>
    `).join("")}
  </ul>
  `;
  res.send(html);
});

app.get("/product/:id/ui", (req, res) => {
  const p = products.find(x => x.id == req.params.id);
  const html = `
    <h1 data-testid="product-name">${p.name}</h1>
    <div data-testid="product-price">${p.price}</div>
    <form method="POST" action="/cart/add">
      <input type="hidden" name="id" value="${p.id}" />
      <input type="hidden" name="name" value="${p.name}" />
      <input type="hidden" name="price" value="${p.price}" />
      <button data-testid="add-to-cart" type="submit">Add to cart</button>
    </form>
    <a href="/cart/ui">Go to cart</a>
  `;
  res.send(html);
});

app.post("/cart/add", (req, res) => {
  const { id, name, price } = req.body;
  cart.push({ id, name, price: Number(price), quantity: 1 });
  res.redirect("/cart/ui");
});

app.get("/cart/ui", (req, res) => {
  const html = `
    <h1>Cart</h1>
    <ul>
      ${cart.map(item => `
        <li data-testid="cart-item">
          <span data-testid="cart-name">${item.name}</span>
          <span data-testid="cart-price">${item.price}</span>
          <span data-testid="cart-qty">${item.quantity}</span>
        </li>
      `).join("")}
    </ul>
    <a href="/products">Back to products</a>
  `;
  res.send(html);
});

app.listen(3000, () => console.log("App running on 3000"));