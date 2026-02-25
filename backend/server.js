const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Initialize database
const db = new Database(path.join(__dirname, 'inventory.db'));

// Create table and seed data
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    sku TEXT UNIQUE NOT NULL,
    description TEXT
  )
`);

// Seed with 20 products if empty
const count = db.prepare('SELECT COUNT(*) as cnt FROM products').get();
if (count.cnt === 0) {
  const insert = db.prepare(
    'INSERT INTO products (name, category, price, quantity, sku, description) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const products = [
    ['Wireless Headphones', 'Electronics', 79.99, 45, 'SKU-001', 'Premium sound quality with noise cancellation'],
    ['Mechanical Keyboard', 'Electronics', 129.99, 30, 'SKU-002', 'Tactile switches with RGB backlight'],
    ['USB-C Hub 7-in-1', 'Electronics', 49.99, 60, 'SKU-003', 'Multi-port hub with HDMI and USB 3.0'],
    ['Running Shoes', 'Footwear', 89.99, 25, 'SKU-004', 'Lightweight and breathable for long runs'],
    ['Yoga Mat', 'Sports', 34.99, 50, 'SKU-005', 'Non-slip surface, 6mm thick'],
    ['Coffee Maker', 'Kitchen', 59.99, 18, 'SKU-006', '12-cup programmable coffee maker'],
    ['Stainless Steel Water Bottle', 'Kitchen', 24.99, 80, 'SKU-007', '32oz insulated, keeps drinks cold 24h'],
    ['Desk Lamp LED', 'Office', 39.99, 35, 'SKU-008', 'Adjustable brightness and color temperature'],
    ['Notebook Set (3 pack)', 'Office', 14.99, 100, 'SKU-009', 'A5 ruled notebooks, 200 pages each'],
    ['Backpack 30L', 'Bags', 69.99, 22, 'SKU-010', 'Waterproof with laptop compartment'],
    ['Sunglasses Polarized', 'Accessories', 44.99, 40, 'SKU-011', 'UV400 protection, lightweight frame'],
    ['Bluetooth Speaker', 'Electronics', 54.99, 28, 'SKU-012', '360° sound, 12-hour battery life'],
    ['Plant Pot Ceramic Set', 'Home', 29.99, 55, 'SKU-013', 'Set of 3 modern ceramic pots'],
    ['Face Moisturizer SPF30', 'Beauty', 22.99, 65, 'SKU-014', 'Daily hydrating cream with sun protection'],
    ['Resistance Bands Set', 'Sports', 19.99, 70, 'SKU-015', '5 resistance levels, includes carry bag'],
    ['Cast Iron Skillet', 'Kitchen', 44.99, 15, 'SKU-016', '10-inch pre-seasoned, oven safe'],
    ['Wireless Mouse', 'Electronics', 34.99, 48, 'SKU-017', 'Ergonomic design, silent click'],
    ['Scented Candle Set', 'Home', 27.99, 90, 'SKU-018', 'Set of 4 soy wax candles, 40h burn time'],
    ['Travel Pillow Memory Foam', 'Travel', 19.99, 38, 'SKU-019', 'Ergonomic neck support for travel'],
    ['Vitamin C Supplement 60ct', 'Health', 12.99, 120, 'SKU-020', '1000mg daily immune support'],
  ];
  const insertMany = db.transaction((items) => {
    for (const item of items) insert.run(...item);
  });
  insertMany(products);
}

// GET all products
app.get('/api/products', (req, res) => {
  const { search, category } = req.query;
  let query = 'SELECT * FROM products';
  const params = [];
  const conditions = [];

  if (search) {
    conditions.push("(name LIKE ? OR sku LIKE ?)");
    params.push(`%${search}%`, `%${search}%`);
  }
  if (category && category !== 'All') {
    conditions.push("category = ?");
    params.push(category);
  }
  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY name ASC';

  const products = db.prepare(query).all(...params);
  res.json(products);
});

// GET categories
app.get('/api/categories', (req, res) => {
  const rows = db.prepare('SELECT DISTINCT category FROM products ORDER BY category ASC').all();
  res.json(rows.map(r => r.category));
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST create product
app.post('/api/products', (req, res) => {
  const { name, category, price, quantity, sku, description } = req.body;
  if (!name || !category || price == null || quantity == null || !sku) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const result = db.prepare(
      'INSERT INTO products (name, category, price, quantity, sku, description) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(name, category, price, quantity, sku, description || '');
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(product);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'SKU already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT update product quantity
app.put('/api/products/:id/quantity', (req, res) => {
  const { quantity } = req.body;
  if (quantity == null || quantity < 0) {
    return res.status(400).json({ error: 'Invalid quantity' });
  }
  const result = db.prepare('UPDATE products SET quantity = ? WHERE id = ?').run(quantity, req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Product not found' });
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json(product);
});

// PUT update full product
app.put('/api/products/:id', (req, res) => {
  const { name, category, price, quantity, sku, description } = req.body;
  if (!name || !category || price == null || quantity == null || !sku) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const result = db.prepare(
      'UPDATE products SET name=?, category=?, price=?, quantity=?, sku=?, description=? WHERE id=?'
    ).run(name, category, price, quantity, sku, description || '', req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Product not found' });
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(product);
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'SKU already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  if (result.changes === 0) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Inventory API running on http://localhost:${PORT}`);
});
