import axios from 'axios';
import { seededEvents } from '../data/seedEvents.js';

export const apiClient = axios.create({
  baseURL: 'http://localhost:4000',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function fetchFeaturedEvents(limit = 3) {
  try {
    const { data } = await apiClient.get('/events', { params: { limit } });
    if (Array.isArray(data) && data.length) return data.slice(0, limit);
    return seededEvents.slice(0, limit);
  } catch {
    return seededEvents.slice(0, limit);
  }
}

export async function fetchEvents(params = {}) {
  try {
    const { data } = await apiClient.get('/events', { params });
    if (Array.isArray(data) && data.length) return data;
    return filterSeeded(params);
  } catch {
    return filterSeeded(params);
  }
}

export async function fetchEvent(id) {
  try {
    const { data } = await apiClient.get(`/events/${id}`);
    return data;
  } catch {
    return seededEvents.find((e) => String(e.id) === String(id)) || null;
  }
}

function filterSeeded(params) {
  const { category, search } = params;
  let events = [...seededEvents];
  if (category && category !== 'all') {
    events = events.filter((e) => e.category === category);
  }
  if (search) {
    const s = search.toLowerCase();
    events = events.filter((e) => e.title.toLowerCase().includes(s) || e.description.toLowerCase().includes(s));
  }
  return events;
}
