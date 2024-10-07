import { IScene, IObject, IRobot } from "../types/Interfaces";

// Simulated fake data
const fakeObjects: IObject[] = [
  {
    id: "001",
    name: "Object 1",
    description: "This is object 1",
    scene_id: "1",
    position: [0, 0, 0],
    orientation: [0, 0, 0],
    scale: [1, 1, 1],
    color: "red",
    object_reference: "ref1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "002",
    name: "Object 2",
    description: "This is object 2",
    scene_id: "1",
    position: [4, 0, 0],
    orientation: [0, 0, 0],
    scale: [1, 1, 1],
    color: "blue",
    object_reference: "ref2",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const fakeRobots: IRobot[] = [
  {
    id: "003",
    name: "Robot 1",
    description: "This is robot 1",
    scene_id: "1",
    position: [2, 0, 0],
    orientation: [0, 0, 0],
    scale: [1, 1, 1],
    joint_angles: [0, 0, 0],
    robot_reference: "refRobot1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const fetchSceneData = async (sceneId: string): Promise<IScene> => {
  const fakeScene: IScene = {
    id: sceneId,
    name: "Sample Scene",
    description: "This is a sample scene.",
    user_id: "Karim",
    websocket_visual_id: "ws_visual_1",
    websocket_control_id: "ws_control_1",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return new Promise((resolve) => setTimeout(() => resolve(fakeScene), 1000));
};

export const fetchObjectsForScene = async (
  sceneId: string
): Promise<IObject[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(fakeObjects), 1000));
};

export const fetchRobotsForScene = async (
  sceneId: string
): Promise<IRobot[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(fakeRobots), 1000));
};

export const saveSceneData = async (sceneData: IScene): Promise<IScene> => {
  const updatedScene: IScene = {
    ...sceneData,
    updated_at: new Date().toISOString(),
  };

  console.log("Saved scene data:", JSON.stringify(updatedScene, null, 2));

  return new Promise((resolve) =>
    setTimeout(() => resolve(updatedScene), 1000)
  );
};

export const saveObject = async (object: IObject): Promise<IObject> => {
  const updatedObject: IObject = {
    ...object,
    updated_at: new Date().toISOString(),
  };

  console.log("Saved object data:", JSON.stringify(updatedObject, null, 2));

  return new Promise((resolve) =>
    setTimeout(() => resolve(updatedObject), 500)
  );
};

export const saveRobot = async (robot: IRobot): Promise<IRobot> => {
  const updatedRobot: IRobot = {
    ...robot,
    updated_at: new Date().toISOString(),
  };

  console.log("Saved robot data:", JSON.stringify(updatedRobot, null, 2));

  return new Promise((resolve) => setTimeout(() => resolve(updatedRobot), 500));
};
