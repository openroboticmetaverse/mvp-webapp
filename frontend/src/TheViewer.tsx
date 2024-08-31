import { useEffect, useRef, useState, useCallback } from "react";
import { useControls } from "leva";
import * as THREE from "three";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ThreeHelper } from "./helpers/threeHelpers/core/ThreeHelper";
import { RobotManager, RobotProperty } from "./kernel/managers/RobotManager";
import { Vector3 } from "three";
import useModelStore from "@/stores/model-store";

const TheViewer = () => {
  console.log("TheViewer rendering");

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [helper, setHelper] = useState<ThreeHelper | null>(null);
  const [robotManager, setRobotManager] = useState<RobotManager | null>(null);
  const [robotModel, setRobotModel] = useState<THREE.Object3D | null>(null);

  const {
    currentModel,
    modelToRemove,
    updateModelUUID,
    removeModel,
    setCurrentModel,
  } = useModelStore((state) => ({
    currentModel: state.currentModel,
    modelToRemove: state.modelToRemove,
    updateModelUUID: state.updateModelUUID,
    removeModel: state.removeModel,
    setCurrentModel: state.setCurrentModel,
    addSceneModel: state.addSceneModel,
  }));

  console.log("Current model in render:", currentModel);

  // Leva controls for joint angles
  const jointAngles = useControls("Motocortex Robot", {
    Link1: { value: Math.PI / 4, min: -Math.PI, max: Math.PI },
    Link2: { value: Math.PI / 6, min: -Math.PI, max: Math.PI },
    Link3: { value: Math.PI / 3, min: -Math.PI, max: Math.PI },
    Link4: { value: -Math.PI, min: -Math.PI, max: Math.PI },
    Link5: { value: -Math.PI / 4, min: -Math.PI, max: Math.PI },
    Link6: { value: Math.PI, min: -Math.PI, max: Math.PI },
  });

  const jointConfig = [
    {
      name: "Link1",
      channel: 0,
      axis: "rz",
      castShadow: true,
      addEnvironmentMap: true,
    },
    {
      name: "Link2",
      channel: 1,
      axis: "ry",
      castShadow: true,
      addEnvironmentMap: true,
    },
    {
      name: "Link3",
      channel: 2,
      axis: "ry",
      castShadow: true,
      addEnvironmentMap: true,
    },
    {
      name: "Link4",
      channel: 3,
      axis: "rz",
      castShadow: true,
      addEnvironmentMap: true,
    },
    {
      name: "Link5",
      channel: 4,
      axis: "ry",
      castShadow: true,
      addEnvironmentMap: true,
    },
    {
      name: "Link6",
      channel: 5,
      axis: "rz",
      castShadow: true,
      addEnvironmentMap: true,
    },
  ];

  useEffect(() => {
    if (!canvasRef.current) return;

    console.log("Initializing ThreeHelper and controls");
    const threeHelper = new ThreeHelper(canvasRef.current);
    setHelper(threeHelper);

    const newRobotManager = new RobotManager(threeHelper);
    setRobotManager(newRobotManager);

    const animate = () => {
      requestAnimationFrame(animate);
      threeHelper.renderer.render(threeHelper.scene, threeHelper.camera);
    };
    animate();

    return () => {
      console.log("Cleaning up ThreeHelper and controls");
      threeHelper.dispose();
    };
  }, []);

  const addModelToScene = useCallback(
    (object: THREE.Object3D) => {
      if (!helper) {
        console.error("Helper not initialized");
        return;
      }
      console.log("Adding model to scene:", object);
      object.position.set(0, 0, 0);
      object.castShadow = true;
      helper.scene.add(object);
      helper.renderer.render(helper.scene, helper.camera);
    },
    [helper]
  );

  useEffect(() => {
    console.log("Current model effect triggered");
    console.log("Store state in render:", useModelStore.getState());

    if (!helper) {
      console.log("Helper not available. Cannot add current model to scene.");
      return;
    }
    if (!currentModel) {
      console.log("Current model not available. Skipping processing.");
      return;
    }

    console.log("Processing current model:", currentModel);

    let newObject: THREE.Object3D | null = null;

    switch (currentModel.name) {
      case "Cube":
        newObject = new THREE.Mesh(
          new THREE.BoxGeometry(20, 20, 20),
          new THREE.MeshStandardMaterial({ color: 0x049ef4 })
        );
        break;
      case "Sphere":
        newObject = new THREE.Mesh(
          new THREE.SphereGeometry(10, 32, 32),
          new THREE.MeshStandardMaterial({ color: 0x049ef4 })
        );
        break;
      case "Cylinder":
        newObject = new THREE.Mesh(
          new THREE.CylinderGeometry(10, 10, 20, 32),
          new THREE.MeshStandardMaterial({ color: 0x049ef4 })
        );
        break;
      case "Plane":
        newObject = new THREE.Mesh(
          new THREE.PlaneGeometry(10, 10),
          new THREE.MeshStandardMaterial({ color: 0x049ef4 })
        );
        break;
      case "Torus":
        newObject = new THREE.Mesh(
          new THREE.TorusGeometry(10, 3, 16, 100),
          new THREE.MeshStandardMaterial({ color: 0x049ef4 })
        );
        break;
      case "Goal":
        newObject = new THREE.Mesh(
          new THREE.IcosahedronGeometry(6, 0),
          new THREE.MeshStandardMaterial({ color: 0x049ef4 })
        );
        break;
      case "Franka":
        console.debug("Adding Franka robot to the scene");
        addRobot("franka_arm", currentModel);
        return;
      case "Sawyer":
        console.debug("Adding sawyer robot to the scene");
        addRobot("sawyer", currentModel);
        return;
      case "Motocortex":
        console.debug("Adding Motocortex robot to the scene");
        loadGLTFRobot(
          helper,
          "/MCX-Anthropomorphic-Robot-R01.glb",
          currentModel
        );
        return;
      default:
        console.debug("Unknown model name:", currentModel.name);
        return;
    }

    if (newObject) {
      addModelToScene(newObject);
      if (currentModel.id) {
        const newUUID = newObject.uuid;
        updateModelUUID(currentModel.id, newUUID);
      }
      console.log("Model added to scene:", newObject);
      setCurrentModel(null); // Clear current model after adding
    }
  }, [currentModel, helper, updateModelUUID, addModelToScene]);

  const loadGLTFRobot = (
    helper: ThreeHelper,
    modelPath: string,
    modelToAdd: typeof currentModel
  ) => {
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        console.log("Loading GLTF model:", gltf);
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        model.scale.set(100, 100, 100);
        model.rotation.set(-Math.PI / 2, 0, 0);

        console.log("Adding model to scene:", model);
        helper.add(model);
        setRobotModel(model);

        console.log("Applying joint angles to model:", jointAngles);
        applyJointAngles(model, jointConfig, jointAngles);

        if (modelToAdd && modelToAdd.id) {
          updateModelUUID(modelToAdd.id, model.uuid);
        }
        console.log("GLTF model loaded and added to scene:", model);
        setCurrentModel(null); // Clear current model after adding
      },
      undefined,
      (error) => {
        console.error("An error occurred while loading the GLTF model:", error);
      }
    );
  };

  const applyJointAngles = (
    model: THREE.Object3D,
    jointConfig: Array<{ name: string; axis: string }>,
    jointAngles: Record<string, number>
  ) => {
    model.traverse((child) => {
      if (child) {
        const jointConfigItem = jointConfig.find(
          (config) => config.name === child.name
        );

        if (jointConfigItem) {
          const angle = jointAngles[jointConfigItem.name] || 0;

          switch (jointConfigItem.axis) {
            case "rx":
              child.rotation.x = angle;
              break;
            case "ry":
              child.rotation.y = angle;
              break;
            case "rz":
              child.rotation.z = angle;
              break;
            default:
              console.warn(
                `Unknown rotation axis for joint ${child.name}: ${jointConfigItem.axis}`
              );
              break;
          }
        }
      }
    });
  };

  const addRobot = async (
    modelName: string,
    modelToAdd: typeof currentModel
  ) => {
    if (!robotManager) {
      console.error("RobotManager is not initialized.");
      return;
    }

    const props: RobotProperty = {
      scale: new Vector3(75, 75, 75),
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
      robotManager.setJointAnglesFromMap(modelName, jointAngles);
      console.log(`Joint angles set for ${modelName} robot`);
      if (modelToAdd && modelToAdd.id) {
        updateModelUUID(modelToAdd.id, robotManager.robotUUID);
      }
    } catch (error) {
      console.error(`Failed to set joint angles:`, error);
    }

    setCurrentModel(null); // Clear current model after adding
  };

  useEffect(() => {
    if (!helper || !modelToRemove) return;

    console.log("Attempting to remove model:", modelToRemove);
    const objectToRemove = helper.getObjectByUUID(modelToRemove.uuid || "");

    if (objectToRemove) {
      helper.remove(objectToRemove);
      console.log("Model removed from scene");
      removeModel(modelToRemove.id!);
    } else {
      console.warn("Model not found in scene:", modelToRemove);
    }
  }, [modelToRemove, helper, , removeModel]);

  return (
    <canvas ref={canvasRef} className="m-0 w-full h-full absolute"></canvas>
  );
};

export default TheViewer;
