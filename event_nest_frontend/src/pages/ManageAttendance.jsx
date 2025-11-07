import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { apiClient } from '../lib/api.js';
import { showToast } from '../lib/toast.js';

export default function ManageAttendancePage() {
  const { id } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventRes, regsRes] = await Promise.all([
        apiClient.get(`/events/${id}`),
        apiClient.get(`/events/${id}/registrations`)
      ]);
      setEvent(eventRes.data);
      setRegistrations(regsRes.data || []);
    } catch (error) {
      showToast('Could not load attendance data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleMarkAttended = async (registrationId) => {
    try {
      await apiClient.post(`/registrations/${registrationId}/attend`);
      showToast('Attendance marked!');
      setRegistrations((prev) => prev.map((reg) => reg.id === registrationId ? { ...reg, attended: true } : reg));
    } catch (error) {
      showToast('Failed to mark attendance.');
    }
  };

  if (loading) return <p className="text-center text-lg">Loading attendance...</p>;

  return (
    <section className="max-w-4xl mx-auto panel-glass p-8 md:p-12 rounded-2xl">
      <h2 className="text-3xl font-bold mb-4">Manage Attendance</h2>
      <p className="text-xl text-gray-300 mb-8">For: {event?.title}</p>
      <div className="space-y-4">
        {registrations.length === 0 ? (
          <p className="text-gray-400">No one has registered for this event yet.</p>
        ) : (
          registrations.map((reg) => (
            <div key={reg.id} className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-700/50 p-4 rounded-lg">
              <div>
                <h4 className="font-semibold text-lg">{reg.user.name}</h4>
                <p className="text-sm text-gray-400">{reg.user.email}</p>
              </div>
              <button onClick={() => handleMarkAttended(reg.id)} className={`btn btn-sm ${reg.attended ? 'btn-secondary' : 'btn-primary'}`} disabled={reg.attended}>
                {reg.attended ? (<><Check className="w-4 h-4 mr-1"/> Attended</>) : 'Mark Attended'}
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
