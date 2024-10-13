import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { IObject, IReferenceObject } from "@/types/Interfaces";

export const renderObject = (
  obj: IObject,
  referenceObject: IReferenceObject
) => {
  switch (referenceObject.file_type.toLowerCase()) {
    case "stl":
      const geometry = useLoader(
        STLLoader,
        URL.createObjectURL(referenceObject.file)
      );
      return <primitive object={geometry} />;
    case "obj":
      const objModel = useLoader(
        OBJLoader,
        URL.createObjectURL(referenceObject.file)
      );
      return <primitive object={objModel} />;
    case "gltf":
    case "glb":
      const gltf = useLoader(
        GLTFLoader,
        URL.createObjectURL(referenceObject.file)
      );
      return <primitive object={gltf.scene} />;
    default:
      // Fallback to basic shape
      return (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={obj.color} />
        </mesh>
      );
  }
};
