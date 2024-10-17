import React, { useRef, useCallback, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { observer } from "mobx-react-lite";
import * as THREE from "three";
import { sceneStore, objectStore, robotStore } from "@/stores/scene-store";
import SceneObject from "./SceneObject";
import SceneRobot from "./SceneRobot";
import CustomTransformControls from "./CustomTransformControls";
import SceneEnvironment from "./SceneEnvironment";
import { errorLoggingService } from "@/services/error-logging-service";

/**
 * SceneContent component renders the main content of the 3D scene.
 * It observes the scene, object, and robot stores to render and update scene elements.
 */
const SceneContent: React.FC = observer(() => {
  const { scene } = useThree();
  const objectRefs = useRef<{ [key: string]: THREE.Group | null }>({});

  const handleObjectChange = useCallback((event: THREE.Event) => {
    const target = event.target as THREE.Object3D;
    const id = target.userData.id as string;
    const updates = {
      position: target.position.toArray(),
      orientation: [
        target.rotation.x,
        target.rotation.y,
        target.rotation.z,
      ] as [number, number, number],
      scale: target.scale.toArray(),
    };

    if (objectStore.items.some((obj) => obj.id === id)) {
      objectStore.updateObject(id, updates);
    } else if (robotStore.items.some((robot) => robot.id === id)) {
      robotStore.updateRobot(id, updates);
    }
  }, []);

  useEffect(() => {
    if (sceneStore.selectedItem) {
      const selectedObject = objectRefs.current[sceneStore.selectedItem.id];
      if (selectedObject) {
        scene.attach(selectedObject);
      }
    }
    return () => {
      if (sceneStore.selectedItem) {
        const selectedObject = objectRefs.current[sceneStore.selectedItem.id];
        if (selectedObject && selectedObject.parent) {
          selectedObject.parent.attach(selectedObject);
        }
      }
    };
  }, [scene, sceneStore.selectedItem]);

  useEffect(() => {
    const loadSceneContents = async () => {
      if (sceneStore.activeSceneId) {
        try {
          errorLoggingService.info(
            `Loading contents for scene: ${sceneStore.activeSceneId}`
          );
          await Promise.all([
            objectStore.fetchObjects(),
            robotStore.fetchRobots(),
          ]);
          errorLoggingService.info(
            `Scene contents loaded successfully for scene: ${sceneStore.activeSceneId}`
          );
        } catch (error) {
          errorLoggingService.error(
            `Error loading scene contents for scene: ${sceneStore.activeSceneId}`,
            error as Error
          );
        }
      }
    };

    loadSceneContents();
  }, [sceneStore.activeSceneId]);

  if (!sceneStore.activeSceneId) {
    return null;
  }

  const sceneObjects = objectStore.objectsByScene(sceneStore.activeSceneId);
  const sceneRobots = robotStore.robotsByScene(sceneStore.activeSceneId);

  return (
    <>
      <SceneEnvironment />

      {sceneObjects.map((object) => (
        <SceneObject
          key={object.id}
          object={object}
          setSelectedId={(id) => sceneStore.setSelectedItem(id)}
          ref={(el) => {
            objectRefs.current[object.id] = el;
          }}
        />
      ))}

      {sceneRobots.map((robot) => (
        <SceneRobot
          key={robot.id}
          robot={robot}
          setSelectedId={(id) => sceneStore.setSelectedItem(id)}
          ref={(el) => {
            objectRefs.current[robot.id] = el;
          }}
        />
      ))}

      {sceneStore.selectedItem &&
        objectRefs.current[sceneStore.selectedItem.id] && (
          <CustomTransformControls
            object={objectRefs.current[sceneStore.selectedItem.id]!}
            onObjectChange={handleObjectChange}
          />
        )}
    </>
  );
});

export default SceneContent;
