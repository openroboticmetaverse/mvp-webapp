import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

// Define the materials interface
interface MaterialsType {
  "Aluminum_Anodized_DarkGray #0": THREE.Material;
  "Material #25": THREE.Material;
  "Material #76": THREE.Material;
  "Material #77": THREE.Material;
  "Material #78": THREE.Material;
  "Glass_Crystal #0": THREE.Material;
}

// Define the structure of the GLTF result
type GLTFResult = GLTF & {
  nodes: {
    Box001: THREE.Mesh;
    网格001: THREE.Mesh;
    网格001_1: THREE.Mesh;
    网格001_2: THREE.Mesh;
    网格001_3: THREE.Mesh;
    网格001_4: THREE.Mesh;
  };
  materials: MaterialsType;
};

export function IndustrialScene(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/models/industrial-scene.glb"
  ) as GLTFResult;

  return (
    <group {...props} dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Box001.geometry}
        material={materials["Aluminum_Anodized_DarkGray #0"]}
        position={[6.388, 0, 3.375]}
        scale={0.01}
      />
      <group position={[-5.227, 0, -2.761]} scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.网格001.geometry}
          material={materials["Material #25"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.网格001_1.geometry}
          material={materials["Material #76"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.网格001_2.geometry}
          material={materials["Material #77"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.网格001_3.geometry}
          material={materials["Material #78"]}
        />
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.网格001_4.geometry}
          material={materials["Glass_Crystal #0"]}
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/industrial-scene.glb");
