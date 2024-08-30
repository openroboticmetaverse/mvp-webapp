import { useEffect, useRef, useState } from "react";
import { useControls } from "leva";
import * as THREE from "three";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ThreeHelper } from "./helpers/threeHelpers/core/ThreeHelper";
import { useModel } from "@/contexts/SelectedModelContext.tsx";
import { RobotManager, RobotProperty } from "./kernel/managers/RobotManager";
import { Vector3 } from "three";

/**
 * TheViewer component
 * Renders a 3D viewer for the scene
 */

const TheViewer = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [helper, setHelper] = useState<ThreeHelper | null>(null);
  const [robotManager, setRobotManager] = useState<RobotManager | null>(null);
  const [transformControls, setTransformControls] =
    useState<TransformControls | null>(null);
  const [robotModel, setRobotModel] = useState<THREE.Object3D | null>(null);

  const { modelInfo, updateModelInfoUUID, modelInfoToRemove } = useModel();

  const isMotocortexActive = false;
  // Define Leva controls for joint angles
  const jointAngles = isMotocortexActive
    ? useControls({
        "Motocortex Robot": folder({
          Link1: { value: Math.PI / 4, min: -Math.PI, max: Math.PI },
          Link2: { value: Math.PI / 6, min: -Math.PI, max: Math.PI },
          Link3: { value: Math.PI / 3, min: -Math.PI, max: Math.PI },
          Link4: { value: -Math.PI, min: -Math.PI, max: Math.PI },
          Link5: { value: -Math.PI / 4, min: -Math.PI, max: Math.PI },
          Link6: { value: Math.PI, min: -Math.PI, max: Math.PI },
        }),
      })
    : {};
  //const { toggle } = useControls("isActive", { toggle: true });

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
    switch (modelInfo ? modelInfo.name : "no model selected") {
      case "Cube":
        geometry = new THREE.BoxGeometry(20, 20, 20);
        break;
      case "Sphere":
        geometry = new THREE.SphereGeometry(10, 32, 32);
        break;
      case "Cylinder":
        geometry = new THREE.CylinderGeometry(10, 10, 20, 32);
        break;
      case "Plane":
        geometry = new THREE.PlaneGeometry(10, 10);
        break;
      case "Torus":
        geometry = new THREE.TorusGeometry(10, 3, 16, 100);
        break;
      case "Goal":
        geometry = new THREE.IcosahedronGeometry(6, 0);
        break;
      case "Franka":
        console.debug("Adding Franka robot to the scene");
        addRobot("franka_arm", modelInfo);
        return;
      case "Sawyer":
        console.debug("Adding sawyer robot to the scene");
        addRobot("sawyer", modelInfo);
        return;
      case "Motocortex":
        console.debug("Adding Motocortex robot to the scene");
        loadGLTFRobot(
          helper,
          transformControls,
          "/MCX-Anthropomorphic-Robot-R01.glb",
          modelInfo
        );
        return;

      default:
        console.debug("Unknown model name:", modelInfo ? modelInfo.name : null);
        return;
    }

    if (geometry) {
      const material = new THREE.MeshMatcapMaterial({ color: 0x049ef4 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(0, 0, 0);
      mesh.castShadow = true;

      helper.add(mesh);
      console.log("Model added to scene:", mesh);

      // NOTE:
      // To prevent Runtime errors, check if one of the above model is clicked.
      // The check if react-generated id exist for that model.
      // If both are true, identify that model and update its threejs generated
      // uuid.
      if (modelInfo) {
        if (modelInfo.id) updateModelInfoUUID(modelInfo.id, mesh.uuid);
      }
      transformControls.attach(mesh);

      return () => {
        transformControls.detach();
      };
    }
  }, [modelInfo, helper, transformControls]);

  useEffect(() => {
    if (robotModel) {
      console.log("Applying joint angles to model:", jointAngles);
      applyJointAngles(robotModel, jointConfig, jointAngles);
    }
  }, [jointAngles, robotModel]);

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

  const loadGLTFRobot = (
    helper: ThreeHelper,
    transformControls: TransformControls,
    modelPath: string,
    modelToAdd: typeof modelInfo
  ) => {
    const loader = new GLTFLoader();
    loader.load(
      modelPath,
      (gltf) => {
        console.log("Loading GLTF model:", gltf);
        const model = gltf.scene;
        model.position.set(0, 0, 0); // Adjust model's position
        model.scale.set(100, 100, 100); // Adjust model's scale
        model.rotation.set(-Math.PI / 2, 0, 0); // Adjust model's rotation

        console.log("Adding model to scene:", model);
        helper.add(model);
        transformControls.attach(model);
        setRobotModel(model); // Store the loaded model to be used in the effect

        console.log("Applying joint angles to model:", jointAngles);
        applyJointAngles(model, jointConfig, jointAngles);

        if (modelToAdd) {
          if (modelToAdd.id) updateModelInfoUUID(modelToAdd.id, model.uuid);
        }
        console.log("GLTF model loaded and added to scene:", model);
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
    // Traverse the model to find specific joints
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

  const addRobot = async (modelName: string, modelToAdd: typeof modelInfo) => {
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
      if (modelToAdd) {
        if (modelToAdd.id)
          updateModelInfoUUID(modelToAdd.id, robotManager.robotUUID);
      }
    } catch (error) {
      console.error(`Failed to set joint angles:`, error);
    }
  };

  const removeModel = (modelToBeRemoved: typeof modelInfo) => {
    if (!helper || !transformControls) {
      console.error("ThreeHelper is not initialized.");
      return;
    }
    if (modelToBeRemoved && modelToBeRemoved.uuid) {
      console.log(modelToBeRemoved.uuid);
      const modelIdToRemove = helper.getObjectByUUID(modelToBeRemoved.uuid);
      console.log("helper.scene");
      console.log(helper);
      console.log(helper.scene);
      console.log(modelIdToRemove);
      if (modelIdToRemove) {
        helper.remove(modelIdToRemove);
        transformControls.detach();
      }
    }
  };

  useEffect(() => {
    if (modelInfoToRemove) {
      removeModel(modelInfoToRemove);
    }
  }, [modelInfoToRemove]);

  return (
    <canvas ref={canvasRef} className="m-0 w-full h-full absolute"></canvas>
  );
};

export default TheViewer;
