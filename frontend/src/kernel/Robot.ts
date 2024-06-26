import { LoadingManager, Object3D } from "three";
import RobotLoader from "../helpers/modelLoaders/core/RobotLoader";

export default class Robot {
  modelName: string;
  url: string;
  parsedModel: Object3D | null;
  id: number;
  isGeometryLoaded: boolean;

  constructor(name: string, url: string) {
    this.modelName = name;
    this.url = url;
    this.id = -1;
    this.parsedModel = null;
    this.isGeometryLoaded = false;
  }

  async parse(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      let [robot, manager]: [Object3D, LoadingManager] =
        await RobotLoader.createRobot(this.url);
      manager.onLoad = () => {
        this.parsedModel = robot;
        this.isGeometryLoaded = true;
        this.id = robot.id;
        resolve();
      };
    });
  }
}
