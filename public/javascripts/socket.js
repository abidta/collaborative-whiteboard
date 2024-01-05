const socket = io();
import { canvas, undo, redo } from "/javascripts/script.js";
import { getRandomColor } from "./util.js";
import { createModalObj } from "./models.js";

let users = {};
let newObject;

const updateOnline = (count) => {
  document.getElementById("online-count").innerHTML = count;
};
//listening
socket.on("new-user", (userCount) => {
  console.log("new user");
  updateOnline(userCount);
});
socket.on("disconnect-user", (userCount, id) => {
  updateOnline(userCount);
  //for delete div element on mousemove while disconnect user
  if (users[id]) {
    users[id].remove();
    delete users[id];
  }
});
socket.on("new-added", (object) => {
  const { obj, divId, id } = object;
  if (obj?.path) {
    newObject = new fabric.Path(obj.path).set(obj).set({ id: id });
  } else {
   // console.log(obj.top,obj.left, "obj topleft");
   // console.log(top,left,'calculated top left');
    newObject = createModalObj(divId).set(obj);
  }
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
socket.on("undo-redo", (data) => {
  if (data === "u") {
    undo();
    return;
  }
  if (data === "r") {
    redo();
    return;
  }
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
export const emitUndoOrRedo = (data) => {
  socket.emit("undo-redo", data);
};
export const emitClear = () => {
  socket.emit("clear");
};
