const colorP = document.getElementById("inpColor");
const fontColor = document.getElementById("fontColor");
const reset = document.getElementById("reset");
const theFont = document.querySelectorAll(".theFont");
const main = document.getElementById("main");

let bgCol = localStorage.getItem("bg-color");
let fCol = localStorage.getItem("font-color");
if (bgCol && fCol) {
  main.style = `background-image: none; background-color: ${bgCol};`;
  theFont.forEach((font) => {
    font.style = `color: ${fCol}!important; border-color: ${fCol};`;
  });
}
colorP.addEventListener("input", () => {
  localStorage.setItem("bg-color", colorP.value);
  bgCol = localStorage.getItem("bg-color");
  main.style = `background-image: none; background-color: ${bgCol};`;
});
// console.log(theFont.length)
fontColor.addEventListener("input", () => {
  localStorage.setItem("font-color", fontColor.value);
  fCol = localStorage.getItem("font-color");
  theFont.forEach((font) => {
    font.style = `color: ${fCol}!important;`;
  });
});
const defaultBg = `background-color: #4d5dfb;
  background-image: linear-gradient(12deg, #4d5dfb 31%, #08c8f6 70%);`;
const defaultColor = `color: white;`
reset.addEventListener("click", () => {
  localStorage.setItem("bg-color", defaultBg);
  localStorage.setItem("font-color", defaultColor);
  main.style = defaultBg
  theFont.forEach((font) => {
    font.style = defaultColor;
  });
});
