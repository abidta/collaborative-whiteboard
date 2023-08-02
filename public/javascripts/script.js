// eslint-disable-next-line no-undef
const socket = io();
const canvas = document.getElementById("drawing-board");
const toolBar = document.getElementById("tool-bar");
const ctx = canvas.getContext("2d");

const canvasOffsetX = canvas.offsetLeft;
const canvasOffsetY = canvas.offsetTop;

canvas.width = window.innerWidth - canvasOffsetX;
canvas.height = window.innerHeight - canvasOffsetY;

let canvasData = [];
//let collabData = [];

let isPainting = false;
//let collabPainting = false;
let lineWidth = 5;
let clientX;
let clientY;
// let startX
// let startY

toolBar.addEventListener("click", (e) => {
  if (e.target.id === "clear") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  if (e.target.id === "save") {
    let url = canvas.toDataURL();
    console.log(url);
  }
});

toolBar.addEventListener("change", (e) => {
  if (e.target.id === "stroke") {
    ctx.strokeStyle = e.target.value;
  }
  if (e.target.id === "line-width") {
    lineWidth = e.target.value;
  }
});

const draw = (clientX, clientY) => {
  if (!isPainting) {
    return;
  }
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  // ctx.beginPath()
  ctx.lineTo(clientX - canvasOffsetX, clientY);
  ctx.stroke();
};
// const collabDraw=(collabX,collabY)=>{
//     if (collabPainting) {
//         console.log("collab")
//         ctx.lineWidth = lineWidth
//         ctx.lineCap = 'round'
//         ctx.lineTo(collabX - canvasOffsetX, collabY)
//         ctx.stroke()
//         ctx.beginPath()
//     }
// }

const mouseDown = () => {
  isPainting = true;
  ctx.beginPath();
  //startX = e.clientX
  //startY = e.clientY
  //ctx.closePath()
};
const mouseUp = (e) => {
  console.log(e);
  console.log(ctx.beginPath(), "begin");
  ctx.beginPath();
  socket.emit("mouseup", canvasData);
  canvasData = [];
  isPainting = false;
  //socket.emit('collab',canvasData)
  //collabDraw(collabData)
  //collabData=[]
  //ctx.closePath()
};

const mouseMOve = (e) => {
  clientX = e.clientX;
  clientY = e.clientY;
  if (e.type === "touchmove") {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  }
  if (isPainting) {
    console.log("paint");
    canvasData.push({ clientX, clientY });
    //socket.emit('collab', { clientX, clientY })
    draw(clientX, clientY);
  }
};
// mouse events
canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mouseup", mouseUp);
canvas.addEventListener("mousemove", mouseMOve);

//touch events
canvas.addEventListener("touchstart", mouseDown);
canvas.addEventListener("touchend", mouseUp);
canvas.addEventListener("touchmove", mouseMOve);

// socket events
// socket.on("collab", (data) => {
//  isPainting = true;
//  collabDraw(data);
//   collabPainting = true
//   collabData.push({clientX,clientY})
//   draw(clientX, clientY)
// })
socket.on("mouseup", (data) => {
  //isPainting = false
  //collabPainting = false;
  collabDraw(data);
});

const collabDraw = (data) => {
  //ctx.beginPath()
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  data.forEach((element) => {
    ctx.lineTo(element.clientX - canvasOffsetX, element.clientY);
    ctx.stroke();
  });
  ctx.beginPath();
};
