/* eslint-disable no-undef */

const createModalObj = (id,data) => {
  switch (id) {
    case "rect":
      return rectObj();
    case "round":
      return roundObj();
    case "triangle":
      return triangleObj();
    case "fill-rect":
      return fillRectObj();
    case "fill-round":
      return fillRoundObj();
    case "fill-triangle":
      return fillTriangleObj();
      case "text":
        return textObj(data)
    default:
      break;
  }
}
;const rectObj = () => {
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
const textObj=(text)=>{
  return new fabric.IText("text",{
    top:150,
    left:150

  })
}
export {
 createModalObj
};
