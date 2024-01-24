const ClientManager = require('../models/clients');
const clientManager = new ClientManager()


exports.addToClientManager = (ws) => {
  clientManager.add(ws)
}
exports.removeFromClientManager = (ws) => {
  clientManager.delete(ws)
}
exports.publishToWs = (msg) => {
  clientManager.broadcastMessage(msg)
}