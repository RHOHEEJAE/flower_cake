-- Seed categories
INSERT INTO public.categories (name, slug, description, image_url, sort_order) VALUES
  ('상견례', 'sanggyeonrye', '첫 만남의 격식과 정성을 담은 선물 세트', 'https://picsum.photos/seed/sanggyeonrye/800/400', 1),
  ('환갑·칠순', 'birthday', '장수와 감사를 담은 고급 화과자', 'https://picsum.photos/seed/birthday/800/400', 2),
  ('돌잔치', 'dol', '아이의 첫 생일을 축하하는 귀여운 디자인', 'https://picsum.photos/seed/dol/800/400', 3),
  ('결혼·웨딩', 'wedding', '두 사람의 시작을 축하하는 우아한 세트', 'https://picsum.photos/seed/wedding/800/400', 4),
  ('명절·제사', 'holiday', '추석·설날 전통 화과자', 'https://picsum.photos/seed/holiday/800/400', 5),
  ('기업·답례품', 'corporate', '로고 각인 가능한 단체 주문용', 'https://picsum.photos/seed/corporate/800/400', 6),
  ('계절 한정', 'seasonal', '봄·여름·가을·겨울 시즌 특별 화과자', 'https://picsum.photos/seed/seasonal/800/400', 7),
  ('선물 세트', 'gift-set', '2종·5종·10종 혼합 구성', 'https://picsum.photos/seed/giftset/800/400', 8)
ON CONFLICT (slug) DO NOTHING;

