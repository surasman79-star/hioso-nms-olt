import api from './api'

const monitoringService = {
  getDashboard: () => api.get('/monitoring/dashboard'),
  getTraffic: () => api.get('/monitoring/traffic'),
  getAlarms: () => api.get('/monitoring/alarms'),
}

export default monitoringService