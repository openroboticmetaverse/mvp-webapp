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
import { observer } from "mobx-react";
import { fetchSceneData, RobotData, SceneData } from "../../api/sceneService";
import { renderObject } from "./renderObject";
import { renderRobot } from "./renderRobot";
import LoadingScreen from "../ui/LoadingScreen";
import { ObjectData, saveScene } from "@/api/mockAPIService";
import WebGLNotSupported from "../ui/WebGLNotSupported";
import { sceneStore } from "@/stores/scene-store";

interface MainSceneProps {
  sceneId: string;
}

const MainScene: React.FC<MainSceneProps> = observer(({ sceneId }) => {
  useEffect(() => {
    sceneStore.fetchScene(sceneId);
  }, [sceneId]);

  const handleSaveScene = async () => {
    await sceneStore.saveScene();
  };

  if (sceneStore.isLoading) {
    return <LoadingScreen />;
  }

  if (sceneStore.error) {
    return <div>Error: {sceneStore.error}</div>;
  }

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

// Separate component for scene content to use hooks
const SceneContent: React.FC = observer(() => {
  const { scene } = useThree();
  const objectsRef = useRef<{ [key: string]: Object3D }>({});

  useEffect(() => {
    return () => {
      Object.values(objectsRef.current).forEach((obj) => {
        scene.remove(obj);
      });
    };
  }, [scene]);

  const handleObjectChange = (event: any) => {
    const target = event.target.object;
    console.log("Object transformed:", target);
    const id = target.userData.id;
    sceneStore.updateObject(id, {
      position: target.position.toArray(),
      orientation: target.rotation.toArray(),
      scale: target.scale.toArray(),
    });
  };

  if (!sceneStore.sceneData) return null;

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

      {sceneStore.sceneData.objects.map((obj) => (
        <ObjectWrapper
          key={obj.id}
          obj={obj}
          setSelectedId={sceneStore.setSelectedId}
          objectsRef={objectsRef}
        />
      ))}

      {sceneStore.sceneData.robots.map((robot) => (
        <RobotWrapper
          key={robot.id}
          robot={robot}
          setSelectedId={sceneStore.setSelectedId}
          objectsRef={objectsRef}
        />
      ))}

      {sceneStore.selectedId && objectsRef.current[sceneStore.selectedId] && (
        <TransformControls
          object={objectsRef.current[sceneStore.selectedId]}
          onObjectChange={handleObjectChange}
          size={0.7}
        />
      )}
    </>
  );
});

const ObjectWrapper: React.FC<{
  obj: ObjectData;
  setSelectedId: (id: string | null) => void;
  objectsRef: React.MutableRefObject<{ [key: string]: Object3D }>;
}> = observer(({ obj, setSelectedId, objectsRef }) => {
  const { scene } = useThree();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const object = new Object3D();
    object.position.set(obj.position[0], obj.position[1], obj.position[2]);
    object.rotation.set(
      obj.orientation[0],
      obj.orientation[1],
      obj.orientation[2]
    );
    object.scale.set(obj.scale[0], obj.scale[1], obj.scale[2]);

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
});

const RobotWrapper: React.FC<{
  robot: RobotData;
  setSelectedId: (id: string | null) => void;
  objectsRef: React.MutableRefObject<{ [key: string]: Object3D }>;
}> = observer(({ robot, setSelectedId, objectsRef }) => {
  const { scene } = useThree();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const object = new Object3D();
    object.position.set(
      robot.position[0],
      robot.position[1],
      robot.position[2]
    );
    object.rotation.set(
      robot.orientation[0],
      robot.orientation[1],
      robot.orientation[2]
    );
    object.scale.set(robot.scale[0], robot.scale[1], robot.scale[2]);

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
});

export default MainScene;
