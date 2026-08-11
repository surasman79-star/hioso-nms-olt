const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

async function apiFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

export const getOltInfo     = () => apiFetch('/api/olt/info');
export const getPonPorts    = () => apiFetch('/api/olt/pon-ports');
export const getGePorts     = () => apiFetch('/api/olt/ge-ports');
export const getOnus        = () => apiFetch('/api/olt/onus');
export const getOnuTraffic  = () => apiFetch('/api/olt/onu-traffic');
export const getOnuConfigs  = () => apiFetch('/api/olt/onu-configs');
