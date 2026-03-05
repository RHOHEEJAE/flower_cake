import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import { adminApi } from '../../lib/api';

const CATEGORIES = [
  { value: 'sanggyeonrye', label: '상견례' },
  { value: 'birthday', label: '환갑·칠순' },
  { value: 'dol', label: '돌잔치' },
  { value: 'wedding', label: '결혼·웨딩' },
  { value: 'holiday', label: '명절·제사' },
  { value: 'corporate', label: '기업·답례품' },
  { value: 'seasonal', label: '계절 한정' },
  { value: 'gift-set', label: '선물 세트' },
];

const STORAGE_OPTIONS = ['냉장', '실온', '냉동'];
const INPUT_CLS = 'w-full border border-brand-light px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-brand-terra bg-white';

const INITIAL_FORM = {
  name: '',
  category_slug: 'gift-set',
  price: '',
  stock: '',
  description: '',
  ingredients: '',
  storage: '냉장',
  shelf_life: '',
  tags: '',
  is_active: true,
};

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form, setForm] = useState(INITIAL_FORM);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) {
      adminApi.get(`/products/${id}`).then(res => {
        const p = res.data.product;
        setForm({
          name: p.name,
          category_slug: p.category_slug,
          price: p.price,
          stock: p.stock,
          description: p.description || '',
          ingredients: p.ingredients || '',
          storage: p.storage || '냉장',
          shelf_life: p.shelf_life || '',
          tags: (p.tags || []).join(', '),
          is_active: p.is_active,
        });
        setExistingImages(p.images || []);
      }).catch(() => navigate('/admin/products'));
    }
  }, [id]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImages = e => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviewImages(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    if (images.length > 0) {
      images.forEach(f => formData.append('images', f));
    } else if (isEdit && existingImages.length > 0) {
      existingImages.forEach(img => formData.append('images', img));
    }

    try {
      if (isEdit) {
        await adminApi.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await adminApi.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      navigate('/admin/products');
    } catch (err) {
      setError(err.response?.data?.message || '저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const displayImages = previewImages.length > 0 ? previewImages : existingImages;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title={isEdit ? '상품 수정' : '상품 등록'} />
        <main className="flex-1 overflow-auto p-6">
          <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
            {error && <div className="p-3 bg-red-50 border border-red-200 text-red-600 font-sans text-xs">{error}</div>}

            <div className="bg-white border border-gray-100 p-6 space-y-4">
              <h3 className="font-serif text-sm text-brand-dark border-b border-gray-100 pb-3">기본 정보</h3>

              <div>
                <label className="block font-sans text-xs text-gray-500 mb-1">상품명 *</label>
                <input name="name" value={form.name} onChange={handleChange} required
                  className={INPUT_CLS} placeholder="상품명을 입력하세요" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-xs text-gray-500 mb-1">카테고리 *</label>
                  <select name="category_slug" value={form.category_slug} onChange={handleChange} className={INPUT_CLS}>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-sans text-xs text-gray-500 mb-1">보관 방법</label>
                  <select name="storage" value={form.storage} onChange={handleChange} className={INPUT_CLS}>
                    {STORAGE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-xs text-gray-500 mb-1">가격 (원) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} required
                    className={INPUT_CLS} placeholder="0" min="0" />
                </div>
                <div>
                  <label className="block font-sans text-xs text-gray-500 mb-1">재고 수량 *</label>
                  <input name="stock" type="number" value={form.stock} onChange={handleChange} required
                    className={INPUT_CLS} placeholder="0" min="0" />
                </div>
              </div>

              <div>
                <label className="block font-sans text-xs text-gray-500 mb-1">유통기한</label>
                <input name="shelf_life" value={form.shelf_life} onChange={handleChange}
                  className={INPUT_CLS} placeholder="예) 제조일로부터 5일" />
              </div>

              <div>
                <label className="block font-sans text-xs text-gray-500 mb-1">재료</label>
                <input name="ingredients" value={form.ingredients} onChange={handleChange}
                  className={INPUT_CLS} placeholder="예) 찹쌀가루, 팥앙금, 백앙금" />
              </div>

              <div>
                <label className="block font-sans text-xs text-gray-500 mb-1">상품 설명</label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  className={`${INPUT_CLS} h-28 resize-none`} placeholder="상품 상세 설명을 입력하세요" />
              </div>

              <div>
                <label className="block font-sans text-xs text-gray-500 mb-1">태그 (쉼표로 구분)</label>
                <input name="tags" value={form.tags} onChange={handleChange}
                  className={INPUT_CLS} placeholder="예) 인기, 신상, 프리미엄" />
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" name="is_active" id="is_active" checked={form.is_active} onChange={handleChange}
                  className="w-4 h-4 accent-brand-terra" />
                <label htmlFor="is_active" className="font-sans text-sm text-brand-dark">노출 (활성화)</label>
              </div>
            </div>

            <div className="bg-white border border-gray-100 p-6">
              <h3 className="font-serif text-sm text-brand-dark border-b border-gray-100 pb-3 mb-4">이미지</h3>
              <input type="file" multiple accept="image/*" onChange={handleImages}
                className="block font-sans text-sm text-brand-dark/60 mb-4" />
              {displayImages.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {displayImages.map((src, i) => (
                    <img key={i} src={src} alt="" className="w-20 h-20 object-cover border border-brand-light" />
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate('/admin/products')} className="btn-outline text-sm">취소</button>
              <button type="submit" disabled={loading} className="btn-primary text-sm disabled:opacity-60">
                {loading ? '저장 중...' : isEdit ? '수정 완료' : '등록 완료'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
