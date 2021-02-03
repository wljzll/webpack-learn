import "./index.css";
// import "./less.less";
// import "./sass.scss";
const title = require("./title.txt");
const logo = require("./images/logo.jpg");
let image = new Image();
image.src = logo;
document.body.appendChild(image)
console.log(title);
document.write(title.default);
