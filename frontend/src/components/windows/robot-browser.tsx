import React, { useCallback } from "react";
import WindowCard from "@/components/ui/window-card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Bot, Box, Cylinder, Globe, Goal, Square, Torus } from "lucide-react";
import { useSceneStore } from "../../stores/SceneStore";
import { GeometricObject, Robot } from "../../interfaces/SceneInterfaces";

const RobotBrowser: React.FC = () => {
  const { addObject } = useSceneStore();

  // Define the list of available models
  const shapesList = [
    {
      name: "Cube",
      description: "A basic cube",
      icon: <Box size={50} />,
      shape: "box" as const,
    },
    {
      name: "Sphere",
      description: "A basic sphere",
      icon: <Globe size={50} />,
      shape: "sphere" as const,
    },
    {
      name: "Cylinder",
      description: "A basic cylinder",
      icon: <Cylinder size={50} />,
      shape: "cylinder" as const,
    },
    {
      name: "Plane",
      description: "A basic plane",
      icon: <Square size={50} />,
      shape: "box" as const,
    },
    {
      name: "Torus",
      description: "A basic torus",
      icon: <Torus size={50} />,
      shape: "torus" as const,
    },
    {
      name: "Goal",
      description: "A goal position for the robot",
      icon: <Goal size={50} />,
      shape: "sphere" as const,
    },
  ];

  const robotsList = [
    {
      name: "Franka",
      description: "A Franka Emika robot arm",
      icon: <Bot size={50} />,
      type_name: 1,
    },
    {
      name: "Sawyer",
      description: "A Sawyer robot arm",
      icon: <Bot size={50} />,
      type_name: 2,
    },
    {
      name: "Motocortex",
      description: "A Motocortex robot arm",
      icon: <Bot size={50} />,
      type_name: 3,
    },
  ];

  // Update the Zustand store when the user clicks on a model icon
  const handleSelectedModel = useCallback(
    (modelInfo: { name: string; shape?: string; type_name?: number }) => {
      const id = `${modelInfo.name.toLowerCase()}-${Date.now()}`;
      const sceneId = "scene1"; // Assuming we're working with a single scene for now

      if (modelInfo.shape) {
        // It's a geometric object
        const newObject: GeometricObject = {
          id,
          name: modelInfo.name,
          scene_id: sceneId,
          position: [0, 0, 0],
          orientation: [0, 0, 0],
          scale: [1, 1, 1],
          color: "#ffffff", // Default color
          shape: modelInfo.shape as
            | "box"
            | "sphere"
            | "cylinder"
            | "plane"
            | "torus",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        addObject(newObject);
      } else if (modelInfo.type_name) {
        // It's a robot
        /*         const newObject: Robot = {
          id,
          name: modelInfo.name,
          scene_id: sceneId,
          position: [0, 0, 0],
          orientation: [0, 0, 0],
          scale: [1, 1, 1],
          type_name: modelInfo.type_name,
          num_joints: 6, // Default number of joints
          joint_angles: [0, 0, 0, 0, 0, 0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        addObject(newObject); */
        console.log("Not implemented yet");
      }

      console.log("Added new object:", modelInfo.name);
    },
    [addObject]
  );

  const renderModelList = useCallback(
    (models: typeof shapesList | typeof robotsList) => (
      <div className="flex flex-wrap gap-6">
        {models.map(({ name, description, icon, shape, type_name }) => (
          <HoverCard
            key={`${name}-${Date.now()}`}
            openDelay={200}
            closeDelay={200}
          >
            <HoverCardTrigger>
              <div
                onClick={() => handleSelectedModel({ name, shape, type_name })}
                className="rounded border hover:bg-white p-2 hover:bg-opacity-25 hover:text-muted cursor-pointer"
              >
                {icon}
              </div>
            </HoverCardTrigger>
            <HoverCardContent>
              <WindowCard description={description} title={name} />
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    ),
    [handleSelectedModel]
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-semibold mb-4">Primitive Shapes</h2>
        {renderModelList(shapesList)}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Robots</h2>
        {renderModelList(robotsList)}
      </div>
    </div>
  );
};

export default RobotBrowser;
