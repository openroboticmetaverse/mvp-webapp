

const clientController = require("./controllers/client")
const robotController = require("./controllers/robot")
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });

// Handle new WebSocket connections
wss.on('connection', (ws) => {
  // Add the new client
  clientController.addToClientManager(ws)

  // Remove the client 
  ws.on('close', () => {
    clientController.removeFromClientManager(ws)
  });
});


function publishRobotPoses() {
  let message = robotController.getRobotPose()
  clientController.publishToWs(message);
}

// Call the function to publish robot poses periodically
setInterval(publishRobotPoses, 50);
