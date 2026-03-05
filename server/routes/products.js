const router = require('express').Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const db = require('../database');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../public/uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

function parseProduct(p) {
  if (!p) return null;
  return { ...p, images: JSON.parse(p.images || '[]'), tags: JSON.parse(p.tags || '[]'), is_active: !!p.is_active };
}

// 전체 상품 목록
router.get('/', (req, res) => {
  const { category, sort, q } = req.query;
  let query = 'SELECT * FROM products WHERE is_active = 1';
  const params = [];
  if (category) { query += ' AND category_slug = ?'; params.push(category); }
  if (q) { query += ' AND (name LIKE ? OR description LIKE ?)'; params.push(`%${q}%`, `%${q}%`); }
  if (sort === 'price_asc') query += ' ORDER BY price ASC';
  else if (sort === 'price_desc') query += ' ORDER BY price DESC';
  else if (sort === 'newest') query += ' ORDER BY created_at DESC';
  else query += ' ORDER BY created_at DESC';
  const products = db.prepare(query).all(...params);
  res.json(products.map(parseProduct));
});

// 상품 상세 + 관련 상품
router.get('/:id', (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ? AND is_active = 1').get(req.params.id);
  if (!product) return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
  const related = db.prepare(
    'SELECT * FROM products WHERE category_slug = ? AND id != ? AND is_active = 1 ORDER BY RANDOM() LIMIT 6'
  ).all(product.category_slug, product.id);
  res.json({ product: parseProduct(product), related: related.map(parseProduct) });
});

// 상품 등록 (관리자)
router.post('/', adminMiddleware, upload.array('images', 10), (req, res) => {
  const { name, category_slug, price, stock, description, ingredients, storage: stor, shelf_life, tags, is_active } = req.body;
  const id = uuidv4();
  const images = req.files && req.files.length > 0
    ? req.files.map(f => `/uploads/${f.filename}`)
    : (req.body.images ? (Array.isArray(req.body.images) ? req.body.images : [req.body.images]) : []);
  db.prepare(
    'INSERT INTO products (id, name, category_slug, price, stock, description, ingredients, storage, shelf_life, images, tags, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, name, category_slug, parseInt(price), parseInt(stock) || 0, description || '', ingredients || '', stor || '실온', shelf_life || '', JSON.stringify(images), JSON.stringify(tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : []), is_active === 'false' ? 0 : 1);
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  res.status(201).json(parseProduct(product));
});

// 상품 수정 (관리자)
router.put('/:id', adminMiddleware, upload.array('images', 10), (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) return res.status(404).json({ message: '상품을 찾을 수 없습니다.' });
  const { name, category_slug, price, stock, description, ingredients, storage: stor, shelf_life, tags, is_active } = req.body;
  const images = req.files && req.files.length > 0
    ? req.files.map(f => `/uploads/${f.filename}`)
    : (req.body.images ? (Array.isArray(req.body.images) ? req.body.images : [req.body.images]) : JSON.parse(product.images));
  db.prepare(
    'UPDATE products SET name=?, category_slug=?, price=?, stock=?, description=?, ingredients=?, storage=?, shelf_life=?, images=?, tags=?, is_active=? WHERE id=?'
  ).run(name || product.name, category_slug || product.category_slug, price !== undefined ? parseInt(price) : product.price, stock !== undefined ? parseInt(stock) : product.stock, description !== undefined ? description : product.description, ingredients !== undefined ? ingredients : product.ingredients, stor || product.storage, shelf_life !== undefined ? shelf_life : product.shelf_life, JSON.stringify(images), JSON.stringify(tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : JSON.parse(product.tags)), is_active !== undefined ? (is_active === 'false' || is_active === false ? 0 : 1) : product.is_active, req.params.id);
  const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  res.json(parseProduct(updated));
});

// 상품 삭제 (관리자 - soft delete)
router.delete('/:id', adminMiddleware, (req, res) => {
  db.prepare('UPDATE products SET is_active = 0 WHERE id = ?').run(req.params.id);
  res.json({ message: '상품이 삭제되었습니다.' });
});

module.exports = router;
