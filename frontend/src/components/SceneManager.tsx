import React, { useRef, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { sceneStore, objectStore, robotStore } from "@/stores/scene-store";

// Helper component to render a single object
const SceneObject = ({ object }) => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5;
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <Box
      ref={meshRef}
      position={[object.position.x, object.position.y, object.position.z]}
      scale={[object.scale.x, object.scale.y, object.scale.z]}
    >
      <meshStandardMaterial color={object.color || "orange"} />
    </Box>
  );
};

// Helper component to render a single robot
const SceneRobot = ({ robot }) => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[robot.position.x, robot.position.y, robot.position.z]}
    >
      <Sphere args={[0.5, 32, 32]}>
        <meshStandardMaterial color="blue" />
      </Sphere>
      <Box args={[0.25, 0.25, 0.25]} position={[0, 0.5, 0]}>
        <meshStandardMaterial color="gray" />
      </Box>
    </group>
  );
};

// Main scene component
const SceneViewer = observer(() => {
  const activeScene = sceneStore.activeScene;
  const sceneObjects = activeScene
    ? objectStore.getObjectsForScene(activeScene.id)
    : [];
  const sceneRobots = activeScene
    ? robotStore.getRobotsForScene(activeScene.id)
    : [];

  useEffect(() => {
    if (activeScene) {
      objectStore.fetchObjects();
      robotStore.fetchRobots();
    }
  }, [activeScene]);

  if (!activeScene) {
    return <div>No scene selected</div>;
  }

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <Canvas camera={{ position: [0, 5, 10] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <OrbitControls />

        {sceneObjects.map((object) => (
          <SceneObject key={object.id} object={object} />
        ))}

        {sceneRobots.map((robot) => (
          <SceneRobot key={robot.id} robot={robot} />
        ))}

        <gridHelper args={[20, 20, "white", "gray"]} />
      </Canvas>
    </div>
  );
});

// Updated SceneSelector component
const SceneSelector = observer(() => {
  return (
    <div>
      <h2>Select a Scene</h2>
      <select
        value={sceneStore.activeSceneId || ""}
        onChange={(e) => sceneStore.setActiveScene(e.target.value || null)}
      >
        <option value="">Select a scene</option>
        {sceneStore.items.map((scene) => (
          <option key={scene.id} value={scene.id}>
            {scene.name}
          </option>
        ))}
      </select>
    </div>
  );
});

// Main component combining scene selection and viewing
const SceneManager = observer(() => {
  useEffect(() => {
    sceneStore.fetchScenes();
  }, []);

  return (
    <div>
      <SceneSelector />
      <SceneViewer />
    </div>
  );
});

export default SceneManager;
