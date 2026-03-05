require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const db = require('./database');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// 카테고리 삽입
const categories = [
  { id: uuidv4(), name: '상견례', slug: 'sanggyeonrye', description: '첫 만남의 격식과 정성을 담은 선물 세트', image_url: 'https://picsum.photos/seed/sanggyeonrye/800/400', sort_order: 1 },
  { id: uuidv4(), name: '환갑·칠순', slug: 'birthday', description: '장수와 감사를 담은 고급 화과자', image_url: 'https://picsum.photos/seed/birthday/800/400', sort_order: 2 },
  { id: uuidv4(), name: '돌잔치', slug: 'dol', description: '아이의 첫 생일을 축하하는 귀여운 디자인', image_url: 'https://picsum.photos/seed/dol/800/400', sort_order: 3 },
  { id: uuidv4(), name: '결혼·웨딩', slug: 'wedding', description: '두 사람의 시작을 축하하는 우아한 세트', image_url: 'https://picsum.photos/seed/wedding/800/400', sort_order: 4 },
  { id: uuidv4(), name: '명절·제사', slug: 'holiday', description: '추석·설날 전통 화과자', image_url: 'https://picsum.photos/seed/holiday/800/400', sort_order: 5 },
  { id: uuidv4(), name: '기업·답례품', slug: 'corporate', description: '로고 각인 가능한 단체 주문용', image_url: 'https://picsum.photos/seed/corporate/800/400', sort_order: 6 },
  { id: uuidv4(), name: '계절 한정', slug: 'seasonal', description: '봄·여름·가을·겨울 시즌 특별 화과자', image_url: 'https://picsum.photos/seed/seasonal/800/400', sort_order: 7 },
  { id: uuidv4(), name: '선물 세트', slug: 'gift-set', description: '2종·5종·10종 혼합 구성', image_url: 'https://picsum.photos/seed/giftset/800/400', sort_order: 8 },
];

const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (id, name, slug, description, image_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)');
for (const c of categories) insertCategory.run(c.id, c.name, c.slug, c.description, c.image_url, c.sort_order);
console.log('카테고리 삽입 완료');

