const express=require('express')
const http= require('http')
const {Server} = require('socket.io')
const cors=require('cors')


const app=express()
app.use(cors());
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:'*',
        }
});
const roomListeners = {};
io.on("connection",(socket)=>{
    console.log("user connected",socket.id);

    socket.on('send-piece',(data,roomId)=>{
        socket.to(roomId).emit('receive-piece',data);
    })

    socket.on('join-room',(roomId, isRoomJoinable)=>{
        // console.log(roomId,isRoomJoinable);
        if (roomListeners[roomId] && roomListeners[roomId] >= 2) {
            isRoomJoinable(false,false);
            return;
        }
        socket.join(roomId);
        if (!roomListeners[roomId]) roomListeners[roomId] = 1;
        else roomListeners[roomId]++;
         isRoomJoinable(true,roomListeners[roomId]==1);
         
          

    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    
        // Decrement the listener count for the room when a user disconnects
        Object.keys(roomListeners).forEach((roomID) => {
          if (socket.rooms.has(roomID)) {
            roomListeners[roomID]--;
            if (roomListeners[roomID] <= 0) {
              delete roomListeners[roomID];
            }
          }
        });
      });
})
server.listen(3001,()=>{
    console.log('server started at 3001')
})
