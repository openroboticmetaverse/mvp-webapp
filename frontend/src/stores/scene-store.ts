import { makeAutoObservable, runInAction } from "mobx";
import { fetchSceneData, saveSceneData } from "../api/sceneService";
import { SceneData, RobotData, ObjectData } from "../types/Interfaces";

/**
 * SceneStore manages the state and operations for a scene in the application.
 * It handles loading, updating, and saving scene data, as well as managing the selected object/robot.
 */
class SceneStore {
  /** The current scene data */
  sceneData: SceneData | null = null;
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
   * Fetches scene data from the server.
   * @param {string} sceneId - The ID of the scene to fetch.
   */
  async fetchScene(sceneId: string) {
    console.log(`Fetching scene with ID: ${sceneId}`);
    this.isLoading = true;
    this.error = null;
    try {
      const data = await fetchSceneData(sceneId);
      console.log("Scene data fetched successfully", data);
      runInAction(() => {
        this.sceneData = data;
        this.isLoading = false;
      });
    } catch (error) {
      console.error("Error fetching scene data", error);
      runInAction(() => {
        if (error instanceof Error) {
          console.log(error.message);
        }
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
   * Updates an object in the scene.
   * @param {string} id - The ID of the object to update.
   * @param {Partial<ObjectData>} updates - The properties to update on the object.
   */
  updateObject(id: string, updates: Partial<ObjectData>) {
    console.log(`Updating object with ID: ${id}`, updates);
    if (!this.sceneData) {
      console.warn("No scene data available to update object");
      return;
    }
    const objectIndex = this.sceneData.objects.findIndex(
      (obj) => obj.id === id
    );
    if (objectIndex !== -1) {
      this.sceneData.objects[objectIndex] = {
        ...this.sceneData.objects[objectIndex],
        ...updates,
      };
      console.log(
        "Object updated successfully",
        this.sceneData.objects[objectIndex]
      );
    } else {
      console.warn(`Object with ID: ${id} not found`);
    }
  }

  /**
   * Updates a robot in the scene.
   * @param {string} id - The ID of the robot to update.
   * @param {Partial<RobotData>} updates - The properties to update on the robot.
   */
  updateRobot(id: string, updates: Partial<RobotData>) {
    console.log(`Updating robot with ID: ${id}`, updates);
    if (!this.sceneData) {
      console.warn("No scene data available to update robot");
      return;
    }
    const robotIndex = this.sceneData.robots.findIndex(
      (robot) => robot.id === id
    );
    if (robotIndex !== -1) {
      this.sceneData.robots[robotIndex] = {
        ...this.sceneData.robots[robotIndex],
        ...updates,
      };
      console.log(
        "Robot updated successfully",
        this.sceneData.robots[robotIndex]
      );
    } else {
      console.warn(`Robot with ID: ${id} not found`);
    }
  }

  /**
   * Saves the current scene data to the server.
   */
  async saveScene() {
    console.log("Saving scene data");
    if (!this.sceneData) {
      console.warn("No scene data available to save");
      return;
    }
    this.isLoading = true;
    this.error = null;
    try {
      const sceneDataToSave = { ...this.sceneData };
      const savedData = await saveSceneData(sceneDataToSave);
      console.log("Scene data saved successfully");
      runInAction(() => {
        this.sceneData = savedData;
        this.isLoading = false;
      });
    } catch (error) {
      console.error("Error saving scene data", error);
      runInAction(() => {
        if (error instanceof Error) {
          this.error = error.message;
        } else {
          this.error = String(error);
        }
        this.isLoading = false;
      });
    }
  }

  addObject(newObject: ObjectData) {
    this.sceneData!.objects.push(newObject);
  }

  addRobot(newRobot: RobotData) {
    this.sceneData!.robots.push(newRobot);
  }
}

export const sceneStore = new SceneStore();
