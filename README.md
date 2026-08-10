# HIOSO NMS OLT - Network Management System

Platform monitoring Optical Line Terminal (OLT) dan Fiber Optik berbasis web dengan fitur real-time monitoring, analytics, dan management.

## 📋 Fitur Utama

### Dashboard
- **Monitoring OLT & Optik Fiber NMS** - Monitoring status OLT, SFP Transceiver, Redaman Optik ONU, dan Alarm Kritis secara real-time
- **Total Perangkat OLT** - Menampilkan jumlah unit OLT dan status port PON
- **ONU/ONT Pelanggan** - Monitoring status signal Rx/Tx dan Pelanggan online
- **Traffic OLT Total** - Visualisasi bandwidth upload & download dalam Mbps
- **Alarm Aktif** - Notifikasi event dan alarm kritis real-time
- **Grafik Traffic Bandwidth** - Historical data traffic 24 jam dengan breakdown download/upload
- **Kualitas Sinyal Optik ONU** - Distribusi level power Rx (-dBm) untuk setiap ONU

### Menu Monitoring
- **Dashboard** - Overview sistem & traffic
- **Perangkat OLT** - Daftar OLT, Slot & PON Port management
- **LibreNMS Poller** - Agent Bridge LAN monitoring
- **Manajemen ONU/ONT** - Status signal Rx/Tx & Pelanggan
- **Otoriasi ONU Baru** - Auto-Discovery Uncfg ONU
- **Topologi Fiber ODN** - Struktur & Redundansi Optik
- **Alarm & Kejadian** - IOS High Attenuation & Dying Gasp
- **Terminal SSH OLT** - CLI Emulator Huawei, ZTE, VSOL

### Fitur Lanjutan
- **AI Diagnosa Fiber** - Analisis Gemini Optik & Sinyal
- **Status Uplink Port GE** - Monitoring port Gigabit Ethernet
- **Status Port PON** - Monitoring PON port (HA7304)
- **Daftar ONU/ONT Parameter** - Tabel detail ONU dengan RX Power, TX Power, Temperature, Voltage

## 🏗️ Struktur Project

```
hioso-nms-olt/
├── frontend/                 # React.js Application
│   ├── src/
│   │   ├── components/       # Komponen UI
│   │   ├── pages/            # Halaman
│   │   ├── layouts/          # Layout
│   │   ├── services/         # API Client
│   │   ├── store/            # State Management (Redux/Zustand)
│   │   ├── utils/            # Utility functions
│   │   ├── styles/           # Global styles
│   │   └── App.jsx
│   ├── public/
│   └── package.json
├── backend/                  # Node.js/Express API
│   ├── src/
│   │   ├── controllers/      # Route handlers
│   │   ├── services/         # Business logic
│   │   ├── models/           # Database models
│   │   ├── routes/           # API routes
│   │   ├── middleware/       # Express middleware
│   │   ├── config/           # Configuration
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── database/                 # Database scripts
│   ├── migrations/           # Database migrations
│   ├── seeds/                # Sample data
│   └── schema.sql
├── docker/                   # Docker configuration
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
├── docs/                     # Documentation
│   ├── API.md
│   ├── SETUP.md
│   ├── ARCHITECTURE.md
│   └── SCREENSHOTS.md
└── README.md
```

## 🚀 Tech Stack

### Frontend
- **React.js** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Recharts** - Charts & graphs
- **Axios** - HTTP client
- **Zustand/Redux** - State management
- **React Router** - Routing

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **Socket.io** - Real-time updates
- **JWT** - Authentication
- **SNMP** - Device communication

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy

## 📦 Instalasi

### Prerequisites
- Node.js v16+
- Docker & Docker Compose
- PostgreSQL 13+
- SNMP tools

### Quick Start dengan Docker

```bash
# Clone repository
git clone https://github.com/surasman79-star/hioso-nms-olt.git
cd hioso-nms-olt

# Setup environment
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Build dan run dengan Docker Compose
docker-compose up -d

# Akses aplikasi
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# Adminer: http://localhost:8080
```

### Manual Setup

**Backend:**
```bash
cd backend
npm install
npm run migrate
npm start
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh token

### OLT Management
- `GET /api/olt` - Daftar semua OLT
- `GET /api/olt/:id` - Detail OLT
- `POST /api/olt` - Tambah OLT baru
- `PUT /api/olt/:id` - Update OLT
- `DELETE /api/olt/:id` - Hapus OLT

### ONU/ONT Management
- `GET /api/onu` - Daftar ONU/ONT
- `GET /api/onu/:id` - Detail ONU/ONT
- `POST /api/onu` - Tambah ONU
- `PUT /api/onu/:id` - Update ONU
- `DELETE /api/onu/:id` - Hapus ONU

### Monitoring
- `GET /api/monitoring/dashboard` - Dashboard data
- `GET /api/monitoring/traffic` - Traffic data
- `GET /api/monitoring/alarms` - Alarm list
- `GET /api/monitoring/ports` - Port status
- `GET /api/monitoring/signal-quality` - ONU signal quality

### Real-time (WebSocket)
- `socket.on('olt:update')` - OLT status update
- `socket.on('traffic:update')` - Traffic update
- `socket.on('alarm:trigger')` - New alarm event

## 📊 Database Schema

### Tables
- `users` - User management
- `olts` - OLT devices
- `onu_ont` - ONU/ONT devices
- `ports_ge` - Gigabit Ethernet ports
- `ports_pon` - PON ports
- `traffic_data` - Historical traffic
- `alarms` - Alarm events
- `audit_logs` - Audit trail

## 🔐 Keamanan

- JWT authentication
- RBAC (Role-Based Access Control)
- Encrypted passwords (bcrypt)
- API rate limiting
- HTTPS/TLS support
- SQL injection prevention
- CSRF protection

## 📝 Documentation

Lihat folder `/docs` untuk dokumentasi lengkap:
- [API Documentation](./docs/API.md)
- [Setup Guide](./docs/SETUP.md)
- [Architecture](./docs/ARCHITECTURE.md)
- [Screenshots](./docs/SCREENSHOTS.md)

## 🤝 Contributing

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

MIT License - lihat [LICENSE](LICENSE) file

## 👥 Author

**surasman79-star**

## 📧 Support

Untuk pertanyaan atau laporan bug, silakan buat [GitHub Issue](https://github.com/surasman79-star/hioso-nms-olt/issues)

---

**Status**: 🚧 Under Development
**Last Updated**: 2026-08-10
