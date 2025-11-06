import { useEffect, useMemo, useState } from 'react';
import { Calendar, Plus, RefreshCw } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [status, setStatus] = useState('BUSY');
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    const res = await fetch(API_BASE + '/api/event/get-events', { credentials: 'include' });
    if (res.ok) setEvents(await res.json());
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const createEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(API_BASE + '/api/event/create-event', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, start, end, status }),
      });
      if (res.ok) {
        setTitle('');
        setStart('');
        setEnd('');
        setStatus('BUSY');
        await fetchEvents();
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleSwappable = async (event) => {
    const endpoint = event.status === 'SWAPPABLE' ? 'disable-swap' : 'enable-swap';
    const res = await fetch(`${API_BASE}/api/event/${endpoint}/${event._id || event.id}`, {
      method: 'PUT',
      credentials: 'include',
    });
    if (res.ok) fetchEvents();
  };

  const formatted = useMemo(() => events?.map(e => ({
    id: e._id || e.id,
    title: e.title,
    start: e.start,
    end: e.end,
    status: e.status || 'BUSY',
  })) || [], [events]);

  return (
    <section className="container mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2"><Calendar className="w-5 h-5"/> Your Events</h3>
        <button onClick={fetchEvents} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"><RefreshCw className="w-4 h-4"/> Refresh</button>
      </div>

      <form onSubmit={createEvent} className="grid grid-cols-1 md:grid-cols-5 gap-3 bg-white rounded-lg p-4 shadow">
        <input className="border rounded-md px-3 py-2" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
        <input className="border rounded-md px-3 py-2" type="datetime-local" value={start} onChange={e=>setStart(e.target.value)} required />
        <input className="border rounded-md px-3 py-2" type="datetime-local" value={end} onChange={e=>setEnd(e.target.value)} required />
        <select className="border rounded-md px-3 py-2" value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="BUSY">BUSY</option>
          <option value="SWAPPABLE">SWAPPABLE</option>
        </select>
        <button disabled={loading} className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white rounded-md px-4 py-2">
          <Plus className="w-4 h-4"/> {loading ? 'Saving...' : 'Add'}
        </button>
      </form>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {formatted.map(ev => (
          <div key={ev.id} className="bg-white rounded-lg p-4 shadow border">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{ev.title}</h4>
              <span className={`text-xs px-2 py-1 rounded-full ${ev.status === 'SWAPPABLE' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                {ev.status}
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-600">{new Date(ev.start).toLocaleString()} — {new Date(ev.end).toLocaleString()}</p>
            <div className="mt-4 flex items-center gap-2">
              <button onClick={()=>toggleSwappable(ev)} className="text-sm px-3 py-1.5 rounded-md border">
                {ev.status === 'SWAPPABLE' ? 'Make Busy' : 'Make Swappable'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
