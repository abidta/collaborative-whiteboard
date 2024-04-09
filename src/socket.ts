import { addUser, deleteUser, getUser, getUserCount } from "./users";

export default (io: any) => {
  io.on("connection", (socket: any): void => {
    console.log("user connected", socket.id);

    addUser(socket.id);

    io.emit("new-user", getUserCount());

    socket.on("new-added", (object: any): void => {
      console.log("object added");
      socket.broadcast.emit("new-added", object);
    });

    socket.on("mod-obj", (object: any): void => {
      socket.broadcast.emit("mod-obj", object);
    });

    socket.on("mousemove", (mouseCoord: any): void => {
      mouseCoord.id = socket.id;
      socket.broadcast.emit("mousemove", mouseCoord);
    });

    socket.on("undo-redo", (data: string): void => {
      socket.broadcast.emit("undo-redo", data);
    });

    socket.on("clear", (): void => {
      socket.broadcast.emit("clear");
    });

    socket.on("disconnect", (): void => {
      deleteUser(socket.id);

      io.emit("disconnect-user", getUserCount(), socket.id);

      console.log("user disconnected");
    });
  });
};
