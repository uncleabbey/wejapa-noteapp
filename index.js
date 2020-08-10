const http = require('http');
const requestListener = require('./routes.js');

const host = 'localhost';
const port = process.env.PORT || 3000;

const server = http.createServer(requestListener);

server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
