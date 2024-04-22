<template>
  <canvas ref="canvas" class="canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { ThreeHelper } from "../helpers/threeHelpers/core/ThreeHelper";
import RobotLoader from "../helpers/modelLoaders/core/RobotLoader";
import ROSLIB from 'roslib';
import { useRobotController, useRobotSelector } from "../stores/store";

const canvas = ref<HTMLCanvasElement | null>(null);
let threeHelper: ThreeHelper;
let robot = null;
const robotController = useRobotController();
const robotSelector = useRobotSelector();

// Setup ROS connection
const ros = new ROSLIB.Ros({
  url: 'ws://localhost:9090'
});

ros.on('connection', () => {
  console.log('Connected to ROS WebSocket.');
});

ros.on('error', (error) => {
  console.error('Error connecting to ROS: ', error);
});

ros.on('close', () => {
  console.log('Connection to ROS closed.');
});

const jointStateTopic = new ROSLIB.Topic({
  ros,
  name: '/joint_states',
  messageType: 'sensor_msgs/JointState'
});

async function createRobot(robotPath) {
  robot = await RobotLoader.createRobot(robotPath);
  robot.scale.set(10, 10, 10);
  robot.rotation.x = -Math.PI / 2;
  threeHelper.add(robot);

  // Subscribe to joint state updates
  jointStateTopic.subscribe((message) => {
    if (robot) {
      applyJointStatesToRobot(robot, message);
    }
  });
  return robot;
}

function applyJointStatesToRobot(robot, jointStates) {
  // Assume function applies joint states to robot joints
  jointStates.name.forEach((jointName, index) => {
    const joint = robot.getObjectByName(jointName);
    if (joint) {
      joint.rotation.x = jointStates.position[index];  // Adjust transformation based on actual joint data
    }
  });
}

onMounted(async () => {
  if (canvas.value) {
    threeHelper = new ThreeHelper(canvas.value);
    threeHelper.animate();
  }
});

watch(() => robotController.isRobotActivated, async (newVal) => {
  if (newVal) {
    if (!robot && robotSelector.selectedRobot) {
      robot = await createRobot(robotSelector.selectedRobot);
    }
  }
});

watch(() => robotSelector.selectedRobot, async (newVal) => {
  if (newVal) {
    if (robot) {
      await threeHelper.remove(robot);
      robot = await createRobot(newVal);
    } else {
      robot = await createRobot(newVal);
    }
  }
});

onUnmounted(() => {
  threeHelper.dispose();
  jointStateTopic.unsubscribe(); // Ensure to unsubscribe to clean up resources
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
