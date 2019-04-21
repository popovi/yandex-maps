const { resolve } = require("path");

const target = process.env.TARGET || "client";
const enviroment = "development";

const pathToConfigFile = (target == "server") ? `${target}.webpack.config.js` : `${target}.${enviroment}.webpack.config.js`;

module.exports = require(resolve(__dirname, "webpack", pathToConfigFile));