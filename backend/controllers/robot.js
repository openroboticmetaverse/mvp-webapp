const RobotCreator = require('../models/robot');
const robot = new RobotCreator()

exports.getRobotPose = () => {
  return robot.generateRobotPose()
}