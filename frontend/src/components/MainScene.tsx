import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { observer } from "mobx-react";
import { sceneStore } from "@/stores/scene-store";
import SceneContent from "./3d/SceneContent";
import LoadingScreen from "./ui/LoadingScreen";
import WebGLNotSupported from "./ui/WebGLNotSupported";
import { useToast } from "@/hooks/use-toast";
import { errorLoggingService } from "@/services/error-logging-service";
import NoSceneSelected from "./ui/NoSceneSelected";

/**
 * MainScene component handles the rendering of the 3D scene and various states.
 * It uses MobX for state management and react-three-fiber for 3D rendering.
 * It also integrates with the error logging service for better error handling.
 */
const MainScene: React.FC = observer(() => {
  const { toast } = useToast();

  useEffect(() => {
    // Show toast messages and log errors based on the scene store state
    if (sceneStore.state.status === "error") {
      const errorMessage =
        sceneStore.state.error || "An unknown error occurred";
      errorLoggingService.error("Scene loading error", new Error(errorMessage));
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } else if (
      sceneStore.state.status === "success" &&
      !sceneStore.activeScene
    ) {
      errorLoggingService.warn("No scene selected");
      toast({
        title: "No Scene Selected",
        description: "Please select a scene from the Scene Selector.",
      });
    } else if (
      sceneStore.state.status === "success" &&
      sceneStore.activeScene
    ) {
      errorLoggingService.info(`Scene loaded: ${sceneStore.activeScene.name}`);
    }
  }, [sceneStore.state.status, sceneStore.activeScene, toast]);

  /**
   * Render appropriate content based on the current state of the scene store
   */
  const renderContent = () => {
    switch (sceneStore.state.status) {
      case "loading":
        return <LoadingScreen />;
      case "success":
        if (sceneStore.activeSceneId) {
          return (
            <Canvas
              camera={{ position: [20, 7, 12], fov: 60, near: 0.1, far: 200 }}
              style={{ background: "#242625" }}
              className="m-0 w-full h-full absolute"
              dpr={[0.8, 2]}
              fallback={<WebGLNotSupported />}
              onCreated={() =>
                errorLoggingService.info("Canvas created successfully")
              }
            >
              <SceneContent />
            </Canvas>
          );
        }
        // If no active scene, we'll show an empty div and let the toast handle the notification
        return <div className="w-full h-full bg-[#121212]"></div>;
      case "error":
        return (
          <div className="w-full h-full flex items-center justify-center bg-[#121212] text-red-500">
            Error loading scene
          </div>
        );
      default:
        return <NoSceneSelected />;
    }
  };

  return <div className="w-screen h-screen">{renderContent()}</div>;
});

export default MainScene;
