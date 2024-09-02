import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";

import {
  AccumulativeShadows,
  DragControls,
  Environment,
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
  RandomizedLight,
  StatsGl,
  useGLTF,
} from "@react-three/drei";
import { useControls } from "leva";
import { useSceneStore } from "./stores/SceneStore";
import SceneComponent from "./components/SceneComponent";
import { GeometricObject } from "./interfaces/SceneInterfaces";
const Scene = () => {
  const { scenes, initializeScene } = useSceneStore();
  const setSelectedObject = useSceneStore((state) => state.setSelectedObject);

  console.log(scenes);

  const gridConfig = {
    cellSize: 1,
    cellThickness: 1,
    cellColor: "#6f6f6f",
    sectionSize: 10,
    sectionThickness: 1.5,
    sectionColor: "#6f6f6f",
    fadeDistance: 100,
    fadeStrength: 1,
    followCamera: true,
    infiniteGrid: true,
    fadeFrom: 0.5,
  };

  useEffect(() => {
    if (scenes.length === 0) {
      const sceneData = {
        id: "scene1",
        name: "mvp_scene",
        user_id: "karim",
        description: "A test scene",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const objectsData = [
        {
          id: "geo1",
          name: "Test Cube",
          scene_id: "scene1",
          db_model_reference: "cube_model_1",
          position: [0, 0, 0],
          orientation: [0, 0, 0],
          scale: [1, 1, 1],
          color: "#ff0000",
          shape: "cylinder",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as GeometricObject,
      ];

      initializeScene(sceneData, objectsData);
    }
  }, [scenes, initializeScene]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} castShadow />
      <Grid position={[0, -0.01, 0]} sire={1000} {...gridConfig} />
      <StatsGl />
      <Shadows />

      <group onClick={() => setSelectedObject(null)}>
        {scenes.map((scene) => (
          <SceneComponent key={scene.id} {...scene} />
        ))}
      </group>
    </>
  );
};
const Shadows = () => (
  <AccumulativeShadows
    temporal
    frames={100}
    color="#9d4b4b"
    colorBlend={0.5}
    alphaTest={0.9}
    scale={20}
  >
    <RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
  </AccumulativeShadows>
);
const TheViewer = () => {
  return (
    <Canvas
      camera={{ position: [20, 7, 12], fov: 60, near: 0.1, far: 100 }}
      style={{ background: "#242625" }}
      className="m-0 w-full h-full absolute"
      shadows
    >
      <Scene />
      <OrbitControls makeDefault />

      <GizmoHelper alignment="bottom-right" margin={[70, 70]}>
        <GizmoViewport
          axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
          labelColor="white"
        />
      </GizmoHelper>
    </Canvas>
  );
};

export default TheViewer;