// 상품 데이터
const productTemplates = [
  // 상견례
  { name: '정성 상견례 세트', slug: 'sanggyeonrye', price: 85000, stock: 20, desc: '첫 만남의 설레임을 담아 정성스럽게 만든 화과자 세트. 봄 꽃 모양의 네리키리와 함께 격조 있는 선물을 전하세요.', ingredients: '찹쌀가루, 팥앙금, 백앙금, 천연색소', storage: '냉장', shelf_life: '제조일로부터 5일', tags: ['인기', '선물'], img_seed: 'wagashi1' },
  { name: '매화 상견례 2인 세트', slug: 'sanggyeonrye', price: 48000, stock: 15, desc: '매화 꽃잎을 형상화한 섬세한 화과자. 두 가문의 첫 만남을 아름답게 장식합니다.', ingredients: '백앙금, 한천, 천연색소, 흑임자', storage: '냉장', shelf_life: '제조일로부터 5일', tags: ['신상'], img_seed: 'wagashi2' },
  { name: '격조 상견례 선물함', slug: 'sanggyeonrye', price: 120000, stock: 8, desc: '고급 오동나무 상자에 담긴 프리미엄 화과자. 격식 있는 자리에 어울리는 품격 있는 선물입니다.', ingredients: '찹쌀가루, 팥앙금, 백앙금, 계피, 천연색소', storage: '냉장', shelf_life: '제조일로부터 5일', tags: ['인기', '프리미엄'], img_seed: 'wagashi3' },
  // 환갑·칠순
  { name: '오복 환갑 선물 세트', slug: 'birthday', price: 98000, stock: 12, desc: '오복을 담은 다섯 가지 모양의 화과자. 어르신의 건강과 장수를 기원하는 마음을 담았습니다.', ingredients: '찹쌀가루, 팥앙금, 백앙금, 호박, 흑임자', storage: '냉장', shelf_life: '제조일로부터 5일', tags: ['인기'], img_seed: 'wagashi4' },
  { name: '국화 칠순 화과자', slug: 'birthday', price: 65000, stock: 18, desc: '국화꽃을 형상화한 화과자로 어르신의 칠순을 축하합니다. 전통의 맛과 현대적 감각을 담았습니다.', ingredients: '백앙금, 식용 국화, 한천, 천연색소', storage: '냉장', shelf_life: '제조일로부터 5일', tags: ['신상'], img_seed: 'wagashi5' },
  { name: '수복강녕 8종 세트', slug: 'birthday', price: 145000, stock: 6, desc: '수·복·강·녕을 담은 여덟 가지 화과자 프리미엄 세트. 귀한 어른께 드리기 최적인 고급 선물입니다.', ingredients: '찹쌀가루, 팥앙금, 백앙금, 오미자, 치자, 흑임자', storage: '냉장', shelf_life: '제조일로부터 5일', tags: ['프리미엄'], img_seed: 'wagashi6' },
  // 돌잔치
  { name: '복숭아 돌잔치 세트', slug: 'dol', price: 55000, stock: 25, desc: '장수를 상징하는 복숭아 모양의 귀여운 화과자. 아이의 첫 생일을 특별하게 만들어 드립니다.', ingredients: '찹쌀가루, 백앙금, 딸기분말, 천연색소', storage: '냉장', shelf_life: '제조일로부터 5일', tags: ['인기', '귀여운'], img_seed: 'wagashi7' },
  { name: '곰돌이 돌화과자 6종', slug: 'dol', price: 42000, stock: 30, desc: '아이들이 좋아하는 귀여운 동물 모양 화과자. 달콤한 맛으로 돌잔치를 더욱 풍성하게 합니다.', ingredients: '백앙금, 흑임자앙금, 천연색소', storage: '냉장', shelf_life: '제조일로부터 5일', tags: ['귀여운', '신상'], img_seed: 'wagashi8' },
  { name: '무지개 돌잔치 선물 세트', slug: 'dol', price: 78000, stock: 15, desc: '일곱 빛깔 무지개처럼 화려하고 행복한 아이의 첫 돌을 축하합니다.', ingredients: '찹쌀가루, 백앙금, 천연색소, 과일분말', storage: '냉장', shelf_life: '제조일로부터 5일', tags: ['인기'], img_seed: 'wagashi9' },
  // 결혼·웨딩
  { name: '백년해로 웨딩 세트', slug: 'wedding', price: 110000, stock: 10, desc: '두 사람의 영원한 사랑을 담은 웨딩 화과자 세트. 순백의 꽃잎과 금박으로 장식한 최고급 선물입니다.', ingredients: '백앙금, 찹쌀가루, 금박, 천연색소', storage: '냉장', shelf_life: '제조일로부터 5일', tags: ['인기', '프리미엄'], img_seed: 'wagashi10' },
  { name: '봄날 웨딩 화과자', slug: 'wedding', price: 68000, stock: 20, desc: '벚꽃 흩날리는 봄날의 설레임을 담은 웨딩 화과자. 결혼식 답례품으로 최적입니다.', ingredients: '백앙금, 벚꽃분말, 한천, 천연색소', storage: '냉장', shelf_life: '제조일로부터 5일', tags: ['신상'], img_seed: 'wagashi11' },
  { name: '골드 웨딩 프리미엄 박스', slug: 'wedding', price: 180000, stock: 5, desc: '황금빛 고급 패키지에 담긴 웨딩 화과자. 특별한 날의 기억을 영원히 간직할 최고의 선물입니다.', ingredients: '백앙금, 찹쌀가루, 금박, 장미분말, 천연색소', storage: '냉장', shelf_life: '제조일로부터 5일', tags: ['프리미엄'], img_seed: 'wagashi12' },
  // 명절·제사
  { name: '추석 전통 화과자 세트', slug: 'holiday', price: 52000, stock: 40, desc: '추석 차례상에 올리기 좋은 전통 화과자 세트. 선조의 지혜를 담은 정통 레시피로 만들었습니다.', ingredients: '찹쌀가루, 팥앙금, 콩가루, 참기름', storage: '실온', shelf_life: '제조일로부터 7일', tags: ['전통', '인기'], img_seed: 'wagashi13' },
  { name: '설날 모둠 화과자', slug: 'holiday', price: 45000, stock: 35, desc: '설날의 새 출발을 축하하는 모둠 화과자. 우리 조상의 손맛을 담아 정성스럽게 만들었습니다.', ingredients: '찹쌀가루, 팥앙금, 흑임자, 계피', storage: '실온', shelf_life: '제조일로부터 7일', tags: ['전통'], img_seed: 'wagashi14' },
  { name: '제례용 고급 화과자 세트', slug: 'holiday', price: 72000, stock: 20, desc: '정성을 다해 만든 제례용 전통 화과자. 선조를 기리는 마음을 담아 정갈하게 준비했습니다.', ingredients: '찹쌀가루, 팥앙금, 청포묵가루, 천연색소', storage: '실온', shelf_life: '제조일로부터 7일', tags: ['전통', '프리미엄'], img_seed: 'wagashi15' },
  // 기업·답례품
  { name: '기업 답례 화과자 (10개입)', slug: 'corporate', price: 35000, stock: 100, desc: '기업 행사 답례품으로 최적화된 화과자 세트. 로고 각인 가능하며 대량 주문 시 할인됩니다.', ingredients: '백앙금, 찹쌀가루, 천연색소', storage: '냉장', shelf_life: '제조일로부터 5일', tags: ['단체주문'], img_seed: 'wagashi16' },
  { name: '프리미엄 기업 선물 세트', slug: 'corporate', price: 85000, stock: 50, desc: '고급스러운 포장과 함께 기업의 품격을 높이는 프리미엄 화과자 선물 세트입니다.', ingredients: '백앙금, 찹쌀가루, 금박, 천연색소', storage: '냉장', shelf_life: '제조일로부터 5일', tags: ['프리미엄', '단체주문'], img_seed: 'wagashi17' },
  { name: '각인 화과자 미니 박스', slug: 'corporate', price: 28000, stock: 200, desc: '회사 로고나 메시지를 각인할 수 있는 미니 화과자 박스. 소량부터 대량까지 주문 가능합니다.', ingredients: '백앙금, 찹쌀가루, 천연색소', storage: '냉장', shelf_life: '제조일로부터 5일', tags: ['단체주문', '인기'], img_seed: 'wagashi18' },
  // 계절 한정
  { name: '봄 벚꽃 한정 화과자', slug: 'seasonal', price: 48000, stock: 30, desc: '봄에만 맛볼 수 있는 벚꽃 화과자. 연한 분홍빛과 달콤한 향기로 봄의 설레임을 전합니다.', ingredients: '백앙금, 벚꽃분말, 한천, 천연색소', storage: '냉장', shelf_life: '제조일로부터 5일', tags: ['계절한정', '봄'], img_seed: 'wagashi19' },
  { name: '겨울 설화 화과자', slug: 'seasonal', price: 52000, stock: 25, desc: '겨울 눈꽃을 형상화한 한정 화과자. 차가운 계절에 따뜻한 감동을 선물합니다.', ingredients: '백앙금, 찹쌀가루, 말차, 천연색소', storage: '냉장', shelf_life: '제조일로부터 5일', tags: ['계절한정', '겨울'], img_seed: 'wagashi20' },
  { name: '가을 단풍 화과자 세트', slug: 'seasonal', price: 58000, stock: 20, desc: '붉게 물든 가을 단풍을 담은 화과자. 가을의 풍성함과 깊은 맛을 동시에 느끼세요.', ingredients: '백앙금, 고구마앙금, 계피, 천연색소', storage: '냉장', shelf_life: '제조일로부터 5일', tags: ['계절한정', '가을'], img_seed: 'wagashi21' },
  // 선물 세트
  { name: '2종 혼합 선물 세트', slug: 'gift-set', price: 38000, stock: 50, desc: '인기 화과자 2종을 아름다운 선물 상자에 담았습니다. 간단하지만 진심이 담긴 선물입니다.', ingredients: '찹쌀가루, 팥앙금, 백앙금, 천연색소', storage: '냉장', shelf_life: '제조일로부터 5일', tags: ['인기'], img_seed: 'wagashi22' },
  { name: '5종 시그니처 세트', slug: 'gift-set', price: 75000, stock: 35, desc: '매장 시그니처 화과자 5종을 엄선하여 구성했습니다. 다양한 맛의 조화를 경험해보세요.', ingredients: '찹쌀가루, 팥앙금, 백앙금, 말차, 흑임자, 천연색소', storage: '냉장', shelf_life: '제조일로부터 5일', tags: ['인기', '시그니처'], img_seed: 'wagashi23' },
  { name: '10종 프리미엄 선물 세트', slug: 'gift-set', price: 138000, stock: 20, desc: '정성스럽게 선별한 10가지 화과자로 구성된 프리미엄 세트. 최고의 선물로 마음을 전하세요.', ingredients: '찹쌀가루, 팥앙금, 백앙금, 말차, 흑임자, 오미자, 치자, 천연색소', storage: '냉장', shelf_life: '제조일로부터 5일', tags: ['프리미엄', '인기'], img_seed: 'wagashi24' },
];

