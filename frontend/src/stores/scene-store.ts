import {
  makeObservable,
  observable,
  action,
  runInAction,
  computed,
} from "mobx";
import { sceneManagerApi } from "../services/api";
import { IScene, IObject, IRobot } from "../types/Interfaces";
import { libraryStore } from "./library-store";
import { generateUniqueId } from "@/utils/idGenerator";
import { errorLoggingService } from "../services/error-logging-service";

/**
 * Base store with pending changes functionality and verbose logging
 */
class BasePendingStore<T extends { id: string }> {
  @observable items: T[] = [];
  @observable pendingChanges = new Map<string, Partial<T>>();
  @observable pendingCreations = new Map<string, T>();
  @observable pendingDeletions = new Set<string>();
  @observable state: {
    status: "idle" | "loading" | "success" | "error";
    error?: string;
    data?: T[];
  } = { status: "idle" };

  constructor() {
    makeObservable(this);
    errorLoggingService.debug(`${this.constructor.name} initialized`);
  }

  @action
  protected applyLocalCreation(item: T) {
    this.pendingCreations.set(item.id, item);
    this.items.push(item);
    errorLoggingService.debug(
      `${this.constructor.name}: Local creation applied for item`,
      item
    );
  }

  @action
  protected applyLocalChange(id: string, updates: Partial<T>) {
    const existingChanges = this.pendingChanges.get(id) || {};
    this.pendingChanges.set(id, { ...existingChanges, ...updates });

    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...updates };
    }
    errorLoggingService.debug(
      `${this.constructor.name}: Local change applied for item with id: ${id}`,
      updates
    );
  }

  @action
  protected applyLocalDeletion(id: string) {
    this.pendingDeletions.add(id);
    this.items = this.items.filter((item) => item.id !== id);
    errorLoggingService.debug(
      `${this.constructor.name}: Local deletion applied for item with id: ${id}`
    );
  }

  protected getItemWithPendingChanges(id: string): T | undefined {
    const item = this.items.find((item) => item.id === id);
    const pendingChanges = this.pendingChanges.get(id);
    const pendingCreation = this.pendingCreations.get(id);
    if (pendingCreation) return pendingCreation;
    if (item && pendingChanges) {
      return { ...item, ...pendingChanges };
    }
    return item;
  }

  @action
  async saveChanges(): Promise<void> {
    errorLoggingService.info(
      `${this.constructor.name}: Starting to save changes`
    );
    const savePromises: Promise<void>[] = [];

    // Handle creations
    for (const [id, item] of this.pendingCreations.entries()) {
      savePromises.push(this.createItem(item));
    }

    // Handle updates
    for (const [id, updates] of this.pendingChanges.entries()) {
      if (!this.pendingDeletions.has(id)) {
        savePromises.push(this.saveItem(id, updates));
      }
    }

    // Handle deletions
    for (const id of this.pendingDeletions) {
      savePromises.push(this.deleteItem(id));
    }

    try {
      await Promise.all(savePromises);
      runInAction(() => {
        this.pendingChanges.clear();
        this.pendingCreations.clear();
        this.pendingDeletions.clear();
      });
      errorLoggingService.info(
        `${this.constructor.name}: All changes saved successfully`
      );
    } catch (error) {
      errorLoggingService.error(
        `${this.constructor.name}: Error saving changes`,
        error as Error
      );
      throw error;
    }
  }

  @action
  protected async fetchItems(fetcher: () => Promise<T[]>) {
    this.state = { status: "loading" };
    errorLoggingService.info(`${this.constructor.name}: Fetching items`);
    try {
      const data = await fetcher();
      runInAction(() => {
        this.items = data;
        this.state = { status: "success", data };
      });
      errorLoggingService.info(
        `${this.constructor.name}: Fetched ${data.length} items successfully`
      );
    } catch (error) {
      runInAction(() => {
        this.state = { status: "error", error: (error as Error).message };
      });
      errorLoggingService.error(
        `${this.constructor.name}: Error fetching items`,
        error as Error
      );
      throw error;
    }
  }

  protected async createItem(item: T): Promise<void> {
    errorLoggingService.error(
      `${this.constructor.name}: createItem must be implemented in derived class`
    );
    throw new Error("createItem must be implemented in derived class");
  }

  protected async saveItem(id: string, updates: Partial<T>): Promise<void> {
    errorLoggingService.error(
      `${this.constructor.name}: saveItem must be implemented in derived class`
    );
    throw new Error("saveItem must be implemented in derived class");
  }

  protected async deleteItem(id: string): Promise<void> {
    errorLoggingService.error(
      `${this.constructor.name}: deleteItem must be implemented in derived class`
    );
    throw new Error("deleteItem must be implemented in derived class");
  }
}

