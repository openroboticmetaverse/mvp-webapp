import { makeAutoObservable, runInAction } from "mobx";
import { SceneData, ObjectData, RobotData } from "@/api/sceneService";
import { fetchSceneData, saveSceneData } from "../api/sceneService"; // Assuming these API functions exist

class SceneStore {
  sceneData: SceneData | null = null;
  selectedId: string | null = null;
  isLoading: boolean = false;
  error: string | null = null;

  constructor() {
    console.log("Initializing SceneStore");
    makeAutoObservable(this);
  }

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
        this.error = error.message;
        this.isLoading = false;
      });
    }
  }

  setSelectedId = (id: string | null) => {
    console.log(`Setting selected ID: ${id}`);
    this.selectedId = id;
  };

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

  async saveScene() {
    console.log("Saving scene data");
    if (!this.sceneData) {
      console.warn("No scene data available to save");
      return;
    }
    this.isLoading = true;
    this.error = null;
    try {
      await saveSceneData(this.sceneData);
      console.log("Scene data saved successfully");
      runInAction(() => {
        this.isLoading = false;
      });
    } catch (error) {
      console.error("Error saving scene data", error);
      runInAction(() => {
        this.error = error.message;
        this.isLoading = false;
      });
    }
  }
}

export const sceneStore = new SceneStore();
