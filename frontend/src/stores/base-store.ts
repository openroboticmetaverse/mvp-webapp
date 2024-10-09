import { observable, makeObservable, action, runInAction } from "mobx";
import { errorStore } from "./error-store";

// Discriminated union for store state
type StoreState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T[] }
  | { status: "error"; error: string };

// Base Store
export abstract class BaseStore<T extends { id: string }> {
  @observable items: T[] = [];
  @observable state: StoreState<T> = { status: "idle" };

  constructor() {
    makeObservable(this);
  }

  @action
  protected async fetchItems(apiCall: () => Promise<T[]>) {
    this.state = { status: "loading" };
    try {
      const data = await apiCall();
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
  protected updateItem(id: string, updates: Partial<T>) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...updates };
    }
  }

  @action
  protected deleteItem(id: string) {
    this.items = this.items.filter((item) => item.id !== id);
  }

  getItemById(id: string): T | undefined {
    return this.items.find((item) => item.id === id);
  }
}
