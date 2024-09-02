import create from "zustand";
import {
  Scene,
  Object,
  Robot,
  GeometricObject,
} from "../interfaces/SceneInterfaces";

interface SceneState {
  scenes: Scene[];
  objects: (Object | Robot | GeometricObject)[];
  addScene: (scene: Scene) => void;
  initializeScene: (
    sceneData: Scene,
    objects: (Object | Robot | GeometricObject)[]
  ) => void;
  removeScene: (id: string) => void;
  updateScene: (id: string, updates: Partial<Scene>) => void;
  addObject: (object: Object | Robot | GeometricObject) => void;
  removeObject: (id: string) => void;
  updateObject: (
    id: string,
    updates: Partial<Object | Robot | GeometricObject>
  ) => void;
  getObjectsBySceneId: (
    sceneId: string
  ) => (Object | Robot | GeometricObject)[];

  selectedObjectId: string | null;
  setSelectedObject: (id: string | null) => void;
}

export const useSceneStore = create<SceneState>((set, get) => ({
  scenes: [],
  objects: [],
  selectedObjectId: null, // Added this line

  addScene: (scene) => set((state) => ({ scenes: [...state.scenes, scene] })),
  initializeScene: (sceneData, objectsData) =>
    set((state) => ({
      scenes: [...state.scenes, sceneData],
      objects: [...state.objects, ...objectsData],
    })),

  removeScene: (id) =>
    set((state) => ({
      scenes: state.scenes.filter((scene) => scene.id !== id),
      objects: state.objects.filter((obj) => obj.scene_id !== id),
    })),

  updateScene: (id, updates) =>
    set((state) => ({
      scenes: state.scenes.map((scene) =>
        scene.id === id ? { ...scene, ...updates } : scene
      ),
    })),

  addObject: (object) =>
    set((state) => ({ objects: [...state.objects, object] })),

  removeObject: (id) =>
    set((state) => ({
      objects: state.objects.filter((obj) => obj.id !== id),
    })),

  updateObject: (id, updates) =>
    set((state) => ({
      objects: state.objects.map((obj) =>
        obj.id === id ? { ...obj, ...updates } : obj
      ),
    })),

  getObjectsBySceneId: (sceneId) => {
    return get().objects.filter((obj) => obj.scene_id === sceneId);
  },

  setSelectedObject: (id) => set({ selectedObjectId: id }),
}));
