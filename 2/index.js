const st = require('st');
const http = require('http');

http.createServer(st({
  path: __dirname + '/../public/',
  index: 'index.html',
  url: 'h2/',
})).listen(process.env.PORT || 1337);
