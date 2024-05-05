<template>
  <canvas ref="canvas" class="canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { Group } from "three";
import { ThreeHelper } from "../helpers/threeHelpers/core/ThreeHelper";
import RobotLoader from "../helpers/modelLoaders/core/RobotLoader";

import {
  subscribeToTransformations,
  unsubscribeFromTransformations,
} from "../helpers/wsManager/core/wsManager"; // Assume unsubscribeFromTransformations is a method you have for unsubscribing
import { useRobotController, useRobotSelector, useNavbarStore } from "../stores/store";

const canvas = ref<HTMLCanvasElement | null>(null);
let threeHelper: ThreeHelper;
let robot = null;
let robots = [];
let robotSecond = null;
const robotController = useRobotController();
const robotSelector = useRobotSelector();
const navbarSelector = useNavbarStore();

const ws = ref<WebSocket | null>(null);

async function createRobot(robotPath, x = 0, y = 0, z = 0) {
  const pair = await RobotLoader.createRobot(robotPath);
  robot = pair[0];
  robot.scale.set(10, 10, 10);
  robot.rotation.x = -Math.PI / 2;
  robot.position.set(x, y, z);
  console.log(robot.id);
  return pair;
}

onMounted(async () => {
  if (canvas.value) {
    threeHelper = new ThreeHelper(canvas.value);
    threeHelper.animate();
  }
  //

  // Watcher for isRobotActivated changes
  watch(
    () => robotController.isRobotActivated,
    (newVal) => {
      if (newVal && robot) {
        // Subscribe if not already subscribed
        if (newVal) {
          ws.value = subscribeToTransformations(robot, 8081);
        }
      } else {
        if (!newVal) {
          unsubscribeFromTransformations(ws.value);
          ws.value = null;
        }
      }
    }
  );
  watch(() => navbarSelector.isSimulationRunning, async (isRunning) => {
    const franka_arm = "https://raw.githubusercontent.com/openroboticmetaverse/mvp-test/master/assets/models/franka_description/robots/panda_arm_hand.urdf.xacro";
    const franka_dual_arm = ref("https://raw.githubusercontent.com/openroboticmetaverse/mvp-webapp/main/frontend/public/franka_description/robots/dual_panda_example.urdf.xacro")

    function generateGridPoints(width, height, distance) {
      const gridPoints = [];

      for (let x = 0; x < width; x += distance) {
        for (let y = 0; y < height; y += distance) {
          gridPoints.push({ x: x, y: y });
        }
      }

      return gridPoints;
    }
    console.log("starting ....,", isRunning)
    if (isRunning) {
      console.log("starting ....")
      const pair = await createRobot(franka_arm);
      const manager = pair[1];
      let robot = pair[0];
      manager.onLoad = () => {
        let xGrid = 4;
        let yGrid = 4;
        let step = 20;

        let xzPosList = generateGridPoints(xGrid * step, yGrid * step, step);

        xzPosList.forEach(coord => {
          let clone = robot.clone();
          robots.push(clone);
          clone.position.x = coord.x;
          clone.position.z = coord.z;
          threeHelper.add(clone);
        })

      }
    } else {
      robots.forEach(robot => {
        threeHelper.remove(robot);
      })
      // remove all saved
      robots.splice(robots, robots.length)
    }
  });

  watch(
    () => robotSelector.selectedRobot,
    async (newVal) => {
      const group = new Group();
      const pair = await createRobot(newVal);
      const manager = pair[1];
      let direction = Math.random() <= 0.5 ? -1 : 1;
      let randomX = (Math.random() * 100) * direction;
      let robot = pair[0];
      manager.onLoad = () => {
        // console.log(clone);
        let oldPos = robot.position.x;
        let oldPosY = robot.position.y;
        for (let i = 0; i < 50; ++i) {
          let clone = robot.clone();
          oldPos += 50;
          console.log(parseInt(oldPos))
          if (parseInt(oldPos) % 200 == 0) {
            oldPosY += 50;
            console.log(oldPosY)
            clone.position.y = oldPosY;
          }
          clone.position.x = oldPos;
          threeHelper.add(clone);
        }
      }
      // clone.matrix=robot.matrix
      // clone.matrixWorld=robot.matrixWorld
      // let clone = await createRobot(newVal);
      // let clone =  structuredClone(robot) 
      // clone.position.x += 30
      // robot.position.x -= 70
      // group.add(robot);
      // group.add(robotSecond);
      // console.log(clone === robot)
      // console.log(clone)
      // console.log(robot)
      threeHelper.add(robot);
      console.log("orig:", robot.position)
      // threeHelper.add(robot);
      // threeHelper.add(robot);
      // threeHelper.add(clone);
      // if (newVal && robot) {
      //   await threeHelper.remove(robot)
      //   robot = await createRobot(newVal)
      //   threeHelper.add(robot)
      // }
      // else if (newVal && !robot) {
      //   robot = await createRobot(newVal, -10, -10, -10)
      //   robotSecond = await createRobot(newVal, 50, 10, 10)
      //   threeHelper = threeHelper.add(robot, robotSecond)
      // }
    }
  );
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
