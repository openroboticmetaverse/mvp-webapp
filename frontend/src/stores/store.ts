// navbarStore.js
import { defineStore } from "pinia";

// Navbar store
export const useNavbarStore = defineStore("navbar", {
  state: () => ({
    isControlPanelActive: false,
    isPoseDisplayActive: false,
    isRobotBrowserActive: false,
    isDebugActive: false,
    isSimulationRunning: false,
    isRemoveAll: false,
  }),
  actions: {
    toggleRemoveAll() {
      this.isRemoveAll = !this.isRemoveAll;
    },
    toggleSimulation() {
      this.isSimulationRunning = !this.isSimulationRunning;
    },
    toggleControlPanel() {
      this.isControlPanelActive = !this.isControlPanelActive;
    },
    togglePoseDisplay() {
      this.isPoseDisplayActive = !this.isPoseDisplayActive;
    },
    toggleRobotBrowser() {
      this.isRobotBrowserActive = !this.isRobotBrowserActive;
    },
    toggleDebug() {
      this.isDebugActive = !this.isDebugActive;
    },
    deactivateControlPanel() {
      this.isControlPanelActive = false;
    },
    deactivatePoseDisplay() {
      this.isPoseDisplayActive = false;
    },
    deactivateRobotBrowser() {
      this.isRobotBrowserActive = false;
    },
  },
});

// Robot controller store
export const useRobotController = defineStore("robotController", {
  state: () => ({
    isRobotActivated: false,
  }),
  actions: {
    activateRobot() {
      this.isRobotActivated = true;
    },
    deactivateRobot() {
      this.isRobotActivated = false;
    },
  },
});

// Robot selector store
export const useRobotSelector = defineStore("robotSelector", {
  state: () => ({
    selectedRobot: "",
  }),
  actions: {
    selectRobot(robotPath: string) {
      this.selectedRobot = robotPath;
    },
    deselectRobot() {
      this.selectedRobot = "";
    },
  },
});
