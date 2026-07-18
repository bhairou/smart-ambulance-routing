const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const admissionRoutes = require('./routes/admissionRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());
app.use('/api/admissions', admissionRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

const routePoints = [
  { lat: 31.2538, lng: 75.7014, status: 'Available', eta: '2 min' },
  { lat: 31.2542, lng: 75.7005, status: 'On Route', eta: '3 min' },
  { lat: 31.2545, lng: 75.6998, status: 'On Route', eta: '2 min' },
  { lat: 31.255, lng: 75.698, status: 'Arriving', eta: '1 min' }
];

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  let index = 0;
  socket.emit('ambulance-location', {
    id: socket.id,
    ...routePoints[index]
  });

  const interval = setInterval(() => {
    index = (index + 1) % routePoints.length;
    socket.emit('ambulance-location', {
      id: socket.id,
      ...routePoints[index]
    });
  }, 2500);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    clearInterval(interval);
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Smart Ambulance Routing System API',
    status: 'running'
  });
});

app.get('/health', (req, res) => {
  res.json({
    api: 'ok',
    socket: 'ok',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-ambulance')
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.warn('MongoDB not connected. API and socket server are still running.');
    console.warn(error.message);
  });
