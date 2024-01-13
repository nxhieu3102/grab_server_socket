const SocketMsgModel = require('./msg.model.js');
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server)

let count = 0

io.eio.pingTimeout = 120000;
io.eio.pingInterval = 120000;

rooms = new Map();

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
        socketMsg.customerSocketId = socket.id;
        io.emit('request_ride', socketMsg);
    })

    socket.on('accept_ride', (msg) => {
        console.log('accept_ride', msg);
        const socketMsg = SocketMsgModel.fromJson(msg);
        socketMsg.driverSocketId = socket.id;
        const ids = [socketMsg.customerId, socketMsg.driverId, socketMsg.customerSocketId, socketMsg.driverSocketId].sort();
        const idRoom = ids.join('###');
        socket.join(idRoom);

        if (!rooms.has(idRoom) || rooms.get(idRoom) == false) {
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