const insertProduct = db.prepare(
  'INSERT OR IGNORE INTO products (id, name, category_slug, price, stock, description, ingredients, storage, shelf_life, images, tags, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)'
);
for (const p of productTemplates) {
  const images = JSON.stringify([
    `https://picsum.photos/seed/${p.img_seed}/600/600`,
    `https://picsum.photos/seed/${p.img_seed}a/600/600`,
    `https://picsum.photos/seed/${p.img_seed}b/600/600`
  ]);
  insertProduct.run(uuidv4(), p.name, p.slug, p.price, p.stock, p.desc, p.ingredients, p.storage, p.shelf_life, images, JSON.stringify(p.tags));
}
console.log('상품 데이터 삽입 완료');

// 관리자 계정 생성
const adminUsername = process.env.ADMIN_USERNAME || 'admin';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234!';
const adminHash = bcrypt.hashSync(adminPassword, 10);
const existingAdmin = db.prepare('SELECT id FROM admins WHERE username = ?').get(adminUsername);
if (!existingAdmin) {
  db.prepare('INSERT INTO admins (id, username, password) VALUES (?, ?, ?)').run(uuidv4(), adminUsername, adminHash);
  console.log(`관리자 계정 생성: ${adminUsername} / ${adminPassword}`);
} else {
  console.log('관리자 계정이 이미 존재합니다.');
}

console.log('\n시드 데이터 삽입 완료!');
process.exit(0);
