export default function AdminHeader({ title }) {
  const username = (() => {
    try {
      const token = localStorage.getItem('wagashi_admin_token');
      if (!token) return 'Admin';
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username || 'Admin';
    } catch {
      return 'Admin';
    }
  })();

  return (
    <header className="bg-white border-b border-brand-light px-6 py-4 flex items-center justify-between">
      <h2 className="font-serif text-lg text-brand-dark">{title}</h2>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-brand-terra/20 flex items-center justify-center">
          <span className="font-serif text-xs text-brand-terra">{username.charAt(0).toUpperCase()}</span>
        </div>
        <span className="font-sans text-sm text-brand-dark/60">{username}</span>
      </div>
    </header>
  );
}
