module.exports = class RobotCreator {
  constructor() {
  }
  generatePoseValue(min, max) {
    return Math.random() * (max - min) + min;
  }
  generateRobotPose() {
    return {
      jointPositions: {
        panda_joint1: this.generatePoseValue(-3.14, 3, 14),
        panda_joint2: this.generatePoseValue(-3.14, 3, 14),
        panda_joint4: this.generatePoseValue(-3.14, 3, 14),
        panda_joint6: this.generatePoseValue(-3.14, 3, 14),
        panda_joint7: this.generatePoseValue(-3.14, 3, 14),
      }
    }
  }
};
