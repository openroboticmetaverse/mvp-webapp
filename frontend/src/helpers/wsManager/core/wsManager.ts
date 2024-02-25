import { Object3D } from "three";

const initWebSocket = (port: number): WebSocket => {
  return new WebSocket(`ws://localhost:${port.toString()}`);
};

export const subscribeToTransformations = (robot: Object3D, port: number): WebSocket => {
  const ws = initWebSocket(port);
  ws.send("Hello Server!")
  ws.onmessage = (event) => {
    let data = JSON.parse(event.data);
    if (data.jointPositions) {
      for (let jointName in data.jointPositions) {
        if (robot.joints.hasOwnProperty(jointName)) {
          robot.setJointValue(jointName, data.jointPositions[jointName]);
        }
      }
    }
  };
  
  // Return the WebSocket connection for later use
  return ws;
};

export const unsubscribeFromTransformations = (ws: WebSocket) => {
  if (ws) {
    // Close the WebSocket connection
    ws.close();
    
    // Optionally reset the onmessage handler to a no-op or remove it entirely
    ws.onmessage = null;
  }
};
