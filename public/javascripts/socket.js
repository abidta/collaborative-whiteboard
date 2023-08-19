const socket = io();
import { canvas } from "/javascripts/script.js";

let flag;
console.log(socket);
//listening
socket.on('new-user',()=>{
  console.log('new user');
  flag=null
})
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
socket.on("mousemove", (mouseCoord) => {
  if (!flag) {
    let mouseMove = document.createElement("div");
    let att = document.createAttribute("class");
    att.value = "pointer-class";
    mouseMove.setAttributeNode(att);
    flag=mouseMove
    document.body.appendChild(mouseMove);
  }
  flag.style.left = mouseCoord.x + "px";
  flag.style.top = mouseCoord.y + "px";
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
export const emitMousemove = (mouseCoord) => {
  socket.emit("mousemove", mouseCoord);
};
export const emitClear = () => {
  socket.emit("clear");
};
