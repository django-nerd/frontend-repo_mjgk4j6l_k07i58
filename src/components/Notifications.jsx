import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL || '';

export default function Notifications() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);

  const fetchData = async () => {
    // Assuming your backend exposes these within get-user or another endpoint.
    // Here we try get-user for simplicity; adjust mapping to your payload shape.
    const res = await fetch(API_BASE + '/api/auth/get-user', { credentials: 'include' });
    if (!res.ok) return;
    const data = await res.json();
    setIncoming(data.incomingRequests || []);
    setOutgoing(data.outgoingRequests || []);
  };

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, 5000);
    return () => clearInterval(id);
  }, []);

  const respond = async (swapId, decision) => {
    const res = await fetch(`${API_BASE}/api/swap-response/${swapId}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision }),
    });
    if (res.ok) fetchData();
  };

  return (
    <section className="container mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold flex items-center gap-2"><Bell className="w-5 h-5"/> Notifications & Requests</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium mb-3">Incoming Requests</h4>
          <div className="space-y-3">
            {incoming.length === 0 && <p className="text-sm text-gray-600">No incoming requests.</p>}
            {incoming.map(req => (
              <div key={req.id || req._id} className="bg-white rounded-lg p-4 shadow border">
                <p className="text-sm text-gray-800">{req.fromName || 'Someone'} wants to swap <span className="font-medium">{req.targetTitle}</span> with <span className="font-medium">{req.offerTitle}</span>.</p>
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={()=>respond(req.id || req._id, 'ACCEPT')} className="px-3 py-1.5 rounded-md bg-emerald-600 text-white">Accept</button>
                  <button onClick={()=>respond(req.id || req._id, 'REJECT')} className="px-3 py-1.5 rounded-md border">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-medium mb-3">Outgoing Requests</h4>
          <div className="space-y-3">
            {outgoing.length === 0 && <p className="text-sm text-gray-600">No outgoing requests.</p>}
            {outgoing.map(req => (
              <div key={req.id || req._id} className="bg-white rounded-lg p-4 shadow border">
                <p className="text-sm text-gray-800">Waiting for response on your request to swap <span className="font-medium">{req.targetTitle}</span>.</p>
                <span className="text-xs mt-2 inline-block px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">Pending...</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
