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

  const { modelInfo, updateModelInfoUUID, modelInfoToRemove  } = useModel();


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
    switch (modelInfo ? modelInfo.name: "no model selected") {
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
      addRobot("franka_arm", modelInfo);
        return;
      case "Sawyer":
        console.debug("Adding sawyer robot to the scene");
      addRobot("sawyer", modelInfo);
        return;

      default:
        console.debug("Unknown model name:", modelInfo ? modelInfo.name: null);
        return;
    }

    if (geometry) {
      const material = new THREE.MeshStandardMaterial({ color: 0x87ceeb });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);
      mesh.castShadow = true;

      helper.add(mesh);
      console.log("Model added to scene:", mesh);
      setModelUUID(mesh.id.toString());

      // NOTE: 
      // To prevent Runtime errors, check if one of the above model is clicked.
      // The check if react-generated id exist for that model.
      // If both are true, identify that model and update its threejs generated
      // uuid.
      if (modelInfo){
        if (modelInfo.id)
          updateModelInfoUUID(modelInfo.id, mesh.uuid)
      }
      transformControls.attach(mesh);

      return () => {
        transformControls.detach();
      };
    }
  }, [modelInfo, helper, transformControls]);


  const addRobot = async (modelName: string, modelToAdd: typeof modelInfo) => {
    if (!robotManager) {
      console.error("RobotManager is not initialized.");
      return;
    }

    const props: RobotProperty = {
      scale: new Vector3(100, 100, 100),
      rotation: new Vector3(-Math.PI / 2, 0, 0),
      position: [new Vector3(0, 0, 0)],
    };

    try {
      await robotManager.addSingleRobot(modelName, props);
      console.log(`${modelName} robot added to the scene`);
    } catch (error) {
      console.error(`Failed to add ${modelName} robot to the scene:`, error);
    }
    if (!robotManager.robots.has(modelName)) {
      console.error(`Robot ${modelName} not found in the RobotManager`);
    }

    try {
      const jointAngles = {
        panda_joint1: -1.57079,
        panda_joint2: -1.57079,
        panda_joint3: 0.24,
        panda_joint4: -1.57079,
      };

      robotManager.setJointAnglesFromMap(modelName, jointAngles);
      console.log(`Joint angles set for ${modelName} robot`);
      if (modelToAdd){
        if (modelToAdd.id)
          updateModelInfoUUID(modelToAdd.id, robotManager.robotUUID)
      }
    } catch (error) {
      console.error(`Failed to set joint angles:`, error);
    }
    setModelUUID(robotManager.robotsId[0].toString());
  };


  const removeModel = (modelToBeRemoved: typeof modelInfo) => {
    if (!helper || !transformControls){
      console.error("ThreeHelper is not initialized.");
      return;
    }
    if (modelToBeRemoved && modelToBeRemoved.uuid){
      console.log(modelToBeRemoved.uuid)
      const modelIdToRemove = helper.getObjectByUUID(modelToBeRemoved.uuid);
      console.log("helper.scene");
      console.log(helper);
      console.log(helper.scene);
      console.log(modelIdToRemove);
      if (modelIdToRemove){
        helper.remove(modelIdToRemove);
        transformControls.detach();
      }
    }
  };
  useEffect(()=> {
    if (modelInfoToRemove){
      removeModel(modelInfoToRemove);
    }
  }, [modelInfoToRemove])

  return (
    <canvas ref={canvasRef} className="m-0 w-full h-full absolute"></canvas>
  );
};

export default TheViewer;
