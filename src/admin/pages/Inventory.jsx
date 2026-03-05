import { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import { adminApi } from '../../lib/api';

const STOCK_BADGE = {
  '품절': 'bg-red-100 text-red-700',
  '소량 남음': 'bg-orange-100 text-orange-700',
  '재고 있음': 'bg-green-100 text-green-700',
};

export default function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editStocks, setEditStocks] = useState({});
  const [saving, setSaving] = useState({});

  const load = () => {
    adminApi.get('/inventory')
      .then(res => {
        setInventory(res.data);
        const stocks = {};
        res.data.forEach(p => { stocks[p.id] = p.stock; });
        setEditStocks(stocks);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (productId) => {
    setSaving(s => ({ ...s, [productId]: true }));
    try {
      await adminApi.patch(`/inventory/${productId}`, { stock: editStocks[productId] });
      load();
    } catch {
    } finally {
      setSaving(s => ({ ...s, [productId]: false }));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="재고 관리" />
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white border border-gray-100 shadow-sm overflow-x-auto">
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-2 border-brand-terra border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <table className="w-full font-sans text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {['상품명', '카테고리', '현재 재고', '재고 상태', '재고 수정', '마지막 수정'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {inventory.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-400">상품이 없습니다.</td></tr>
                  ) : inventory.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-brand-dark max-w-[200px] truncate">{item.name}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{item.category_name || item.category_slug}</td>
                      <td className="px-4 py-3 font-serif text-brand-dark">{item.stock}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 ${STOCK_BADGE[item.stock_status] || ''}`}>
                          {item.stock_status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            value={editStocks[item.id] ?? item.stock}
                            onChange={e => setEditStocks(s => ({ ...s, [item.id]: parseInt(e.target.value) || 0 }))}
                            className="w-20 border border-brand-light px-2 py-1 font-sans text-sm focus:outline-none focus:border-brand-terra text-center"
                          />
                          <button
                            onClick={() => handleSave(item.id)}
                            disabled={saving[item.id] || editStocks[item.id] === item.stock}
                            className="text-xs text-white bg-brand-terra px-2 py-1 hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            {saving[item.id] ? '...' : '저장'}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs">
                        {new Date(item.created_at).toLocaleDateString('ko-KR')}
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
