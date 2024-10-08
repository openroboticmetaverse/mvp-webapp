import { makeAutoObservable, runInAction } from "mobx";
import {
  IScene,
  IRobot,
  IObject,
  IReferenceRobot,
  IReferenceObject,
} from "../types/Interfaces";
import { sceneManagerApi, objectLibraryApi } from "../services/api";

// Enhanced logging function
const log = (method: string, message: string, data?: any) => {
  console.log(
    `[SceneStore] [${method}] ${message}`,
    data ? JSON.stringify(data, null, 2) : ""
  );
};

class SceneStore {
  scenes: IScene[] = [];
  sceneData: IScene | null = null;
  objects: IObject[] = [];
  robots: IRobot[] = [];
  referenceRobots: IReferenceRobot[] = [];
  referenceObjects: IReferenceObject[] = [];
  selectedId: string | null = null;
  isLoading: boolean = false;
  error: string | null = null;
  selectedScene: IScene | null = null;
  isSuccess: boolean = false;

  pendingChanges: {
    objects: Map<string, Partial<IObject>>;
    robots: Map<string, Partial<IRobot>>;
    deletedObjects: Set<string>;
    deletedRobots: Set<string>;
  } = {
    objects: new Map(),
    robots: new Map(),
    deletedObjects: new Set(),
    deletedRobots: new Set(),
  };

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
    log("constructor", "Scene Store Initialized");
  }

  private handleError(error: unknown, errorMessage: string): void {
    console.error(`[SceneStore] [handleError] ${errorMessage}`, error);
    runInAction(() => {
      this.error = error instanceof Error ? error.message : String(error);
      this.isLoading = false;
      this.isSuccess = false;
    });
    log("handleError", `Error handled: ${this.error}`);
  }
  setError = (errorMessage: string | null): void => {
    runInAction(() => {
      this.error = errorMessage;
    });
    log("setError", `Error set: ${errorMessage}`);
  };

  setSelectedScene = (scene: IScene | null) => {
    log("setSelectedScene", "Setting selected scene", scene);
    if (this.selectedScene?.id === scene?.id) {
      return; // Don't reload if it's the same scene
    }
    this.selectedScene = scene;
    if (scene) {
      log("setSelectedScene", "Fetching scene data for selected scene", {
        sceneId: scene.id,
      });
      this.fetchSceneData(scene.id);
    }
  };

  lastFetchTime: number = 0;

  fetchScenes = async () => {
    const now = Date.now();
    if (now - this.lastFetchTime < 60000) {
      // Cache for 1 minute
      return; // Use cached scenes
    }

    log("fetchScenes", "Fetching scenes...");
    this.isLoading = true;
    try {
      const fetchedScenes = await sceneManagerApi.fetchScenes();
      runInAction(() => {
        this.scenes = fetchedScenes;
        this.isLoading = false;
        this.lastFetchTime = now;
        log("fetchScenes", "Scenes fetched successfully", {
          count: fetchedScenes.length,
          scenes: fetchedScenes,
        });
      });
    } catch (error) {
      this.handleError(error, "Error fetching scenes:");
    }
  };

  fetchSceneData = async (sceneId: string) => {
    if (this.sceneData?.id === sceneId) {
      return; // Don't refetch if it's the same scene
    }

    log("fetchSceneData", `Fetching scene data for scene ID: ${sceneId}`);
    this.isLoading = true;
    try {
      const [objectsData, robotsData] = await Promise.all([
        sceneManagerApi.fetchObjects(),
        sceneManagerApi.fetchRobots(),
      ]);
      runInAction(() => {
        this.objects = objectsData.filter((obj) => obj.scene_id === sceneId);
        this.robots = robotsData.filter((robot) => robot.scene_id === sceneId);
        this.sceneData =
          this.scenes.find((scene) => scene.id === sceneId) || null;
        this.isLoading = false;
        log("fetchSceneData", "Scene data fetched successfully", {
          sceneId,
          objectsCount: this.objects.length,
          robotsCount: this.robots.length,
          objects: this.objects,
          robots: this.robots,
        });
      });
    } catch (error) {
      this.handleError(error, "Error fetching scene data:");
    }
  };

  fetchReferenceObjects = async () => {
    log("fetchReferenceObjects", "Fetching reference objects...");
    this.isLoading = true;
    try {
      const fetchedReferenceObjects =
        await objectLibraryApi.fetchReferenceObjects();
      runInAction(() => {
        this.referenceObjects = fetchedReferenceObjects;
        this.isLoading = false;
        log("fetchReferenceObjects", "Reference objects fetched successfully", {
          count: fetchedReferenceObjects.length,
          referenceObjects: fetchedReferenceObjects,
        });
      });
    } catch (error) {
      this.handleError(error, "Error fetching reference objects:");
    }
  };

  fetchReferenceRobots = async () => {
    log("fetchReferenceRobots", "Fetching reference robots...");
    this.isLoading = true;
    try {
      const fetchedReferenceRobots =
        await objectLibraryApi.fetchReferenceRobots();
      runInAction(() => {
        this.referenceRobots = fetchedReferenceRobots;
        this.isLoading = false;
        log("fetchReferenceRobots", "Reference robots fetched successfully", {
          count: fetchedReferenceRobots.length,
          referenceRobots: fetchedReferenceRobots,
        });
      });
    } catch (error) {
      this.handleError(error, "Error fetching reference robots:");
    }
  };

  async fetchScene(sceneId: string): Promise<void> {
    log("fetchScene", `Fetching scene with ID: ${sceneId}`);
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
        log("fetchScene", "Scene fetched successfully", {
          sceneData: this.sceneData,
          objectsCount: this.objects.length,
          robotsCount: this.robots.length,
        });
      });
    } catch (error) {
      this.handleError(error, "Error fetching scene:");
    }
  }

  async createNewScene(name: string): Promise<void> {
    log("createNewScene", `Creating new scene with name: ${name}`);
    this.isLoading = true;
    this.error = null;
    try {
      const newScene: Partial<IScene> = {
        name: name,
        description: "A new scene",
      };
      const createdScene = await sceneManagerApi.createScene(newScene);
      runInAction(() => {
        this.sceneData = createdScene;
        this.selectedScene = createdScene;
        this.scenes.push(createdScene);
        this.objects = [];
        this.robots = [];
        this.isLoading = false;
        log("createNewScene", "New scene created successfully", {
          createdScene,
        });
      });
    } catch (error) {
      this.handleError(error, "Error creating new scene:");
    }
  }

  async saveScene(): Promise<void> {
    log("saveScene", "Saving scene...");
    if (!this.sceneData) {
      log("saveScene", "No scene data available to save");
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
        log("saveScene", "Scene saved successfully", {
          updatedScene,
          updatedObjectsCount: updatedObjects.length,
          updatedRobotsCount: updatedRobots.length,
        });
      });
    } catch (error) {
      this.handleError(error, "Error saving scene:");
    }
  }

  async addObject(newObject: Partial<IObject>): Promise<void> {
    log("addObject", "Adding new object", newObject);
    const id = `temp_${Date.now()}`;
    const fullObject: IObject = {
      ...newObject,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as IObject;

    runInAction(() => {
      this.objects.push(fullObject);
      this.pendingChanges.objects.set(id, fullObject);
      log("addObject", "New object added", { fullObject });
    });
  }

  async addRobot(newRobot: Partial<IRobot>): Promise<void> {
    log("addRobot", "Adding new robot", newRobot);
    const id = `temp_${Date.now()}`;
    const fullRobot: IRobot = {
      ...newRobot,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as IRobot;

    runInAction(() => {
      this.robots.push(fullRobot);
      this.pendingChanges.robots.set(id, fullRobot);
      log("addRobot", "New robot added", { fullRobot });
    });
  }

  async updateObject(id: string, updates: Partial<IObject>): Promise<void> {
    log("updateObject", `Updating object with ID: ${id}`, updates);
    runInAction(() => {
      const index = this.objects.findIndex((obj) => obj.id === id);
      if (index !== -1) {
        this.objects[index] = { ...this.objects[index], ...updates };
        this.pendingChanges.objects.set(id, updates);
        log("updateObject", "Object updated", {
          updatedObject: this.objects[index],
        });
      } else {
        log("updateObject", `Object with ID ${id} not found`);
      }
    });
  }

  async updateRobot(id: string, updates: Partial<IRobot>): Promise<void> {
    log("updateRobot", `Updating robot with ID: ${id}`, updates);
    runInAction(() => {
      const index = this.robots.findIndex((robot) => robot.id === id);
      if (index !== -1) {
        this.robots[index] = { ...this.robots[index], ...updates };
        this.pendingChanges.robots.set(id, updates);
        log("updateRobot", "Robot updated", {
          updatedRobot: this.robots[index],
        });
      } else {
        log("updateRobot", `Robot with ID ${id} not found`);
      }
    });
  }

  async deleteObject(id: string): Promise<void> {
    log("deleteObject", `Deleting object with ID: ${id}`);
    runInAction(() => {
      this.objects = this.objects.filter((obj) => obj.id !== id);
      this.pendingChanges.deletedObjects.add(id);
      this.pendingChanges.objects.delete(id);
      log("deleteObject", `Object with ID ${id} marked for deletion`);
    });
  }

  async deleteRobot(id: string): Promise<void> {
    log("deleteRobot", `Deleting robot with ID: ${id}`);
    runInAction(() => {
      this.robots = this.robots.filter((robot) => robot.id !== id);
      this.pendingChanges.deletedRobots.add(id);
      this.pendingChanges.robots.delete(id);
      log("deleteRobot", `Robot with ID ${id} marked for deletion`);
    });
  }

  async addReferenceRobot(
    newReferenceRobot: Partial<IReferenceRobot>
  ): Promise<void> {
    log("addReferenceRobot", "Adding new reference robot", newReferenceRobot);
    this.isLoading = true;
    this.error = null;
    try {
      const createdReferenceRobot =
        await objectLibraryApi.createReferenceRobot(newReferenceRobot);
      runInAction(() => {
        this.referenceRobots.push(createdReferenceRobot);
        this.isLoading = false;
        this.isSuccess = true;
        log("addReferenceRobot", "New reference robot added successfully", {
          createdReferenceRobot,
        });
      });
    } catch (error) {
      this.handleError(error, "Error adding reference robot:");
    }
  }

  async addReferenceObject(
    newReferenceObject: Partial<IReferenceObject>
  ): Promise<void> {
    log(
      "addReferenceObject",
      "Adding new reference object",
      newReferenceObject
    );
    this.isLoading = true;
    this.error = null;
    try {
      const createdReferenceObject =
        await objectLibraryApi.createReferenceObject(newReferenceObject);
      runInAction(() => {
        this.referenceObjects.push(createdReferenceObject);
        this.isLoading = false;
        this.isSuccess = true;
        log("addReferenceObject", "New reference object added successfully", {
          createdReferenceObject,
        });
      });
    } catch (error) {
      this.handleError(error, "Error adding reference object:");
    }
  }

  async updateReferenceRobot(
    id: string,
    updates: Partial<IReferenceRobot>
  ): Promise<void> {
    log(
      "updateReferenceRobot",
      `Updating reference robot with ID: ${id}`,
      updates
    );
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
          log("updateReferenceRobot", "Reference robot updated successfully", {
            updatedReferenceRobot,
          });
        } else {
          log(
            "updateReferenceRobot",
            `Reference robot with ID ${id} not found`
          );
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
    log(
      "updateReferenceObject",
      `Updating reference object with ID: ${id}`,
      updates
    );
    this.isLoading = true;
    this.error = null;
    try {
      const updatedReferenceObject =
        await objectLibraryApi.updateReferenceObject(id, updates);
      runInAction(() => {
        const index = this.referenceObjects.findIndex((obj) => obj.id === id);
        if (index !== -1) {
          this.referenceObjects[index] = updatedReferenceObject;
          log(
            "updateReferenceObject",
            "Reference object updated successfully",
            { updatedReferenceObject }
          );
        } else {
          log(
            "updateReferenceObject",
            `Reference object with ID ${id} not found`
          );
        }
        this.isLoading = false;
        this.isSuccess = true;
      });
    } catch (error) {
      this.handleError(error, "Error updating reference object:");
    }
  }

  async deleteReferenceRobot(id: string): Promise<void> {
    log("deleteReferenceRobot", `Deleting reference robot with ID: ${id}`);
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
        log(
          "deleteReferenceRobot",
          `Reference robot with ID ${id} deleted successfully`
        );
      });
    } catch (error) {
      this.handleError(error, "Error deleting reference robot:");
    }
  }

  async deleteReferenceObject(id: string): Promise<void> {
    log("deleteReferenceObject", `Deleting reference object with ID: ${id}`);
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
        log(
          "deleteReferenceObject",
          `Reference object with ID ${id} deleted successfully`
        );
      });
    } catch (error) {
      this.handleError(error, "Error deleting reference object:");
    }
  }

  // Computed properties
  get objectsById(): Map<string, IObject> {
    const objectMap = new Map(this.objects.map((obj) => [obj.id, obj]));
    log("objectsById", "Computed objects by ID", {
      objectCount: objectMap.size,
    });
    return objectMap;
  }

  get robotsById(): Map<string, IRobot> {
    const robotMap = new Map(this.robots.map((robot) => [robot.id, robot]));
    log("robotsById", "Computed robots by ID", { robotCount: robotMap.size });
    return robotMap;
  }

  get referenceRobotsById(): Map<string, IReferenceRobot> {
    const referenceRobotMap = new Map(
      this.referenceRobots.map((robot) => [robot.id, robot])
    );
    log("referenceRobotsById", "Computed reference robots by ID", {
      referenceRobotCount: referenceRobotMap.size,
    });
    return referenceRobotMap;
  }

  get referenceObjectsById(): Map<string, IReferenceObject> {
    const referenceObjectMap = new Map(
      this.referenceObjects.map((obj) => [obj.id, obj])
    );
    log("referenceObjectsById", "Computed reference objects by ID", {
      referenceObjectCount: referenceObjectMap.size,
    });
    return referenceObjectMap;
  }

  // Utility methods
  getObjectById(id: string): IObject | undefined {
    const object = this.objectsById.get(id);
    log("getObjectById", `Getting object with ID: ${id}`, { object });
    return object;
  }

  getRobotById(id: string): IRobot | undefined {
    const robot = this.robotsById.get(id);
    log("getRobotById", `Getting robot with ID: ${id}`, { robot });
    return robot;
  }

  getReferenceRobotById(id: string): IReferenceRobot | undefined {
    const referenceRobot = this.referenceRobotsById.get(id);
    log("getReferenceRobotById", `Getting reference robot with ID: ${id}`, {
      referenceRobot,
    });
    return referenceRobot;
  }

  getReferenceObjectById(id: string): IReferenceObject | undefined {
    const referenceObject = this.referenceObjectsById.get(id);
    log("getReferenceObjectById", `Getting reference object with ID: ${id}`, {
      referenceObject,
    });
    return referenceObject;
  }

  setSelectedId(id: string | null): void {
    log("setSelectedId", `Setting selected ID: ${id}`);
    this.selectedId = id;
  }

  async saveChanges(): Promise<void> {
    log("saveChanges", "Saving all pending changes");
    this.isLoading = true;
    this.error = null;
    try {
      // Create new objects
      for (const [id, object] of this.pendingChanges.objects) {
        if (id.startsWith("temp_")) {
          log("saveChanges", `Creating new object: ${id}`, object);
          const createdObject = await sceneManagerApi.createObject(object);
          const index = this.objects.findIndex((obj) => obj.id === id);
          if (index !== -1) {
            this.objects[index] = createdObject;
            log(
              "saveChanges",
              `New object created and updated: ${createdObject.id}`
            );
          }
        } else {
          log("saveChanges", `Updating existing object: ${id}`, object);
          await sceneManagerApi.updateObject(id, object);
        }
      }

      // Create new robots
      for (const [id, robot] of this.pendingChanges.robots) {
        if (id.startsWith("temp_")) {
          log("saveChanges", `Creating new robot: ${id}`, robot);
          const createdRobot = await sceneManagerApi.createRobot(robot);
          const index = this.robots.findIndex((rob) => rob.id === id);
          if (index !== -1) {
            this.robots[index] = createdRobot;
            log(
              "saveChanges",
              `New robot created and updated: ${createdRobot.id}`
            );
          }
        } else {
          log("saveChanges", `Updating existing robot: ${id}`, robot);
          await sceneManagerApi.updateRobot(id, robot);
        }
      }

      // Delete objects
      for (const id of this.pendingChanges.deletedObjects) {
        log("saveChanges", `Deleting object: ${id}`);
        await sceneManagerApi.deleteObject(id);
      }

      // Delete robots
      for (const id of this.pendingChanges.deletedRobots) {
        log("saveChanges", `Deleting robot: ${id}`);
        await sceneManagerApi.deleteRobot(id);
      }

      // Clear pending changes
      runInAction(() => {
        this.pendingChanges = {
          objects: new Map(),
          robots: new Map(),
          deletedObjects: new Set(),
          deletedRobots: new Set(),
        };
        this.isLoading = false;
        this.isSuccess = true;
        log("saveChanges", "All changes saved successfully");
      });
    } catch (error) {
      this.handleError(error, "Error saving changes:");
    }
  }

  hasUnsavedChanges(): boolean {
    const hasChanges =
      this.pendingChanges.objects.size > 0 ||
      this.pendingChanges.robots.size > 0 ||
      this.pendingChanges.deletedObjects.size > 0 ||
      this.pendingChanges.deletedRobots.size > 0;
    log("hasUnsavedChanges", `Unsaved changes: ${hasChanges}`, {
      objectChanges: this.pendingChanges.objects.size,
      robotChanges: this.pendingChanges.robots.size,
      deletedObjects: this.pendingChanges.deletedObjects.size,
      deletedRobots: this.pendingChanges.deletedRobots.size,
    });
    return hasChanges;
  }

  discardChanges(): void {
    log("discardChanges", "Discarding all pending changes");
    // Revert objects
    for (const [id, object] of this.pendingChanges.objects) {
      if (id.startsWith("temp_")) {
        log("discardChanges", `Removing temporary object: ${id}`);
        this.objects = this.objects.filter((obj) => obj.id !== id);
      } else {
        log("discardChanges", `Reverting changes for object: ${id}`);
        const originalObject = this.objects.find((obj) => obj.id === id);
        if (originalObject) {
          Object.assign(originalObject, object);
        }
      }
    }

    // Revert robots
    for (const [id, robot] of this.pendingChanges.robots) {
      if (id.startsWith("temp_")) {
        log("discardChanges", `Removing temporary robot: ${id}`);
        this.robots = this.robots.filter((rob) => rob.id !== id);
      } else {
        log("discardChanges", `Reverting changes for robot: ${id}`);
        const originalRobot = this.robots.find((rob) => rob.id === id);
        if (originalRobot) {
          Object.assign(originalRobot, robot);
        }
      }
    }

    // Restore deleted objects and robots
    this.objects = this.objects.concat(
      Array.from(this.pendingChanges.deletedObjects)
        .map((id) => this.getObjectById(id))
        .filter(Boolean) as IObject[]
    );
    log(
      "discardChanges",
      `Restored ${this.pendingChanges.deletedObjects.size} deleted objects`
    );

    this.robots = this.robots.concat(
      Array.from(this.pendingChanges.deletedRobots)
        .map((id) => this.getRobotById(id))
        .filter(Boolean) as IRobot[]
    );
    log(
      "discardChanges",
      `Restored ${this.pendingChanges.deletedRobots.size} deleted robots`
    );

    // Clear pending changes
    this.pendingChanges = {
      objects: new Map(),
      robots: new Map(),
      deletedObjects: new Set(),
      deletedRobots: new Set(),
    };
    log("discardChanges", "All changes discarded");
  }
}

export const sceneStore = new SceneStore();
log("sceneStore", "Scene Store instance created");
