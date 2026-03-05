const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const adminMiddleware = require('../middleware/adminMiddleware');
const db = require('../database');

// 관리자 로그인
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: '아이디와 비밀번호를 입력해주세요.' });
  const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
  if (!admin) return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
  const valid = bcrypt.compareSync(password, admin.password);
  if (!valid) return res.status(401).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
  const token = jwt.sign({ id: admin.id, username: admin.username, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  res.json({ token, username: admin.username });
});

// 관리자 로그아웃
router.post('/logout', (req, res) => {
  res.json({ message: '로그아웃되었습니다.' });
});

// 회원 목록
router.get('/members', adminMiddleware, (req, res) => {
  const { provider, from, to } = req.query;
  let query = 'SELECT u.id, u.provider, u.nickname, u.email, u.phone, u.created_at, COUNT(o.id) as order_count FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE 1=1';
  const params = [];
  if (provider) { query += ' AND u.provider = ?'; params.push(provider); }
  if (from) { query += ' AND date(u.created_at) >= date(?)'; params.push(from); }
  if (to) { query += ' AND date(u.created_at) <= date(?)'; params.push(to); }
  query += ' GROUP BY u.id ORDER BY u.created_at DESC';
  const members = db.prepare(query).all(...params);
  res.json(members);
});

// 회원 상세 + 주문 이력
router.get('/members/:id', adminMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, provider, nickname, email, phone, profile_image, default_address, created_at, last_login_at FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ message: '회원을 찾을 수 없습니다.' });
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.params.id);
  res.json({ ...user, orders: orders.map(o => ({ ...o, items: JSON.parse(o.items) })) });
});

// 대시보드 통계
router.get('/dashboard', adminMiddleware, (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const thisMonth = today.substring(0, 7);

  const todayOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE date(created_at) = date('now')").get();
  const monthSales = db.prepare("SELECT COALESCE(SUM(total_price), 0) as total FROM orders WHERE strftime('%Y-%m', created_at) = ? AND status != '취소'").get(thisMonth);
  const lowStock = db.prepare('SELECT COUNT(*) as count FROM products WHERE stock <= 5 AND is_active = 1').get();
  const newMembers = db.prepare("SELECT COUNT(*) as count FROM users WHERE strftime('%Y-%m', created_at) = ?").get(thisMonth);

  const weekSales = db.prepare(`
    SELECT date(created_at) as date, COALESCE(SUM(total_price), 0) as total
    FROM orders WHERE date(created_at) >= date('now', '-6 days') AND status != '취소'
    GROUP BY date(created_at) ORDER BY date ASC
  `).all();

  const categorySales = db.prepare(`
    SELECT p.category_slug, c.name as category_name, COUNT(*) as count
    FROM orders o, json_each(o.items) item
    JOIN products p ON json_extract(item.value, '$.productId') = p.id
    JOIN categories c ON p.category_slug = c.slug
    WHERE o.status != '취소'
    GROUP BY p.category_slug
  `).all();

  const recentOrders = db.prepare(`
    SELECT o.id, o.customer_name, o.total_price, o.status, o.created_at, u.nickname
    FROM orders o JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC LIMIT 10
  `).all();

  res.json({
    todayOrderCount: todayOrders.count,
    monthSales: monthSales.total,
    lowStockCount: lowStock.count,
    newMemberCount: newMembers.count,
    weekSales,
    categorySales,
    recentOrders
  });
});

module.exports = router;
