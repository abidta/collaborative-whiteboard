import { emitClear, emitObj } from "/javascripts/socket.js";
import { uid } from "/javascripts/uid.js";

let object;
const toolBar = document.getElementById("tool-bar");

export const canvas = new fabric.Canvas("drawing-board", {
  isDrawingMode: true,
  height: screen.availHeight,
  width: screen.availWidth,
});
canvas.freeDrawingBrush.width = 5;
canvas.freeDrawingBrush.color = "#000000";
toolBar.addEventListener("click", (e) => {
  if (e.target.id === "clear") {
    canvas.clear();
    emitClear();
  }
  if (e.target.id === "save") {
    let url = canvas.toDataURL();
    console.log(url);
  }
});

toolBar.addEventListener("change", (e) => {
  if (e.target.id === "stroke") {
    canvas.freeDrawingBrush.color = e.target.value;
  }
  if (e.target.id === "line-width") {
    canvas.freeDrawingBrush.width = parseInt(e.target.value, 10);
  }
});

canvas.on("path:created", ({ path }) => {
  path.set("id", uid());
  object = {
    obj: path,
    id: path.id,
  };
  console.log(window.screen);
  emitObj(object);
});
