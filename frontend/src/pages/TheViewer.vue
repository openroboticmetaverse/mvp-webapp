<template>
  <canvas ref="canvas" class="canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";

/**
 * TheViewer is a Vue component that displays a 3D viewer of a robot and its joint states.
 * It uses the Three.js library to render the 3D scene and ROSLIB to connect to a ROS master and subscribe to /joint_states topic.
 * 
 * @property {HTMLCanvasElement | null} canvas - The canvas element that the 3D viewer is rendered on.
 * @property {ThreeHelper} threeHelper - The ThreeHelper object that manages the 3D scene.
 * @property {Object | null} robot - The 3D model of the robot.
 * @property {Object} robotController - The store object that manages the robot activation state.
 * @property {Object} robotSelector - The store object that manages the selected robot.
 * @property {Object} ros - The ROSLIB object that manages the ROS connection.
 * @property {Object} jointStateTopic - The ROSLIB topic object that subscribes to /joint_states topic.
 * 
 * @emits {Object} createRobot: Emits a promise that resolves to the created robot object.
 * @emits {Object} applyJointStatesToRobot: Emits a function that applies the joint states to the robot's joints.
 * @emits {void} onMounted: Emits a function that initializes the ThreeHelper and animates the 3D viewer.
 * @emits {void} watch: Emits a watch function that creates or updates the robot based on changes in the robot activation and selected robot state.
 * @emits {void} onUnmounted: Emits a function that disposes the ThreeHelper and unsubscribes from the ROS joint state topic.
 */

// Import needed components and helpers
import { ThreeHelper } from "../helpers/threeHelpers/core/ThreeHelper";
import RobotLoader from "../helpers/modelLoaders/core/RobotLoader";
import ROSLIB from 'roslib';
import { Group } from "three";

import {
  subscribeToTransformations,
  subscribeToTransformationsAll,
  unsubscribeFromTransformations,
} from "../helpers/wsManager/core/wsManager"; // Assume unsubscribeFromTransformations is a method you have for unsubscribing
import { useRobotController, useRobotSelector, useNavbarStore } from "../stores/store";

// Define refs for components and helpers
const canvas = ref<HTMLCanvasElement | null>(null);
let threeHelper: ThreeHelper;
let robot = null;
let robots = [];
let robotSecond = null;
const robotController = useRobotController();
const robotSelector = useRobotSelector();

// Setup ROS connection
const ros = new ROSLIB.Ros({
  url: 'ws://localhost:9090'
});

// On ROS connection, log message
ros.on('connection', () => {
  console.log('Connected to ROS WebSocket.');
});

// On ROS error, log error
ros.on('error', (error) => {
  console.error('Error connecting to ROS: ', error);
});

// On ROS close, log message
ros.on('close', () => {
  console.log('Connection to ROS closed.');
});

// Define ROS joint state topic
const jointStateTopic = new ROSLIB.Topic({
  ros,
  name: '/joint_states',
  messageType: 'sensor_msgs/JointState'
});

// Function to create robot model
async function createSingleRobot(robotPath: string): Promise<Object> {
  /**
   * Creates a 3D model of the robot.
   * 
   * @param {string} robotPath - The path to the robot model.
   * @returns {Promise<Object>} A promise that resolves to the created robot object.
   */
  // Create robot model, scale and rotate it, add it to threeHelper, and subscribe to joint state updates
  robot = await RobotLoader.createRobot(robotPath);
  robot.scale.set(10, 10, 10);
  robot.rotation.x = -Math.PI / 2;
  threeHelper.add(robot);
  jointStateTopic.subscribe((message) => {
    if (robot) {
      applyJointStatesToRobot(robot, message);
    }
  });
  return robot;
}
// Function to apply joint states to robot's joints
function applyJointStatesToRobot(robot: Object, jointStates: Object) {
  /**
   * Applies the joint states to the robot's joints.
   * 
   * @param {Object} robot - The 3D model of the robot.
   * @param {Object} jointStates - The joint states message.
   */
  // Assume function applies joint states to robot joints
  jointStates.name.forEach((jointName: string, index: number) => {
    const joint = robot.getObjectByName(jointName);
    if (joint) {
      joint.rotation.z = jointStates.position[index];  // Adjust transformation based on actual joint data
      //console.log(`Joint ${jointName} position: ${jointStates.position[index]}`);

    }
  });
}
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

// On component mount, initialize threeHelper and animate it
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
    if (isRunning) {
      const pair = await createRobot(franka_arm);
      const manager = pair[1];
      let robot = pair[0];
      // threeHelper.add(robot);
      manager.onLoad = () => {
        console.log(robot)
        let xGrid = 4;
        let yGrid = 4;
        let step = 20;

        let xzPosList = generateGridPoints(xGrid * step, yGrid * step, step);
        console.log(xzPosList)
        xzPosList.forEach(coord => {
          let clone = robot.clone();
          robots.push(clone);
          clone.position.x = coord.x;
          clone.position.z = coord.y;
          threeHelper.add(clone);
          jointStateTopic.subscribe((message) => {
            if (clone) {
              applyJointStatesToRobot(clone, message);
            }
          })
        })

      }
    } else {
      robots.forEach(robot => {
        threeHelper.remove(robot);
      })
      // remove all saved
      robots.splice(robots, robots.length);
      unsubscribeFromTransformations(ws.value);
      ws.value = null;
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

// Watch for changes in robot activation and selected robot, and create or update robot accordingly
watch(() => robotController.isRobotActivated, async (newVal: boolean) => {
  if (newVal) {
    if (!robot && robotSelector.selectedRobot) {
      robot = await createRobot(robotSelector.selectedRobot);
    }
  }
});
watch(() => robotSelector.selectedRobot, async (newVal: string) => {
  if (newVal) {
    if (robot) {
      await threeHelper.remove(robot);
      robot = await createRobot(newVal);
    } else {
      robot = await createRobot(newVal);
    }
  }
});

// On component unmount, dispose of threeHelper and unsubscribe from ROS joint state topic
onUnmounted(() => {
  threeHelper.dispose();
  jointStateTopic.unsubscribe();
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
