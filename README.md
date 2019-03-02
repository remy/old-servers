_Note: the remi.tech domain has since lapsed (probably sensibly on my part), I might re-host one day, but for now, you'll need to host locally to try them out._

# HTTP versions

This hack aims to make the following HTTP versions available to test against:

- [0.9](https://www.w3.org/Protocols/HTTP/AsImplemented.html): http://http-0.9.remi.tech
- [1.0](https://www.w3.org/Protocols/HTTP/HTTP2.html) ([RFC](https://tools.ietf.org/html/rfc1945)) (not implemented…yet)
- [1.1](https://tools.ietf.org/html/rfc2616): http://http-1.1.remi.tech
- [2.0](https://tools.ietf.org/html/rfc7540): https://http-2.remi.tech

…and was written in 3 hours (mostly falling down rabbit holes around "the oldest server" and super old W3C documents).

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

## The domain name

There's a story behind that. Back in 2006 I scribbled notes in a pub with Julie to try to work out company names. Two remained after lots of ideas. [Left Logic](https://leftlogic.com) as my company is named today, and Remitech (the french spelling of my name…with "tech" added to the end).

When I floated the name Remitech across a few friends, each and every one of them responded with:

![Nope](http://i.imgur.com/qBsYuX5.gif)

…so alas, Remitech was left to die. Except! Skip forward to 2017, I attend Render Conf and they have a parter deal for a _free_ `.tech` domain. So, yep, that's what you've got: remi.tech. And yup, I'll totally left it expire and die once the year of free .tech domain is up `¯\_(ツ)_/¯`.
