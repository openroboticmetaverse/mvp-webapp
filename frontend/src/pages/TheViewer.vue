
<template>
  <canvas ref="canvas" class="canvas"> </canvas>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { ThreeHelper } from "../helpers/threeHelpers/core/ThreeHelper";
import RobotLoader from "../helpers/modelLoaders/core/RobotLoader";
import { subscribeToTransformations } from "../helpers/wsManager/core/wsManager";
const canvas = ref<HTMLCanvasElement | null>(null);
let threeHelper : ThreeHelper;

onMounted(async () => {
  if (canvas.value) {
    threeHelper = new ThreeHelper(canvas.value);
    threeHelper.animate();
    const robot = await RobotLoader.createRobot(
      "https://raw.githubusercontent.com/openroboticmetaverse/mvp-test/master/assets/models/franka_description/robots/panda_arm_hand.urdf.xacro"
    );
    if (robot) {
      robot.scale.set(10, 10, 10);
      robot.rotation.x = -Math.PI / 2;
      threeHelper.add(robot);
      subscribeToTransformations(robot, 3000);
    }
  }
});

onUnmounted(() => {
  threeHelper.dispose()
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