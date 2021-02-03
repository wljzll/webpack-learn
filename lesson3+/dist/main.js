/******/ (() => { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const title = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './title.txt'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
const logo = __webpack_require__(Object(function webpackMissingModule() { var e = new Error("Cannot find module './images/logo.jpg'"); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
let image = new Image();
image.src = logo;
document.body.appendChild(image)
console.log(title);
document.write(title.default);

/******/ })()
;