import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { createScene, fetchScenes } from "@/services/api";
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

// Define the props for the SceneSelector component
interface SceneSelectorProps {
  onSceneSelect: (sceneId: string) => void;
}

/**
 * SceneSelector Component
 *
 * This component allows users to view, select, and create scenes.
 * It fetches scenes from an API, displays them in a grid, and provides
 * functionality to create new scenes.
 *
 * @param {SceneSelectorProps} props - The props for the SceneSelector component
 * @returns {JSX.Element} The rendered SceneSelector component
 */
const SceneSelector = observer(
  ({ onSceneSelect }: SceneSelectorProps): JSX.Element => {
    // State variables
    const [newSceneName, setNewSceneName] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Load scenes on component mount
    useEffect(() => {
      loadScenes();
    }, []);

    /**
     * Fetch scenes from the API and update the store
     */
    const loadScenes = async () => {
      sceneStore.isLoading = true;
      sceneStore.error = null;
      try {
        const fetchedScenes = await fetchScenes();
        sceneStore.sceneData = fetchedScenes;
      } catch (err) {
        sceneStore.error = "Failed to load scenes. Please try again.";
      } finally {
        sceneStore.isLoading = false;
      }
    };

    /**
     * Handle scene selection
     * @param {string} sceneId - The ID of the selected scene
     */
    const handleSceneSelect = (sceneId: string) => {
      sceneStore.fetchScene(sceneId);
      onSceneSelect(sceneId);
    };

    /**
     * Create a new scene
     */
    const handleNewScene = async () => {
      if (!newSceneName.trim()) {
        sceneStore.error = "Please enter a scene name.";
        return;
      }
      try {
        const newScene = await createScene({ name: newSceneName.trim() });
        await sceneStore.fetchScene(newScene.id);
        handleSceneSelect(newScene.id);
        setNewSceneName("");
        setIsDialogOpen(false);
      } catch (err) {
        sceneStore.error = "Failed to create new scene. Please try again.";
      }
    };

    /**
     * Render the list of scenes
     * @param {IScene[]} scenes - The array of scenes to render
     * @returns {JSX.Element} The rendered list of scenes
     */
    const renderSceneList = (scenes: IScene[]) => (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {scenes.map((scene) => (
          <HoverCard key={scene.id} openDelay={200} closeDelay={200}>
            <HoverCardTrigger asChild>
              <button
                onClick={() => handleSceneSelect(scene.id)}
                className="w-full h-24 rounded-lg border border-gray-700 hover:bg-white hover:bg-opacity-25 p-4 transition-colors duration-200 flex flex-col items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <FileAxis3D className="h-10 w-10 text-white" />
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
      <div className="text-gray-300">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-100">Scene Selector</h2>
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={loadScenes}
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
                  className="rounded border hover:bg-white hover:bg-opacity-25 hover:text-gray-300 "
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white bg-opacity-10 backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle className="text-gray-100 ">
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
                    className="rounded  hover:bg-white p-2 hover:bg-opacity-25 bg-gray-100 text-gray-900"
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
            className="bg-red-900 text-red-300 border-red-800 mb-6"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{sceneStore.error}</AlertDescription>
          </Alert>
        )}

        {sceneStore.isLoading ? (
          <div className="flex justify-center items-center h-48">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : sceneStore.sceneData && sceneStore.sceneData.length > 0 ? (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-100">
              Available Scenes
            </h3>
            {renderSceneList(sceneStore.sceneData)}
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
    );
  }
);

export default SceneSelector;
