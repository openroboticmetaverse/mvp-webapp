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
      try {
        console.log(`Starting to load robot model from URL: ${this.url}`);
        let [robot, manager]: [Object3D, LoadingManager] =
          await RobotLoader.createRobot(this.url);

        manager.onLoad = () => {
          console.log(`Model loaded successfully: ${this.modelName}`);
          this.parsedModel = robot;
          this.isGeometryLoaded = true;
          this.id = robot.id;
          console.log(`Robot ID set to: ${this.id}`);
          resolve();
        };

        manager.onError = (url) => {
          console.error(`Error occurred while loading the model from: ${url}`);
          reject(new Error(`Failed to load model from ${url}`));
        };

        manager.onProgress = (url, itemsLoaded, itemsTotal) => {
          console.log(
            `Loading progress: ${itemsLoaded} of ${itemsTotal} items from ${url}.`
          );
        };
      } catch (error) {
        console.error(
          `Failed to load robot model from URL: ${this.url}`,
          error
        );
        reject(
          new Error(
            `Failed to load robot model from URL: ${this.url}: ${error.message}`
          )
        );
      }
    });
  }
}
