import React, { useEffect, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { observer } from "mobx-react";
import { sceneStore } from "@/stores/scene-store";
import SceneContent from "./3d/SceneContent";
import LoadingScreen from "./ui/LoadingScreen";
import WebGLNotSupported from "./ui/WebGLNotSupported";

const MainScene: React.FC = observer(() => {
  useEffect(() => {
    // Fetch scenes if not already loaded
    if (sceneStore.scenes.length === 0) {
      sceneStore.fetchScenes();
    }

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (sceneStore.hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  useEffect(() => {
    if (sceneStore.selectedScene) {
      console.log("Fetching scene data...");
      sceneStore.fetchSceneData(sceneStore.selectedScene.id);
    }
  }, [sceneStore.selectedScene]);

  const handleSaveScene = useCallback(async () => {
    try {
      await sceneStore.saveChanges();
      console.log("Scene saved successfully");
    } catch (error) {
      console.error("Error saving scene:", error);
    }
  }, []);

  if (sceneStore.isLoading) {
    return <LoadingScreen />;
  }

  if (sceneStore.error) {
    return <div>Error: {sceneStore.error}</div>;
  }

  if (!sceneStore.selectedScene) {
    return (
      <div>
        No scene selected. Please select a scene from the Scene Selector.
      </div>
    );
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        camera={{ position: [20, 7, 12], fov: 60, near: 0.1, far: 200 }}
        style={{ background: "#242625" }}
        className="m-0 w-full h-full absolute"
        dpr={[0.8, 2]}
        fallback={<WebGLNotSupported />}
      >
        <SceneContent />
      </Canvas>

      <button
        onClick={handleSaveScene}
        style={{ position: "absolute", bottom: 20, right: 20 }}
        disabled={!sceneStore.hasUnsavedChanges()}
      >
        {sceneStore.hasUnsavedChanges() ? "Save Changes" : "No Changes to Save"}
      </button>
    </div>
  );
});

export default MainScene;
