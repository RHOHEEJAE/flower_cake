const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../database');

function issueJWT(user) {
  return jwt.sign(
    { id: user.id, nickname: user.nickname, email: user.email, role: user.role, provider: user.provider },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

// 네이버 OAuth
router.get('/naver', passport.authenticate('naver', { session: false }));
router.get('/naver/callback',
  passport.authenticate('naver', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=naver` }),
  (req, res) => {
    const token = issueJWT(req.user);
    res.redirect(`${process.env.CLIENT_URL}/oauth-callback?token=${token}`);
  }
);

// 카카오 OAuth
router.get('/kakao', passport.authenticate('kakao', { session: false }));
router.get('/kakao/callback',
  passport.authenticate('kakao', { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=kakao` }),
  (req, res) => {
    const token = issueJWT(req.user);
    res.redirect(`${process.env.CLIENT_URL}/oauth-callback?token=${token}`);
  }
);

// 현재 로그인 회원 정보
router.get('/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, provider, nickname, email, phone, profile_image, default_address, role, created_at, last_login_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ message: '회원을 찾을 수 없습니다.' });
  res.json(user);
});

// 로그아웃 (클라이언트 측 토큰 삭제 안내)
router.post('/logout', (req, res) => {
  res.json({ message: '로그아웃되었습니다. 클라이언트의 토큰을 삭제해 주세요.' });
});

module.exports = router;
