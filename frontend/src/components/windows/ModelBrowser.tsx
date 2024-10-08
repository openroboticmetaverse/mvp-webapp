import { useEffect, useMemo } from "react";
import { observer } from "mobx-react-lite";
import WindowCard from "@/components/ui/window-card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Bot,
  Box,
  Cylinder,
  Globe,
  Goal,
  Loader,
  Square,
  Torus,
} from "lucide-react";
import { sceneStore } from "@/stores/scene-store";
import { IReferenceObject, IReferenceRobot } from "@/types/Interfaces";

interface ModelInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  type: "object" | "robot";
  reference: string;
}

const ModelBrowser: React.FC = observer(() => {
  useEffect(() => {
    if (sceneStore.referenceObjects.length === 0) {
      sceneStore.fetchReferenceObjects();
    }
    if (sceneStore.referenceRobots.length === 0) {
      sceneStore.fetchReferenceRobots();
    }
  }, []);
  // Predefined shapes list
  const shapesList: ModelInfo[] = useMemo(
    () => [
      {
        id: "cube",
        name: "Cube",
        description: "A basic cube",
        icon: <Box size={50} />,
        type: "object",
        reference: "cube",
      },
      {
        id: "sphere",
        name: "Sphere",
        description: "A basic sphere",
        icon: <Globe size={50} />,
        type: "object",
        reference: "sphere",
      },
      {
        id: "cylinder",
        name: "Cylinder",
        description: "A basic cylinder",
        icon: <Cylinder size={50} />,
        type: "object",
        reference: "cylinder",
      },
      {
        id: "plane",
        name: "Plane",
        description: "A basic plane",
        icon: <Square size={50} />,
        type: "object",
        reference: "plane",
      },
      {
        id: "torus",
        name: "Torus",
        description: "A basic torus",
        icon: <Torus size={50} />,
        type: "object",
        reference: "torus",
      },
      {
        id: "goal",
        name: "Goal",
        description: "A goal position",
        icon: <Goal size={50} />,
        type: "object",
        reference: "goal",
      },
    ],
    []
  );
  const referenceObjectsList: ModelInfo[] = useMemo(
    () =>
      sceneStore.referenceObjects.map((refObj: IReferenceObject) => ({
        id: refObj.id,
        name: refObj.name,
        description: refObj.description,
        icon: <Box size={50} />,
        type: "object" as const,
        reference: refObj.id,
      })),
    [sceneStore.referenceObjects]
  );

  const referenceRobotsList: ModelInfo[] = useMemo(
    () =>
      sceneStore.referenceRobots.map((refRobot: IReferenceRobot) => ({
        id: refRobot.id,
        name: refRobot.name,
        description: refRobot.description,
        icon: <Bot size={50} />,
        type: "robot" as const,
        reference: refRobot.id,
      })),
    [sceneStore.referenceRobots]
  );

  const renderModelList = (models: ModelInfo[]) => (
    <div className="flex flex-wrap gap-6">
      {models.map((model) => (
        <HoverCard key={model.id} openDelay={200} closeDelay={200}>
          <HoverCardTrigger>
            <div className="rounded border hover:bg-white p-2 hover:bg-opacity-25 hover:text-muted cursor-pointer">
              {model.icon}
            </div>
          </HoverCardTrigger>
          <HoverCardContent>
            <WindowCard description={model.description} title={model.name} />
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );

  if (sceneStore.isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-2xl font-bold text-gray-100">Model Browser</h2>
      <div>
        <h2 className="text-xl font-semibold mb-4">Primitive Shapes</h2>
        {renderModelList(shapesList)}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Custom Objects</h2>
        {renderModelList(referenceObjectsList)}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Robots</h2>
        {renderModelList(referenceRobotsList)}
      </div>
      {sceneStore.error && (
        <div className="text-red-500">{sceneStore.error}</div>
      )}
    </div>
  );
});

export default ModelBrowser;
