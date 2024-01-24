const WebSocket = require('ws');

const serializeMessage = (msg) => {
    return  JSON.stringify(msg)
}

module.exports = class ClientManager {
    constructor() {
        this.pose = {}
        this.clients = new Set()
    }
    add(ws) {
        this.clients.add(ws)
    }
    delete(ws) {
        this.clients.delete(ws)
    }
    broadcastMessage(message) {
        let serializedMessage = serializeMessage(message)
        this.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(serializedMessage)
            }
        })
    }


};
