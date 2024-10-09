import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { observer } from "mobx-react";
import { sceneStore } from "@/stores/scene-store";
import SceneContent from "./3d/SceneContent";
import LoadingScreen from "./ui/LoadingScreen";
import WebGLNotSupported from "./ui/WebGLNotSupported";
import { useToast } from "@/hooks/use-toast";

/**
 * MainScene component handles the rendering of the 3D scene and various states.
 * It uses MobX for state management and react-three-fiber for 3D rendering.
 */
const MainScene: React.FC = observer(() => {
  const { toast } = useToast();

  useEffect(() => {
    // Show toast messages based on the scene store state
    if (sceneStore.state.status === "error") {
      toast({
        variant: "destructive",
        title: "Error",
        description: sceneStore.state.error,
      });
    } else if (
      sceneStore.state.status === "success" &&
      !sceneStore.activeScene
    ) {
      toast({
        title: "No Scene Selected",
        description: "Please select a scene from the Scene Selector.",
      });
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
        if (sceneStore.activeScene) {
          return (
            <Canvas
              camera={{ position: [20, 7, 12], fov: 60, near: 0.1, far: 200 }}
              style={{ background: "#242625" }}
              className="m-0 w-full h-full absolute"
              dpr={[0.8, 2]}
              fallback={<WebGLNotSupported />}
            >
              <SceneContent />
            </Canvas>
          );
        }
        // If no active scene, we'll show an empty div and let the toast handle the notification
        return <div className="w-full h-full" />;
      default:
        return <div className="w-full h-full" />;
    }
  };

  return <div className="w-screen h-screen">{renderContent()}</div>;
});

export default MainScene;
