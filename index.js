const http = require('http');
const requestListener = require('./routes.js');

const port = process.env.PORT || 3000;

const server = http.createServer(requestListener);

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
