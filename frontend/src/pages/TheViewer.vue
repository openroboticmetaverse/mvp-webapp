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
import { Vector3 } from "three";
import { RobotProperty, RobotManager } from '../kernel/managers/RobotManager.ts';

import { useRobotController, useRobotSelector, useNavbarStore } from "../stores/store";

// Define refs for components and helpers
const canvas = ref<HTMLCanvasElement | null>(null);
let threeHelper: ThreeHelper;
const robotController = useRobotController();
const robotSelector = useRobotSelector();
let robotManager: RobotManager;

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

// On component mount, initialize threeHelper and animate it
onMounted(async () => {
  if (canvas.value) {
    threeHelper = new ThreeHelper(canvas.value);
    robotManager = new RobotManager(threeHelper);
    threeHelper.animate();
  }
  //

  watch(() => navbarSelector.isRemoveAll, async (isRemoveAll) => {
    robotManager.removeAll();
  });

  async function poseRobotsFacingEachOther() {
    try {

      const distance = 150; // Distance between the centers of the two robots

      // Get connection details for the first robot
      const url1 = prompt("Enter IP and port for the first robot (e.g., 192.168.1.2:9090):", "localhost:9090");
      const robotProps1: RobotProperty = {
        scale: new Vector3(100, 100, 100),
        rotation: new Vector3(- Math.PI / 2, 0, 0), // Face towards the center
        position: [new Vector3(-distance / 2, 0, 0)],
        url: `ws://${url1}`,
        color: 'red',
        updateRobot: applyJointStatesToRobot,
      };

      // Add robot to the scene
      await robotManager.addSingleRobot("franka_arm", robotProps1);
    } catch (error) {
      console.error("Failed to add the robots facing each other:", error);
    }
  }
  watch(() => navbarSelector.isSimulationRunning, async (isRunning) => {
    if (isRunning) {
      poseRobotsFacingEachOther();
    };
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
});
// On component unmount, dispose of threeHelper and unsubscribe from ROS joint state topic
onUnmounted(() => {
  robotManager.removeAll();
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
