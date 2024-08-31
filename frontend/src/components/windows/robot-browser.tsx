import WindowCard from "@/components/ui/window-card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Bot, Box, Cylinder, Globe, Goal, Square, Torus } from "lucide-react";
import useModelStore from "../../stores/model-store";
import { useCallback } from "react";

const RobotBrowser = () => {
  const { setCurrentModel, addSceneModel } = useModelStore();

  // Define the list of available models
  const shapesList = [
    {
      name: "Cube",
      description: "A basic cube",
      icon: <Box size={50} />,
      lastUpdated: "June 2024",
      id: Date.now(),
    },
    {
      name: "Sphere",
      description: "A basic sphere",
      icon: <Globe size={50} />,
      id: Date.now(),
    },
    {
      name: "Cylinder",
      description: "A basic cylinder",
      icon: <Cylinder size={50} />,
      id: Date.now(),
    },
    {
      name: "Plane",
      description: "A basic plane",
      icon: <Square size={50} />,
      id: Date.now(),
    },
    {
      name: "Torus",
      description: "A basic torus",
      icon: <Torus size={50} />,
      id: Date.now(),
    },
    {
      name: "Goal",
      description: "A goal position for the robot",
      icon: <Goal size={50} />,
      id: Date.now(),
    },
  ];

  const robotsList = [
    {
      name: "Franka",
      description: "A Franka Emika robot arm",
      icon: <Bot size={50} />,
      id: Date.now(),
    },
    {
      name: "Sawyer",
      description: "A Sawyer robot arm",
      icon: <Bot size={50} />,
      id: Date.now(),
    },
    {
      name: "Motocortex",
      description: "A Motocortex robot arm",
      icon: <Bot size={50} />,
      id: Date.now(),
      lastUpdated: "August 2024",
    },
  ];

  // Update the Zustand store when the user clicks on a model icon
  const handleSelectedModel = useCallback(
    (modelInfo: { name: string; id: number; uuid: string | null }) => {
      // Generate a unique ID for the new model
      const uniqueId = Date.now();
      const newModel = { ...modelInfo, id: uniqueId, uuid: null };

      console.log("Selected model:", newModel);

      // Set the current model and add it to the scene
      setCurrentModel(newModel);
      addSceneModel(newModel);
    },
    [setCurrentModel, addSceneModel]
  );

  const renderModelList = useCallback(
    (models: typeof shapesList) => (
      <div className="flex flex-wrap gap-6">
        {models.map(({ name, description, icon, lastUpdated }) => (
          <HoverCard
            key={`${name}-${Date.now()}`}
            openDelay={200}
            closeDelay={200}
          >
            <HoverCardTrigger>
              <div
                onClick={() =>
                  handleSelectedModel({ name, id: Date.now(), uuid: null })
                }
                className="rounded border hover:bg-white p-2
                hover:bg-opacity-25 hover:text-muted cursor-pointer"
              >
                {icon}
              </div>
            </HoverCardTrigger>
            <HoverCardContent>
              <WindowCard
                description={description}
                title={name}
                lastUpdated={lastUpdated}
              />
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
