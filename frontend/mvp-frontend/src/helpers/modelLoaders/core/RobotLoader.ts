import { LoaderUtils, Object3D } from "three";
import URDFLoader from "urdf-loader";
import { XacroLoader } from "xacro-parser";

const FRANKA_DESCRIPTION_URL = "https://raw.githubusercontent.com/openroboticmetaverse/mvp-test/master/assets/models/franka_description/";

export default class RobotLoader {
  static createRobot(_url: string): Promise<Object3D> {
    console.log("Loading robot from URL:", _url);

    const xacroLoader = new XacroLoader();
    xacroLoader.inOrder = true;
    xacroLoader.requirePrefix = true;
    xacroLoader.localProperties = true;

    xacroLoader.rospackCommands = {
      find(pkg) {
        return pkg === "franka_description" ? FRANKA_DESCRIPTION_URL : pkg;
      },
    };

    return new Promise((resolve, reject) => {
      xacroLoader.load(
        _url,
        (xml) => {
          const urdfLoader = new URDFLoader();
          urdfLoader.workingPath = LoaderUtils.extractUrlBase(_url);
          const robot = urdfLoader.parse(xml);
          resolve(robot);
        },
        (error) => {
          console.error("Error loading robot:", error);
          reject(error);
        }
      );
    });
  }
}
