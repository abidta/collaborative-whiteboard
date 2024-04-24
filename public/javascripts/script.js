import {
  emitClear,
  emitObj,
  emitModObj,
  emitMousemove,
  emitUndoOrRedo,
} from "/javascripts/socket.js";
import { createModalObj } from "./models.js";
import { uid } from "/javascripts/util.js";

let canvasEmitObject = {
  obj: "",
  divId: "",
  id: null,
};
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
const saveBtn = document.getElementById("save");

//toggle active tool for styling. and checking canvas is drawing mode or not
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

//undo function
export const undo = () => {
  if (canvas._objects.length !== 0) {
    redoStack.push(canvas._objects.pop());
    canvas.renderAll();
  }
};

//redo function
export const redo = () => {
  if (redoStack.length !== 0) {
    canvas._objects.push(redoStack.pop());
    canvas.renderAll();
  }
};

//init new canvas
export const canvas = new fabric.Canvas("drawing-board", {
  isDrawingMode: true,
  height: screen.availHeight,
  width: screen.availWidth,
});
canvas.freeDrawingBrush.width = strokeWidth;
canvas.freeDrawingBrush.color = strokeColor;

/**
 *
 * 
 * **********************   Event Listeners.    ****************
 * 
 */

//this for hide online dropdown when click anywhere in th window
window.onclick = (e) => {
  if (!e.target.matches(".dropbtn")) {
    let dropdown = document.getElementById("content-drop");
    if (dropdown.classList.contains("show")) {
      dropdown.classList.remove("show");
    }
  }
};

// Toolbar listeners
toolBar.addEventListener("click", (e) => {
  if (e.target.id === "clear") {
    canvas.clear();
    emitClear();
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

//tool bar input events. colors and line width
toolBar.addEventListener("input", (e) => {
  if (e.target.id === "stroke") {
    canvas.freeDrawingBrush.color = strokeColor = e.target.value;
    canvas.renderAll();
  }
  if (e.target.id === "fill") {
    fillColor = e.target.value;
  }
  if (e.target.id === "canvas-bg") {
    canvas.set({ backgroundColor: e.target.value });
    canvas.renderAll();
  }
  if (e.target.id === "line-width") {
    if (e.target.value > 100 || e.target.value < 1) {
      e.target.value = 2;
      return alert("line width sould be <=100 || >=1");
    }
    canvas.freeDrawingBrush.width = strokeWidth = parseInt(e.target.value, 10);
  }
});

//save btn event
saveBtn.addEventListener("click", function () {
  const dLink = document.createElement("a");
  dLink.href = canvas.toDataURL({ format: "png" });
  dLink.download = "canva.png";
  document.body.appendChild(dLink);
  dLink.click();
  document.body.removeChild(dLink);
});

// This event for key down (ctrl+z for undo, ctrl+y fo redo)
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

//add shapes to activeShape
subToolBar.addEventListener("click", (e) => {
  if (e.target.id && e.target.id !== "sub-tool") {
    canvas.set({ isDrawingMode: false });
    activeShape = e.target.id;
    toggleActive(e.target);
  }
});

// Mouse and touch move events for realtime mousecoords
document.addEventListener("touchmove", (e) => {
  let mouseObject = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  emitMousemove(mouseObject);
});
document.addEventListener("mousemove", (e) => {
  let mouseObject = { x: e.clientX, y: e.clientY };
  emitMousemove(mouseObject);
});

//
document.addEventListener("click", () => {
  console.log('hii');
  document.getElementById("content-drop").classList.toggle("show");
});

/**
 ***************    Canvas Events     ******************
 */
canvas.on("path:created", ({ path }) => {
  path.set("id", uid());
  canvasEmitObject = {
    obj: path,
    id: path.id,
  };
  emitObj(canvasEmitObject);
});
canvas.on("object:modified", () => {
  console.log("modified");
  //object.canva = canvas.toDatalessJSON();
  emitModObj({ canva: canvas.toDatalessJSON() });
});
canvas.on("mouse:down:before", (option) => {
  console.log(option, "bfore mouse");
  if (canvas.getActiveObject()) {
    activeObj = true;
    return;
  } else {
    activeObj = false;
  }
});
canvas.on("mouse:down", (option) => {
  console.log(option, "op");
  if (option.target == null && !canvas.isDrawingMode) {
    if (activeShape === "text" && activeObj) {
      return;
    }
    initX = option.pointer.x;
    initY = option.pointer.y;
    newObj = createModalObj(activeShape);
    if (newObj != undefined) {
      if (newObj.fill !== 0) {
        newObj.set({ fill: fillColor });
      }

      newObj.set({
        strokeWidth: strokeWidth,
        stroke: strokeColor,
      });

      canvas.add(
        newObj.set({
          left:
            activeShape === "text" ? option.pointer.x - 30 : option.pointer.x,
          top:
            activeShape === "text" ? option.pointer.y - 20 : option.pointer.y,
        })
      );
    }
  }
});
canvas.on("mouse:move", (option) => {
  if (newObj != null && activeShape !== "text") {
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
  if (newObj !== undefined && newObj.width < 5 && newObj.height < 5) {
    canvas.remove(newObj);
  }
  if (activeShape === "text" && newObj !== undefined) {
    emitObj({
      obj: newObj,
      divId: activeShape,
      id: null,
    });
  }
  console.log("first");
  newObj = undefined;
});
canvas.on("selection:created", (option) => {
  console.log("second", option);

  if (newObj !== undefined) {
    if (newObj.left < 0 || newObj.top < 0) {
      emitModObj({ canva: canvas.toDatalessJSON() });
      return;
    }
    canvasEmitObject = {
      obj: newObj,
      divId: activeShape,
      id: null,
    };
    emitObj(canvasEmitObject);
  }
  console.log(option, "added");
});