export default BasePendingStore;

/**
 * Store for managing scenes
 */
class SceneStore extends BasePendingStore<IScene> {
  @observable scenes: IScene[] = [];
  @observable objects: IObject[] = [];
  @observable robots: IRobot[] = [];
  @observable activeSceneId: string | null = null;
  @observable newSceneName: string = "";
  @observable selectedItemId: string | null = null;

  constructor() {
    super();
    makeObservable(this);
    errorLoggingService.debug("SceneStore initialized");
  }

  @computed get activeScene() {
    return this.scenes.find((scene) => scene.id === this.activeSceneId);
  }

  @computed get currentSceneObjects() {
    return this.objects
      .filter((obj) => obj.scene_id === this.activeSceneId)
      .map((obj) => ({
        ...obj,
        ...this.pendingChanges.get(obj.id),
        ...(this.pendingCreations.get(obj.id) || {}),
      }))
      .filter((obj) => !this.pendingDeletions.has(obj.id));
  }

  @computed get currentSceneRobots() {
    return this.robots
      .filter((robot) => robot.scene_id === this.activeSceneId)
      .map((robot) => ({
        ...robot,
        ...this.pendingChanges.get(robot.id),
      }));
  }

  @computed get selectedItem() {
    if (!this.selectedItemId) return null;
    return (
      this.currentSceneObjects.find((obj) => obj.id === this.selectedItemId) ||
      this.currentSceneRobots.find(
        (robot) => robot.id === this.selectedItemId
      ) ||
      null
    );
  }

  @action
  setActiveScene(sceneId: string) {
    this.activeSceneId = sceneId;
    errorLoggingService.debug(`Active scene set to: ${sceneId}`);
  }

  @action
  setSelectedItem(itemId: string | null) {
    this.selectedItemId = itemId;
    errorLoggingService.debug(`Selected item set to: ${itemId}`);
  }

  @action
  async fetchSceneData(sceneId: string) {
    this.state = { status: "loading" };
    try {
      errorLoggingService.info(`Fetching scene data for scene: ${sceneId}`);

      // Fetch library data if it hasn't been loaded yet
      if (!libraryStore.isLoaded) {
        await libraryStore.fetchLibraryData();
      }

      const [scenes, objects, robots] = await Promise.all([
        sceneManagerApi.fetchScenes(),
        sceneManagerApi.fetchObjects(),
        sceneManagerApi.fetchRobots(),
      ]);
      runInAction(() => {
        this.scenes = scenes;
        this.objects = objects;
        this.robots = robots;
        this.setActiveScene(sceneId);
        this.state = { status: "success" };
      });

      errorLoggingService.info(
        `Scene data fetched successfully for scene: ${sceneId}`
      );
    } catch (error) {
      runInAction(() => {
        this.state = { status: "error", error: (error as Error).message };
      });
      errorLoggingService.error(
        `Error fetching scene data for scene: ${sceneId}`,
        error as Error
      );
    }
  }

  @action
  async fetchScenes() {
    return this.fetchItems(sceneManagerApi.fetchScenes);
  }

  @action
  async createScene(sceneData: Partial<IScene>): Promise<IScene> {
    errorLoggingService.info("Creating new scene", sceneData);
    try {
      const newScene = await sceneManagerApi.createScene(sceneData);
      runInAction(() => {
        this.items.push(newScene);
      });
      errorLoggingService.info("New scene created successfully", newScene);
      return newScene;
    } catch (error) {
      errorLoggingService.error("Error creating new scene", error as Error);
      throw error;
    }
  }

  @action
  async updateScene(id: string, updates: Partial<IScene>) {
    errorLoggingService.info(`Updating scene: ${id}`, updates);
    this.applyLocalChange(id, updates);
    if (!this.pendingChanges.has(id)) {
      await this.saveItem(id, updates);
    }
  }

