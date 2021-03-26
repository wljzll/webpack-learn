function loader(content) {
  return `
   let style = document.createElement('style');
   style.innerHTML = ${JSON.stringify(content)};
   doucment.head.appendChild(style);
  `
}

module.exports = loader;
