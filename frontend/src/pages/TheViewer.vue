
<template>
    <canvas ref="canvas" class="canvas"> </canvas>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { IThreeHelper } from "../helpers/threeHelpers/interfaces/IThreeHelper";
import { ThreeHelper } from "../helpers/threeHelpers/core/ThreeHelper";
import { EnhancedThreeHelper } from "../helpers/threeHelpers/core/EnhancedThreeHelper";
import RobotLoader from "../helpers/modelLoaders/core/RobotLoader";
const canvas = ref<HTMLCanvasElement | null>(null);

const initWebSocket = (robot) => {
  const socket = new WebSocket("ws://localhost:3000")
    socket.onmessage = (event) => {
      let data = JSON.parse(event.data);
      if (data.jointPositions) {
        console.log(robot.joints)
        console.log(data.jointPositions)

        for (let jointName in data.jointPositions) {
        // Check if the joint exists in robot.joints
        if (robot.joints.hasOwnProperty(jointName)) {
          robot.setJointValue(jointName, data.jointPositions[jointName]) ;
        }
      }
      }
    }
}

onMounted(async () => {
  if (canvas.value) {
    const baseThreeHelper = new ThreeHelper(canvas.value);
    const decoratedThreeHelper: IThreeHelper = new EnhancedThreeHelper(
      baseThreeHelper
    );
    await decoratedThreeHelper.animate();
    const robot = await RobotLoader.createRobot(
      "https://raw.githubusercontent.com/openroboticmetaverse/mvp-test/master/assets/models/franka_description/robots/panda_arm_hand.urdf.xacro"
    );
    if (robot) {
      robot.scale.set(10, 10, 10);
      robot.rotation.x = -Math.PI / 2;
      baseThreeHelper.add(robot);
      initWebSocket(robot)
    }
  }
});
</script>

<style >
.canvas {
  display: block;
  overflow: hidden;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  position: absolute;
  
}
</style>