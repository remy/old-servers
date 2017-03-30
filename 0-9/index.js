const net = require('net');
const fs = require('fs');
const path = require('path');
const erorrPage = require('./404');
const parse = require('url').parse;
const host = 'remi.tech';

const clean = u => {
  let p = parse(u).pathname;
  p = p.replace(/%2e/ig, '.');
  p = p.replace(/%2f/ig, '/');
  p = p.replace(/%5c/ig, '\\');
  p = p.replace(/^[\/\\]?/g, '/');
  p = p.replace(/[\/\\]\.\.[\/\\]/g, '/');
  return path.normalize(p).replace(/\\/g, '/');
};

const fake09 = url => new Promise(resolve => {
  if (url.endsWith('/')) {
    url += 'index.html';
  }
  fs.readFile(`${__dirname}/../public/${url}`, 'utf8', (error, body) => {
    console.log(`GET ${url} ${error ? '404' : '200'}`);
    if (error) {
      return resolve(erorrPage({ url, host }));
    }

    return resolve(body);
  });
});

const server = net.createServer(c => {
  // 'connection' listener

  console.log(`client connection ${c.remoteAddress}`);
  c.on('end', () => {
    console.log('client disconnected');
  });
  c.on('data', data => {
    let [, url] = data.toString().trim().split(' ');
    try {
      url = clean(url);
      fake09(url).then(body => {
        c.write(body);
        c.destroy();
      });
    } catch (e) {
      console.error(e);
      c.write(erorrPage({ url, host }));
      c.destroy();
    }
  });
});

server.on('error', (err) => {
  throw err;
});

server.listen(process.env.PORT || 8124, () => {
  console.log('server bound');
});
