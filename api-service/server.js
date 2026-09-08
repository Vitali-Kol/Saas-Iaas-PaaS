const http = require('http');

const PORT = process.env.PORT || 3000;

// The Config Factor: keskkonnamuutujate lugemine (Environment Variables)
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const urlPath = req.url.split('?')[0];

  if (urlPath === '/api/info') {
    const team = process.env.TEAM_NAME || 'Tundmatu tiim (Viga!)';

    res.writeHead(200);
    res.end(JSON.stringify({
      meeskond: team,
      status: team === 'Tundmatu tiim (Viga!)' ? 'viga' : 'ok',
      timestamp: new Date().toISOString()
    }, null, 2));
    return;
  }

  // Fallback juuraadressil
  res.writeHead(200);
  res.end(JSON.stringify({
    service: 'api-service',
    status: 'running',
    info_endpoint: '/api/info',
    meeskond: process.env.TEAM_NAME || 'Tundmatu tiim (Viga!)'
  }, null, 2));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Mikroteenus töötab pordil ${PORT}`);
  console.log(`TEAM_NAME: ${process.env.TEAM_NAME || 'Määramata (Tundmatu tiim)'}`);
});