  @action
  async deleteScene(id: string) {
    errorLoggingService.info(`Deleting scene: ${id}`);
    try {
      await sceneManagerApi.deleteScene(id);
      runInAction(() => {
        this.items = this.items.filter((item) => item.id !== id);
        this.pendingChanges.delete(id);
      });
      errorLoggingService.info(`Scene deleted successfully: ${id}`);
    } catch (error) {
      errorLoggingService.error(`Error deleting scene: ${id}`, error as Error);
      this.fetchScenes();
      throw error;
    }
  }

  protected async saveItem(
    id: string,
    updates: Partial<IScene>
  ): Promise<void> {
    errorLoggingService.info(`Saving scene: ${id}`, updates);
    try {
      const updatedScene = await sceneManagerApi.updateScene(id, updates);
      runInAction(() => {
        const index = this.items.findIndex((item) => item.id === id);
        if (index !== -1) {
          this.items[index] = updatedScene;
        }
      });
      errorLoggingService.info(`Scene saved successfully: ${id}`);
    } catch (error) {
      errorLoggingService.error(`Error saving scene: ${id}`, error as Error);
      this.fetchScenes();
      throw error;
    }
  }

  async saveChanges(): Promise<void> {
    errorLoggingService.info("Saving all changes in SceneStore");
    try {
      await super.saveChanges();
      await objectStore.saveChanges();
      await robotStore.saveChanges();
      errorLoggingService.info("All changes saved successfully in SceneStore");
    } catch (error) {
      errorLoggingService.error(
        "Error saving changes in SceneStore",
        error as Error
      );
      throw error;
    }
  }
}

/**
 * Store for managing objects
 */
class ObjectStore extends BasePendingStore<IObject> {
  constructor() {
    super();
    makeObservable(this);
    errorLoggingService.debug("ObjectStore initialized");
  }

  @action
  fetchObjects() {
    errorLoggingService.info("Fetching objects");
    return this.fetchItems(sceneManagerApi.fetchObjects);
  }

  @action
  async createObject(objectData: Partial<IObject>): Promise<IObject> {
    errorLoggingService.info("Creating new object", objectData);
    try {
      const newObject = await sceneManagerApi.createObject(objectData);
      runInAction(() => {
        this.items.push(newObject);
      });
      errorLoggingService.info("New object created successfully", newObject);
      return newObject;
    } catch (error) {
      errorLoggingService.error("Error creating new object", error as Error);
      throw error;
    }
  }

  @action
  async updateObject(id: string, updates: Partial<IObject>) {
    errorLoggingService.info(`Updating object: ${id}`, updates);
    this.applyLocalChange(id, updates);
    if (!this.pendingChanges.has(id)) {
      await this.saveItem(id, updates);
    }
  }

  @action
  async deleteObject(id: string) {
    errorLoggingService.info(`Deleting object: ${id}`);
    this.applyLocalDeletion(id);
  }

  @computed
  get objectsByScene() {
    return (sceneId: string): IObject[] => {
      const objects = this.items
        .filter((obj) => obj.scene_id === sceneId)
        .map((obj) => this.getItemWithPendingChanges(obj.id)!);
      errorLoggingService.debug(
        `Retrieved ${objects.length} objects for scene: ${sceneId}`
      );
      return objects;
    };
  }

  @action
  async createObjectFromReference(
    referenceId: string
  ): Promise<IObject | undefined> {
    errorLoggingService.info(`Creating object from reference: ${referenceId}`);
    if (!sceneStore.activeScene) {
      errorLoggingService.error("No active scene to add object to");
      return;
    }

    const referenceObject = libraryStore.getReferenceObjectById(referenceId);
    if (!referenceObject) {
      errorLoggingService.error(
        `Reference object with id ${referenceId} not found`
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
      color: referenceObject.color || "#FFFFFF",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.applyLocalCreation(newObject);
    errorLoggingService.info("Object created from reference", newObject);
    return newObject;
  }

  protected async createItem(item: IObject): Promise<void> {
    errorLoggingService.info("Creating object item", item);
    const createdObject = await sceneManagerApi.createObject(item);
    runInAction(() => {
      const index = this.items.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        this.items[index] = createdObject;
      }
    });
    errorLoggingService.info("Object item created successfully", createdObject);
  }

  protected async saveItem(
    id: string,
    updates: Partial<IObject>
  ): Promise<void> {
    errorLoggingService.info(`Saving object: ${id}`, updates);
    try {
      const updatedObject = await sceneManagerApi.updateObject(id, updates);
      runInAction(() => {
        const index = this.items.findIndex((item) => item.id === id);
        if (index !== -1) {
          this.items[index] = updatedObject;
        }
      });
      errorLoggingService.info(`Object saved successfully: ${id}`);
    } catch (error) {
      errorLoggingService.error(`Error saving object: ${id}`, error as Error);
      this.fetchObjects();
      throw error;
    }
  }

  protected async deleteItem(id: string): Promise<void> {
    errorLoggingService.info(`Deleting object: ${id}`);
    await sceneManagerApi.deleteObject(id);
    errorLoggingService.info(`Object deleted successfully: ${id}`);
  }
}

/**
 * Store for managing robots
 */
class RobotStore extends BasePendingStore<IRobot> {
  constructor() {
    super();
    makeObservable(this);
    errorLoggingService.debug("RobotStore initialized");
  }

