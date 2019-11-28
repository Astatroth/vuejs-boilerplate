import camelCase from "lodash/camelCase";
const requireModule = require.context("./", true, /\.js$/); //extract js files inside modules folder
const modules = {};

requireModule.keys().forEach(fileName => {
    if (fileName === "./index.js" || /\.locale/.test(fileName) || /routes/.test(fileName)) return; //reject the index.js file

    const moduleName = camelCase(fileName.split('/')[1]);

    modules[moduleName] = requireModule(fileName).default;
});

export default modules;