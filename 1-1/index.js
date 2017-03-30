const st = require('st');
const http = require('http');

http.createServer(st({
  path: __dirname + '/../public/',
  index: 'index.html',
  url: 'h1-1/',
})).listen(process.env.PORT || 1337);
