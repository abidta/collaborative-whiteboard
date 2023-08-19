const socket = io();
import { canvas } from "/javascripts/script.js";
import { getRandomColor } from "./util.js";

let users = {};
//listening
socket.on("new-user", () => {
  console.log("new user");
});
socket.on("new-added", (object) => {
  const { obj, id } = object;
  let newObject = new fabric.Path(obj.path).set(obj).set({ id: id });
  canvas.add(newObject);
  canvas.renderAll();
});
socket.on("mod-obj", ({ canva }) => {
  canvas.loadFromJSON(JSON.stringify(canva));
});
socket.on("mousemove", (mouseCoord) => {
  if (!users[mouseCoord.id]) {
    let mouseMove = document.createElement("div");
    let att = document.createAttribute("class");
    att.value = "pointer-class";
    mouseMove.setAttributeNode(att);
    mouseMove.style.background = getRandomColor();
    users[mouseCoord.id] = mouseMove;
    document.body.appendChild(mouseMove);
  }
  users[mouseCoord.id].style.left = mouseCoord.x + "px";
  users[mouseCoord.id].style.top = mouseCoord.y + "px";
});

socket.on("clear", () => {
  canvas.clear();
});

//emitters
export const emitObj = (object) => {
  socket.emit("new-added", object);
};
export const emitModObj = (object) => {
  socket.emit("mod-obj", object);
};
export const emitMousemove = (mouseCoord) => {
  socket.emit("mousemove", mouseCoord);
};
export const emitClear = () => {
  socket.emit("clear");
};
