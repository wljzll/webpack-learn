let logo = require('./images/kf.jpg');
console.log(logo);
let image = new Image();
image.src = logo.default;
document.body.appendChild(image);