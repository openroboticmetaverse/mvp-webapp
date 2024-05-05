import { LoaderUtils, Object3D, LoadingManager } from "three";
import URDFLoader from "urdf-loader";
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
  static createRobot(_url: string): Promise<Object3D> {
    /**
     * Load robot from URL.
     *
     * @param {string} _url - The URL of the robot.
     * @return {Promise<Object3D>} A promise that resolves to the created robot object.
     */
    console.log("Loading robot from URL:", _url);

    /**
     * XacroLoader instance used to load XACRO files.
     */
    const xacroLoader = new XacroLoader();
    xacroLoader.inOrder = true;
    xacroLoader.requirePrefix = true;
    xacroLoader.localProperties = true;

    /**
     * Function used to find the URL of a specific package.
     *
     * @param {string} pkg - The name of the package.
     * @return {string} The URL of the package.
     */
    xacroLoader.rospackCommands = {
      find: function (pkg) {
        switch (pkg) {
          case "moveit_resources_panda_description":
            return "https://raw.githubusercontent.com/moveit/moveit_resources/ros2/panda_description";
          case "franka_description":
            return "https://raw.githubusercontent.com/openroboticmetaverse/mvp-test/master/assets/models/franka_description/";
        }
      },
    };

    return new Promise((resolve, reject) => {
      /**
       * Load XACRO file.
       *
       * @param {string} xml - The XML content of the XACRO file.
       */
      xacroLoader.load(
        _url,
        (xml) => {
          /**
           * URDFLoader instance used to parse URDF files.
           */
          const manager = new LoadingManager();
          const urdfLoader = new URDFLoader(manager);
          urdfLoader.workingPath = LoaderUtils.extractUrlBase(_url);
          /**
           * Parse URDF XML and return the created robot object.
           */
          const robot = urdfLoader.parse(xml);
          resolve([robot, manager]);
        },
        /**
         * Handle loading error.
         *
         * @param {Error} error - The error that occurred during loading.
         */
        (error) => {
          console.error("Error loading robot:", error);
          reject(error);
        }
      );
    });
  }
}
