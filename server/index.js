const express = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messagesRoutes");
const socket = require("socket.io");
require("dotenv").config();

const app = express();

// CORS configuration (Update once frontend is live)
app.use(cors({
    origin: '*', // Allow all origins for now. Update this when frontend is deployed.
}));
app.use(express.json());

// Mongoose connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DB Connection successful");
}).catch((err) => {
    console.log(err.message);
});

// API Routes
app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoutes);



// PORT setup for Render deployment
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

// Socket.IO setup with CORS handling
const io = socket(server, {
    cors: {
        origin: "*", // Allow all origins. Update with frontend live URL later.
        credentials: true,
    },
});

app.get('/', (req, res) => {
    res.send('Backend is running successfully.');
});

// Handling socket connection and messaging
global.onlineUsers = new Map();
io.on("connection", (socket) => {
    global.chatSocket = socket;

    // Add user to online users
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    // Handle message sending
    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-receive", data.message);
        }
    });
});
