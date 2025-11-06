import { useEffect, useMemo, useState } from 'react';
import { ShoppingBag } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

export default function Marketplace() {
  const [slots, setSlots] = useState([]);
  const [mySwappables, setMySwappables] = useState([]);
  const [chosen, setChosen] = useState('');
  const [target, setTarget] = useState(null);

  const fetchSlots = async () => {
    const res = await fetch(API_BASE + '/api/swappable-slots', { credentials: 'include' });
    if (res.ok) setSlots(await res.json());
  };
  const fetchMine = async () => {
    const res = await fetch(API_BASE + '/api/event/get-events', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      setMySwappables(data.filter(e => (e.status || '').toUpperCase() === 'SWAPPABLE'));
    }
  };

  useEffect(() => {
    fetchSlots();
    fetchMine();
  }, []);

  const requestSwap = async () => {
    if (!target || !chosen) return;
    const res = await fetch(API_BASE + '/api/swap-request', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetEventId: target._id || target.id, offeredEventId: chosen }),
    });
    if (res.ok) {
      setTarget(null);
      setChosen('');
      await fetchSlots();
    }
  };

  const list = useMemo(() => slots?.map(s => ({
    id: s._id || s.id,
    title: s.title,
    owner: s.ownerName || 'User',
    start: s.start,
    end: s.end,
  })) || [], [slots]);

  return (
    <section className="container mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2"><ShoppingBag className="w-5 h-5"/> Marketplace</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map(item => (
          <div key={item.id} className="bg-white rounded-lg p-4 shadow border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{item.title}</h4>
                <p className="text-xs text-gray-500">by {item.owner}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">{new Date(item.start).toLocaleString()} — {new Date(item.end).toLocaleString()}</p>
            <div className="mt-4">
              <button onClick={()=>{setTarget(item);}} className="text-sm px-3 py-1.5 rounded-md border bg-emerald-600 text-white">Request Swap</button>
            </div>
          </div>
        ))}
      </div>

      {target && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <h4 className="text-lg font-semibold">Offer one of your swappable slots</h4>
            <p className="text-sm text-gray-600 mt-1">Target: <span className="font-medium">{target.title}</span></p>
            <select className="mt-4 w-full border rounded-md px-3 py-2" value={chosen} onChange={e=>setChosen(e.target.value)}>
              <option value="">Select your slot</option>
              {mySwappables.map(m => (
                <option key={m._id || m.id} value={m._id || m.id}>
                  {m.title} — {new Date(m.start).toLocaleString()}
                </option>
              ))}
            </select>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button onClick={()=>{setTarget(null); setChosen('');}} className="px-3 py-1.5 rounded-md border">Cancel</button>
              <button onClick={requestSwap} className="px-3 py-1.5 rounded-md bg-blue-600 text-white">Send Request</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
