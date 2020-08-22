"use strict";

//所有的loader都不干活，像marked-loader实际干活的是marked，babel-loader实际干活的是babel
const marked = require("marked");

//设置loader外边的参数，里边可以得到
const loaderUtils = require("loader-utils");

module.exports = function (markdown) {
  // merge params and default config
  const options = loaderUtils.getOptions(this);

  this.cacheable();

  marked.setOptions(options);

  return marked(markdown);
};