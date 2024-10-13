import { observable, makeObservable, action, runInAction } from "mobx";
import { errorLoggingService } from "../services/error-logging-service";

// Discriminated union for store state
type StoreState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T[] }
  | { status: "error"; error: string };

/**
 * Base Store class that provides common functionality for all stores
 * @template T - The type of items stored in this store
 */
export abstract class BaseStore<T extends { id: string }> {
  @observable items: T[] = [];
  @observable state: StoreState<T> = { status: "idle" };

  constructor() {
    makeObservable(this);
  }

  /**
   * Fetches items from an API and updates the store
   * @param apiCall - A function that returns a Promise resolving to an array of items
   */
  @action
  protected async fetchItems(apiCall: () => Promise<T[]>) {
    this.state = { status: "loading" };
    try {
      const data = await apiCall();
      runInAction(() => {
        this.items = data;
        this.state = { status: "success", data };
      });
      errorLoggingService.info(
        `Successfully fetched ${this.constructor.name} items`
      );
    } catch (error) {
      runInAction(() => {
        this.state = { status: "error", error: (error as Error).message };
      });
      errorLoggingService.error(
        `Error fetching ${this.constructor.name} items`,
        error as Error
      );
    }
  }

  /**
   * Updates an item in the store
   * @param id - The ID of the item to update
   * @param updates - Partial object containing the fields to update
   */
  @action
  protected updateItem(id: string, updates: Partial<T>) {
    const index = this.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...updates };
      errorLoggingService.info(
        `Updated item with ID ${id} in ${this.constructor.name}`
      );
    } else {
      errorLoggingService.warn(
        `Attempted to update non-existent item with ID ${id} in ${this.constructor.name}`
      );
    }
  }

  /**
   * Deletes an item from the store
   * @param id - The ID of the item to delete
   */
  @action
  protected deleteItem(id: string) {
    const initialLength = this.items.length;
    this.items = this.items.filter((item) => item.id !== id);
    if (this.items.length < initialLength) {
      errorLoggingService.info(
        `Deleted item with ID ${id} from ${this.constructor.name}`
      );
    } else {
      errorLoggingService.warn(
        `Attempted to delete non-existent item with ID ${id} from ${this.constructor.name}`
      );
    }
  }

  /**
   * Retrieves an item by its ID
   * @param id - The ID of the item to retrieve
   * @returns The item if found, undefined otherwise
   */
  getItemById(id: string): T | undefined {
    const item = this.items.find((item) => item.id === id);
    if (!item) {
      errorLoggingService.debug(
        `Item with ID ${id} not found in ${this.constructor.name}`
      );
    }
    return item;
  }
}