-- Seed products
INSERT INTO public.products (name, category_slug, price, stock, description, ingredients, storage, shelf_life, images, tags) VALUES
  -- 상견례
  ('정성 상견례 세트', 'sanggyeonrye', 85000, 20, '첫 만남의 설레임을 담아 정성스럽게 만든 화과자 세트. 봄 꽃 모양의 네리키리와 함께 격조 있는 선물을 전하세요.', '찹쌀가루, 팥앙금, 백앙금, 천연색소', '냉장', '제조일로부터 5일', '["https://picsum.photos/seed/wagashi1/600/600","https://picsum.photos/seed/wagashi1a/600/600","https://picsum.photos/seed/wagashi1b/600/600"]'::jsonb, '["인기","선물"]'::jsonb),
  ('매화 상견례 2인 세트', 'sanggyeonrye', 48000, 15, '매화 꽃잎을 형상화한 섬세한 화과자. 두 가문의 첫 만남을 아름답게 장식합니다.', '백앙금, 한천, 천연색소, 흑임자', '냉장', '제조일로부터 5일', '["https://picsum.photos/seed/wagashi2/600/600","https://picsum.photos/seed/wagashi2a/600/600","https://picsum.photos/seed/wagashi2b/600/600"]'::jsonb, '["신상"]'::jsonb),
  ('격조 상견례 선물함', 'sanggyeonrye', 120000, 8, '고급 오동나무 상자에 담긴 프리미엄 화과자. 격식 있는 자리에 어울리는 품격 있는 선물입니다.', '찹쌀가루, 팥앙금, 백앙금, 계피, 천연색소', '냉장', '제조일로부터 5일', '["https://picsum.photos/seed/wagashi3/600/600","https://picsum.photos/seed/wagashi3a/600/600","https://picsum.photos/seed/wagashi3b/600/600"]'::jsonb, '["인기","프리미엄"]'::jsonb),
  -- 환갑·칠순
  ('오복 환갑 선물 세트', 'birthday', 98000, 12, '오복을 담은 다섯 가지 모양의 화과자. 어르신의 건강과 장수를 기원하는 마음을 담았습니다.', '찹쌀가루, 팥앙금, 백앙금, 호박, 흑임자', '냉장', '제조일로부터 5일', '["https://picsum.photos/seed/wagashi4/600/600","https://picsum.photos/seed/wagashi4a/600/600","https://picsum.photos/seed/wagashi4b/600/600"]'::jsonb, '["인기"]'::jsonb),
  ('국화 칠순 화과자', 'birthday', 65000, 18, '국화꽃을 형상화한 화과자로 어르신의 칠순을 축하합니다. 전통의 맛과 현대적 감각을 담았습니다.', '백앙금, 식용 국화, 한천, 천연색소', '냉장', '제조일로부터 5일', '["https://picsum.photos/seed/wagashi5/600/600","https://picsum.photos/seed/wagashi5a/600/600","https://picsum.photos/seed/wagashi5b/600/600"]'::jsonb, '["신상"]'::jsonb),
  ('수복강녕 8종 세트', 'birthday', 145000, 6, '수·복·강·녕을 담은 여덟 가지 화과자 프리미엄 세트. 귀한 어른께 드리기 최적인 고급 선물입니다.', '찹쌀가루, 팥앙금, 백앙금, 오미자, 치자, 흑임자', '냉장', '제조일로부터 5일', '["https://picsum.photos/seed/wagashi6/600/600","https://picsum.photos/seed/wagashi6a/600/600","https://picsum.photos/seed/wagashi6b/600/600"]'::jsonb, '["프리미엄"]'::jsonb),
  -- 돌잔치
  ('복숭아 돌잔치 세트', 'dol', 55000, 25, '장수를 상징하는 복숭아 모양의 귀여운 화과자. 아이의 첫 생일을 특별하게 만들어 드립니다.', '찹쌀가루, 백앙금, 딸기분말, 천연색소', '냉장', '제조일로부터 5일', '["https://picsum.photos/seed/wagashi7/600/600","https://picsum.photos/seed/wagashi7a/600/600","https://picsum.photos/seed/wagashi7b/600/600"]'::jsonb, '["인기","귀여운"]'::jsonb),
  ('곰돌이 돌화과자 6종', 'dol', 42000, 30, '아이들이 좋아하는 귀여운 동물 모양 화과자. 달콤한 맛으로 돌잔치를 더욱 풍성하게 합니다.', '백앙금, 흑임자앙금, 천연색소', '냉장', '제조일로부터 5일', '["https://picsum.photos/seed/wagashi8/600/600","https://picsum.photos/seed/wagashi8a/600/600","https://picsum.photos/seed/wagashi8b/600/600"]'::jsonb, '["귀여운","신상"]'::jsonb),
  ('무지개 돌잔치 선물 세트', 'dol', 78000, 15, '일곱 빛깔 무지개처럼 화려하고 행복한 아이의 첫 돌을 축하합니다.', '찹쌀가루, 백앙금, 천연색소, 과일분말', '냉장', '제조일로부터 5일', '["https://picsum.photos/seed/wagashi9/600/600","https://picsum.photos/seed/wagashi9a/600/600","https://picsum.photos/seed/wagashi9b/600/600"]'::jsonb, '["인기"]'::jsonb),
  -- 결혼·웨딩
  ('백년해로 웨딩 세트', 'wedding', 110000, 10, '두 사람의 영원한 사랑을 담은 웨딩 화과자 세트. 순백의 꽃잎과 금박으로 장식한 최고급 선물입니다.', '백앙금, 찹쌀가루, 금박, 천연색소', '냉장', '제조일로부터 5일', '["https://picsum.photos/seed/wagashi10/600/600","https://picsum.photos/seed/wagashi10a/600/600","https://picsum.photos/seed/wagashi10b/600/600"]'::jsonb, '["인기","프리미엄"]'::jsonb),
  ('봄날 웨딩 화과자', 'wedding', 68000, 20, '벚꽃 흩날리는 봄날의 설레임을 담은 웨딩 화과자. 결혼식 답례품으로 최적입니다.', '백앙금, 벚꽃분말, 한천, 천연색소', '냉장', '제조일로부터 5일', '["https://picsum.photos/seed/wagashi11/600/600","https://picsum.photos/seed/wagashi11a/600/600","https://picsum.photos/seed/wagashi11b/600/600"]'::jsonb, '["신상"]'::jsonb),
  ('골드 웨딩 프리미엄 박스', 'wedding', 180000, 5, '황금빛 고급 패키지에 담긴 웨딩 화과자. 특별한 날의 기억을 영원히 간직할 최고의 선물입니다.', '백앙금, 찹쌀가루, 금박, 장미분말, 천연색소', '냉장', '제조일로부터 5일', '["https://picsum.photos/seed/wagashi12/600/600","https://picsum.photos/seed/wagashi12a/600/600","https://picsum.photos/seed/wagashi12b/600/600"]'::jsonb, '["프리미엄"]'::jsonb),
  -- 명절·제사
  ('추석 전통 화과자 세트', 'holiday', 52000, 40, '추석 차례상에 올리기 좋은 전통 화과자 세트. 선조의 지혜를 담은 정통 레시피로 만들었습니다.', '찹쌀가루, 팥앙금, 콩가루, 참기름', '실온', '제조일로부터 7일', '["https://picsum.photos/seed/wagashi13/600/600","https://picsum.photos/seed/wagashi13a/600/600","https://picsum.photos/seed/wagashi13b/600/600"]'::jsonb, '["전통","인기"]'::jsonb),
  ('설날 모둠 화과자', 'holiday', 45000, 35, '설날의 새 출발을 축하하는 모둠 화과자. 우리 조상의 손맛을 담아 정성스럽게 만들었습니다.', '찹쌀가루, 팥앙금, 흑임자, 계피', '실온', '제조일로부터 7일', '["https://picsum.photos/seed/wagashi14/600/600","https://picsum.photos/seed/wagashi14a/600/600","https://picsum.photos/seed/wagashi14b/600/600"]'::jsonb, '["전통"]'::jsonb),
  ('제례용 고급 화과자 세트', 'holiday', 72000, 20, '정성을 다해 만든 제례용 전통 화과자. 선조를 기리는 마음을 담아 정갈하게 준비했습니다.', '찹쌀가루, 팥앙금, 청포묵가루, 천연색소', '실온', '제조일로부터 7일', '["https://picsum.photos/seed/wagashi15/600/600","https://picsum.photos/seed/wagashi15a/600/600","https://picsum.photos/seed/wagashi15b/600/600"]'::jsonb, '["전통","프리미엄"]'::jsonb),
  -- 기업·답례품
  ('기업 답례 화과자 (10개입)', 'corporate', 35000, 100, '기업 행사 답례품으로 최적화된 화과자 세트. 로고 각인 가능하며 대량 주문 시 할인됩니다.', '백앙금, 찹쌀가루, 천연색소', '냉장', '제조일로부터 5일', '["https://picsum.photos/seed/wagashi16/600/600","https://picsum.photos/seed/wagashi16a/600/600","https://picsum.photos/seed/wagashi16b/600/600"]'::jsonb, '["단체주문"]'::jsonb),
  ('프리미엄 기업 선물 세트', 'corporate', 85000, 50, '고급스러운 포장과 함께 기업의 품격을 높이는 프리미엄 화과자 선물 세트입니다.', '백앙금, 찹쌀가루, 금박, 천연색소', '냉장', '제조일로부터 5일', '["https://picsum.photos/seed/wagashi17/600/600","https://picsum.photos/seed/wagashi17a/600/600","https://picsum.photos/seed/wagashi17b/600/600"]'::jsonb, '["프리미엄","단체주문"]'::jsonb),
  ('각인 화과자 미니 박스', 'corporate', 28000, 200, '회사 로고나 메시지를 각인할 수 있는 미니 화과자 박스. 소량부터 대량까지 주문 가능합니다.', '백앙금, 찹쌀가루, 천연색소', '냉장', '제조일로부터 5일', '["https://picsum.photos/seed/wagashi18/600/600","https://picsum.photos/seed/wagashi18a/600/600","https://picsum.photos/seed/wagashi18b/600/600"]'::jsonb, '["단체주문","인기"]'::jsonb),
  -- 계절 한정
  ('봄 벚꽃 한정 화과자', 'seasonal', 48000, 30, '봄에만 맛볼 수 있는 벚꽃 화과자. 연한 분홍빛과 달콤한 향기로 봄의 설레임을 전합니다.', '백앙금, 벚꽃분말, 한천, 천연색소', '냉장', '제조일로부터 5일', '["https://picsum.photos/seed/wagashi19/600/600","https://picsum.photos/seed/wagashi19a/600/600","https://picsum.photos/seed/wagashi19b/600/600"]'::jsonb, '["계절한정","봄"]'::jsonb),
  ('겨울 설화 화과자', 'seasonal', 52000, 25, '겨울 눈꽃을 형상화한 한정 화과자. 차가운 계절에 따뜻한 감동을 선물합니다.', '백앙금, 찹쌀가루, 말차, 천연색소', '냉장', '제조일로부터 5일', '["https://picsum.photos/seed/wagashi20/600/600","https://picsum.photos/seed/wagashi20a/600/600","https://picsum.photos/seed/wagashi20b/600/600"]'::jsonb, '["계절한정","겨울"]'::jsonb),
  ('가을 단풍 화과자 세트', 'seasonal', 58000, 20, '붉게 물든 가을 단풍을 담은 화과자. 가을의 풍성함과 깊은 맛을 동시에 느끼세요.', '백앙금, 고구마앙금, 계피, 천연색소', '냉장', '제조일로부터 5일', '["https://picsum.photos/seed/wagashi21/600/600","https://picsum.photos/seed/wagashi21a/600/600","https://picsum.photos/seed/wagashi21b/600/600"]'::jsonb, '["계절한정","가을"]'::jsonb),
  -- 선물 세트
  ('2종 혼합 선물 세트', 'gift-set', 38000, 50, '인기 화과자 2종을 아름다운 선물 상자에 담았습니다. 간단하지만 진심이 담긴 선물입니다.', '찹쌀가루, 팥앙금, 백앙금, 천연색소', '냉장', '제조일로부터 5일', '["https://picsum.photos/seed/wagashi22/600/600","https://picsum.photos/seed/wagashi22a/600/600","https://picsum.photos/seed/wagashi22b/600/600"]'::jsonb, '["인기"]'::jsonb),
  ('5종 시그니처 세트', 'gift-set', 75000, 35, '매장 시그니처 화과자 5종을 엄선하여 구성했습니다. 다양한 맛의 조화를 경험해보세요.', '찹쌀가루, 팥앙금, 백앙금, 말차, 흑임자, 천연색소', '냉장', '제조일로부터 5일', '["https://picsum.photos/seed/wagashi23/600/600","https://picsum.photos/seed/wagashi23a/600/600","https://picsum.photos/seed/wagashi23b/600/600"]'::jsonb, '["인기","시그니처"]'::jsonb),
  ('10종 프리미엄 선물 세트', 'gift-set', 138000, 20, '정성스럽게 선별한 10가지 화과자로 구성된 프리미엄 세트. 최고의 선물로 마음을 전하세요.', '찹쌀가루, 팥앙금, 백앙금, 말차, 흑임자, 오미자, 치자, 천연색소', '냉장', '제조일로부터 5일', '["https://picsum.photos/seed/wagashi24/600/600","https://picsum.photos/seed/wagashi24a/600/600","https://picsum.photos/seed/wagashi24b/600/600"]'::jsonb, '["프리미엄","인기"]'::jsonb)
ON CONFLICT DO NOTHING;
