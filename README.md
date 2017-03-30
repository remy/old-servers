# HTTP versions

This project aims to make the following HTTP versions available to test against:

- [0.9](https://www.w3.org/Protocols/HTTP/AsImplemented.html): http://http-0.9.remi.tech
- [1.0](https://www.w3.org/Protocols/HTTP/HTTP2.html) ([RFC](https://tools.ietf.org/html/rfc1945)) (not implemented…yet)
- [1.1](https://tools.ietf.org/html/rfc2616): http://http-1.1.remi.tech
- [2.0](https://tools.ietf.org/html/rfc7540): https://http-2.remi.tech

## Background

This hack was inspired by a talk on HTTP by [Ana Balica](https://twitter.com/anabalica/status/847403988551032834) at Render Conf 2017.

Specifically she mentioned that it was tricky to find a server still responding to HTTP 0.9, which I found fun to implement.

Caveat: the HTTP 2 and HTTP 1.1 servers are simple Node.js http servers, the H2 deployment uses the (excellent) [zeit now](https://zeit.co/now) platform, and H1.1 is the same code, but on my own instance (and no SSL or H2).

The work was really in HTTP 0.9 which boils down to very, very little code. Essentially:

```js
const net = require('net');
const fs = require('fs');

const loadURL = url => new Promise(resolve => {
  fs.readFile(`${__dirname}/public/${url}`, 'utf8', (error, body) => {
    if (error) {
      return resolve('Not found');
    }

    return resolve(body);
  });
});

const server = net.createServer(c => {
  c.on('data', data => {
    // ignores METHOD
    let [, url] = data.toString().trim().split(' ');
    loadURL(url).then(body => {
      c.write(body);
      c.destroy();
    });
  });
});

server.on('error', err => throw err);
server.listen(80);
```

## Hosting

- HTTP 2 is using zeit.co
- HTTP 1.1 is running on Heroku
- HTTP 0.9 is running on an instance provisioned from scaleway.com (foolishly inside a [screen](https://remysharp.com/2015/04/27/screen) instance…which isn't too sensible)
