import { ThreeHelper } from "./helpers/threeHelpers/core/ThreeHelper";
import * as THREE from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { useEffect, useRef, useState } from "react";
import { useModel } from "@/contexts/SelectedModelContext.tsx";

let transformControls: TransformControls | null = null; // Instance of TransformControls for manipulating objects

const TheViewer = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement | undefined>(undefined); // Reference to the canvas element
  const [helper, setHelper] = useState<ThreeHelper>();
  const { modelName } = useModel();

  useEffect(() => {
    const threeHelper = new ThreeHelper(canvasRef.current);
    setHelper(threeHelper);
    threeHelper.animate();
    if (threeHelper) {
      transformControls = new TransformControls(
        threeHelper.camera,
        threeHelper.renderer.domElement,
      );
      threeHelper.scene.add(transformControls); // Add TransformControls to the scene

      // Event listeners for TransformControls
      transformControls.addEventListener("change", () =>
        threeHelper.renderer.render(threeHelper.scene, threeHelper.camera),
      );
      transformControls.addEventListener("dragging-changed", (event) => {
        threeHelper.controls.enabled = !event.value; // Enable/disable controls based on dragging state
      });
    }
  }, []);

  useEffect(() => {
    let geometry: THREE.BufferGeometry | undefined;
    // Create geometry based on the selected model name
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
      default:
        console.error("Unknown model name:", modelName);
        return;
    }
    const material = new THREE.MeshStandardMaterial({ color: 0x87ceeb }); // Light blue color
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    mesh.castShadow = true; // Enable shadows
    console.debug(mesh);
    if (helper) {
      helper.add(mesh); // Add the mesh to the scene
      console.log("Model added to scene:", mesh);

      // Attach TransformControls to the recent mesh
      if (transformControls) {
        transformControls.attach(mesh);
      }
    }
  }, [modelName]);

  return (
    <>
      <canvas ref={canvasRef} className="m-0 w-full h-full absolute"></canvas>
    </>
  );
};

export default TheViewer;
