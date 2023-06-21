const express=require('express')
const http= require('http')
const {Server} = require('socket.io')
const cors=require('cors')


const app=express()
app.use(cors);
const server=http.createServer(app);
const io=new Server(server,{
    cors:{
        origin:'*',
        methods:['GET','POST'],
    }
});

io.on("connection",(socket)=>{
    console.log("user connected",socket.id);
    socket.on('send-piece',(data)=>{
        // console.log(data);
        socket.broadcast.emit('receive-piece',data);
    })
})
server.listen(3001,()=>{
    console.log('server started at 3001')
})
