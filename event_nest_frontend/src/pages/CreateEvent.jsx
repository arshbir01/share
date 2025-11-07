import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../lib/api.js';
import { showToast } from '../lib/toast.js';

export default function CreateEventPage({ isEditMode = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '', category: 'tech', image_url: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiClient.post('/events', { ...formData, date: new Date(formData.date).toISOString() });
      showToast(isEditMode ? 'Event updated!' : 'Event created!');
      navigate('/admin');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to save event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto panel-glass p-8 md:p-12 rounded-2xl">
      <h2 className="text-3xl font-bold mb-8">{isEditMode ? 'Edit Event' : 'Create New Event'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="form-label">Event Title</label>
          <input type="text" name="title" className="form-input" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label className="form-label">Description</label>
          <textarea name="description" rows="5" className="form-input" value={formData.description} onChange={handleChange} required></textarea>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Date and Time</label>
            <input type="datetime-local" name="date" className="form-input" value={formData.date} onChange={handleChange} required />
          </div>
          <div>
            <label className="form-label">Location</label>
            <input type="text" name="location" className="form-input" value={formData.location} onChange={handleChange} required />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Category</label>
            <select name="category" className="form-input" value={formData.category} onChange={handleChange}>
              <option value="tech">Tech</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Sports</option>
              <option value="academic">Academic</option>
            </select>
          </div>
          <div>
            <label className="form-label">Image URL</label>
            <input type="text" name="image_url" placeholder="https://..." className="form-input" value={formData.image_url} onChange={handleChange} />
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-6">
          <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Event')}</button>
        </div>
      </form>
    </section>
  );
}
