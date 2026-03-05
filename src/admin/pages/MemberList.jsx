import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import { adminApi } from '../../lib/api';

const PROVIDERS = [
  { value: '', label: '전체' },
  { value: 'naver', label: '네이버' },
  { value: 'kakao', label: '카카오' },
];

export default function MemberList() {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ provider: '', from: '', to: '' });
  const [selected, setSelected] = useState(null);

  const load = () => {
    const params = new URLSearchParams();
    if (filter.provider) params.set('provider', filter.provider);
    if (filter.from) params.set('from', filter.from);
    if (filter.to) params.set('to', filter.to);
    adminApi.get(`/admin/members?${params}`)
      .then(res => setMembers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);

  const handleViewDetail = async (id) => {
    const res = await adminApi.get(`/admin/members/${id}`);
    setSelected(res.data);
  };

  const providerBadge = provider => provider === 'naver'
    ? <span className="text-xs px-1.5 py-0.5 bg-[#03C75A] text-white">N</span>
    : <span className="text-xs px-1.5 py-0.5 bg-[#FEE500] text-[#3C1E1E]">K</span>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="회원 관리" />
        <main className="flex-1 overflow-auto p-6">
          {/* 필터 */}
          <div className="bg-white border border-gray-100 p-4 mb-4 flex flex-wrap gap-3 items-end">
            <div>
              <label className="block font-sans text-xs text-gray-500 mb-1">가입 경로</label>
              <select
                value={filter.provider}
                onChange={e => setFilter(f => ({ ...f, provider: e.target.value }))}
                className="border border-brand-light px-3 py-2 font-sans text-sm focus:outline-none focus:border-brand-terra"
              >
                {PROVIDERS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-sans text-xs text-gray-500 mb-1">가입일 시작</label>
              <input type="date" value={filter.from} onChange={e => setFilter(f => ({ ...f, from: e.target.value }))}
                className="border border-brand-light px-3 py-2 font-sans text-sm focus:outline-none focus:border-brand-terra" />
            </div>
            <div>
              <label className="block font-sans text-xs text-gray-500 mb-1">가입일 종료</label>
              <input type="date" value={filter.to} onChange={e => setFilter(f => ({ ...f, to: e.target.value }))}
                className="border border-brand-light px-3 py-2 font-sans text-sm focus:outline-none focus:border-brand-terra" />
            </div>
            <button onClick={() => setFilter({ provider: '', from: '', to: '' })}
              className="font-sans text-xs text-brand-dark/50 hover:text-brand-terra px-3 py-2 border border-brand-light">
              초기화
            </button>
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
                    {['번호', '닉네임', '이메일', '가입 경로', '가입일', '총 주문', '관리'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {members.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-12 text-gray-400">회원이 없습니다.</td></tr>
                  ) : members.map((member, i) => (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                      <td className="px-4 py-3 text-brand-dark">{member.nickname}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{member.email || '-'}</td>
                      <td className="px-4 py-3">{providerBadge(member.provider)}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs">{new Date(member.created_at).toLocaleDateString('ko-KR')}</td>
                      <td className="px-4 py-3 font-serif text-brand-dark">{member.order_count}건</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleViewDetail(member.id)} className="text-xs text-brand-terra hover:underline">
                          상세
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>

      {/* 회원 상세 모달 */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4" onClick={() => setSelected(null)}>
          <div className="bg-white max-w-lg w-full max-h-[80vh] overflow-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base text-brand-dark">회원 상세</h3>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-brand-dark">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-2 font-sans text-sm mb-6">
              {[
                ['닉네임', selected.nickname],
                ['이메일', selected.email || '-'],
                ['전화번호', selected.phone || '-'],
                ['가입 경로', selected.provider === 'naver' ? '네이버' : '카카오'],
                ['가입일', new Date(selected.created_at).toLocaleDateString('ko-KR')],
                ['최근 로그인', selected.last_login_at ? new Date(selected.last_login_at).toLocaleDateString('ko-KR') : '-'],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-4">
                  <span className="text-gray-400 w-24 shrink-0">{label}</span>
                  <span className="text-brand-dark">{value}</span>
                </div>
              ))}
            </div>

            <h4 className="font-serif text-sm text-brand-dark mb-3 border-t border-gray-100 pt-4">주문 이력</h4>
            {selected.orders && selected.orders.length > 0 ? (
              <div className="space-y-2">
                {selected.orders.map(order => (
                  <div key={order.id} className="flex justify-between font-sans text-xs border border-gray-100 p-2">
                    <div>
                      <p className="text-gray-400">{new Date(order.created_at).toLocaleDateString('ko-KR')}</p>
                      <p className="text-brand-dark">{order.items.map(i => i.name).join(', ')}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-brand-dark">{order.total_price.toLocaleString()}원</p>
                      <p className="text-brand-terra">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-xs text-center py-4">주문 내역 없음</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
