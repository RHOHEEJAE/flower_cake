const passport = require('passport');
const NaverStrategy = require('passport-naver-v2').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const db = require('../database');
const { v4: uuidv4 } = require('uuid');

function upsertSocialUser(provider, providerId, nickname, email, profileImage) {
  const existing = db.prepare(
    'SELECT * FROM users WHERE provider = ? AND provider_id = ?'
  ).get(provider, providerId);

  if (existing) {
    db.prepare(
      'UPDATE users SET nickname = ?, email = ?, profile_image = ?, last_login_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(nickname || existing.nickname, email || existing.email, profileImage || existing.profile_image, existing.id);
    return db.prepare('SELECT * FROM users WHERE id = ?').get(existing.id);
  } else {
    const id = uuidv4();
    db.prepare(
      'INSERT INTO users (id, provider, provider_id, nickname, email, profile_image, role) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(id, provider, providerId, nickname || '회원', email || '', profileImage || '', 'customer');
    return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
  }
}

passport.use(new NaverStrategy({
  clientID: process.env.NAVER_CLIENT_ID,
  clientSecret: process.env.NAVER_CLIENT_SECRET,
  callbackURL: process.env.NAVER_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : '';
    const user = upsertSocialUser('naver', profile.id, profile.displayName, email, profile.photos && profile.photos[0] ? profile.photos[0].value : '');
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.use(new KakaoStrategy({
  clientID: process.env.KAKAO_CLIENT_ID,
  clientSecret: process.env.KAKAO_CLIENT_SECRET || '',
  callbackURL: process.env.KAKAO_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const kakaoAccount = profile._json && profile._json.kakao_account;
    const email = kakaoAccount && kakaoAccount.email ? kakaoAccount.email : '';
    const profileImage = kakaoAccount && kakaoAccount.profile ? kakaoAccount.profile.profile_image_url : '';
    const user = upsertSocialUser('kakao', profile.id, profile.displayName, email, profileImage);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

module.exports = passport;
