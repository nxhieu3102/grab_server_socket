// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIO(server)

io.eio.pingTimeout = 120000;
io.eio.pingInterval = 120000;

rooms = new Map();

app.use(express.json())
io.on('connection', (socket) => {

    socket.on('user_disconnect', (msg) => {
        const id = msg.id;
        console.log(`User ${id} disconnected`);
        for(const key of rooms.keys()){
            if(key.includes(id)){
                socket.to(key).emit('user_disconnect', id);
                rooms.delete(key);
                socket.leave(key);
            }
        }
    })

    console.log(`User ${socket.id} connected`);
    
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
    });
    
    socket.on('request_ride', (msg) => {
        console.log(`User ${socket.id} requested a ride`)
        console.log(`msg: ${msg}`)
        console.log(`id: ${msg.customerId}`)
        io.emit('request_ride', {
            customerId: msg.customerId,
            id: socket.id,
            position: msg.position,
        });
    })

    socket.on('accept_ride', (msg) => {
        console.log('msg: ', msg);
        const ids = [msg.customerId, msg.driverId].sort();
        const idRoom = ids[0] + '###' + ids[1];
        socket.join(idRoom);


        console.log(`User ${socket.id} accepted a ride`)
        console.log(`msg: ${msg.customerId}, ${msg.driverId}`)
        console.log(`idRoom: ${idRoom}`)

        // case of customer
        if(!rooms.has(idRoom)){
            rooms.set(idRoom, ids);
            io.to(msg.customerSocketId).emit('accept_ride' ,msg);
        }
    })

    socket.on('send_location', (msg) => {
        const ids = [msg.customerId, msg.driverId].sort();
        const idRoom = ids[0] + '###' + ids[1];

        console.log(`User ${socket.id} sent location`, msg);
        
        if(!rooms.has(idRoom)){
            console.log(`Room ${idRoom} not found`);
            return;
        }

        socket.to(idRoom).emit('send_location', msg);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
