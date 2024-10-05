export interface SceneData {
  id: string;
  name: string;
  description: string;
  objects: ObjectData[];
  robots: RobotData[];
}

export interface ObjectData {
  id: string;
  name: string;
  description: string;
  position: [number, number, number];
  orientation: [number, number, number];
  scale: [number, number, number];
  color: string;
  objectReference: string;
}

export interface RobotData {
  id: string;
  name: string;
  description: string;
  position: [number, number, number];
  orientation: [number, number, number];
  scale: [number, number, number];
  jointAngles: number[];
  robotReference: string;
}

export const fetchSceneData = async (sceneId: string): Promise<SceneData> => {
  // Simulated fake data
  const fakeData: SceneData = {
    id: "1",
    name: "Sample Scene",
    description: "This is a sample scene with objects and robots.",
    objects: [
      {
        id: "obj1",
        name: "Object 1",
        description: "This is object 1",
        position: [0, 0, 0],
        orientation: [0, 0, 0],
        scale: [1, 1, 1],
        color: "red",
        objectReference: "ref1",
      },
      {
        id: "obj2",
        name: "Object 2",
        description: "This is object 2",
        position: [2, 0, 0],
        orientation: [0, 0, 0],
        scale: [10, 1, 1],
        color: "blue",
        objectReference: "ref2",
      },
    ],
    robots: [
      {
        id: "robot1",
        name: "Robot 1",
        description: "This is robot 1",
        position: [1, 0, 0],
        orientation: [0, 0, 0],
        scale: [1, 1, 1],
        jointAngles: [0, 0, 0],
        robotReference: "refRobot1",
      },
    ],
  };

  return new Promise((resolve) => setTimeout(() => resolve(fakeData), 2000));
};
