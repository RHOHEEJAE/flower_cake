import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../lib/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await adminApi.post('/admin/login', form);
      localStorage.setItem('wagashi_admin_token', res.data.token);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-brand-cream tracking-widest mb-1">花菓子</h1>
          <p className="font-sans text-xs text-brand-cream/30 tracking-widest">ADMIN</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8">
          <h2 className="font-serif text-base text-brand-dark text-center mb-6">관리자 로그인</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 font-sans text-xs text-center">
              {error}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="block font-sans text-xs text-brand-dark/60 mb-1">아이디</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                className="w-full border border-brand-light px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-brand-terra"
                placeholder="admin"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block font-sans text-xs text-brand-dark/60 mb-1">비밀번호</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full border border-brand-light px-3 py-2.5 font-sans text-sm focus:outline-none focus:border-brand-terra"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
}
