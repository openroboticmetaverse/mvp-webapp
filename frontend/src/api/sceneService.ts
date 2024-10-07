import { SceneData } from "../types/Interfaces";
export const fetchSceneData = async (sceneId: string): Promise<SceneData> => {
  // Simulated fake data
  const fakeData: SceneData = {
    id: "1",
    name: "Sample Scene",
    description: "This is a sample scene with objects and robots.",
    user_id: "Karim",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    objects: [
      {
        id: "001",
        name: "Object 1",
        description: "This is object 1",
        position: [0, 0, 0],
        orientation: [0, 0, 0],
        scale: [1, 1, 1],
        color: "red",
        objectReference: "ref1",
      },
      {
        id: "002",
        name: "Object 2",
        description: "This is object 2",
        position: [4, 0, 0],
        orientation: [0, 0, 0],
        scale: [1, 1, 1],
        color: "blue",
        objectReference: "ref2",
      },
    ],
    robots: [
      {
        id: "003",
        name: "Robot 1",
        description: "This is robot 1",
        position: [2, 0, 0],
        orientation: [0, 0, 0],
        scale: [1, 1, 1],
        jointAngles: [0, 0, 0],
        robotReference: "refRobot1",
      },
    ],
  };

  /*   if (Math.random() < 0.1) {
    // 10% chance of error
    throw new Error("Failed to fetch scene data");
  } */

  return new Promise((resolve) => setTimeout(() => resolve(fakeData), 2000));
};

export const saveSceneData = async (
  sceneData: SceneData
): Promise<SceneData> => {
  // Simulating an API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Update the updated_at timestamp
  const updatedScene: SceneData = {
    ...sceneData,
    updated_at: new Date().toISOString(),
  };

  // Log the saved scene data
  console.log("Saved scene data:", JSON.stringify(updatedScene, null, 2));

  // Simulate potential errors
  /*   if (Math.random() < 0.1) {
    // 10% chance of error
    throw new Error("Failed to save scene data");
  } */

  // In a real implementation, you would send this data to your backend
  // For now, we'll just resolve the promise to simulate a successful save
  return updatedScene;
};
