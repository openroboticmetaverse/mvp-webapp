<template>
  <canvas ref="canvas" class="canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { ThreeHelper } from "../helpers/threeHelpers/core/ThreeHelper";
import RobotLoader from "../helpers/modelLoaders/core/RobotLoader";
import { subscribeToTransformations, unsubscribeFromTransformations } from "../helpers/wsManager/core/wsManager"; // Assume unsubscribeFromTransformations is a method you have for unsubscribing
import { useRobotController, useRobotSelector } from "../stores/store";

const canvas = ref<HTMLCanvasElement | null>(null);
let threeHelper: ThreeHelper;
let robot = null;
const robotController = useRobotController();
const robotSelector = useRobotSelector();
const ws = ref<WebSocket | null>(null)

async function createRobot(robotPath) {
  robot = await RobotLoader.createRobot(robotPath)
  robot.scale.set(10, 10, 10);
  robot.rotation.x = -Math.PI / 2;
  return robot
}

onMounted(async () => {
  if (canvas.value) {
    threeHelper = new ThreeHelper(canvas.value);
    threeHelper.animate();

  }

  // Watcher for isRobotActivated changes
  watch(() => robotController.isRobotActivated, (newVal) => {
    if (newVal && robot) {
      // Subscribe if not already subscribed
      if (newVal) {
        ws.value = subscribeToTransformations(robot, 3000);
      }
    } else {

      if (!newVal) {
        unsubscribeFromTransformations(ws.value);
        ws.value = null;
      }
    }
  });

  watch(() => robotSelector.selectedRobot, async (newVal) => {
    if (newVal && robot) {
      await threeHelper.remove(robot)
      robot = await createRobot(newVal)
      threeHelper.add(robot)
    }
    else if (newVal && !robot) {
      robot = await createRobot(newVal)
      threeHelper.add(robot)
    }
  })
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
