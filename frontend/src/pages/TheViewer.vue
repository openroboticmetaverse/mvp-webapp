<template>
  <canvas ref="canvas" class="canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { ThreeHelper } from "../helpers/threeHelpers/core/ThreeHelper";
import RobotLoader from "../helpers/modelLoaders/core/RobotLoader";
import { subscribeToTransformations, unsubscribeFromTransformations } from "../helpers/wsManager/core/wsManager"; // Assume unsubscribeFromTransformations is a method you have for unsubscribing
import { useRobotController } from "../stores/store";

const canvas = ref<HTMLCanvasElement | null>(null);
let threeHelper: ThreeHelper;
let robot = null;
const robotController = useRobotController();
const ws = ref<WebSocket | null>(null)

onMounted(async () => {
  if (canvas.value) {
    threeHelper = new ThreeHelper(canvas.value);
    threeHelper.animate();

    robot = await RobotLoader.createRobot(
      "https://raw.githubusercontent.com/openroboticmetaverse/mvp-test/master/assets/models/franka_description/robots/panda_arm_hand.urdf.xacro"
    );

    if (robot) {
      robot.scale.set(10, 10, 10);
      robot.rotation.x = -Math.PI / 2;
      threeHelper.add(robot);

      // Initial subscription based on isRobotActivated
      if (robotController.isRobotActivated) {
        ws.value = subscribeToTransformations(robot, 3000);
      }
    }
  }

  // Watcher for isRobotActivated changes
  watch(() => robotController.isRobotActivated, (newVal) => {
    if (newVal && robot) {
      // Subscribe if not already subscribed
      if (!ws.value) {
        ws.value = subscribeToTransformations(robot, 3000);
      }
    } else {
      // Unsubscribe if currently subscribed
      if (ws.value) {
        unsubscribeFromTransformations(ws.value); // Assuming this is how you unsubscribe
        ws.value = null;
      }
    }
  });
});

onUnmounted(() => {
  threeHelper.dispose();
  if (ws.value) {
    unsubscribeFromTransformations(ws.value); // Clean up WebSocket connection
    ws.value = null;
  }
});
</script>

<style>
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
