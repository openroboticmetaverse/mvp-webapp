import { LoaderUtils, Object3D, LoadingManager } from "three";
import URDFLoader, { URDFRobot } from "urdf-loader";
import { XacroLoader } from "xacro-parser";

/**
 * The RobotLoader class is used to create a robot object from a specified URL.
 */
const FRANKA_DESCRIPTION_URL =
  "https://raw.githubusercontent.com/moveit/moveit_resources/ros2/panda_description/";

export default class RobotLoader {
  /**
   * Creates a robot object from the specified URL.
   *
   * @param {string} _url - The URL of the robot.
   * @return {Promise<Object3D>} A promise that resolves to the created robot object.
   */
  static createRobot(_url: string): Promise<[URDFRobot, LoadingManager]> {
    console.log("Loading robot from URL:", _url);

    const xacroLoader = new XacroLoader();
    xacroLoader.inOrder = true;
    xacroLoader.requirePrefix = true;
    xacroLoader.localProperties = true;

    xacroLoader.rospackCommands = {
      find: function (pkg) {
        switch (pkg) {
          case "moveit_resources_panda_description":
            return "https://raw.githubusercontent.com/moveit/moveit_resources/ros2/panda_description";
          case "franka_description":
            return "https://raw.githubusercontent.com/openroboticmetaverse/mvp-test/master/assets/models/franka_description";
          case "sawyer":
            return "https://raw.githubusercontent.com/openroboticmetaverse/mvp-test/master/assets/models/sawyer_description";
          case " robotiq_2f_85_gripper_visualization":
            return "https://raw.githubusercontent.com/openroboticmetaverse/mvp-test/master/assets/models/robotiq_3f_gripper_visualization";
        }
      },
    };

    return new Promise((resolve, reject) => {
      xacroLoader.load(
        _url,
        (xml) => {
          const manager = new LoadingManager();
          const urdfLoader = new URDFLoader(manager);
          urdfLoader.workingPath = LoaderUtils.extractUrlBase(_url);
          // //Ayssar:TODO: must be dynamic
          urdfLoader.packages =
            "https://raw.githubusercontent.com/openroboticmetaverse/mvp-test/master/assets/models";
          const robot = urdfLoader.parse(xml);
          resolve([robot, manager]);
        },
        (error) => {
          console.error("Error loading robot:", error);
          reject(error);
        }
      );
    });
  }
}
