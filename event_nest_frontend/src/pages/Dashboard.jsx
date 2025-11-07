import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TicketX } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { apiClient } from '../lib/api.js';
import { showToast } from '../lib/toast.js';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [registrations, setRegistrations] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [regsRes, certsRes] = await Promise.all([
          apiClient.get('/users/me/registrations'),
          apiClient.get('/users/me/certificates')
        ]);
        setRegistrations(regsRes.data || []);
        setCertificates(certsRes.data || []);
      } catch (error) {
        showToast('Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-center text-lg">Loading dashboard...</p>;

  return (
    <section id="page-dashboard">
      <h2 className="text-4xl font-bold mb-12">My Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 panel-glass p-8 text-center h-fit">
          <img src={`https://placehold.co/150x150/10b981/ffffff?text=${user?.name?.substring(0, 1) || 'U'}`} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-emerald-500" />
          <h3 className="text-2xl font-semibold">{user?.name}</h3>
          <p className="text-emerald-400 mb-4">{user?.email}</p>
          <button className="btn btn-secondary w-full" onClick={() => showToast('Edit Profile: Feature coming soon!')}>Edit Profile</button>
        </div>

        <div className="md:col-span-2 space-y-8">
          <div className="panel-glass p-8">
            <h3 className="text-2xl font-semibold mb-6">My Registered Events</h3>
            {registrations.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <TicketX className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <h4 className="text-xl font-semibold mb-2">No Events Yet</h4>
                <p className="mb-6">You haven't registered for any events.</p>
                <Link to="/events" className="btn btn-primary">Find Events</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {registrations.map(reg => (
                  <div key={reg.id} className="flex justify-between items-center bg-gray-700/50 p-4 rounded-lg">
                    <div>
                      <h4 className="font-semibold">{reg.event.title}</h4>
                      <p className="text-sm text-gray-400">{new Date(reg.event.date).toLocaleDateString()} - {reg.attended ? 'Attended' : 'Registered'}</p>
                    </div>
                    <Link to={`/events/${reg.event.id}`} className="btn btn-secondary btn-sm">View</Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="panel-glass p-8">
            <h3 className="text-2xl font-semibold mb-6">My Certificates</h3>
            {certificates.length === 0 ? (
              <p className="text-gray-400">You haven't earned any certificates yet. Attend events to get them!</p>
            ) : (
              <div className="space-y-4">
                {certificates.map(cert => (
                  <div key={cert.id} className="flex justify-between items-center bg-gray-700/50 p-4 rounded-lg">
                    <div>
                      <h4 className="font-semibold">Certificate for {cert.event.title}</h4>
                      <p className="text-sm text-gray-400">Issued: {new Date(cert.issued_at).toLocaleDateString()}</p>
                    </div>
                    <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">Download</a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
