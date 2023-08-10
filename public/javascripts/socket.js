const socket = io();
import { canvas } from "/javascripts/script.js";

//listening
socket.on("new-added", (object) => {
  console.log("object on");
  const { obj, id } = object;
  let newObject = new fabric.Path(obj.path).set(obj).set({id:id});
  console.log(newObject.id,'id');
  canvas.add(newObject);
  canvas.renderAll();
});
socket.on('mod-obj',({obj,id})=>{

canvas.getObjects().forEach(object => {
    if (object.id === id) {
        object.set(obj)
        object.setCoords()
        canvas.renderAll()
    }
});
})
socket.on("clear", () => {
  canvas.clear();
});

//emitters
export const emitObj = (object) => {
  console.log(object);
  socket.emit("new-added", object);
};
export const emitModObj = (object) => {
    socket.emit("mod-obj",object)
};
export const emitClear = () => {
  socket.emit("clear");
};
