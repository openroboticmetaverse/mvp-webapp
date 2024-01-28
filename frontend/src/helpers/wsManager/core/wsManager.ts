import { Object3D } from "three";

const initWebSocket = (port: number): WebSocket => {
  return new WebSocket(`ws://localhost:${port.toString()}`);

};

export const subscribeToTransformations = (robot:Object3D, port: number) => {
    const ws = initWebSocket(port);
    ws.onmessage = (event) => {
        let data = JSON.parse(event.data);
        if (data.jointPositions) {
            // console.log(robot.joints)
            // console.log(data.jointPositions)
            for (let jointName in data.jointPositions) {
            if (robot.joints.hasOwnProperty(jointName)) {
              robot.setJointValue(jointName, data.jointPositions[jointName]) ;
            }
          }
          }
    }
}
