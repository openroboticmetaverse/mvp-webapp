import { makeAutoObservable, runInAction } from "mobx";
import {
  IScene,
  IRobot,
  IObject,
  IReferenceRobot,
  IReferenceObject,
} from "../types/Interfaces";
import { sceneManagerApi, objectLibraryApi } from "../services/api";

class SceneStore {
  // Scene Manager properties
  scenes: IScene[] = [];
  sceneData: IScene | null = null;
  objects: IObject[] = [];
  robots: IRobot[] = [];

  // Object Library properties
  referenceRobots: IReferenceRobot[] = [];
  referenceObjects: IReferenceObject[] = [];

  // Common properties
  selectedId: string | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  selectedScene: IScene | null = null;
  isSuccess: boolean = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // Generic error handling method
  private handleError(error: unknown, errorMessage: string): void {
    console.error(errorMessage, error);
    runInAction(() => {
      this.error = error instanceof Error ? error.message : String(error);
      this.isLoading = false;
      this.isSuccess = false;
    });
  }

  // Scene Manager methods
  async fetchScenes(): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      const fetchedScenes = await sceneManagerApi.fetchScenes();
      runInAction(() => {
        this.scenes = fetchedScenes;
        this.isLoading = false;
      });
    } catch (error) {
      this.handleError(error, "Error fetching scenes:");
    }
  }

  async fetchScene(sceneId: string): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      const [sceneData, objectsData, robotsData] = await Promise.all([
        sceneManagerApi
          .fetchScenes()
          .then((scenes) => scenes.find((scene) => scene.id === sceneId)),
        sceneManagerApi.fetchObjects(),
        sceneManagerApi.fetchRobots(),
      ]);
      runInAction(() => {
        this.sceneData = sceneData || null;
        this.objects = objectsData.filter((obj) => obj.scene_id === sceneId);
        this.robots = robotsData.filter((robot) => robot.scene_id === sceneId);
        this.isLoading = false;
      });
    } catch (error) {
      this.handleError(error, "Error fetching scene:");
    }
  }

  async updateObject(id: string, updates: Partial<IObject>): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      const updatedObject = await sceneManagerApi.updateObject(id, updates);
      runInAction(() => {
        const index = this.objects.findIndex((obj) => obj.id === id);
        if (index !== -1) {
          this.objects[index] = updatedObject;
        }
        this.isLoading = false;
        this.isSuccess = true;
      });
    } catch (error) {
      this.handleError(error, "Error updating object:");
    }
  }

  async updateRobot(id: string, updates: Partial<IRobot>): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      const updatedRobot = await sceneManagerApi.updateRobot(id, updates);
      runInAction(() => {
        const index = this.robots.findIndex((robot) => robot.id === id);
        if (index !== -1) {
          this.robots[index] = updatedRobot;
        }
        this.isLoading = false;
        this.isSuccess = true;
      });
    } catch (error) {
      this.handleError(error, "Error updating robot:");
    }
  }

  async saveScene(): Promise<void> {
    if (!this.sceneData) {
      console.warn("No scene data available to save");
      return;
    }
    this.isLoading = true;
    this.error = null;
    try {
      const updatedScene = await sceneManagerApi.updateScene(
        this.sceneData.id,
        this.sceneData
      );
      const updatedObjects = await Promise.all(
        this.objects.map((obj) => sceneManagerApi.updateObject(obj.id, obj))
      );
      const updatedRobots = await Promise.all(
        this.robots.map((robot) => sceneManagerApi.updateRobot(robot.id, robot))
      );

      runInAction(() => {
        this.sceneData = updatedScene;
        this.objects = updatedObjects;
        this.robots = updatedRobots;
        this.isLoading = false;
        this.isSuccess = true;
      });
    } catch (error) {
      this.handleError(error, "Error saving scene:");
    }
  }

  async addObject(newObject: Partial<IObject>): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      const createdObject = await sceneManagerApi.createObject(newObject);
      runInAction(() => {
        this.objects.push(createdObject);
        this.isLoading = false;
        this.isSuccess = true;
      });
    } catch (error) {
      this.handleError(error, "Error adding object:");
    }
  }

  async addRobot(newRobot: Partial<IRobot>): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      const createdRobot = await sceneManagerApi.createRobot(newRobot);
      runInAction(() => {
        this.robots.push(createdRobot);
        this.isLoading = false;
        this.isSuccess = true;
      });
    } catch (error) {
      this.handleError(error, "Error adding robot:");
    }
  }

  async deleteObject(id: string): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      await sceneManagerApi.deleteObject(id);
      runInAction(() => {
        this.objects = this.objects.filter((obj) => obj.id !== id);
        this.isLoading = false;
        this.isSuccess = true;
      });
    } catch (error) {
      this.handleError(error, "Error deleting object:");
    }
  }

  async deleteRobot(id: string): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      await sceneManagerApi.deleteRobot(id);
      runInAction(() => {
        this.robots = this.robots.filter((robot) => robot.id !== id);
        this.isLoading = false;
        this.isSuccess = true;
      });
    } catch (error) {
      this.handleError(error, "Error deleting robot:");
    }
  }

  // Object Library methods
  async fetchReferenceRobots(): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      const fetchedReferenceRobots =
        await objectLibraryApi.fetchReferenceRobots();
      runInAction(() => {
        this.referenceRobots = fetchedReferenceRobots;
        this.isLoading = false;
      });
    } catch (error) {
      this.handleError(error, "Error fetching reference robots:");
    }
  }

  async fetchReferenceObjects(): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      const fetchedReferenceObjects =
        await objectLibraryApi.fetchReferenceObjects();
      runInAction(() => {
        this.referenceObjects = fetchedReferenceObjects;
        this.isLoading = false;
      });
    } catch (error) {
      this.handleError(error, "Error fetching reference objects:");
    }
  }

  async addReferenceRobot(
    newReferenceRobot: Partial<IReferenceRobot>
  ): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      const createdReferenceRobot =
        await objectLibraryApi.createReferenceRobot(newReferenceRobot);
      runInAction(() => {
        this.referenceRobots.push(createdReferenceRobot);
        this.isLoading = false;
        this.isSuccess = true;
      });
    } catch (error) {
      this.handleError(error, "Error adding reference robot:");
    }
  }

  async addReferenceObject(
    newReferenceObject: Partial<IReferenceObject>
  ): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      const createdReferenceObject =
        await objectLibraryApi.createReferenceObject(newReferenceObject);
      runInAction(() => {
        this.referenceObjects.push(createdReferenceObject);
        this.isLoading = false;
        this.isSuccess = true;
      });
    } catch (error) {
      this.handleError(error, "Error adding reference object:");
    }
  }

  async updateReferenceRobot(
    id: string,
    updates: Partial<IReferenceRobot>
  ): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      const updatedReferenceRobot = await objectLibraryApi.updateReferenceRobot(
        id,
        updates
      );
      runInAction(() => {
        const index = this.referenceRobots.findIndex(
          (robot) => robot.id === id
        );
        if (index !== -1) {
          this.referenceRobots[index] = updatedReferenceRobot;
        }
        this.isLoading = false;
        this.isSuccess = true;
      });
    } catch (error) {
      this.handleError(error, "Error updating reference robot:");
    }
  }

  async updateReferenceObject(
    id: string,
    updates: Partial<IReferenceObject>
  ): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      const updatedReferenceObject =
        await objectLibraryApi.updateReferenceObject(id, updates);
      runInAction(() => {
        const index = this.referenceObjects.findIndex((obj) => obj.id === id);
        if (index !== -1) {
          this.referenceObjects[index] = updatedReferenceObject;
        }
        this.isLoading = false;
        this.isSuccess = true;
      });
    } catch (error) {
      this.handleError(error, "Error updating reference object:");
    }
  }

  async deleteReferenceRobot(id: string): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      await objectLibraryApi.deleteReferenceRobot(id);
      runInAction(() => {
        this.referenceRobots = this.referenceRobots.filter(
          (robot) => robot.id !== id
        );
        this.isLoading = false;
        this.isSuccess = true;
      });
    } catch (error) {
      this.handleError(error, "Error deleting reference robot:");
    }
  }

  async deleteReferenceObject(id: string): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      await objectLibraryApi.deleteReferenceObject(id);
      runInAction(() => {
        this.referenceObjects = this.referenceObjects.filter(
          (obj) => obj.id !== id
        );
        this.isLoading = false;
        this.isSuccess = true;
      });
    } catch (error) {
      this.handleError(error, "Error deleting reference object:");
    }
  }

  // Computed properties
  get objectsById(): Map<string, IObject> {
    return new Map(this.objects.map((obj) => [obj.id, obj]));
  }

  get robotsById(): Map<string, IRobot> {
    return new Map(this.robots.map((robot) => [robot.id, robot]));
  }

  get referenceRobotsById(): Map<string, IReferenceRobot> {
    return new Map(this.referenceRobots.map((robot) => [robot.id, robot]));
  }

  get referenceObjectsById(): Map<string, IReferenceObject> {
    return new Map(this.referenceObjects.map((obj) => [obj.id, obj]));
  }

  // Utility methods
  getObjectById(id: string): IObject | undefined {
    return this.objectsById.get(id);
  }

  getRobotById(id: string): IRobot | undefined {
    return this.robotsById.get(id);
  }

  getReferenceRobotById(id: string): IReferenceRobot | undefined {
    return this.referenceRobotsById.get(id);
  }

  getReferenceObjectById(id: string): IReferenceObject | undefined {
    return this.referenceObjectsById.get(id);
  }

  setSelectedId(id: string | null): void {
    this.selectedId = id;
  }

  setSelectedScene(scene: IScene | null): void {
    this.selectedScene = scene;
  }
}

export const sceneStore = new SceneStore();
