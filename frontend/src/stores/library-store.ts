// src/stores/library-store.ts

import { observable, action, runInAction, computed } from "mobx";
import { BaseStore } from "./base-store";
import { IReferenceObject, IReferenceRobot } from "../types/Interfaces";
import { objectLibraryApi } from "../services/api";
import { errorLoggingService } from "@/services/error-logging-service";

// Define a union type for library items
type LibraryItem = IReferenceObject | IReferenceRobot;

class LibraryStore extends BaseStore<LibraryItem> {
  @observable referenceObjects: IReferenceObject[] = [];
  @observable referenceRobots: IReferenceRobot[] = [];

  constructor() {
    super();
  }

  @action
  async fetchLibraryData() {
    this.state = { status: "loading" };
    try {
      const [objects, robots] = await Promise.all([
        objectLibraryApi.fetchReferenceObjects(),
        objectLibraryApi.fetchReferenceRobots(),
      ]);
      runInAction(() => {
        this.referenceObjects = objects;
        this.referenceRobots = robots;
        this.items = [...objects, ...robots];
        this.state = { status: "success", data: this.items };
      });
      errorLoggingService.info("Library data fetched successfully", {
        objectCount: objects.length,
        robotCount: robots.length,
        totalItems: this.items.length,
      });
    } catch (error) {
      runInAction(() => {
        this.state = { status: "error", error: (error as Error).message };
      });
      errorLoggingService.error("Error fetching library data", error as Error);
    }
  }

  @computed
  get isLoaded() {
    return this.state.status === "success";
  }

  getReferenceObjectById(id: string | number): IReferenceObject | undefined {
    const result = this.referenceObjects.find(
      (obj) => obj.id.toString() === id.toString()
    );
    if (!result) {
      errorLoggingService.warn(`Reference object not found for id: ${id}`, {
        availableIds: this.referenceObjects.map((obj) => obj.id),
        storeState: this.state,
        objectCount: this.referenceObjects.length,
      });
    }
    return result;
  }

  getReferenceRobotById(id: string | number): IReferenceRobot | undefined {
    const result = this.referenceRobots.find(
      (robot) => robot.id.toString() === id.toString()
    );
    if (!result) {
      errorLoggingService.warn(`Reference robot not found for id: ${id}`, {
        availableIds: this.referenceRobots.map((robot) => robot.id),
        storeState: this.state,
        robotCount: this.referenceRobots.length,
      });
    }
    return result;
  }
}

export const libraryStore = new LibraryStore();
