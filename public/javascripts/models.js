const rectObj = () => {
  return new fabric.Rect({
    fill: 0,
    stroke: "black",
    width: 0,
    height: 0,
  });
};
const roundObj = () => {
  return new fabric.Ellipse({
    fill: 0,
    stroke: "black",
    originX: "left",
    originY: "top",
    rx: 0,
    ry: 0,
  });
};
const triangleObj = () => {
  return new fabric.Triangle({
    fill: 0,
    stroke: "black",
    width: 0,
    height: 0,
  });
};
const fillRectObj = () => {
  return new fabric.Rect({
    fill: "red",
    stroke: "black",
    width: 0,
    height: 0,
  });
};
const fillRoundObj = () => {
  return new fabric.Ellipse({
    fill: "black",
    stroke: "black",
    originX: "left",
    originY: "top",
    rx: 0,
    ry: 0,
  });
};
const fillTriangleObj = () => {
  return new fabric.Triangle({
    fill: "red",
    stroke: "black",
    width: 0,
    height: 0,
  });
};
export {
  rectObj,
  roundObj,
  triangleObj,
  fillRectObj,
  fillRoundObj,
  fillTriangleObj,
};
