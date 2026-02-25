const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Serve static images from the frontend public folder
app.use('/images', express.static(path.join(__dirname, '../frontend/public/images')));

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
    description TEXT,
    image_url TEXT
  )
`);

// Add image_url column if it doesn't exist (for existing databases)
try {
  db.exec('ALTER TABLE products ADD COLUMN image_url TEXT');
} catch (e) {
  // Column already exists, ignore
}

// Seed with 20 disc golf products if empty
const count = db.prepare('SELECT COUNT(*) as cnt FROM products').get();
if (count.cnt === 0) {
  const insert = db.prepare(
    'INSERT INTO products (name, category, price, quantity, sku, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  const products = [
    // Distance Drivers
    ['Innova Boss', 'Distance Driver', 16.99, 24, 'DG-001', 'Innova – Speed 13 | Glide 5 | Turn -1 | Fade 3. Overstable high-speed driver. Great for powerful throwers.', '/images/distance-driver.svg'],
    ['Discraft Zeus', 'Distance Driver', 17.99, 18, 'DG-002', 'Discraft – Speed 12 | Glide 5 | Turn -1 | Fade 3. Paul McBeth signature overstable driver.', '/images/distance-driver.svg'],
    ['Dynamic Discs Felon', 'Distance Driver', 16.99, 20, 'DG-003', 'Dynamic Discs – Speed 12 | Glide 5 | Turn 0 | Fade 3. Overstable workhorse driver for headwinds.', '/images/distance-driver.svg'],
    ['Latitude 64 Missilen', 'Distance Driver', 17.99, 15, 'DG-004', 'Latitude 64 – Speed 14 | Glide 4 | Turn 0 | Fade 4. Max-speed overstable driver for pro-level power.', '/images/distance-driver.svg'],
    // Fairway Drivers
    ['Innova Leopard3', 'Fairway Driver', 15.99, 30, 'DG-005', 'Innova – Speed 7 | Glide 5 | Turn -2 | Fade 1. Understable fairway driver, great for beginners and hyzer-flips.', '/images/fairway-driver.svg'],
    ['Discraft Buzzz SS', 'Fairway Driver', 15.99, 25, 'DG-006', 'Discraft – Speed 5 | Glide 5 | Turn -3 | Fade 1. Understable fairway driver ideal for anhyzer lines.', '/images/fairway-driver.svg'],
    ['Kastaplast Reko', 'Fairway Driver', 17.99, 22, 'DG-007', 'Kastaplast – Speed 4 | Glide 7 | Turn -1 | Fade 1. Straight, reliable fairway driver for all skill levels.', '/images/fairway-driver.svg'],
    // Mid-Range Discs
    ['Innova Mako3', 'Mid-Range', 14.99, 35, 'DG-008', 'Innova – Speed 5 | Glide 5 | Turn 0 | Fade 0. Perfectly neutral mid-range, goes exactly where you throw it.', '/images/mid-range.svg'],
    ['Discraft Buzzz', 'Mid-Range', 15.99, 40, 'DG-009', 'Discraft – Speed 5 | Glide 4 | Turn -1 | Fade 1. The most popular mid-range disc ever made. Reliable and straight.', '/images/mid-range.svg'],
    ['Dynamic Discs Verdict', 'Mid-Range', 14.99, 28, 'DG-010', 'Dynamic Discs – Speed 5 | Glide 5 | Turn -1 | Fade 2. Versatile overstable mid-range for accurate approach shots.', '/images/mid-range.svg'],
    ['Westside Discs Stag', 'Mid-Range', 15.99, 22, 'DG-011', 'Westside – Speed 5 | Glide 5 | Turn -1 | Fade 1. Controllable mid-range with smooth flight path.', '/images/mid-range.svg'],
    // Putters
    ['Innova Aviar', 'Putter', 13.99, 50, 'DG-012', 'Innova – Speed 2 | Glide 3 | Turn 0 | Fade 1. The classic putter. Reliable, consistent, trusted by pros worldwide.', '/images/putter.svg'],
    ['Discraft Zone', 'Putter', 14.99, 38, 'DG-013', 'Discraft – Speed 4 | Glide 3 | Turn 0 | Fade 3. Overstable approach putter, handles any wind condition.', '/images/putter.svg'],
    ['Dynamic Discs Judge', 'Putter', 13.99, 45, 'DG-014', 'Dynamic Discs – Speed 2 | Glide 4 | Turn 0 | Fade 1. Straight-flying, comfortable putter for all styles.', '/images/putter.svg'],
    ['Axiom Envy', 'Putter', 15.99, 30, 'DG-015', 'Axiom – Speed 3 | Glide 3 | Turn -1 | Fade 2. Overmold putter with great feel and consistent flight.', '/images/putter.svg'],
    // Bags
    ['Discmania Weekender Bag', 'Disc Bag', 49.99, 12, 'DG-016', '6–8 disc capacity. Lightweight and compact, perfect for casual rounds. Includes two beverage pockets.', '/images/disc-bag.svg'],
    ['Dynamic Discs Ranger Bag', 'Disc Bag', 89.99, 8, 'DG-017', '18+ disc capacity. Backpack-style with padded straps, cooler pocket, and rain fly included.', '/images/disc-bag.svg'],
    ['Prodigy Disc BP-3 Backpack', 'Disc Bag', 119.99, 6, 'DG-018', '20–25 disc capacity. Premium backpack with multiple pockets, insulated cooler, and ergonomic design.', '/images/disc-bag.svg'],
    // Equipment & Accessories
    ['MVP Black Hole Pro Basket', 'Accessories and baskets', 289.99, 3, 'DG-019', 'Competition-grade portable disc golf basket. 24-chain dual-level catching system, heavy-duty steel construction.', '/images/basket.svg'],
    ['Discraft Towel & Mini Marker Set', 'Accessories and baskets', 14.99, 60, 'DG-020', 'Includes microfiber disc cleaning towel and two mini disc markers. Essential field accessories for any round.', '/images/accessories.svg'],
  ];
  const insertMany = db.transaction((items) => {
    for (const item of items) insert.run(...item);
  });
  insertMany(products);
}

// Migration: Combine Basket and Accessories into Accessories and baskets
db.prepare('UPDATE products SET category = ? WHERE category = ?').run('Accessories and baskets', 'Basket');
db.prepare('UPDATE products SET category = ? WHERE category = ?').run('Accessories and baskets', 'Accessories');

// Update existing products that have no image_url with category-based defaults
const categoryImages = {
  'Distance Driver': '/images/distance-driver.svg',
  'Fairway Driver': '/images/fairway-driver.svg',
  'Mid-Range': '/images/mid-range.svg',
  'Putter': '/images/putter.svg',
  'Disc Bag': '/images/disc-bag.svg',
  'Accessories and baskets': '/images/accessories.svg',
};
const updateImg = db.prepare('UPDATE products SET image_url = ? WHERE (image_url IS NULL OR image_url = \'\') AND category = ?');
for (const [cat, img] of Object.entries(categoryImages)) {
  updateImg.run(img, cat);
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
  const { name, category, price, quantity, sku, description, image_url } = req.body;
  if (!name || !category || price == null || quantity == null || !sku) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const result = db.prepare(
      'INSERT INTO products (name, category, price, quantity, sku, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(name, category, price, quantity, sku, description || '', image_url || categoryImages[category] || '');
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
  const { name, category, price, quantity, sku, description, image_url } = req.body;
  if (!name || !category || price == null || quantity == null || !sku) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const result = db.prepare(
      'UPDATE products SET name=?, category=?, price=?, quantity=?, sku=?, description=?, image_url=? WHERE id=?'
    ).run(name, category, price, quantity, sku, description || '', image_url || '', req.params.id);
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
