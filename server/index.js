const express  = require('express');
const cors = require("cors");
const mongoose = require('mongoose');
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messagesRoutes")
const user = require("./model/userModel")
// const bcrypt = require("bcrypt");// for hashing the passwords used for encryption
const app = express();

// we are importing socket from socket.io
const socket = require("socket.io")


require("dotenv").config();

//using cors and express.json
app.use(cors({// this cors is for express here we are giving all the permissions for the website.
    origin: '*',  // we allowing all the origin to request
}));
app.use(express.json());
// app.use("/api/auth", userRoutes);

//connecting to mongoose server
mongoose.connect(process.env.MONGO_URL,{
    
}).then(()=>{
    console.log("DB Connection successfully");
}).catch((err)=>{
    console.log(err.message);
});

app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoutes);


//starting the server -- here process.env is used to read the port information from the environment
const server = app.listen(process.env.PORT, ()=>{
    console.log(`Server Started on Port : ${process.env.PORT}`)
})

// here the socket is connected with the server 
const io = socket(server,{
    cors:{// cors is used to connect to the frontend because here the frontend is hosted in 3000 port
        origin:"http://localhost:3000",
        credentials: true,
    },
});

global.onlineUsers = new Map();// keeps tract of connected users and there corresponding socket Id
// map produced an efficient way to store and retrieve data -- global.onlineUsers full small code is here inside the globalMap folder follow from there

// how connections are handle --> when a user connects a connection
io.on("connection", (socket)=>{// whenever a new user connected to the socketio server this event is triggered
    global.chatSocket = socket;

    // Handling user addition
    socket.on("add-user",(userId)=>{// userId received from the client is used as a key and socketId is stored as the value in the online Users map
        onlineUsers.set(userId, socket.id);// If User1 has a userId = 123 and socket.id = abc123, it stores this like:
        // onlineUsers = {123: 'abc123'}.
    });

    // handling message sending
    socket.on("send-msg", (data)=>{// when a client emits send-msg it sends a message to another user
        const sendUserSocket = onlineUsers.get(data.to);// here the data.to has the to:- recepients userId and the message is the actual message being sent.
        if(sendUserSocket){// in the onlineUsers map the server finds the recepient socket id if it founds then it emit the msg-receive event delivering the message
            socket.to(sendUserSocket).emit("msg-receive", data.message);
        }
    })
});