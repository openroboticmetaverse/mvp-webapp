import { makeAutoObservable, runInAction } from "mobx";
import { IScene, IRobot, IObject } from "../types/Interfaces";
import * as api from "../services/api";

class SceneStore {
  // Store properties
  sceneData: IScene | null = null;
  objects: IObject[] = [];
  robots: IRobot[] = [];
  selectedId: string | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  selectedScene: IScene | null = null; // New property to store the selected scene

  constructor() {
    makeAutoObservable(this);
  }

  // Fetch scene data, objects, and robots for a given scene ID
  async fetchScene(sceneId: string) {
    this.isLoading = true;
    this.error = null;
    try {
      const [sceneData, objectsData, robotsData] = await Promise.all([
        api
          .fetchScenes()
          .then((scenes) =>
            scenes.find((scene: { id: string }) => scene.id === sceneId)
          ),
        api.fetchObjects(),
        api.fetchRobots(),
      ]);
      runInAction(() => {
        this.sceneData = sceneData;
        this.objects = objectsData.filter(
          (obj: { scene_id: string }) => obj.scene_id === sceneId
        );
        this.robots = robotsData.filter(
          (robot: { scene_id: string }) => robot.scene_id === sceneId
        );
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : String(error);
        this.isLoading = false;
      });
    }
  }

  // Set the selected ID (could be an object or robot ID)
  setSelectedId = (id: string | null) => {
    this.selectedId = id;
  };

  // Set the selected scene
  setSelectedScene = (scene: IScene | null) => {
    this.selectedScene = scene;
  };

  // Update an object in the store
  async updateObject(id: string, updates: Partial<IObject>) {
    try {
      const updatedObject = await api.updateObject(id, updates);
      runInAction(() => {
        const index = this.objects.findIndex((obj) => obj.id === id);
        if (index !== -1) {
          this.objects[index] = updatedObject;
        }
      });
    } catch (error) {
      console.error("Error updating object:", error);
    }
  }

  // Update a robot in the store
  async updateRobot(id: string, updates: Partial<IRobot>) {
    try {
      const updatedRobot = await api.updateRobot(id, updates);
      runInAction(() => {
        const index = this.robots.findIndex((robot) => robot.id === id);
        if (index !== -1) {
          this.robots[index] = updatedRobot;
        }
      });
    } catch (error) {
      console.error("Error updating robot:", error);
    }
  }

  // Save the entire scene, including objects and robots
  async saveScene() {
    if (!this.sceneData) {
      console.warn("No scene data available to save");
      return;
    }
    this.isLoading = true;
    this.error = null;
    try {
      const updatedScene = await api.updateScene(
        this.sceneData.id,
        this.sceneData
      );
      const updatedObjects = await Promise.all(
        this.objects.map((obj) => api.updateObject(obj.id, obj))
      );
      const updatedRobots = await Promise.all(
        this.robots.map((robot) => api.updateRobot(robot.id, robot))
      );

      runInAction(() => {
        this.sceneData = updatedScene;
        this.objects = updatedObjects;
        this.robots = updatedRobots;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : String(error);
        this.isLoading = false;
      });
    }
  }

  // Add a new object to the store
  async addObject(newObject: Partial<IObject>) {
    try {
      const createdObject = await api.createObject(newObject);
      runInAction(() => {
        this.objects.push(createdObject);
      });
    } catch (error) {
      console.error("Error adding object:", error);
    }
  }

  // Add a new robot to the store
  async addRobot(newRobot: Partial<IRobot>) {
    try {
      const createdRobot = await api.createRobot(newRobot);
      runInAction(() => {
        this.robots.push(createdRobot);
      });
    } catch (error) {
      console.error("Error adding robot:", error);
    }
  }

  // Computed property to get objects by their IDs
  get objectsById() {
    return new Map(this.objects.map((obj) => [obj.id, obj]));
  }

  // Computed property to get robots by their IDs
  get robotsById() {
    return new Map(this.robots.map((robot) => [robot.id, robot]));
  }

  // Get an object by its ID
  getObjectById(id: string) {
    return this.objectsById.get(id);
  }

  // Get a robot by its ID
  getRobotById(id: string) {
    return this.robotsById.get(id);
  }
}

export const sceneStore = new SceneStore();
