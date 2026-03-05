const router = require('express').Router();
const adminMiddleware = require('../middleware/adminMiddleware');
const db = require('../database');

// 전체 재고 현황 (관리자)
router.get('/', adminMiddleware, (req, res) => {
  const products = db.prepare(
    'SELECT p.id, p.name, p.category_slug, p.stock, p.created_at, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_slug = c.slug WHERE p.is_active = 1 ORDER BY p.stock ASC'
  ).all();
  const result = products.map(p => ({
    ...p,
    stock_status: p.stock === 0 ? '품절' : p.stock <= 5 ? '소량 남음' : '재고 있음'
  }));
  res.json(result);
});

// 재고 수량 수정 (관리자)
router.patch('/:productId', adminMiddleware, (req, res) => {
  const { stock } = req.body;
  if (stock === undefined || stock < 0) return res.status(400).json({ message: '올바른 재고 수량을 입력해주세요.' });
  db.prepare('UPDATE products SET stock = ? WHERE id = ?').run(parseInt(stock), req.params.productId);
  const product = db.prepare('SELECT id, name, stock FROM products WHERE id = ?').get(req.params.productId);
  res.json(product);
});

module.exports = router;
