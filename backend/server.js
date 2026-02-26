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

// Seed with 28 MVP products (4 discs per category + 4 bags + 4 accessories + 4 Simon Line)
const products = [
  // Distance Drivers (4)
  ["Dimension", "Distance Driver", 17.99, 22, "DG-001", "Distance Driver with a balanced flight profile. Flight: 14.5 | 5 | 0 | 3.", "/images/products/mvp-dimension.jpg"],
  ["Delirium", "Distance Driver", 17.99, 22, "DG-002", "Distance Driver with a balanced flight profile. Flight: 14.5 | 5 | -0.5 | 3.", "/images/products/mvp-delirium.jpg"],
  ["Tantrum", "Distance Driver", 17.99, 22, "DG-003", "Distance Driver with a balanced flight profile. Flight: 14.5 | 5 | -1.5 | 3.", "/images/products/mvp-tantrum.jpg"],
  ["Teleport", "Distance Driver", 17.99, 22, "DG-004", "Distance Driver with a balanced flight profile. Flight: 14.5 | 5 | -1.5 | 2.5.", "/images/products/mvp-teleport.jpg"],
  // Fairway Drivers (4)
  ["Terra", "Fairway Driver", 16.99, 26, "DG-005", "Fairway Driver with a balanced flight profile. Flight: 8 | 5 | 0 | 3.", "/images/products/mvp-terra.jpg"],
  ["Volt", "Fairway Driver", 16.99, 26, "DG-006", "Fairway Driver with a balanced flight profile. Flight: 8 | 5 | -0.5 | 2.", "/images/products/mvp-volt.jpg"],
  ["Amp", "Fairway Driver", 16.99, 26, "DG-007", "Fairway Driver with a balanced flight profile. Flight: 8 | 5 | -1.5 | 1.", "/images/products/mvp-amp.jpg"],
  ["Shock", "Fairway Driver", 16.99, 26, "DG-008", "Fairway Driver with a balanced flight profile. Flight: 8 | 5 | 0 | 2.5.", "/images/products/mvp-shock.jpg"],
  // Mid-Range (4)
  ["Deflector", "Mid-Range", 15.99, 30, "DG-009", "Mid-Range with a balanced flight profile. Flight: 5 | 3.5 | 0 | 4.", "/images/products/mvp-deflector.jpg"],
  ["Pyro", "Mid-Range", 15.99, 30, "DG-010", "Mid-Range with a balanced flight profile. Flight: 5 | 4 | 0 | 2.5.", "/images/products/mvp-pyro.jpg"],
  ["Balance - Prototype", "Mid-Range", 15.99, 30, "DG-011", "Mid-Range with a balanced flight profile. Flight: 5 | 4 | 0 | 3.", "/images/products/mvp-balance-prototype.jpg"],
  ["Balance", "Mid-Range", 15.99, 30, "DG-012", "Mid-Range with a balanced flight profile. Flight: 5 | 5 | 0 | 2.", "/images/products/mvp-balance.jpg"],
  // Putters (4)
  ["Tempo", "Putter", 13.99, 34, "DG-013", "Putter with a balanced flight profile. Flight: 4 | 4 | 0 | 2.5.", "/images/products/mvp-tempo.jpg"],
  ["Ion", "Putter", 13.99, 34, "DG-014", "Putter with a balanced flight profile. Flight: 2.5 | 3 | 0 | 1.5.", "/images/products/mvp-ion.jpg"],
  ["Anode", "Putter", 13.99, 34, "DG-015", "Putter with a balanced flight profile. Flight: 2.5 | 3 | 0 | 0.5.", "/images/products/mvp-anode.jpg"],
  ["Spin", "Putter", 13.99, 34, "DG-016", "Putter with a balanced flight profile. Flight: 2.5 | 4 | -2 | 0.", "/images/products/mvp-spin.jpg"],
  // Bags (4)
  ["MVP Shuttle Backpack", "Disc Bag", 89.99, 8, "DG-017", "Compact 15-disc capacity backpack. Water bottle holder, phone pocket, and comfortable straps.", "/images/products/mvp-shuttle-backpack.jpg"],
  ["MVP Voyager Bag", "Disc Bag", 149.99, 5, "DG-018", "25+ disc capacity. Premium backpack with insulated cooler pocket and rain cover included.", "/images/products/mvp-voyager-bag.jpg"],
  ["MVP Cell Starter Bag", "Disc Bag", 39.99, 12, "DG-019", "Lightweight shoulder bag for 8-10 discs. Perfect for casual rounds and beginners.", "/images/products/mvp-cell-starter-bag.jpg"],
  ["MVP Rover Cart", "Disc Bag", 199.99, 3, "DG-020", "Disc golf cart with large wheels. Holds up to 30 discs plus accessories. Folds for transport.", "/images/products/mvp-rover-cart.jpg"],
  // Accessories (4)
  ["MVP Black Hole Pro Basket", "Accessories and baskets", 289.99, 3, "DG-021", "Competition-grade portable basket. 24-chain dual-level catching system, heavy-duty steel.", "/images/products/mvp-black-hole-pro-basket.jpg"],
  ["MVP Orbit Mini Marker Set", "Accessories and baskets", 12.99, 45, "DG-022", "Set of 3 mini disc markers. Overmold design with GYRO technology branding.", "/images/products/mvp-orbit-mini-marker-set.jpg"],
  ["MVP Towel", "Accessories and baskets", 14.99, 38, "DG-023", "Microfiber disc cleaning towel with carabiner clip. MVP logo embroidered.", "/images/products/mvp-towel.jpg"],
  ["MVP Black Hole Portable Practice Basket", "Accessories and baskets", 159.99, 6, "DG-024", "Lightweight portable basket for practice. Collapsible design, carries in included bag.", "/images/products/mvp-black-hole-portable-practice-basket.jpg"],
  // Simon Lizotte Line (4)
  ["Time-Lapse", "Simon Lizotte Line", 17.99, 20, "DG-025", "Simon Line disc with flight: 12 | 5 | -3 | 2.", "/images/products/mvp-time-lapse.jpg"],
  ["Pixel", "Simon Lizotte Line", 13.99, 20, "DG-026", "Simon Line disc with flight: 3 | 3 | 0 | 1.", "/images/products/mvp-pixel.jpg"],
  ["Balance (Simon Line)", "Simon Lizotte Line", 15.99, 20, "DG-027", "Simon Line disc with flight: 5 | 5 | 0 | 2.", "/images/products/mvp-balance-simon.jpg"],
  ["Nomad", "Simon Lizotte Line", 13.99, 20, "DG-028", "Simon Line disc with flight: 2.5 | 3 | -0.5 | 1.", "/images/products/mvp-nomad.jpg"],
];