  @action
  fetchRobots() {
    errorLoggingService.info("Fetching robots");
    return this.fetchItems(sceneManagerApi.fetchRobots);
  }

  @action
  async createRobot(robotData: Partial<IRobot>): Promise<IRobot> {
    errorLoggingService.info("Creating new robot", robotData);
    try {
      const newRobot = await sceneManagerApi.createRobot(robotData);
      runInAction(() => {
        this.items.push(newRobot);
      });
      errorLoggingService.info("New robot created successfully", newRobot);
      return newRobot;
    } catch (error) {
      errorLoggingService.error("Error creating new robot", error as Error);
      throw error;
    }
  }

  @action
  async updateRobot(id: string, updates: Partial<IRobot>) {
    errorLoggingService.info(`Updating robot: ${id}`, updates);
    this.applyLocalChange(id, updates);
    if (!this.pendingChanges.has(id)) {
      await this.saveItem(id, updates);
    }
  }

  @action
  async deleteRobot(id: string) {
    errorLoggingService.info(`Deleting robot: ${id}`);
    this.applyLocalDeletion(id);
  }

  @computed
  get robotsByScene() {
    return (sceneId: string): IRobot[] => {
      const robots = this.items
        .filter((robot) => robot.scene_id === sceneId)
        .map((robot) => this.getItemWithPendingChanges(robot.id)!);
      errorLoggingService.debug(
        `Retrieved ${robots.length} robots for scene: ${sceneId}`
      );
      return robots;
    };
  }

  @action
  async createRobotFromReference(
    referenceId: string
  ): Promise<IRobot | undefined> {
    errorLoggingService.info(`Creating robot from reference: ${referenceId}`);
    if (!sceneStore.activeScene) {
      errorLoggingService.error("No active scene to add robot to");
      return;
    }

    const referenceRobot = libraryStore.getReferenceRobotById(referenceId);
    if (!referenceRobot) {
      errorLoggingService.error(
        `Reference robot with id ${referenceId} not found`
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

    this.applyLocalCreation(newRobot);
    errorLoggingService.info("Robot created from reference", newRobot);
    return newRobot;
  }

  protected async createItem(item: IRobot): Promise<void> {
    errorLoggingService.info("Creating robot item", item);
    const createdRobot = await sceneManagerApi.createRobot(item);
    runInAction(() => {
      const index = this.items.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        this.items[index] = createdRobot;
      }
    });
    errorLoggingService.info("Robot item created successfully", createdRobot);
  }

  protected async saveItem(
    id: string,
    updates: Partial<IRobot>
  ): Promise<void> {
    errorLoggingService.info(`Saving robot: ${id}`, updates);
    try {
      const updatedRobot = await sceneManagerApi.updateRobot(id, updates);
      runInAction(() => {
        const index = this.items.findIndex((item) => item.id === id);
        if (index !== -1) {
          this.items[index] = updatedRobot;
        }
      });
      errorLoggingService.info(`Robot saved successfully: ${id}`);
    } catch (error) {
      errorLoggingService.error(`Error saving robot: ${id}`, error as Error);
      this.fetchRobots();
      throw error;
    }
  }

  protected async deleteItem(id: string): Promise<void> {
    errorLoggingService.info(`Deleting robot: ${id}`);
    await sceneManagerApi.deleteRobot(id);
    errorLoggingService.info(`Robot deleted successfully: ${id}`);
  }
}

export const sceneStore = new SceneStore();
export const objectStore = new ObjectStore();
export const robotStore = new RobotStore();
