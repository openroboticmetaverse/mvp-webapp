module.exports = class RobotCreator {
  constructor() {
    this.time = 0; // Initialize time or step count
  }

  // Function to map value from one range to another
  mapValue(value, start1, stop1, start2, stop2) {
    return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
  }

  // Generates a smooth cyclic value between -1 and 1 using a sine wave
  generateCyclicValue() {
    const value = Math.sin(this.time);
    this.time += 0.1; // Increment time to progress the wave in the next call
    return value;
  }

  generateRobotPose() {
    // Generate a single cyclic value for this pose to ensure smooth motion
    const cyclicValue = this.generateCyclicValue();

    return {
      jointPositions: {
        panda_joint1: this.mapValue(cyclicValue, -1, 1, -2.8973, 2.8973),
        panda_joint2: this.mapValue(cyclicValue, -1, 1, -1.7628, 1.7628),
        panda_joint3: this.mapValue(cyclicValue, -1, 1, -2.8973, 2.8973),
        panda_joint4: this.mapValue(cyclicValue, -1, 1, -3.0718, -0.0698),
        panda_joint5: this.mapValue(cyclicValue, -1, 1, -2.8973, 2.8973),
        panda_joint6: this.mapValue(cyclicValue, -1, 1, -0.0175, 3.7525),
        panda_joint7: this.mapValue(cyclicValue, -1, 1, -2.8973, 2.8973),
      }
    }
  }
};
