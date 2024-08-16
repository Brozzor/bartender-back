const WebSocket = require('ws');
module.exports = {
    init: async function () {
        const wss = new WebSocket.Server({ noServer: true });
        const connectedSockets = [];
      
        wss.on('connection', async (ws, req) => {
            console.log('bar connection')
            let bar;
            try {
                bar = await authBar(req.headers.authorization)
                await closeAllSameBarSocket(bar.id);
                await Bar.updateOne({id: bar.id}, {status: 'ONLINE'})
            } catch (error) {
                console.log(error)
                return ws.close()
            }
            
            ws.bar = bar.id
            connectedSockets.push(ws);
        
            ws.on('message', (message) => {
                console.log(`Reçu: ${message}`);
            });

            
            ws.on("close", async () => {
                console.log('close')
            });

            ws.on("error", async (err) => {
                console.log('error');
                console.log(err);
                
            });

            ws.on("pong", async (err) => {
                console.log('pong');
                console.log(err);
                
            });


        });
        
        wss.on("error", (err) => {
            console.log(err);
        });
      
        sails.hooks.http.server.on('upgrade', (request, socket, head) => {
          wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit('connection', ws, request);
          });
        });

      
        sails.config.sockets = {
          connectedSockets: connectedSockets,
        };
    },

    send: async function (message) {
        for (const ws of sails.config.sockets.connectedSockets) {
            if (ws.readyState === WebSocket.OPEN && ws.bar === sails.config.tenant.id) {
                ws.send(JSON.stringify(message));
            }
        }
    }
}

async function authBar(authorization) { 
    const base64 = authorization.split(' ')[1]
    const decoded = Buffer.from(base64, 'base64').toString('ascii')
    const [bid, token] = decoded.split(':')
    return await Bar.findOne({id: bid, token: token})  
}

async function closeAllSameBarSocket(barId) {
    for (const ws of sails.config.sockets.connectedSockets) {
        if (ws.readyState === WebSocket.OPEN && ws.bar === barId) {
            sails.config.sockets.connectedSockets.splice(sails.config.sockets.connectedSockets.indexOf(ws), 1);
            await ws.close()
            await Bar.updateOne({id: barId}, {status: 'OFFLINE'})
        }
    }
}