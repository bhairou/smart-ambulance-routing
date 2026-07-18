# smart-ambulance-routing
🚑 Smart Ambulance Routing System - React + Node.js + MongoDB + DSA
# 🚑 Smart Ambulance Routing System

> A complete Full-Stack Emergency Response System with Real-time Tracking, DSA Integration, and AI-powered Route Optimization.

![Ambulance](https://img.shields.io/badge/Ambulance-Routing-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Node.js](https://img.shields.io/badge/Node.js-18-green)
![MongoDB](https://img.shields.io/badge/MongoDB-7-brightgreen)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [DSA Implementations](#-dsa-implementations)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Live Demo](#-live-demo)
- [Future Scope](#-future-scope)
- [Contributing](#-contributing)
- [Author](#-author)
- [License](#-license)

---

## 📌 Overview

**Smart Ambulance Routing System** is a full-stack web application designed to revolutionize emergency response by:

- 🚑 **Optimizing ambulance dispatch** using DSA algorithms
- 🏥 **Intelligent hospital allocation** based on bed availability
- 🗺️ **Real-time tracking** of ambulances on live maps
- 📊 **Analytics & insights** for emergency trends
- 🔐 **Secure authentication** with JWT

The system combines **React** for a premium UI, **Node.js** for a robust backend, **MongoDB** for data persistence, and **C++** for efficient DSA computations.

---

## ⭐ Features

### 🖥️ Frontend Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Login/Signup with JWT and bcrypt encryption |
| 📊 **Dashboard** | Real-time stats: Total Fleet, Available, Busy, Avg Response Time |
| 🗺️ **Live Map** | Leaflet-based map with ambulance markers and status |
| 🚨 **Emergency Request** | Priority-based emergency dispatch (Critical/High/Medium/Low) |
| 🏥 **Hospital Management** | Bed availability, nearest hospital finder, progress bars |
| 🚑 **Ambulance Fleet** | Status tracking with live ETA updates |
| 📈 **Analytics** | Charts: Response time trends, daily emergencies, status distribution |
| 🗺️ **Dijkstra Algorithm** | Visual pathfinding between locations |
| 🔥 **Priority Queue** | Emergency prioritization system |
| 📊 **Trip History** | Filter, search, export (CSV/JSON), clear all |
| 🚀 **Route Simulation** | Real-time ambulance movement on map |
| 🌙 **Theme Toggle** | Dark/Light mode with localStorage persistence |
| 📱 **Responsive** | Fully mobile-friendly design |

### 🔙 Backend Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | JWT + Bcrypt password hashing |
| 📡 **REST API** | Full CRUD operations for ambulances, hospitals, emergencies, trips |
| 🗄️ **Database** | MongoDB with Mongoose ODM |
| 🔄 **Real-time** | Socket.io for live location updates |
| 🛡️ **Security** | CORS, environment variables, input validation |
| 📊 **Logging** | Request logging and error handling |

### 💻 DSA Features

| Algorithm | Application |
|---|---|
| **Dijkstra** | Shortest path for ambulance routing |
| **Priority Queue** | Emergency triage (Critical > High > Medium > Low) |
| **Graph** | Road network representation |
| **Greedy Algorithm** | Nearest hospital/ambulance allocation |
| **Heap** | Efficient priority management |

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Frontend** | React + Vite | 18.3.1 |
| | React Router DOM | 6.20.0 |
| | Leaflet (Map) | 1.9.4 |
| | Chart.js | 4.4.0 |
| | CSS3 | - |
| **Backend** | Node.js | 18.x |
| | Express | 4.18.2 |
| | JWT | 9.0.0 |
| | Bcryptjs | 2.4.3 |
| | Socket.io | 4.7.2 |
| **Database** | MongoDB | 7.x |
| | Mongoose | 7.0.0 |
| **DSA** | C++ | 17 |
| **Deployment** | Vercel (Frontend) | - |
| | Render (Backend) | - |
| | MongoDB Atlas | - |

---

## 📂 Project Structure
📁 smart-ambulance-routing/
│
├── 📁 backend/ # Node.js Backend
│ ├── 📁 models/ # Database Models
│ │ ├── 📄 User.js
│ │ ├── 📄 Ambulance.js
│ │ ├── 📄 Hospital.js
│ │ ├── 📄 Emergency.js
│ │ └── 📄 Trip.js
│ ├── 📁 routes/ # API Routes
│ │ ├── 📄 auth.js
│ │ ├── 📄 ambulances.js
│ │ ├── 📄 hospitals.js
│ │ ├── 📄 emergencies.js
│ │ └── 📄 trips.js
│ ├── 📁 middleware/ # Middleware
│ │ └── 📄 auth.js
│ ├── 📄 server.js # Server Entry Point
│ ├── 📄 package.json
│ └── 📄 .env # Environment Variables
│
├── 📁 src/ # React Frontend
│ ├── 📁 components/ # React Components
│ │ ├── 📄 Navbar.jsx
│ │ ├── 📄 FooterComponent.jsx
│ │ ├── 📄 LiveMap.jsx
│ │ ├── 📄 ThemeToggle.jsx
│ │ └── 📄 Notifications.jsx
│ ├── 📄 App.jsx # Main App
│ ├── 📄 main.jsx # Entry Point
│ ├── 📄 index.css # Global Styles
│ └── 📄 api.js # API Service
│
├── 📁 cpp/ # C++ DSA Module
│ └── 📄 main.cpp # Complete DSA Implementation
│
├── 📄 README.md # Documentation
├── 📄 package.json # Dependencies
├── 📄 .gitignore # Git Ignore
└── 📄 vite.config.js # Vite Configuration

text

---

## 🚀 Installation

### Prerequisites

- Node.js (v18+)
- MongoDB (v7+)
- Git
- C++ Compiler (g++)

### 1. Clone the Repository

```bash
git clone https://github.com/bhairou/smart-ambulance-routing.git
cd smart-ambulance-routing
2. Frontend Setup
bash
npm install
npm run dev
Frontend runs on: http://localhost:5173

3. Backend Setup
bash
cd backend
npm install
npm run dev
Backend runs on: http://localhost:5000

4. Environment Variables
Create .env file in backend folder:

env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ambulance_db
JWT_SECRET=your_super_secret_key
5. C++ DSA Module
bash
cd cpp
g++ main.cpp -o ambulance
./ambulance
6. MongoDB Setup
bash
# Start MongoDB service
net start MongoDB

# Or using mongod
mongod
🧠 DSA Implementations
1. Dijkstra Algorithm (Shortest Path)
cpp
pair<int, vector<int>> dijkstra(int src, int dest) {
    vector<int> dist(V, INT_MAX);
    vector<int> parent(V, -1);
    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;
    
    dist[src] = 0;
    pq.push({0, src});
    
    while(!pq.empty()) {
        int u = pq.top().second;
        pq.pop();
        
        for(auto& [v, w] : adj[u]) {
            if(dist[v] > dist[u] + w) {
                dist[v] = dist[u] + w;
                parent[v] = u;
                pq.push({dist[v], v});
            }
        }
    }
    
    // Reconstruct path
    vector<int> path;
    for(int v = dest; v != -1; v = parent[v]) {
        path.push_back(v);
    }
    reverse(path.begin(), path.end());
    return {dist[dest], path};
}
2. Priority Queue (Emergency Triage)
cpp
struct Emergency {
    int id;
    string location;
    string description;
    int priority; // 0=Critical, 1=High, 2=Medium, 3=Low
    
    bool operator<(const Emergency& other) const {
        return priority > other.priority; // Min-heap
    }
};
3. Graph Representation
cpp
class Graph {
    int V;
    vector<vector<pair<int,int>>> adj;
    
public:
    void addEdge(int u, int v, int w) {
        adj[u].push_back({v, w});
        adj[v].push_back({u, w});
    }
};
🔗 API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login user
Ambulances
Method	Endpoint	Description
GET	/api/ambulances	Get all ambulances
POST	/api/ambulances	Add new ambulance
PUT	/api/ambulances/:id	Update ambulance
DELETE	/api/ambulances/:id	Delete ambulance
Hospitals
Method	Endpoint	Description
GET	/api/hospitals	Get all hospitals
GET	/api/hospitals/:id	Get hospital by ID
POST	/api/hospitals	Add new hospital
PUT	/api/hospitals/:id	Update hospital
Emergencies
Method	Endpoint	Description
GET	/api/emergencies	Get all emergencies
POST	/api/emergencies	Create new emergency
PUT	/api/emergencies/:id	Update emergency
Trips
Method	Endpoint	Description
GET	/api/trips	Get trip history
POST	/api/trips	Add new trip
DELETE	/api/trips/all	Clear all trips
📸 Screenshots
Dashboard
https://via.placeholder.com/800x400?text=Dashboard

Live Map
https://via.placeholder.com/800x400?text=Live+Map

Trip History
https://via.placeholder.com/800x400?text=Trip+History

Analytics
https://via.placeholder.com/800x400?text=Analytics

🚀 Live Demo
Application	URL
Frontend	https://smart-ambulance-routing.vercel.app
Backend	https://smart-ambulance-backend.onrender.com
Demo Credentials:

Email	Password
test@demo.com	password123
🔮 Future Scope
Feature	Description
📱 Mobile App	React Native / Flutter
🔔 Push Notifications	Firebase Cloud Messaging
🤖 AI Prediction	ML for emergency prediction
🗺️ Google Maps	Real traffic integration
🎙️ Voice Assistant	Emergency voice commands
💳 Payment Gateway	Billing & payments
📊 Advanced Analytics	Predictive analytics
👥 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

👨‍💻 Author
Bhairou

GitHub: @bhairou

Email: bhaironathdeep@gmail.com

📄 License
This project is for educational purposes only.

⭐ Show Your Support
If you found this project helpful, please give it a ⭐ on GitHub!

🙏 Acknowledgments
React - Frontend framework

Node.js - Backend runtime

MongoDB - Database

Leaflet - Mapping library

Chart.js - Charts library

📞 Contact
For any queries or feedback:

Email: bhaironathdeep@gmail.com

GitHub: @bhairou

Made with ❤️ by Bhairou

text

---

## ✅ **AB YEH KARO:**

1. **README.md** open karo
2. **POORA CODE DELETE KARO**
3. **UPAR WALA CODE PASTE KARO**
4. **Ctrl + S** (Save)

---

## ✅ **BATAO - KYA HO GAYA?**

**Screenshot bhejo!** 👇
This response is AI-generated, for reference only.
