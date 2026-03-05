const router = require('express').Router();
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../database');

// 내 정보 조회
router.get('/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, provider, nickname, email, phone, profile_image, default_address, role, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ message: '회원을 찾을 수 없습니다.' });
  res.json(user);
});

// 내 정보 수정 (전화번호, 기본 배송지)
router.patch('/me', authMiddleware, (req, res) => {
  const { phone, default_address } = req.body;
  db.prepare('UPDATE users SET phone = COALESCE(?, phone), default_address = COALESCE(?, default_address) WHERE id = ?')
    .run(phone || null, default_address || null, req.user.id);
  const user = db.prepare('SELECT id, provider, nickname, email, phone, profile_image, default_address, role FROM users WHERE id = ?').get(req.user.id);
  res.json(user);
});

// 내 주문 내역
router.get('/me/orders', authMiddleware, (req, res) => {
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  const parsed = orders.map(o => ({ ...o, items: JSON.parse(o.items) }));
  res.json(parsed);
});

module.exports = router;
