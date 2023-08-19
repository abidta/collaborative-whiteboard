export default (io: any) => {
  io.on("connection", (socket: any) => {
    console.log("user connected",socket.id);
    socket.broadcast.emit('new-user')
    socket.on("new-added", (object: any) => {
      console.log("object added");
      socket.broadcast.emit("new-added", object);
    });
    socket.on("mod-obj", (object: any) => {
      socket.broadcast.emit("mod-obj", object);
    });
    socket.on("mousemove",(mouseCoord:object)=>{
      socket.broadcast.emit('mousemove',(mouseCoord))
    })
    socket.on("clear", () => {
      socket.broadcast.emit("clear");
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
