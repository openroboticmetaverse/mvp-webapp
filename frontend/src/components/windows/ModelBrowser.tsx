import React, { useEffect, useMemo, useState, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { libraryStore } from "@/stores/library-store";
import { objectStore, robotStore } from "@/stores/scene-store";
import { IReferenceObject, IReferenceRobot } from "@/types/Interfaces";
import WindowCard from "@/components/ui/window-card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Box,
  Cylinder,
  Globe,
  Goal,
  Square,
  Torus,
  Search,
  RefreshCw,
  Ban,
} from "lucide-react";

interface ModelInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  type: "primitive" | "object" | "robot";
  reference?: string;
}

const ModelItem: React.FC<{ model: ModelInfo }> = React.memo(
  ({ model }) => {
    const handleModelClick = useCallback(async () => {
      try {
        if (model.type === "object" && model.reference) {
          await objectStore.createObjectFromReference(model.reference);
        } else if (model.type === "robot" && model.reference) {
          await robotStore.createRobotFromReference(model.reference);
        } else if (model.type === "primitive") {
          console.log("Creating primitive shape:", model.name);
        }
      } catch (error) {
        console.error("Error creating model:", error);
      }
    }, [model.type, model.reference, model.name]);

    return (
      <HoverCard key={model.id} openDelay={200} closeDelay={200}>
        <HoverCardTrigger asChild>
          <div
            onClick={handleModelClick}
            className="rounded border border-gray-300 p-1 hover:bg-white hover:bg-opacity-25 cursor-pointer w-full h-full flex flex-col items-center justify-center transition-colors duration-200"
          >
            <div className="text-white">{model.icon}</div>
            <div className="text-sm mt-1 truncate text-gray-100">
              {model.name}
            </div>
          </div>
        </HoverCardTrigger>
        <HoverCardContent className="w-60">
          <WindowCard
            description={
              <>
                <span>{model.description}</span>
                <br />
                <span className="text-xs font-mono text-green-700">
                  Model ID: <code>{model.id}</code>
                </span>
              </>
            }
            title={model.name}
          />
        </HoverCardContent>
      </HoverCard>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison function to prevent unnecessary re-renders
    return (
      prevProps.model.id === nextProps.model.id &&
      prevProps.model.name === nextProps.model.name &&
      prevProps.model.type === nextProps.model.type
    );
  }
);

const ModelGrid: React.FC<{ models: ModelInfo[] }> = React.memo(
  ({ models }) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {models.map((model) => (
        <ModelItem key={model.id} model={model} />
      ))}
    </div>
  )
);

const ModelBrowser: React.FC = observer(() => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    libraryStore.fetchLibraryData();
  }, []);

  const handleRefresh = useCallback(async () => {
    await libraryStore.fetchLibraryData();
  }, []);

  const primitiveShapes: ModelInfo[] = useMemo(
    () => [
      {
        id: "cube",
        name: "Cube",
        description: "A basic cube",
        icon: <Box size={32} />,
        type: "primitive",
      },
      {
        id: "sphere",
        name: "Sphere",
        description: "A basic sphere",
        icon: <Globe size={32} />,
        type: "primitive",
      },
      {
        id: "cylinder",
        name: "Cylinder",
        description: "A basic cylinder",
        icon: <Cylinder size={32} />,
        type: "primitive",
      },
      {
        id: "plane",
        name: "Plane",
        description: "A basic plane",
        icon: <Square size={32} />,
        type: "primitive",
      },
      {
        id: "torus",
        name: "Torus",
        description: "A basic torus",
        icon: <Torus size={32} />,
        type: "primitive",
      },
      {
        id: "goal",
        name: "Goal",
        description: "A goal position",
        icon: <Goal size={32} />,
        type: "primitive",
      },
    ],
    []
  );

  const referenceObjects: ModelInfo[] = useMemo(
    () =>
      libraryStore.referenceObjects.map((obj: IReferenceObject) => ({
        id: obj.id,
        name: obj.name,
        description: obj.description,
        icon: <Box size={32} />,
        type: "object" as const,
        reference: obj.id,
      })),
    [libraryStore.referenceObjects]
  );

  const referenceRobots: ModelInfo[] = useMemo(
    () =>
      libraryStore.referenceRobots.map((robot: IReferenceRobot) => ({
        id: robot.id,
        name: robot.name,
        description: robot.description,
        icon: <Bot size={32} />,
        type: "robot" as const,
        reference: robot.id,
      })),
    [libraryStore.referenceRobots]
  );

  const filterModels = useCallback(
    (models: ModelInfo[]) =>
      models.filter(
        (model) =>
          model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          model.description.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm]
  );

  if (libraryStore.state && libraryStore.state.status === "loading") {
    return (
      <div className="flex justify-center items-center h-full">
        <RefreshCw className="animate-spin text-gray-100" />
      </div>
    );
  }

  if (libraryStore.state && libraryStore.state.status === "error") {
    return (
      <div className="text-red-500">Error: {libraryStore.state.error}</div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-4 text-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold">Model Browser</h2>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Search models..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-700 text-gray-800"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-800"
            size={20}
          />
        </div>
        <Button
          variant="secondary"
          size="icon"
          onClick={handleRefresh}
          disabled={libraryStore.state && libraryStore.state.status === "loading"}
          title="Refresh models"
          className="rounded border hover:bg-white hover:bg-opacity-25 hover:text-gray-300"
        >
          <RefreshCw
            className={`h-4 w-4 ${libraryStore.state && libraryStore.state.status === "loading" ? "animate-spin" : ""}`}
          />
        </Button>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-8">
          <section className="relative">
            <h3 className="text-xl font-semibold mb-4">Primitive Shapes</h3>
            <div className="relative">
              <ModelGrid models={filterModels(primitiveShapes)} />
              <div className="absolute inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center rounded-lg">
                <div className="bg-white/80 px-4 py-3 rounded-lg shadow-lg flex flex-col items-center gap-2">
                  <Ban size={24} className="text-red-800" />
                  <span className="text-red-800 font-medium">Currently Disabled</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Custom Objects</h3>
            <ModelGrid models={filterModels(referenceObjects)} />
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Robots</h3>
            <ModelGrid models={filterModels(referenceRobots)} />
          </section>
        </div>
      </ScrollArea>
    </div>
  );
});

export default ModelBrowser;
