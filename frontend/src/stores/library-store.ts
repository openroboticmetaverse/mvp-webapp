// src/stores/library-store.ts

import { observable, action, runInAction } from "mobx";
import { BaseStore } from "./base-store";
import { IReferenceObject, IReferenceRobot } from "../types/Interfaces";
import { objectLibraryApi } from "../services/api";

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
    } catch (error) {
      runInAction(() => {
        this.state = { status: "error", error: (error as Error).message };
      });
    }
  }

  getReferenceObjectById(id: string): IReferenceObject | undefined {
    return this.referenceObjects.find((obj) => obj.id === id);
  }

  getReferenceRobotById(id: string): IReferenceRobot | undefined {
    return this.referenceRobots.find((robot) => robot.id === id);
  }
}

export const libraryStore = new LibraryStore();
