const socket = io();
import { canvas } from "/javascripts/script.js";

//listening
socket.on("new-added", (object) => {
  const { obj, id } = object;
  let newObject = new fabric.Path(obj.path).set(obj).set({ id: id });
  canvas.add(newObject);
  canvas.renderAll();
});
socket.on("mod-obj", ({ canva }) => {
  canvas.loadFromJSON(JSON.stringify(canva));
  console.log(canvas.getObjects(), "all");
});
socket.on("clear", () => {
  canvas.clear();
});

//emitters
export const emitObj = (object) => {
  console.log(object);
  socket.emit("new-added", object);
};
export const emitModObj = (object) => {
  socket.emit("mod-obj", object);
};
export const emitClear = () => {
  socket.emit("clear");
};
