const path = require('path');

// function to get the root file path of a project
module.exports.rootPath = path.dirname(require.main.filename);
