const debug = require('debug')("node-angular)")
const http = require('http');
const app = require('./server/app');

const port = process.env.PORT || 3000;
app.set('port', port)

const server = http.createServer(app);

server.listen(port);