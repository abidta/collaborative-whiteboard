export const uid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
export const getRandomColor = () => {
  let randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + randomColor;
};
