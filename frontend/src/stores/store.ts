// navbarStore.js
import { defineStore } from "pinia";

export const useNavbarStore = defineStore("navbar", {
  state: () => ({
    isControlPanelActive: false,
    isPoseDisplayActive: false,
    isRobotBrowserActive: false,
    isDebugActive: false
  }),
  actions: {
    deactivateControlPanel() {
      this.isControlPanelActive = false;
    },
    toggleControlPanel() {
      this.isControlPanelActive = !this.isControlPanelActive;
    },
    deactivatePoseDisplay() {
      this.isPoseDisplayActive = false;
    },
    togglePoseDisplay() {
      this.isPoseDisplayActive = !this.isPoseDisplayActive;
    },
    deactivateRobotBrowser() {
      this.isRobotBrowserActive = false;
    },
    toggleRobotBrowser() {
      this.isRobotBrowserActive = !this.isRobotBrowserActive;
    },
    toggleDebug() {
      this.isDebugActive = !this.isDebugActive;
    },
  },
});
export const useRobotController = defineStore("controller", {
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
export const useRobotSelector = defineStore("selector", {
  state: () => ({
    selectedRobot: "",
  }),
  actions: {
    selectRobot(robotPath: string) {
      this.selectedRobot = robotPath;
    },
    deselectRobot(robotPath: string) {
      this.selectedRobot = ""
    },
  },
});