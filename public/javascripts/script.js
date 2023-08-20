import {
  emitClear,
  emitObj,
  emitModObj,
  emitMousemove,
  emitUndoOrRedo,
} from "/javascripts/socket.js";
import { uid } from "/javascripts/util.js";

let object = {};
let redoStack = [];
const toolBar = document.getElementById("tool-bar");
export const undo = () => {
  redoStack.push(canvas._objects.pop());
  canvas.renderAll();
};
export const redo = () => {
  if (redoStack.length !== 0) {
    canvas._objects.push(redoStack.pop());
    canvas.renderAll();
  }
};

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
  if (e.target.id === "selection") {
    canvas.set({ isDrawingMode: false });
  }
  if (e.target.id === "draw") {
    canvas.set({ isDrawingMode: true });
  }
});
// event listeners
document.addEventListener(
  "keydown",
  (event) => {
    let code = event.code;
    if (event.ctrlKey && code == "KeyZ") {
      console.log(canvas);
      if (canvas._objects.length !== 0) {
        undo();
        emitUndoOrRedo("u");
      }
    }
    if (event.ctrlKey && code == "KeyY") {
      redo();
      emitUndoOrRedo("r");
    }
  },
  false
);
toolBar.addEventListener("change", (e) => {
  if (e.target.id === "stroke") {
    canvas.freeDrawingBrush.color = e.target.value;
  }
  if (e.target.id === "line-width") {
    canvas.freeDrawingBrush.width = parseInt(e.target.value, 10);
  }
});
document.addEventListener("touchmove", (e) => {
  let mouseObject = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  emitMousemove(mouseObject);
});
document.addEventListener("mousemove", (e) => {
  let mouseObject = { x: e.clientX, y: e.clientY };
  emitMousemove(mouseObject);
});
//canvas events
canvas.on("path:created", ({ path }) => {
  path.set("id", uid());
  object = {
    obj: path,
    id: path.id,
  };
  emitObj(object);
});
canvas.on("object:modified", (option) => {
  object.canva = canvas.toDatalessJSON();
  emitModObj(object);
});

