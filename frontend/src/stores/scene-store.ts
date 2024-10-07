import { makeAutoObservable, runInAction } from "mobx";
import {
  fetchSceneData,
  fetchObjectsForScene,
  fetchRobotsForScene,
  saveSceneData,
  saveObject,
  saveRobot,
} from "../api/sceneService";
import { IScene, IRobot, IObject } from "../types/Interfaces";

/**
 * SceneStore manages the state and operations for a scene, its objects, and robots in the application.
 * It handles loading, updating, and saving scene data, as well as managing the selected object/robot.
 */
class SceneStore {
  /** The current scene data */
  sceneData: IScene | null = null;
  /** Objects associated with the current scene */
  objects: IObject[] = [];
  /** Robots associated with the current scene */
  robots: IRobot[] = [];
  /** The ID of the currently selected object or robot */
  selectedId: string | null = null;
  /** Indicates whether a data operation is in progress */
  isLoading: boolean = false;
  /** Stores any error messages from failed operations */
  error: string | null = null;

  constructor() {
    console.log("Initializing SceneStore");
    makeAutoObservable(this);
  }

  /**
   * Fetches scene data and associated objects and robots from the server.
   * @param {string} sceneId - The ID of the scene to fetch.
   */
  async fetchScene(sceneId: string) {
    console.log(`Fetching scene with ID: ${sceneId}`);
    this.isLoading = true;
    this.error = null;
    try {
      const [sceneData, objectsData, robotsData] = await Promise.all([
        fetchSceneData(sceneId),
        fetchObjectsForScene(sceneId),
        fetchRobotsForScene(sceneId),
      ]);
      console.log("Scene data and associated entities fetched successfully");
      runInAction(() => {
        this.sceneData = sceneData;
        this.objects = objectsData;
        this.robots = robotsData;
        this.isLoading = false;
      });
    } catch (error) {
      console.error("Error fetching scene data and associated entities", error);
      runInAction(() => {
        this.error = error instanceof Error ? error.message : String(error);
        this.isLoading = false;
      });
    }
  }

  /**
   * Sets the ID of the currently selected object or robot.
   * @param {string | null} id - The ID to set as selected, or null to clear selection.
   */
  setSelectedId = (id: string | null) => {
    console.log(`Setting selected ID: ${id}`);
    this.selectedId = id;
  };

  /**
   * Updates an object in the store.
   * @param {string} id - The ID of the object to update.
   * @param {Partial<IObject>} updates - The properties to update on the object.
   */
  updateObject(id: string, updates: Partial<IObject>) {
    console.log(`Updating object with ID: ${id}`, updates);
    const objectIndex = this.objects.findIndex((obj) => obj.id === id);
    if (objectIndex !== -1) {
      this.objects[objectIndex] = { ...this.objects[objectIndex], ...updates };
      console.log("Object updated successfully", this.objects[objectIndex]);
    } else {
      console.warn(`Object with ID: ${id} not found`);
    }
  }

  /**
   * Updates a robot in the store.
   * @param {string} id - The ID of the robot to update.
   * @param {Partial<IRobot>} updates - The properties to update on the robot.
   */
  updateRobot(id: string, updates: Partial<IRobot>) {
    console.log(`Updating robot with ID: ${id}`, updates);
    const robotIndex = this.robots.findIndex((robot) => robot.id === id);
    if (robotIndex !== -1) {
      this.robots[robotIndex] = { ...this.robots[robotIndex], ...updates };
      console.log("Robot updated successfully", this.robots[robotIndex]);
    } else {
      console.warn(`Robot with ID: ${id} not found`);
    }
  }

  /**
   * Saves the current scene data, objects, and robots to the server.
   */
  async saveScene() {
    console.log("Saving scene data and associated entities");
    if (!this.sceneData) {
      console.warn("No scene data available to save");
      return;
    }
    this.isLoading = true;
    this.error = null;
    try {
      const [savedSceneData, savedObjects, savedRobots] = await Promise.all([
        saveSceneData(this.sceneData),
        Promise.all(this.objects.map((obj) => saveObject(obj))),
        Promise.all(this.robots.map((robot) => saveRobot(robot))),
      ]);
      console.log("Scene data and associated entities saved successfully");
      runInAction(() => {
        this.sceneData = savedSceneData;
        this.objects = savedObjects;
        this.robots = savedRobots;
        this.isLoading = false;
      });
    } catch (error) {
      console.error("Error saving scene data and associated entities", error);
      runInAction(() => {
        this.error = error instanceof Error ? error.message : String(error);
        this.isLoading = false;
      });
    }
  }

  /**
   * Adds a new object to the store.
   * @param {IObject} newObject - The new object to add to the store.
   */
  addObject(newObject: IObject) {
    if (!this.sceneData) {
      console.warn("No scene data available to add object");
      return;
    }
    newObject.scene_id = this.sceneData.id;
    this.objects.push(newObject);
    console.log("New object added to store", newObject);
  }

  /**
   * Adds a new robot to the store.
   * @param {IRobot} newRobot - The new robot to add to the store.
   */
  addRobot(newRobot: IRobot) {
    if (!this.sceneData) {
      console.warn("No scene data available to add robot");
      return;
    }
    newRobot.scene_id = this.sceneData.id;
    this.robots.push(newRobot);
    console.log("New robot added to store", newRobot);
  }
  get objectsById() {
    return new Map(this.objects.map((obj) => [obj.id, obj]));
  }

  get robotsById() {
    return new Map(this.robots.map((robot) => [robot.id, robot]));
  }

  getObjectById(id: string) {
    return this.objectsById.get(id);
  }

  getRobotById(id: string) {
    return this.robotsById.get(id);
  }
}

export const sceneStore = new SceneStore();
