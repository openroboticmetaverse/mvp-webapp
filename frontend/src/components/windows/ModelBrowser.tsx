import { useCallback } from "react";
import { observer } from "mobx-react-lite";
import WindowCard from "@/components/ui/window-card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Bot, Box, Cylinder, Globe, Goal, Square, Torus } from "lucide-react";
import { sceneStore } from "@/stores/scene-store";
import { IObject, IRobot } from "@/types/Interfaces";

interface ModelInfo {
  name: string;
  description: string;
  icon: React.ReactNode;
  type: "object" | "robot";
  objectReference?: string;
  robotReference?: string;
}

const ModelBrowser: React.FC = observer(() => {
  const shapesList: ModelInfo[] = [
    {
      name: "Cube",
      description: "A basic cube",
      icon: <Box size={50} />,
      type: "object",
      objectReference: "cube",
    },
    {
      name: "Sphere",
      description: "A basic sphere",
      icon: <Globe size={50} />,
      type: "object",
      objectReference: "sphere",
    },
    {
      name: "Cylinder",
      description: "A basic cylinder",
      icon: <Cylinder size={50} />,
      type: "object",
      objectReference: "cylinder",
    },
    {
      name: "Plane",
      description: "A basic plane",
      icon: <Square size={50} />,
      type: "object",
      objectReference: "plane",
    },
    {
      name: "Torus",
      description: "A basic torus",
      icon: <Torus size={50} />,
      type: "object",
      objectReference: "torus",
    },
    {
      name: "Goal",
      description: "A goal position",
      icon: <Goal size={50} />,
      type: "object",
      objectReference: "goal",
    },
  ];

  const robotsList: ModelInfo[] = [
    {
      name: "Franka",
      description: "A Franka Emika robot arm",
      icon: <Bot size={50} />,
      type: "robot",
      robotReference: "franka",
    },
    {
      name: "Sawyer",
      description: "A Sawyer robot arm",
      icon: <Bot size={50} />,
      type: "robot",
      robotReference: "sawyer",
    },
    {
      name: "Motocortex",
      description: "A Motocortex robot arm",
      icon: <Bot size={50} />,
      type: "robot",
      robotReference: "motocortex",
    },
  ];

  const handleAddModel = useCallback(
    (modelInfo: ModelInfo) => {
      if (!sceneStore.sceneData) {
        console.warn("No active scene to add model to");
        return;
      }

      const newId = `${modelInfo.type}_${Date.now()}`;
      const commonData = {
        id: newId,
        name: modelInfo.name,
        description: modelInfo.description,
        scene_id: sceneStore.sceneData.id,
        position: [0, 0, 0] as [number, number, number],
        orientation: [0, 0, 0] as [number, number, number],
        scale: [1, 1, 1] as [number, number, number],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (modelInfo.type === "object") {
        const newObject: IObject = {
          ...commonData,
          color: "#FFFFFF", // Default color
          object_reference: modelInfo.objectReference!,
        };
        sceneStore.addObject(newObject);
      } else if (modelInfo.type === "robot") {
        const newRobot: IRobot = {
          ...commonData,
          joint_angles: [0, 0, 0], // Default joint angles
          robot_reference: modelInfo.robotReference!,
        };
        sceneStore.addRobot(newRobot);
      }

      sceneStore.setSelectedId(newId);
    },
    [sceneStore]
  );

  const renderModelList = useCallback(
    (models: ModelInfo[]) => (
      <div className="flex flex-wrap gap-6">
        {models.map((model) => (
          <HoverCard key={model.name} openDelay={200} closeDelay={200}>
            <HoverCardTrigger>
              <div
                onClick={() => handleAddModel(model)}
                className="rounded border hover:bg-white p-2 hover:bg-opacity-25 hover:text-muted cursor-pointer"
              >
                {model.icon}
              </div>
            </HoverCardTrigger>
            <HoverCardContent>
              <WindowCard description={model.description} title={model.name} />
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    ),
    [handleAddModel]
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
});

export default ModelBrowser;
