const path = require("path");
// const mime = require("mime");
var mime = require('mime');
const { getOptions } = require("loader-utils");

function loader(content) {
  let options = getOptions(this) || {};
  let { limit = 8 * 1024, fallback = "file-loader" } = options;
  const mimeType = mime.getType(this.resourcePath); // image/jpeg
  if (content.length < limit) {
    let base64Str = `data:${mimeType};base64,${content.toString("base64")}`;
    return `module.exports = ${JSON.stringify(base64Str)}`;
  } else {
    let fileLoader = require(fallback);
    return fileLoader.call(this, content);
  }
}

loader.raw = true; //这样写辨识source是一个二进制
module.exports = loader;
