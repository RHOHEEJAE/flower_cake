import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import { adminApi } from '../../lib/api';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    adminApi.get('/products')
      .then(res => setProducts(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`"${name}"을 삭제하시겠습니까?`)) return;
    await adminApi.delete(`/products/${id}`);
    load();
  };

  const stockBadge = stock => {
    if (stock === 0) return <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700">품절</span>;
    if (stock <= 5) return <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700">소량 남음</span>;
    return <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700">재고 있음</span>;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="상품 목록" />
        <main className="flex-1 overflow-auto p-6">
          <div className="flex justify-end mb-4">
            <Link to="/admin/products/new" className="btn-primary text-sm">+ 상품 등록</Link>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-2 border-brand-terra border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <table className="w-full font-sans text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['이미지', '상품명', '카테고리', '가격', '재고', '상태', '관리'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <img
                          src={p.images?.[0] || `https://picsum.photos/seed/${p.id}/60/60`}
                          alt={p.name}
                          className="w-12 h-12 object-cover"
                        />
                      </td>
                      <td className="px-4 py-3 text-brand-dark max-w-[200px] truncate">{p.name}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{p.category_slug}</td>
                      <td className="px-4 py-3 font-serif text-brand-dark">{p.price.toLocaleString()}원</td>
                      <td className="px-4 py-3 text-brand-dark">{p.stock}</td>
                      <td className="px-4 py-3">{stockBadge(p.stock)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link to={`/admin/products/${p.id}/edit`} className="text-xs text-brand-terra hover:underline">수정</Link>
                          <button onClick={() => handleDelete(p.id, p.name)} className="text-xs text-red-500 hover:underline">삭제</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
