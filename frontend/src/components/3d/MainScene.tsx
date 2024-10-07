import React, { useEffect, useState, useRef, memo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
  StatsGl,
  TransformControls,
} from "@react-three/drei";
import { Object3D } from "three";
import { observer } from "mobx-react";
import { IRobot, IObject } from "@/types/Interfaces";
import { renderObject } from "./renderObject";
import { renderRobot } from "./renderRobot";
import LoadingScreen from "../ui/LoadingScreen";
import WebGLNotSupported from "../ui/WebGLNotSupported";
import { sceneStore } from "@/stores/scene-store";

interface MainSceneProps {
  sceneId: string;
}

// Main component for the 3D scene
const MainScene: React.FC<MainSceneProps> = observer(({ sceneId }) => {
  // Fetch scene data when the component mounts or sceneId changes
  useEffect(() => {
    sceneStore.fetchScene(sceneId);
  }, [sceneId]);

  // Handler for saving the scene
  const handleSaveScene = async () => {
    await sceneStore.saveScene();
  };

  // Render loading screen while data is being fetched
  if (sceneStore.isLoading) {
    return <LoadingScreen />;
  }

  // Render error message if there's an error
  if (sceneStore.error) {
    return <div>Error: {sceneStore.error}</div>;
  }

  // Render message if no scene data is available
  if (!sceneStore.sceneData) {
    return <div>No scene data available</div>;
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
      >
        Save Scene
      </button>
    </div>
  );
});

// Component for rendering the scene content
const SceneContent: React.FC = observer(() => {
  const { scene } = useThree();
  const objectsRef = useRef<{ [key: string]: Object3D }>({});
  const [selectedObject, setSelectedObject] = useState<Object3D | null>(null);

  // Use useFrame to continuously update objects
  useFrame(() => {
    // Update objects
    sceneStore.objects.forEach((obj) => updateOrCreateObject(obj, "object"));
    sceneStore.robots.forEach((robot) => updateOrCreateObject(robot, "robot"));

    // Remove objects that are no longer in the store
    removeStaleObjects();

    // Update selected object
    updateSelectedObject();
  });

  // Function to update or create an object in the scene
  const updateOrCreateObject = (
    item: IObject | IRobot,
    type: "object" | "robot"
  ) => {
    if (!objectsRef.current[item.id]) {
      const newObject = createObject(item, type);
      scene.add(newObject);
      objectsRef.current[item.id] = newObject;
    } else {
      updateObjectProperties(objectsRef.current[item.id], item);
    }
  };

  // Function to create a new Object3D
  const createObject = (
    item: IObject | IRobot,
    type: "object" | "robot"
  ): Object3D => {
    const newObject = new Object3D();
    updateObjectProperties(newObject, item);
    newObject.userData = { id: item.id, type };
    return newObject;
  };

  // Function to update Object3D properties
  const updateObjectProperties = (object: Object3D, item: IObject | IRobot) => {
    object.position.set(item.position[0], item.position[1], item.position[2]);
    object.rotation.set(
      item.orientation[0],
      item.orientation[1],
      item.orientation[2]
    );
    object.scale.set(item.scale[0], item.scale[1], item.scale[2]);
  };

  // Function to remove stale objects from the scene
  const removeStaleObjects = () => {
    Object.keys(objectsRef.current).forEach((id) => {
      if (
        !sceneStore.objects.some((obj) => obj.id === id) &&
        !sceneStore.robots.some((robot) => robot.id === id)
      ) {
        scene.remove(objectsRef.current[id]);
        delete objectsRef.current[id];
      }
    });
  };

  // Function to update the selected object
  const updateSelectedObject = () => {
    if (sceneStore.selectedId && objectsRef.current[sceneStore.selectedId]) {
      setSelectedObject(objectsRef.current[sceneStore.selectedId]);
    } else {
      setSelectedObject(null);
    }
  };

  // Handler for object transformation
  const handleObjectChange = (event: any) => {
    const target = event.target.object;
    console.log("Object transformed:", target);
    const id = target.userData.id;
    const updates = {
      position: target.position.toArray(),
      orientation: target.rotation.toArray(),
      scale: target.scale.toArray(),
    };
    if (target.userData.type === "object") {
      sceneStore.updateObject(id, updates);
    } else if (target.userData.type === "robot") {
      sceneStore.updateRobot(id, updates);
    }
  };

  return (
    <>
      <OrbitControls makeDefault />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Grid
        args={[10, 100]}
        infiniteGrid
        fadeDistance={120}
        sectionColor={0xdee2e6}
        cellColor={0xdee2e6}
        sectionSize={10}
        cellSize={1}
        fadeStrength={2}
      />

      <StatsGl />
      <GizmoHelper alignment="bottom-right" margin={[70, 70]}>
        <GizmoViewport
          axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
          labelColor="white"
        />
      </GizmoHelper>

      {Object.entries(objectsRef.current).map(([id, obj]) => {
        const isObject = obj.userData.type === "object";
        const item = isObject
          ? sceneStore.getObjectById(id)
          : sceneStore.getRobotById(id);

        if (!item) return null;

        return (
          <primitive
            key={id}
            object={obj}
            onClick={() => sceneStore.setSelectedId(id)}
          >
            {isObject ? (
              <ObjectRenderer
                object={item as IObject}
                setSelectedId={sceneStore.setSelectedId}
              />
            ) : (
              <RobotRenderer
                robot={item as IRobot}
                setSelectedId={sceneStore.setSelectedId}
              />
            )}
          </primitive>
        );
      })}

      {selectedObject && (
        <TransformControls
          object={selectedObject}
          onObjectChange={handleObjectChange}
        />
      )}
    </>
  );
});

// Memoized component for rendering objects
const ObjectRenderer = memo(
  ({
    object,
    setSelectedId,
  }: {
    object: IObject;
    setSelectedId: (id: string | null) => void;
  }) => {
    return renderObject(object, setSelectedId);
  }
);

// Memoized component for rendering robots
const RobotRenderer = memo(
  ({
    robot,
    setSelectedId,
  }: {
    robot: IRobot;
    setSelectedId: (id: string | null) => void;
  }) => {
    return renderRobot(robot, setSelectedId);
  }
);

export default MainScene;
