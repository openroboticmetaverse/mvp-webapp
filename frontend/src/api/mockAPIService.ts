// mockApiService.ts

import { Object3D } from "three";

export interface ObjectData {
  id: string;
  type: "box" | "sphere" | "cylinder" | "cone" | "torus" | "model";
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
  size?: [number, number, number];
  radius?: number;
  height?: number;
  tubeRadius?: number;
  url?: string;
  ref?: React.RefObject<Object3D>; // this is added temporarily
}

const mockObjects: ObjectData[] = [
  {
    id: "1",
    type: "box",
    position: [0, 0, 0],
    color: "red",
    size: [1, 1, 1],
  },
  {
    id: "2",
    type: "sphere",
    position: [2, 0, 0],
    color: "blue",
    radius: 0.5,
  },
  {
    id: "3",
    type: "cylinder",
    position: [-2, 0, 0],
    color: "green",
    radius: 0.5,
    height: 2,
  },
  {
    id: "4",
    type: "cone",
    position: [0, 2, 0],
    color: "yellow",
    radius: 0.5,
    height: 1,
  },
  {
    id: "5",
    type: "torus",
    position: [0, -2, 0],
    color: "purple",
    radius: 0.5,
    tubeRadius: 0.1,
  },
  /*   {
    id: "6",
    type: "model",
    position: [4, 0, 0],
    url: "/path/to/your/model.gltf",
    scale: [1, 1, 1],
  }, */
];

export const fetchObjects = (): Promise<ObjectData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockObjects), 500); // Simulate network delay
  });
};

export const saveScene = (objects: ObjectData[]): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Scene saved:", objects);
      resolve();
    }, 500);
  });
};
