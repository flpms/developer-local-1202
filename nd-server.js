var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(3001);
console.log('Server Start: \n Porta: 3001 ');