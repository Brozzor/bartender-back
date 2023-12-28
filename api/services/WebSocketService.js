const WebSocket = require('ws');
module.exports = {
    init: async function () {
        const wss = new WebSocket.Server({ noServer: true });
        const connectedSockets = [];
      
        wss.on('connection', async (ws, req) => {

            let bar;
            try {
                bar = await authBar(req.headers.authorization)
                closeAllSameBarSocket(bar.id);
            } catch (error) {
                return ws.close()
            }
            
            ws.bar = bar.id
            connectedSockets.push(ws);
        
            ws.on('message', (message) => {
                console.log(`Reçu: ${message}`);
            });
        
            ws.send('Bienvenue sur le serveur WebSocket de Sails.js!');
        });
      
        sails.hooks.http.server.on('upgrade', (request, socket, head) => {
          wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
          });
        });
      
        sails.config.sockets = {
          connectedSockets: connectedSockets,
        };
    }
}

async function authBar(authorization) { 
    const base64 = authorization.split(' ')[1]
    const decoded = Buffer.from(base64, 'base64').toString('ascii')
    const [bid, token] = decoded.split(':')
    return await Bar.findOne({id: bid, token: token})  
}

async function closeAllSameBarSocket(barId) {
    sails.config.sockets.connectedSockets.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN && ws.bar === barId) {
            ws.close()
        }
    });
}