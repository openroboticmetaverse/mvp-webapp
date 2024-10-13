import React, { useEffect, useState, useCallback } from "react";
import { Observer, observer } from "mobx-react-lite";
import { sceneStore } from "@/stores/scene-store";
import { errorStore } from "@/stores/error-store";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

// Memoized scene item component
interface SceneItemProps {
  scene: IScene;
  isActive: boolean;
  onSelect: (scene: IScene) => void;
}

const SceneItem: React.FC<SceneItemProps> = React.memo(
  ({ scene, isActive, onSelect }) => (
    <HoverCard key={scene.id} openDelay={200} closeDelay={200}>
      <HoverCardTrigger asChild>
        <button
          onClick={() => onSelect(scene)}
          className={`w-full aspect-square rounded-lg border ${
            isActive
              ? "border-blue-500 bg-blue-500 bg-opacity-25"
              : "border-gray-300 hover:bg-white hover:bg-opacity-25"
          } p-2 transition-colors duration-200 flex flex-col items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-gray-200`}
        >
          <FileAxis3D className="h-12 w-12 text-white" />
          <span className="text-sm font-medium truncate w-full text-center text-white">
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
  )
);

const SceneSelector = observer(() => {
  const [newSceneName, setNewSceneName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (
      sceneStore.items.length === 0 &&
      sceneStore.state.status !== "loading"
    ) {
      sceneStore.fetchScenes();
    }
  }, []);

  const handleSceneSelect = useCallback(async (scene: IScene) => {
    sceneStore.setActiveScene(scene.id);
    await sceneStore.fetchSceneData(scene.id);
  }, []);

  const handleNewScene = useCallback(async () => {
    if (!newSceneName.trim()) {
      errorStore.addError(new Error("Please enter a scene name."));
      return;
    }
    try {
      const newScene = await sceneStore.createScene({
        name: newSceneName.trim(),
      });
      setNewSceneName("");
      setIsDialogOpen(false);
      await handleSceneSelect(newScene);
    } catch (err) {
      // Error is already handled in the store
    }
  }, [newSceneName, handleSceneSelect]);

  const handleRefresh = useCallback(async () => {
    await sceneStore.fetchScenes();
    if (sceneStore.activeSceneId) {
      await sceneStore.fetchSceneData(sceneStore.activeSceneId);
    }
  }, []);

  return (
    <Observer>
      {() => (
        <div className="flex flex-col h-full">
          <div className="flex-shrink-0 flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-100">Scene Selector</h2>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleRefresh}
                disabled={sceneStore.state.status === "loading"}
                title="Refresh scenes"
                className="rounded border hover:bg-white hover:bg-opacity-25 hover:text-gray-300"
              >
                <RefreshCw
                  className={`h-4 w-4 ${sceneStore.state.status === "loading" ? "animate-spin" : ""}`}
                />
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    disabled={sceneStore.state.status === "loading"}
                    title="Create new scene"
                    className="rounded border hover:bg-white hover:bg-opacity-25 hover:text-gray-300"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="bg-white bg-opacity-10 backdrop-blur-sm"
                  aria-describedby="dialog-description"
                >
                  <DialogHeader>
                    <DialogTitle className="text-gray-100">
                      Create New Scene
                    </DialogTitle>
                    <DialogDescription>
                      Enter a name for your new scene below.
                    </DialogDescription>
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

          {sceneStore.state.status === "error" && (
            <Alert
              variant="destructive"
              className="bg-red-900 text-red-300 border-red-800 mb-4"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{sceneStore.state.error}</AlertDescription>
            </Alert>
          )}

          <div className="flex-grow overflow-hidden">
            {sceneStore.state.status === "loading" ? (
              <div className="flex justify-center items-center h-full">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : sceneStore.items.length > 0 ? (
              <div className="h-full flex flex-col">
                <h3 className="text-xl font-semibold mb-2 text-gray-100">
                  Available Scenes
                </h3>
                <ScrollArea className="flex-grow">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                    {sceneStore.items.map((scene) => (
                      <Observer key={scene.id}>
                        {() => (
                          <SceneItem
                            scene={scene}
                            isActive={sceneStore.activeSceneId === scene.id}
                            onSelect={handleSceneSelect}
                          />
                        )}
                      </Observer>
                    ))}
                  </div>
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
      )}
    </Observer>
  );
});

export default SceneSelector;
