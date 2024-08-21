import Robot from "../Robot";
import { Vector3, Group } from "three";
import { ThreeHelper } from "../../helpers/threeHelpers/core/ThreeHelper";

export interface RobotProperty {
  scale: Vector3;
  rotation: Vector3;
  position: Array<Vector3>;
  url?: string;
  color?: string;
}

export class RobotManager {
  static RobotMap: Map<string, string> = new Map<string, string>([
    [
      "franka_arm",
      "https://raw.githubusercontent.com/openroboticmetaverse/mvp-test/master/assets/models/franka_description/robots/panda_arm_hand.urdf.xacro",
    ],
    [
      "franka_dual_arm",
      "https://raw.githubusercontent.com/openroboticmetaverse/mvp-webapp/main/frontend/public/franka_description/robots/dual_panda_example.urdf.xacro",
    ],
    [
      "sawyer",
      "https://raw.githubusercontent.com/openroboticmetaverse/mvp-test/master/assets/models/sawyer_description/urdf/sawyer_base.urdf.xacro",
    ],
  ]);

  robots: Map<string, Robot>;
  robotUUID: string;
  robotsId: Array<number>;
  robotsUUID: Array<string>;
  scene: ThreeHelper;
  groups: Array<Group>;

  constructor(scene: ThreeHelper) {
    this.robots = new Map<string, Robot>();
    this.scene = scene;
    this.robotsId = new Array<number>();
    this.robotsUUID = new Array<string>();
    this.robotUUID = "";
    this.groups = new Array<Group>();
  }

  async addSingleRobot(name: string, props: RobotProperty): Promise<void> {
    try {
      if (!this.robots.has(name) && RobotManager.RobotMap.has(name)) {
        const robotUrl = RobotManager.RobotMap.get(name);
        if (robotUrl) {
          const robot = new Robot(name, robotUrl);
          await robot.parse();
          this.robots.set(name, robot);
        } else {
          throw new Error("Robot URL not found");
        }
      }

      const robot = this.robots.get(name);
      if (!robot || !robot.parsedModel) {
        throw new Error("Robot model not available or not parsed");
      }
      robot.parsedModel.scale.set(props.scale.x, props.scale.y, props.scale.z);
      robot.parsedModel.rotation.set(
        props.rotation.x,
        props.rotation.y,
        props.rotation.z
      );

      /*       robot.parsedModel.setJointValue("panda_joint1", -1.57079);
               robot.parsedModel.setJointValue("panda_joint2", 0.9);
               robot.parsedModel.setJointValue("panda_joint3", 0.24);
               robot.parsedModel.setJointValue("panda_joint4", -1.57079); */

      //    <key name="home" qpos="0 0 0 -1.57079 0 1.57079 -0.7853 0.04 0.04" ctrl="0 0 0 -1.57079 0 1.57079 -0.7853 255"/>

      this.scene.add(robot.parsedModel);
      this.robotsId.push(robot.id);
      this.robotUUID = robot.uuid;
      this.robotsUUID.push(robot.uuid);
    } catch (error: any) {
      console.error(`Error adding robot ${name}:`, error.message);
      throw new Error(`Error adding robot ${name}: ${error.message}`);
    }
  }

  setJointAngles(robotName: string, jointName: string, angle: number): void {
    const robot = this.robots.get(robotName);
    if (robot && robot.parsedModel) {
      robot.parsedModel.setJointValue(jointName, angle);
    } else {
      console.error(`Robot or joint not found: ${robotName}, ${jointName}`);
    }
  }

  setJointAnglesFromMap(
    robotName: string,
    jointAngles: { [key: string]: number }
  ): void {
    const robot = this.robots.get(robotName);
    if (robot && robot.parsedModel) {
      Object.entries(jointAngles).forEach(([jointName, angle]) => {
        robot.parsedModel?.setJointValue(jointName, angle);
      });
    } else {
      console.error(`Robot not found: ${robotName}`);
    }
  }

  remove(id: string) {
    const robot = this.scene.getObjectById(id);
    if (robot) {
      this.scene.remove(robot);
    } else {
      console.warn(`Robot with ID=${id} does not exist`);
    }
  }

  removeAll() {
    this.groups.forEach((group) => {
      this.scene.remove(group);
    });
    this.groups.length = 0;
    this.robotsId.length = 0;
  }
}
