import {
  emitClear,
  emitObj,
  emitModObj,
  emitMousemove,
  emitUndoOrRedo,
} from "/javascripts/socket.js";
import { createModalObj } from "./models.js";
import { uid } from "/javascripts/util.js";

let object = {};
let redoStack = [];
let strokeWidth = 2;
let strokeColor = "#000000";
let fillColor = "#000000";
let newObj;
let activeShape;
let activeObj;
let initX;
let initY;
const toolBar = document.getElementById("tool-bar");
const subToolBar = document.getElementById("sub-tool");
const toggleActive = (element) => {
  if (
    document.querySelector(".active") &&
    element != document.querySelector(".active")
  ) {
    document.querySelector(".active").classList.remove("active");
  }
  if (element.id !== "draw") {
    canvas.set({ isDrawingMode: false });
  }
  element.classList.toggle("active");
};
export const undo = () => {
  if (canvas._objects.length !== 0) {
    redoStack.push(canvas._objects.pop());
    canvas.renderAll();
  }
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
canvas.freeDrawingBrush.width = strokeWidth;
canvas.freeDrawingBrush.color = strokeColor;
// event listeners
window.onclick = (e) => {
  if (!e.target.matches(".dropbtn")) {
    let dropdown = document.getElementById("content-drop");
    if (dropdown.classList.contains("show")) {
      dropdown.classList.remove("show");
    }
  }
};
toolBar.addEventListener("click", (e) => {
  if (e.target.id === "clear") {
    canvas.clear();
    emitClear();
  }
  if (e.target.id === "save") {
    console.log(e.target.value);
    let url = canvas.toDataURL();
    // console.log(url);
  }
  if (e.target.id === "selection") {
    canvas.set({ isDrawingMode: false });
    activeShape = null;
    toggleActive(e.target);
  }
  if (e.target.id === "draw") {
    canvas.set({ isDrawingMode: true });
    toggleActive(e.target);
  }
  if (e.target.id === "undo") {
    undo();
    emitUndoOrRedo("u");
  }
  if (e.target.id === "redo") {
    redo();
    emitUndoOrRedo("r");
  }
  if (e.target.id === "shapes") {
    let subTools = document.getElementById("sub-tool");
    console.log(subTools);
    if (subTools.style.display === "none") {
      subTools.style.display = "flex";
    } else {
      subTools.style.display = "none";
    }
  }
  if (e.target.id === "text") {
    activeShape = e.target.id;
    toggleActive(e.target);
  }
});
toolBar.addEventListener("change", (e) => {
  if (e.target.id === "stroke") {
    canvas.freeDrawingBrush.color = strokeColor = e.target.value;
  }
  if (e.target.id === "fill") {
    fillColor = e.target.value;
  }
  if (e.target.id === "line-width") {
    canvas.freeDrawingBrush.width = strokeWidth = parseInt(e.target.value, 10);
  }
});
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
subToolBar.addEventListener("click", (e) => {
  if (e.target.id && e.target.id !== "sub-tool") {
    canvas.set({ isDrawingMode: false });
    activeShape = e.target.id;
    toggleActive(e.target);
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
document.addEventListener("click", (e) => {
  document.getElementById("content-drop").classList.toggle("show");
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
canvas.on("mouse:down:before", (option) => {
  if (canvas.getActiveObject()) {
    activeObj = true;
    return;
  } else {
    activeObj = false;
  }
});
canvas.on("mouse:down", (option) => {
  console.log(option.active, "op");
  if (option.target == null && !canvas.isDrawingMode && !activeObj) {
    initX = option.pointer.x;
    initY = option.pointer.y;
    newObj = createModalObj(activeShape);
    if (newObj != undefined) {
      if (newObj.fill !== 0) {
        newObj.set({ fill: fillColor });
      }
      if (newObj.type !== "i-text") {
        newObj.set({
          strokeWidth: strokeWidth,
          stroke: strokeColor,
        });
      }
      canvas.add(
        newObj.set({
          left: option.pointer.x,
          top: option.pointer.y,
        })
      );
    }
  }
});
canvas.on("mouse:move", (option) => {
  if (newObj != null) {
    newObj.set({
      width: Math.abs(initX - option.pointer.x),
      height: Math.abs(initY - option.pointer.y),
    });
    newObj.set({ left: Math.min(option.pointer.x, initX) });
    newObj.set({ top: Math.min(option.pointer.y, initY) });
    if (activeShape === "round" || activeShape === "fill-round") {
      newObj.set({
        rx: Math.abs((initX - option.pointer.x) / 2),
        ry: Math.abs((initY - option.pointer.y) / 2),
      });
    }
    newObj.setCoords();
    canvas.renderAll();
  }
});
canvas.on("mouse:up", () => {
  if (newObj !== undefined && newObj.width === 0 && newObj.height === 0) {
    canvas.remove(newObj);
  }

  newObj = createModalObj(activeShape);
});
canvas.on("selection:created", (option) => {
  if (newObj !== undefined) {
    object = {
      obj: newObj,
      divId: activeShape,
      id: null,
    };
    emitObj(object);
  }
  console.log(option, "added");
});
