/**
 * The Zustand store for managing the state of the 3D scene.
 * @module ModelStore
 */

import create from "zustand";
import * as THREE from "three";
/**
 * Represents the information of a 3D model.
 */
interface ModelInfo {
  /** The name of the model. */
  name: string | null;
  /** The unique identifier of the model. */
  id: number | null;
  /** The UUID of the model in the 3D scene. */
  uuid: string | null;
}

/**
 * Represents the state and actions of the model store.
 */
interface ModelState {
  /** The currently selected model. */
  currentModel: ModelInfo | null;
  /** An array of all models in the scene. */
  sceneModels: ModelInfo[];
  /** The model to be removed from the scene. */
  modelToRemove: ModelInfo | null;
  /** The currently selected object. */
  selectedObject: THREE.Object3D | null;

  /**
   * Sets the currently selected model.
   * @param model - The model to set as the currently selected model.
   */
  setCurrentModel: (model: ModelInfo | null) => void;

  /**
   * Adds a model to the scene.
   * @param model - The model to add to the scene.
   */
  addSceneModel: (model: ModelInfo) => void;

  /**
   * Updates the UUID of a model in the scene.
   * @param id - The ID of the model to update.
   * @param newUUID - The new UUID to assign to the model.
   */
  updateModelUUID: (id: number, newUUID: string) => void;

  /**
   * Sets the model to be removed from the scene.
   * @param model - The model to remove from the scene.
   */
  setModelToRemove: (model: ModelInfo) => void;

  /**
   * Removes a model from the scene.
   * @param id - The ID of the model to remove.
   */
  removeModel: (id: number) => void;

  /**
   * Sets the selected object.
   * @param object - The object to set as the selected object.
   */

  setSelectedObject: (object: THREE.Object3D | null) => void;
}

/**
 * Creates and returns the Zustand store for managing 3D models in the scene.
 */
const useModelStore = create<ModelState>((set) => ({
  currentModel: null,
  sceneModels: [], // Initialize as an empty array
  selectedObject: null,
  modelToRemove: null,

  setCurrentModel: (model) => {
    console.log("Setting current model in store:", model);
    set((state) => {
      console.log("Previous state:", state.currentModel);
      console.log("New state:", model);
      return { currentModel: model ? { ...model } : null };
    });
  },
  addSceneModel: (model) =>
    set((state) => ({
      sceneModels: [...state.sceneModels, model],
    })),
  updateModelUUID: (id, newUUID) =>
    set((state) => ({
      sceneModels: state.sceneModels.map((model) =>
        model.id === id ? { ...model, uuid: newUUID } : model
      ),
    })),
  removeModel: (id) =>
    set((state) => ({
      sceneModels: state.sceneModels.filter((model) => model.id !== id),
      modelToRemove: null,
    })),
  setSelectedObject: (object) => set({ selectedObject: object }),
  setModelToRemove: (model) => set({ modelToRemove: model }),
}));

export default useModelStore;
