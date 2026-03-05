const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const db = require('../database');
const { v4: uuidv4 } = require('uuid');

function parseOrder(o) {
  if (!o) return null;
  return { ...o, items: JSON.parse(o.items) };
}

// 주문 생성 (로그인 필요)
router.post('/', authMiddleware, (req, res) => {
  const { customer_name, phone, address, items, memo } = req.body;
  if (!items || !items.length) return res.status(400).json({ message: '주문 상품이 없습니다.' });

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const id = uuidv4();

  // 재고 차감
  const stmt = db.prepare('SELECT stock FROM products WHERE id = ?');
  for (const item of items) {
    const product = stmt.get(item.productId);
    if (!product) return res.status(400).json({ message: `상품(${item.name})을 찾을 수 없습니다.` });
    if (product.stock < item.qty) return res.status(400).json({ message: `${item.name} 재고가 부족합니다.` });
  }
  const deductStmt = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?');
  for (const item of items) deductStmt.run(item.qty, item.productId);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  db.prepare(
    'INSERT INTO orders (id, user_id, customer_name, phone, address, items, total_price, status, memo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).run(id, req.user.id, customer_name || user.nickname, phone || user.phone, address || user.default_address, JSON.stringify(items), totalPrice, '주문접수', memo || '');

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
  res.status(201).json(parseOrder(order));
});

// 전체 주문 목록 (관리자)
router.get('/', adminMiddleware, (req, res) => {
  const { status, from, to } = req.query;
  let query = 'SELECT o.*, u.nickname, u.email FROM orders o JOIN users u ON o.user_id = u.id WHERE 1=1';
  const params = [];
  if (status) { query += ' AND o.status = ?'; params.push(status); }
  if (from) { query += ' AND date(o.created_at) >= date(?)'; params.push(from); }
  if (to) { query += ' AND date(o.created_at) <= date(?)'; params.push(to); }
  query += ' ORDER BY o.created_at DESC';
  const orders = db.prepare(query).all(...params);
  res.json(orders.map(parseOrder));
});

// 주문 상세
router.get('/:id', authMiddleware, (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  if (!order) return res.status(404).json({ message: '주문을 찾을 수 없습니다.' });
  if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
    return res.status(403).json({ message: '접근 권한이 없습니다.' });
  }
  res.json(parseOrder(order));
});

// 주문 상태 변경 (관리자)
router.patch('/:id/status', adminMiddleware, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['주문접수', '준비중', '배송중', '배송완료', '취소'];
  if (!validStatuses.includes(status)) return res.status(400).json({ message: '유효하지 않은 상태입니다.' });
  db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  res.json(parseOrder(order));
});

module.exports = router;
