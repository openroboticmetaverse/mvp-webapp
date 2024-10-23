import * as THREE from "three";
import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

type GLTFResult = GLTF & {
  nodes: {
    Wind_turbine_001_Wind_turbine_Circle001: THREE.Mesh;
    Wind_turbine_001_Wind_turbine_Circle001_1: THREE.Mesh;
    Wind_turbine_001_Wind_turbine_Circle000: THREE.Mesh;
    Wind_turbine_001_Wind_turbine_Circle000_1: THREE.Mesh;
  };
  materials: {
    gray: THREE.MeshStandardMaterial;
    red: THREE.MeshStandardMaterial;
  };
};

type ActionName = "Wind_turbine_001_BladesAction";
type GLTFActions = Record<ActionName, THREE.AnimationAction>;

export default function WindTurbine(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF(
    "models/wind-turbine.gltf"
  ) as GLTFResult;
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    const action = actions[
      "Wind_turbine_001_BladesAction"
    ] as THREE.AnimationAction;
    if (action) {
      action.setEffectiveTimeScale(1.0);
      action.play();
      action.setLoop(THREE.LoopRepeat, Infinity);
    }
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Wind_turbine_001">
        <mesh
          geometry={nodes.Wind_turbine_001_Wind_turbine_Circle001.geometry}
          material={nodes.Wind_turbine_001_Wind_turbine_Circle001.material}
        />
        <mesh
          geometry={nodes.Wind_turbine_001_Wind_turbine_Circle001_1.geometry}
          material={nodes.Wind_turbine_001_Wind_turbine_Circle001_1.material}
        />
        <group name="Wind_turbine_001_Blades" position={[0.01, 4.38, 0.49]}>
          <mesh
            geometry={nodes.Wind_turbine_001_Wind_turbine_Circle000.geometry}
            material={nodes.Wind_turbine_001_Wind_turbine_Circle000.material}
          />
          <mesh
            geometry={nodes.Wind_turbine_001_Wind_turbine_Circle000_1.geometry}
            material={nodes.Wind_turbine_001_Wind_turbine_Circle000_1.material}
          />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("models/wind-turbine.gltf");
