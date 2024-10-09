import {
  makeObservable,
  observable,
  action,
  runInAction,
  computed,
} from "mobx";
import { sceneManagerApi } from "../services/api";
import { IScene, IObject, IRobot } from "../types/Interfaces";
import { BaseStore } from "./base-store";
import { errorStore } from "./error-store";
import { libraryStore } from "./library-store";
import { generateUniqueId } from "@/utils/idGenerator";

// Scene Store
class SceneStore extends BaseStore<IScene> {
  @observable activeSceneId: string | null = null;
  @observable newSceneName: string = "";

  constructor() {
    super();
    makeObservable(this);
  }

  @action
  setActiveScene(sceneId: string | null) {
    this.activeSceneId = sceneId;
  }

  @computed
  get activeScene(): IScene | undefined {
    return this.items.find((scene) => scene.id === this.activeSceneId);
  }

  @action
  async fetchScenes() {
    this.state = { status: "loading" };
    try {
      const data = await sceneManagerApi.fetchScenes();
      runInAction(() => {
        this.items = data;
        this.state = { status: "success", data };
      });
    } catch (error) {
      runInAction(() => {
        this.state = { status: "error", error: (error as Error).message };
        errorStore.addError(error as Error);
      });
    }
  }

  @action
  async createScene(sceneData: Partial<IScene>) {
    try {
      const newScene = await sceneManagerApi.createScene(sceneData);
      runInAction(() => {
        this.items.push(newScene);
      });
      return newScene;
    } catch (error) {
      errorStore.addError(error as Error);
      throw error;
    }
  }

  @action
  async updateScene(id: string, updates: Partial<IScene>) {
    try {
      const updatedScene = await sceneManagerApi.updateScene(id, updates);
      runInAction(() => {
        const index = this.items.findIndex((item) => item.id === id);
        if (index !== -1) {
          this.items[index] = updatedScene;
        }
      });
      return updatedScene;
    } catch (error) {
      errorStore.addError(error as Error);
      this.fetchScenes();
      throw error;
    }
  }

  @action
  async deleteScene(id: string) {
    try {
      await sceneManagerApi.deleteScene(id);
      runInAction(() => {
        this.items = this.items.filter((item) => item.id !== id);
      });
    } catch (error) {
      errorStore.addError(error as Error);
      this.fetchScenes();
      throw error;
    }
  }
}
// Object Store
class ObjectStore extends BaseStore<IObject> {
  constructor() {
    super();
    makeObservable(this);
  }

  @action
  fetchObjects() {
    return this.fetchItems(sceneManagerApi.fetchObjects);
  }

  @action
  createObject(objectData: Partial<IObject>) {
    return sceneManagerApi
      .createObject(objectData)
      .then((newObject) => {
        runInAction(() => {
          this.items.push(newObject);
        });
        return newObject;
      })
      .catch((error) => {
        errorStore.addError(error);
        throw error;
      });
  }

  @action
  updateObject(id: string, updates: Partial<IObject>) {
    this.updateItem(id, updates);
    return sceneManagerApi.updateObject(id, updates).catch((error) => {
      errorStore.addError(error);
      // Revert the change if the API call fails
      this.fetchObjects();
      throw error;
    });
  }

  @action
  deleteObject(id: string) {
    this.deleteItem(id);
    return sceneManagerApi.deleteObject(id).catch((error) => {
      errorStore.addError(error);
      // Revert the change if the API call fails
      this.fetchObjects();
      throw error;
    });
  }

  @action
  getObjectsForScene(sceneId: string): IObject[] {
    return this.items.filter((obj) => obj.scene_id === sceneId);
  }

  @action
  createObjectFromReference(referenceId: string) {
    if (!sceneStore.activeScene) {
      errorStore.addError(new Error("No active scene to add object to"));
      return;
    }

    const referenceObject = libraryStore.getReferenceObjectById(referenceId);
    if (!referenceObject) {
      errorStore.addError(
        new Error(`Reference object with id ${referenceId} not found`)
      );
      return;
    }

    const newObject: IObject = {
      id: generateUniqueId(),
      name: referenceObject.name,
      description: referenceObject.description,
      scene_id: sceneStore.activeScene.id,
      position: [0, 0, 0],
      orientation: [0, 0, 0],
      scale: [1, 1, 1],
      object_reference: referenceId,
      color: referenceObject.color || "#FFFFFF", // Default color if not provided
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return this.createObject(newObject);
  }
}

// Robot Store
class RobotStore extends BaseStore<IRobot> {
  constructor() {
    super();
    makeObservable(this);
  }

  @action
  fetchRobots() {
    return this.fetchItems(sceneManagerApi.fetchRobots);
  }

  @action
  createRobot(robotData: Partial<IRobot>) {
    return sceneManagerApi
      .createRobot(robotData)
      .then((newRobot) => {
        runInAction(() => {
          this.items.push(newRobot);
        });
        return newRobot;
      })
      .catch((error) => {
        errorStore.addError(error);
        throw error;
      });
  }

  @action
  updateRobot(id: string, updates: Partial<IRobot>) {
    this.updateItem(id, updates);
    return sceneManagerApi.updateRobot(id, updates).catch((error) => {
      errorStore.addError(error);
      // Revert the change if the API call fails
      this.fetchRobots();
      throw error;
    });
  }

  @action
  deleteRobot(id: string) {
    this.deleteItem(id);
    return sceneManagerApi.deleteRobot(id).catch((error) => {
      errorStore.addError(error);
      // Revert the change if the API call fails
      this.fetchRobots();
      throw error;
    });
  }

  @action
  getRobotsForScene(sceneId: string): IRobot[] {
    return this.items.filter((robot) => robot.scene_id === sceneId);
  }

  @action
  createRobotFromReference(referenceId: string) {
    if (!sceneStore.activeScene) {
      errorStore.addError(new Error("No active scene to add robot to"));
      return;
    }

    const referenceRobot = libraryStore.getReferenceRobotById(referenceId);
    if (!referenceRobot) {
      errorStore.addError(
        new Error(`Reference robot with id ${referenceId} not found`)
      );
      return;
    }

    const newRobot: IRobot = {
      id: generateUniqueId(),
      name: referenceRobot.name,
      description: referenceRobot.description,
      scene_id: sceneStore.activeScene.id,
      position: [0, 0, 0],
      orientation: [0, 0, 0],
      scale: [1, 1, 1],
      robot_reference: referenceId,
      joint_angles: [0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return this.createRobot(newRobot);
  }
}

export const sceneStore = new SceneStore();
export const objectStore = new ObjectStore();
export const robotStore = new RobotStore();
