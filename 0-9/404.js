module.exports = ({ host, serverId = 'CERN/3.0', url }) => `<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
<html><head>
<title>Not Found</title>
</head><body>
<h1>Not Found</h1>
<p>The requested URL ${url} was not found on this server.</p>
<hr>
<address>${serverId} at ${host} Port 80</address>
</body></html>`;
