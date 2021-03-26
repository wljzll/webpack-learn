let logo = require('./images/logo.png');
console.log(logo);
let image = new Image();
image.src = logo.default;
document.body.appendChild(image);