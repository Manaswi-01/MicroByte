require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require("socket.io");

// Import Models
const Message = require('./models/Message');

// Import Routes
const moduleRoutes = require('./routes/moduleRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const userRoutes = require('./routes/userRoutes');
const progressRoutes = require('./routes/progressRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const server = http.createServer(app);

// CORS setup for local development and production
const allowedOrigins = [ 'http://localhost:5173', process.env.FRONTEND_URL ];
const corsOptions = { origin: allowedOrigins };
app.use(cors(corsOptions));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());

// API Routes
app.use('/api/modules', moduleRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => res.send('Backend server is running!'));

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);
  socket.on('sendMessage', async (messageData) => {
    try {
      const newMessage = new Message({ text: messageData.text, sender: messageData.sender });
      await newMessage.save();
      io.emit('receiveMessage', messageData);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });
  socket.on('disconnect', () => console.log(`A user disconnected: ${socket.id}`));
});

const PORT = process.env.PORT || 8000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
  })
  .catch((error) => console.error('Connection to MongoDB failed:', error.message));