export default (io: any) => {
  io.on("connection", (socket: any) => {
    console.log("user connected");
    socket.on("new-added", (object: any) => {
      console.log("object added");
      socket.broadcast.emit("new-added", object);
    });
    socket.on("clear", () => {
      socket.broadcast.emit("clear");
    });
    socket.on("mod-obj", (object: any) => {
      socket.broadcast.emit("mod-obj", object);
    });
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
