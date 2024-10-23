import React, { useRef, Suspense, useMemo } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import * as THREE from "three";
import { errorLoggingService } from "@/services/error-logging-service";

/**
 * Props for GLTFProp component
 */
interface GLTFPropProps {
  modelUrl: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  id?: string;
}

/**
 * Fallback component shown while the model is loading
 */
const LoadingFallback: React.FC = React.memo(() => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="gray" wireframe />
  </mesh>
));

/**
 * Error boundary fallback component
 */
const ErrorFallback: React.FC = React.memo(() => (
  <mesh>
    <sphereGeometry args={[0.5, 16]} />
    <meshStandardMaterial color="red" />
  </mesh>
));

/**
 * Model component that handles the GLTF model
 */
const ModelDisplay: React.FC<{
  gltf: THREE.Group;
  id: string;
}> = React.memo(({ gltf, id }) => {
  const modelRef = useRef<THREE.Group>(gltf.clone());

  // Log successful model initialization
  React.useEffect(() => {
    errorLoggingService.debug(`Model initialized`, {
      id,
      meshCount: countMeshes(modelRef.current),
    });
  }, [id]);

  return <primitive object={modelRef.current} />;
});

/**
 * Utility function to count meshes in a model
 */
const countMeshes = (object: THREE.Object3D): number => {
  let count = 0;
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) count++;
  });
  return count;
};

/**
 * GLTFProp component for loading and displaying GLTF models
 */
const GLTFProp: React.FC<GLTFPropProps> = ({
  modelUrl,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
  id = "gltf-prop",
}) => {
  // Refs
  const groupRef = useRef<THREE.Group>(null);

  // Configure GLTF loader with Draco support
  const gltfLoader = useMemo(() => {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();

    // Set up Draco loader
    dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
    );
    loader.setDRACOLoader(dracoLoader);

    errorLoggingService.debug("Initialized GLTF loader with Draco support", {
      id,
      modelUrl,
    });

    return loader;
  }, [id, modelUrl]);

  // Load the GLTF model with error handling
  const gltf = useLoader(GLTFLoader, modelUrl, (loader) => {
    // Set up Draco loader
    if (loader instanceof GLTFLoader && gltfLoader.dracoLoader) {
      loader.setDRACOLoader(gltfLoader.dracoLoader);
    }

    // Error handling
    loader.manager.onError = (url) => {
      errorLoggingService.error(
        `Failed to load resource: ${url}`,
        new Error(`Failed to load resource: ${url}`),
        { id, modelUrl }
      );
    };
  });

  return (
    <group
      ref={groupRef}
      userData={{ id, type: "GLTFProp" }}
      position={position}
      rotation={rotation}
      scale={scale}
      castShadow
      receiveShadow
    >
      <Suspense fallback={<LoadingFallback />}>
        {gltf ? <ModelDisplay gltf={gltf.scene} id={id} /> : <ErrorFallback />}
      </Suspense>
    </group>
  );
};

/**
 * Cleanup function to dispose of Draco loader and resources
 */
const cleanup = () => {
  DRACOLoader.prototype.dispose();
};

// Add cleanup to window unload event
if (typeof window !== "undefined") {
  window.addEventListener("unload", cleanup);
}

export default React.memo(GLTFProp);
