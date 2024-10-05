import React, { useEffect, useState, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
  StatsGl,
  TransformControls,
} from "@react-three/drei";
import { Object3D } from "three";
import { fetchSceneData, SceneData } from "../../api/sceneService";
import { renderObject } from "./renderObject";
import { renderRobot } from "./renderRobot";
import LoadingScreen from "../ui/LoadingScreen";
import { saveScene } from "@/api/mockAPIService";
import WebGLNotSupported from "../ui/WebGLNotSupported";

interface MainSceneProps {
  sceneId: string;
}

const MainScene: React.FC<MainSceneProps> = ({ sceneId }) => {
  const [sceneData, setSceneData] = useState<SceneData | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const loadSceneData = async () => {
      const data = await fetchSceneData(sceneId);
      setSceneData(data);
    };

    loadSceneData();
  }, [sceneId]);

  const handleSaveScene = async () => {
    if (!sceneData) return;

    try {
      await saveScene(sceneData.objects);
      console.log("Scene saved successfully");
    } catch (error) {
      console.error("Error saving scene:", error);
    }
  };

  if (!sceneData) {
    return <LoadingScreen />;
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        camera={{ position: [20, 7, 12], fov: 60, near: 0.1, far: 200 }}
        style={{ background: "#242625" }}
        className="m-0 w-full h-full absolute"
        dpr={[0.8, 2]} // Change Device Pixel Ratio for performance: lower is better
        fallback={
          <>
            <WebGLNotSupported />
          </>
        }
      >
        <SceneContent
          sceneData={sceneData}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
        />
      </Canvas>

      <button
        onClick={handleSaveScene}
        style={{ position: "absolute", bottom: 20, right: 20 }}
      >
        Save Scene
      </button>
    </div>
  );
};

// Separate component for scene content to use hooks
const SceneContent: React.FC<{
  sceneData: SceneData;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}> = ({ sceneData, selectedId, setSelectedId }) => {
  const { scene } = useThree();
  const objectsRef = useRef<{ [key: string]: Object3D }>({});

  useEffect(() => {
    // Clean up objects when component unmounts
    return () => {
      Object.values(objectsRef.current).forEach((obj) => {
        scene.remove(obj);
      });
    };
  }, [scene]);

  const handleObjectChange = (event: any) => {
    const target = event.target.object;
    console.log("Object transformed:", target);
    // Update your scene data here based on the new transform
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

      {sceneData.objects.map((obj) => (
        <ObjectWrapper
          key={obj.id}
          obj={obj}
          setSelectedId={setSelectedId}
          objectsRef={objectsRef}
        />
      ))}

      {sceneData.robots.map((robot) => (
        <RobotWrapper
          key={robot.id}
          robot={robot}
          setSelectedId={setSelectedId}
          objectsRef={objectsRef}
        />
      ))}

      {selectedId && objectsRef.current[selectedId] && (
        <TransformControls
          object={objectsRef.current[selectedId]}
          onObjectChange={handleObjectChange}
        />
      )}
    </>
  );
};

const ObjectWrapper: React.FC<{
  obj: any; // Replace with proper type
  setSelectedId: (id: string | null) => void;
  objectsRef: React.MutableRefObject<{ [key: string]: Object3D }>;
}> = ({ obj, setSelectedId, objectsRef }) => {
  const { scene } = useThree();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const object = new Object3D();
    object.position.set(...obj.position);
    object.rotation.set(...obj.orientation);
    object.scale.set(...obj.scale);

    scene.add(object);
    objectsRef.current[obj.id] = object;
    setIsReady(true);

    return () => {
      scene.remove(object);
      delete objectsRef.current[obj.id];
    };
  }, [obj, scene, objectsRef]);

  if (!isReady) return null;

  return (
    <primitive
      object={objectsRef.current[obj.id]}
      onClick={() => setSelectedId(obj.id)}
    >
      {renderObject(obj, setSelectedId)}
    </primitive>
  );
};

const RobotWrapper: React.FC<{
  robot: any; // Replace with proper type
  setSelectedId: (id: string | null) => void;
  objectsRef: React.MutableRefObject<{ [key: string]: Object3D }>;
}> = ({ robot, setSelectedId, objectsRef }) => {
  const { scene } = useThree();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const object = new Object3D();
    object.position.set(...robot.position);
    object.rotation.set(...robot.orientation);
    object.scale.set(...robot.scale);

    scene.add(object);
    objectsRef.current[robot.id] = object;
    setIsReady(true);

    return () => {
      scene.remove(object);
      delete objectsRef.current[robot.id];
    };
  }, [robot, scene, objectsRef]);

  if (!isReady) return null;

  return (
    <primitive
      object={objectsRef.current[robot.id]}
      onClick={() => setSelectedId(robot.id)}
    >
      {renderRobot(robot, setSelectedId)}
    </primitive>
  );
};

export default MainScene;
