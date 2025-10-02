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
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/modules', moduleRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/users', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/chat', chatRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Real-time connection logic
io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  // Listen for a 'sendMessage' event
  socket.on('sendMessage', async (messageData) => {
    try {
      // Create a new message document and save it to the database
      const newMessage = new Message({
        text: messageData.text,
        sender: messageData.sender
      });
      await newMessage.save();

      // Broadcast the message to all connected clients
      io.emit('receiveMessage', messageData);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`A user disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 8000;

// Connect to Database & Start Server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Connection to MongoDB failed:', error.message);
  });