const count = db.prepare('SELECT COUNT(*) as cnt FROM products').get();
if (count.cnt === 0) {
  const insert = db.prepare(
    'INSERT INTO products (name, category, price, quantity, sku, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );
  const insertMany = db.transaction((items) => {
    for (const item of items) insert.run(...item);
  });
  insertMany(products);
}

// Sync inventory to the MVP disc list
const skuList = products.map((item) => item[4]);
if (skuList.length > 0) {
  const placeholders = skuList.map(() => '?').join(', ');
  db.prepare(`DELETE FROM products WHERE sku NOT IN (${placeholders})`).run(...skuList);
}
const upsert = db.prepare(
  'INSERT INTO products (name, category, price, quantity, sku, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?) '
  + 'ON CONFLICT(sku) DO UPDATE SET '
  + 'name=excluded.name, category=excluded.category, price=excluded.price, '
  + 'quantity=excluded.quantity, description=excluded.description, image_url=excluded.image_url'
);
const upsertMany = db.transaction((items) => {
  for (const item of items) upsert.run(...item);
});
upsertMany(products);

// Migration: Revert category images to icons for existing databases
const categoryIcons = {
  'Distance Driver': '/images/distance-driver.svg',
  'Fairway Driver': '/images/fairway-driver.svg',
  'Mid-Range': '/images/mid-range.svg',
  'Putter': '/images/putter.svg',
  'Disc Bag': '/images/disc-bag.svg',
  'Accessories and baskets': '/images/accessories.svg',
};
for (const [category, icon] of Object.entries(categoryIcons)) {
  db.prepare(
    "UPDATE products SET image_url = ? WHERE category = ? AND (image_url IS NULL OR image_url = '')"
  ).run(icon, category);
}


// Add fallback images - uses category icons if product image not found
// The frontend will show the product image if it exists, then fallback to category SVG
const categoryFallback = {
  'Distance Driver': '/images/distance-driver.svg',
  'Fairway Driver': '/images/fairway-driver.svg',
  'Mid-Range': '/images/mid-range.svg',
  'Putter': '/images/putter.svg',
  'Disc Bag': '/images/disc-bag.svg',
  'Accessories and baskets': '/images/accessories.svg',
};
// Note: No need to update - frontend handles fallback automatically

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
