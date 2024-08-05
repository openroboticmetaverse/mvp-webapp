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
  ]);

  robots: Map<string, Robot>;
  robotsId: Array<number>;
  scene: ThreeHelper;
  groups: Array<Group>;

  constructor(scene: ThreeHelper) {
    this.robots = new Map<string, Robot>();
    this.scene = scene;
    this.robotsId = new Array<number>();
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

      this.scene.add(robot.parsedModel);
      this.robotsId.push(robot.id);
    } catch (error: any) {
      console.error(`Error adding robot ${name}:`, error.message);
      throw new Error(`Error adding robot ${name}: ${error.message}`);
    }
  }

  remove(id: number) {
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
