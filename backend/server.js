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

// Seed with 20 disc golf products if empty
const count = db.prepare('SELECT COUNT(*) as cnt FROM products').get();
if (count.cnt === 0) {
  const insert = db.prepare(
    'INSERT INTO products (name, category, price, quantity, sku, description) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const products = [
    // Distance Drivers
    ['Innova Boss', 'Distance Driver', 16.99, 24, 'DG-001', 'Innova – Speed 13 | Glide 5 | Turn -1 | Fade 3. Overstable high-speed driver. Great for powerful throwers.'],
    ['Discraft Zeus', 'Distance Driver', 17.99, 18, 'DG-002', 'Discraft – Speed 12 | Glide 5 | Turn -1 | Fade 3. Paul McBeth signature overstable driver.'],
    ['Dynamic Discs Felon', 'Distance Driver', 16.99, 20, 'DG-003', 'Dynamic Discs – Speed 12 | Glide 5 | Turn 0 | Fade 3. Overstable workhorse driver for headwinds.'],
    ['Latitude 64 Missilen', 'Distance Driver', 17.99, 15, 'DG-004', 'Latitude 64 – Speed 14 | Glide 4 | Turn 0 | Fade 4. Max-speed overstable driver for pro-level power.'],
    // Fairway Drivers
    ['Innova Leopard3', 'Fairway Driver', 15.99, 30, 'DG-005', 'Innova – Speed 7 | Glide 5 | Turn -2 | Fade 1. Understable fairway driver, great for beginners and hyzer-flips.'],
    ['Discraft Buzzz SS', 'Fairway Driver', 15.99, 25, 'DG-006', 'Discraft – Speed 5 | Glide 5 | Turn -3 | Fade 1. Understable fairway driver ideal for anhyzer lines.'],
    ['Kastaplast Reko', 'Fairway Driver', 17.99, 22, 'DG-007', 'Kastaplast – Speed 4 | Glide 7 | Turn -1 | Fade 1. Straight, reliable fairway driver for all skill levels.'],
    // Mid-Range Discs
    ['Innova Mako3', 'Mid-Range', 14.99, 35, 'DG-008', 'Innova – Speed 5 | Glide 5 | Turn 0 | Fade 0. Perfectly neutral mid-range, goes exactly where you throw it.'],
    ['Discraft Buzzz', 'Mid-Range', 15.99, 40, 'DG-009', 'Discraft – Speed 5 | Glide 4 | Turn -1 | Fade 1. The most popular mid-range disc ever made. Reliable and straight.'],
    ['Dynamic Discs Verdict', 'Mid-Range', 14.99, 28, 'DG-010', 'Dynamic Discs – Speed 5 | Glide 5 | Turn -1 | Fade 2. Versatile overstable mid-range for accurate approach shots.'],
    ['Westside Discs Stag', 'Mid-Range', 15.99, 22, 'DG-011', 'Westside – Speed 5 | Glide 5 | Turn -1 | Fade 1. Controllable mid-range with smooth flight path.'],
    // Putters
    ['Innova Aviar', 'Putter', 13.99, 50, 'DG-012', 'Innova – Speed 2 | Glide 3 | Turn 0 | Fade 1. The classic putter. Reliable, consistent, trusted by pros worldwide.'],
    ['Discraft Zone', 'Putter', 14.99, 38, 'DG-013', 'Discraft – Speed 4 | Glide 3 | Turn 0 | Fade 3. Overstable approach putter, handles any wind condition.'],
    ['Dynamic Discs Judge', 'Putter', 13.99, 45, 'DG-014', 'Dynamic Discs – Speed 2 | Glide 4 | Turn 0 | Fade 1. Straight-flying, comfortable putter for all styles.'],
    ['Axiom Envy', 'Putter', 15.99, 30, 'DG-015', 'Axiom – Speed 3 | Glide 3 | Turn -1 | Fade 2. Overmold putter with great feel and consistent flight.'],
    // Bags
    ['Discmania Weekender Bag', 'Disc Bag', 49.99, 12, 'DG-016', '6–8 disc capacity. Lightweight and compact, perfect for casual rounds. Includes two beverage pockets.'],
    ['Dynamic Discs Ranger Bag', 'Disc Bag', 89.99, 8, 'DG-017', '18+ disc capacity. Backpack-style with padded straps, cooler pocket, and rain fly included.'],
    ['Prodigy Disc BP-3 Backpack', 'Disc Bag', 119.99, 6, 'DG-018', '20–25 disc capacity. Premium backpack with multiple pockets, insulated cooler, and ergonomic design.'],
    // Equipment & Accessories
    ['MVP Black Hole Pro Basket', 'Basket', 289.99, 3, 'DG-019', 'Competition-grade portable disc golf basket. 24-chain dual-level catching system, heavy-duty steel construction.'],
    ['Discraft Towel & Mini Marker Set', 'Accessories', 14.99, 60, 'DG-020', 'Includes microfiber disc cleaning towel and two mini disc markers. Essential field accessories for any round.'],
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
