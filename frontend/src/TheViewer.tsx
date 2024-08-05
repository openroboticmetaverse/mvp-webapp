import { ThreeHelper } from "./helpers/threeHelpers/core/ThreeHelper";
import * as THREE from "three";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { useEffect, useRef, useState } from "react";
import { useModel } from "@/contexts/SelectedModelContext.tsx";
import { RobotManager, RobotProperty } from "./kernel/managers/RobotManager";
import { Vector3 } from "three";

const TheViewer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [helper, setHelper] = useState<ThreeHelper | null>(null);
  const [robotManager, setRobotManager] = useState<RobotManager | null>(null);
  const [transformControls, setTransformControls] =
    useState<TransformControls | null>(null);
  const { modelName } = useModel();

  useEffect(() => {
    if (!canvasRef.current) return;

    const threeHelper = new ThreeHelper(canvasRef.current);
    setHelper(threeHelper);
    threeHelper.animate();

    const newTransformControls = new TransformControls(
      threeHelper.camera,
      threeHelper.renderer.domElement
    );
    threeHelper.scene.add(newTransformControls);
    setTransformControls(newTransformControls);

    newTransformControls.addEventListener("change", () =>
      threeHelper.renderer.render(threeHelper.scene, threeHelper.camera)
    );
    newTransformControls.addEventListener("dragging-changed", (event) => {
      threeHelper.controls.enabled = !event.value;
    });

    const newRobotManager = new RobotManager(threeHelper);
    setRobotManager(newRobotManager);

    return () => {
      threeHelper.dispose();
      newTransformControls.dispose();
    };
  }, []);

  useEffect(() => {
    if (!helper || !transformControls) return;

    let geometry: THREE.BufferGeometry | undefined;
    switch (modelName) {
      case "Cube":
        geometry = new THREE.BoxGeometry(20, 20, 20);
        break;
      case "Sphere":
        geometry = new THREE.SphereGeometry(10, 32, 32);
        break;
      case "Cylinder":
        geometry = new THREE.CylinderGeometry(10, 10, 20, 32);
        break;
      case "Franka":
        console.debug("Adding Franka robot to the scene");
        addRobot("franka_arm");
        return;
      default:
        console.debug("Unknown model name:", modelName);
        return;
    }

    if (geometry) {
      const material = new THREE.MeshStandardMaterial({ color: 0x87ceeb });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);
      mesh.castShadow = true;

      helper.add(mesh);
      console.log("Model added to scene:", mesh);

      transformControls.attach(mesh);

      return () => {
        transformControls.detach();
      };
    }
  }, [modelName, helper, transformControls]);

  const addRobot = async (modelName: string) => {
    if (!robotManager) {
      console.error("RobotManager is not initialized.");
      return;
    }

    const props: RobotProperty = {
      scale: new Vector3(10, 10, 10),
      rotation: new Vector3(-Math.PI / 2, 0, 0),
      position: [new Vector3(0, 0, 0)],
    };

    try {
      await robotManager.addSingleRobot(modelName, props);
      console.log(`${modelName} robot added to the scene`);
    } catch (error) {
      console.error(`Failed to add ${modelName} robot to the scene:`, error);
    }
  };

  return (
    <canvas ref={canvasRef} className="m-0 w-full h-full absolute"></canvas>
  );
};

export default TheViewer;
