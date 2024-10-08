import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { sceneStore } from "@/stores/scene-store";
import { IScene } from "@/types/Interfaces";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Plus, RefreshCw, AlertCircle, FileAxis3D } from "lucide-react";
import WindowCard from "../ui/window-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

const SceneSelector = observer(() => {
  const [newSceneName, setNewSceneName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSceneSelect = (scene: IScene) => {
    sceneStore.setSelectedScene(scene);
  };

  const handleNewScene = async () => {
    if (!newSceneName.trim()) {
      sceneStore.setError("Please enter a scene name.");
      return;
    }
    try {
      await sceneStore.createNewScene(newSceneName.trim());
      setNewSceneName("");
      setIsDialogOpen(false);
    } catch (err) {
      sceneStore.setError("Failed to create new scene. Please try again.");
    }
  };

  const renderSceneList = (scenes: IScene[]) => (
    <div className="grid grid-cols-2 gap-4 p-4">
      {scenes.map((scene) => (
        <HoverCard key={scene.id} openDelay={200} closeDelay={200}>
          <HoverCardTrigger asChild>
            <button
              onClick={() => handleSceneSelect(scene)}
              className={`w-full aspect-square rounded-lg border ${
                sceneStore.selectedScene?.id === scene.id
                  ? "border-blue-500 bg-blue-500 bg-opacity-25"
                  : "border-gray-300 hover:bg-white hover:bg-opacity-25"
              } p-2 transition-colors duration-200 flex flex-col items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-gray-200`}
            >
              <FileAxis3D className="h-8 w-8 text-white" />
              <span className="text-xs font-medium truncate w-full text-center text-white">
                {scene.name}
              </span>
            </button>
          </HoverCardTrigger>
          <HoverCardContent>
            <WindowCard
              title={scene.name}
              description={
                <span className="text-xs font-mono text-green-700">
                  Scene ID: <code>{scene.id}</code>
                </span>
              }
              lastUpdated={new Intl.DateTimeFormat(undefined, {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(scene.updated_at))}
            />
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex-shrink-0 flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-100">Scene Selector</h2>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => sceneStore.fetchScenes()}
            disabled={sceneStore.isLoading}
            title="Refresh scenes"
            className="rounded border hover:bg-white hover:bg-opacity-25 hover:text-gray-300"
          >
            <RefreshCw
              className={`h-4 w-4 ${sceneStore.isLoading ? "animate-spin" : ""}`}
            />
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                disabled={sceneStore.isLoading}
                title="Create new scene"
                className="rounded border hover:bg-white hover:bg-opacity-25 hover:text-gray-300"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white bg-opacity-10 backdrop-blur-sm">
              <DialogHeader>
                <DialogTitle className="text-gray-100">
                  Create New Scene
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  id="name"
                  placeholder="Enter scene name"
                  value={newSceneName}
                  onChange={(e) => setNewSceneName(e.target.value)}
                  className="bg-gray-100"
                />
                <Button
                  onClick={handleNewScene}
                  className="rounded hover:bg-white p-2 hover:bg-opacity-25 bg-gray-100 text-gray-900"
                >
                  Create Scene
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {sceneStore.error && (
        <Alert
          variant="destructive"
          className="bg-red-900 text-red-300 border-red-800 mb-4"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{sceneStore.error}</AlertDescription>
        </Alert>
      )}

      <div className="flex-grow overflow-hidden">
        {sceneStore.isLoading ? (
          <div className="flex justify-center items-center h-full">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : sceneStore.scenes.length > 0 ? (
          <div className="h-full flex flex-col">
            <h3 className="text-xl font-semibold mb-2 text-gray-100">
              Available Scenes
            </h3>
            <ScrollArea className="flex-grow">
              {renderSceneList(sceneStore.scenes)}
            </ScrollArea>
          </div>
        ) : (
          <Alert className="bg-gray-800 text-gray-300 border-gray-700">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Scenes Available</AlertTitle>
            <AlertDescription>
              Create a new scene to get started.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
});

export default SceneSelector;
