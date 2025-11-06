import { useEffect, useState } from 'react';
import { Home, Calendar as CalendarIcon, ShoppingBag, Bell, LogOut, User } from 'lucide-react';
import HeroCover from './components/HeroCover';
import AuthForms from './components/AuthForms';
import Dashboard from './components/Dashboard';
import Marketplace from './components/Marketplace';
import Notifications from './components/Notifications';

const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = async () => {
    try {
      const res = await fetch(API_BASE + '/api/auth/get-user', { credentials: 'include' });
      if (res.ok) setUser(await res.json());
    } catch {}
    setLoading(false);
  };

  useEffect(() => { bootstrap(); }, []);

  const logout = async () => {
    await fetch(API_BASE + '/api/auth/logout', { method: 'POST', credentials: 'include' });
    setUser(null);
  };

  return { user, setUser, loading, logout };
}

function Nav({ current, setCurrent, user, onLogout }) {
  const items = [
    { key: 'home', icon: <Home className="w-4 h-4"/>, label: 'Home' },
    { key: 'dashboard', icon: <CalendarIcon className="w-4 h-4"/>, label: 'My Calendar' },
    { key: 'market', icon: <ShoppingBag className="w-4 h-4"/>, label: 'Marketplace' },
    { key: 'notifications', icon: <Bell className="w-4 h-4"/>, label: 'Notifications' },
  ];
  return (
    <header className="sticky top-0 z-40 bg-black/70 backdrop-blur border-b border-white/10">
      <div className="container mx-auto px-6 h-14 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-orange-400 to-pink-500" />
          <span className="font-semibold">SwapFlow</span>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {items.map(it => (
            <button key={it.key} onClick={()=>setCurrent(it.key)} className={`px-3 py-2 rounded-md text-sm inline-flex items-center gap-2 hover:bg-white/10 ${current===it.key?'bg-white/10':''}`}>
              {it.icon} {it.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2 text-sm text-white/80"><User className="w-4 h-4"/> {user.name || user.email}</div>
              <button onClick={onLogout} className="px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 inline-flex items-center gap-2"><LogOut className="w-4 h-4"/> Logout</button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const { user, setUser, loading, logout } = useAuth();
  const [current, setCurrent] = useState('home');

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Nav current={current} setCurrent={setCurrent} user={user} onLogout={logout} />

      {current === 'home' && (
        <>
          <HeroCover />
          <section className="container mx-auto px-6 py-10 grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold">Trade time, not favors</h2>
              <p className="mt-3 text-neutral-400">Create events, make them swappable, browse the marketplace, and manage incoming and outgoing requests — all in one place.</p>
              <ul className="mt-6 space-y-2 text-neutral-300 list-disc list-inside">
                <li>Simple calendar to manage your events</li>
                <li>One-click make swappable</li>
                <li>Request swaps securely</li>
                <li>Real-time updates for decisions</li>
              </ul>
            </div>
            <div>
              {!user && !loading ? (
                <AuthForms onAuth={() => window.location.reload()} />
              ) : (
                <div className="bg-white/5 rounded-xl p-6">
                  <p className="text-sm text-neutral-300">You are logged in. Jump into your calendar or the marketplace using the navigation above.</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {user && current === 'dashboard' && <Dashboard />}
      {user && current === 'market' && <Marketplace />}
      {user && current === 'notifications' && <Notifications />}

      {!user && current !== 'home' && (
        <section className="container mx-auto px-6 py-20">
          <div className="bg-white/5 border border-white/10 rounded-xl p-8 text-center">
            <h3 className="text-xl font-semibold">Please sign in</h3>
            <p className="text-neutral-400 mt-2">You need an account to access this page.</p>
          </div>
        </section>
      )}

      <footer className="border-t border-white/10 mt-16">
        <div className="container mx-auto px-6 py-8 text-sm text-neutral-400">© {new Date().getFullYear()} SwapFlow. All rights reserved.</div>
      </footer>
    </div>
  );
}
