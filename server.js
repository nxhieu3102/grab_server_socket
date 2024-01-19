const SocketMsgModel = require('./msg.model.js');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    maxHttpBufferSize: 1e7 
  });
let count = 0

io.eio.pingTimeout = 120000;
io.eio.pingInterval = 120000;
rooms = new Map();
console.log(io.maxHttpBufferSize);
app.use(express.json())

io.on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);
    socket.emit('connected', { id: socket.id });

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
        const socketId = socket.id;

        for (let [key, value] of rooms) {
            console.log(key, value);
            if (key.includes(socketId)) {
                rooms.delete(key);
            }
        }
    });

    socket.on('request_ride', (msg) => {
        const socketMsg = SocketMsgModel.fromJson(msg);
        console.log('socketMsg', socketMsg);
        socketMsg.customerSocketId = socket.id;
        io.emit('request_ride', socketMsg);
    })

    socket.on('start_ride', (msg) => {
        console.log('start_ride');
        socket.to(msg.customerSocketId).emit('start_ride');
    })

    socket.on('finish_ride', (msg) => {
        console.log('finish_ride');
        socket.to(msg.customerSocketId).emit('finish_ride');
    })

    socket.on('accept_ride', (msg) => {
        console.log('accept_ride', msg);
        const socketMsg = SocketMsgModel.fromJson(msg);
        socketMsg.driverSocketId = socket.id;
        const ids = [socketMsg.customerId, socketMsg.driverId, socketMsg.customerSocketId, socketMsg.driverSocketId].sort();
        console.log('accept_ride', ids);
        const idRoom = ids.join('###');
        socket.join(idRoom);

        if (!rooms.has(idRoom) || rooms.get(idRoom) == false) {
            console.log(idRoom);
            console.log('new room');
            rooms.set(idRoom, true);
            io.to(socketMsg.customerSocketId).emit('accept_ride', socketMsg);
        }
    })

    socket.on('send_location', (msg) => {
        const socketMsg = SocketMsgModel.fromJson(msg);
        const ids = [socketMsg.customerId, socketMsg.driverId, socketMsg.customerSocketId, socketMsg.driverSocketId].sort();
        const idRoom = ids.join('###');
        
        console.log(`User ${socket.id} sent location`, msg);
        console.log(`send ${count++}`);

        if (!rooms.has(idRoom)) {
            console.log(`Room ${idRoom} not found`);
            return;
        }

        socket.to(socketMsg.customerSocketId).emit('send_location', msg);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
