import React, {
  useCallback,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { ThreeEvent, useLoader, useThree } from "@react-three/fiber";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { IObject } from "@/types/Interfaces";
import { libraryStore } from "@/stores/library-store";
import * as THREE from "three";
import ErrorBoundary from "../ErrorBoundary";
import { errorLoggingService } from "@/services/error-logging-service";

interface SceneObjectProps {
  object: IObject;
  setSelectedId: (id: string | null) => void;
}

// Type guard to check if the object has an 'id' property
function hasId(obj: any): obj is { id: string | number } {
  return obj && typeof obj === "object" && "id" in obj;
}

const SceneObject = forwardRef<THREE.Group, SceneObjectProps>(
  ({ object, setSelectedId }, ref) => {
    const { scene } = useThree();
    const groupRef = React.useRef<THREE.Group>(null);

    console.log("SceneObject props:", object);
    console.log("object_reference:", object.object_reference);
    console.log("Library store state:", libraryStore.state);
    console.log("Library store items:", libraryStore.items);

    const referenceObjectId = useMemo(() => {
      if (
        typeof object.object_reference === "string" ||
        typeof object.object_reference === "number"
      ) {
        return object.object_reference;
      } else if (hasId(object.object_reference)) {
        return (object.object_reference as { id: string | number }).id;
      } else {
        errorLoggingService.error(
          "Invalid object_reference type",
          new Error("Invalid object_reference type"),
          {
            objectId: object.id,
            objectReference: object.object_reference,
          }
        );
        return null;
      }
    }, [object.object_reference, object.id]);

    const referenceObject = useMemo(() => {
      if (referenceObjectId !== null) {
        return libraryStore.getReferenceObjectById(referenceObjectId);
      }
      return null;
    }, [referenceObjectId]);

    console.log("Resolved referenceObjectId:", referenceObjectId);
    console.log("Retrieved referenceObject:", referenceObject);

    useImperativeHandle(ref, () => groupRef.current!, []);

    const handleClick = useCallback(
      (event: ThreeEvent<MouseEvent>) => {
        event.stopPropagation();
        setSelectedId(object.id);
      },
      [object.id, setSelectedId]
    );

    const ObjectModel = useMemo(() => {
      if (!referenceObject) {
        const errorMessage = `Reference object not found for id: ${referenceObjectId}`;
        errorLoggingService.error(errorMessage, new Error(errorMessage), {
          objectId: object.id,
          referenceObjectId: referenceObjectId,
          libraryStoreState: libraryStore.state,
          libraryStoreItemCount: libraryStore.items.length,
        });
        return () => <FallbackModel color="yellow" />; // Yellow to indicate missing reference
      }

      return () => {
        try {
          switch (referenceObject.file_type.toLowerCase()) {
            case "stl":
              return (
                <STLModel file={referenceObject.file} color={object.color} />
              );
            case "obj":
              return <OBJModel file={referenceObject.file} />;
            case "gltf":
            case "glb":
              return <GLTFModel file={referenceObject.file} />;
            default:
              return <FallbackModel color={object.color} />;
          }
        } catch (error) {
          errorLoggingService.error("Error loading model:", error as Error, {
            objectId: object.id,
            referenceObjectId: referenceObjectId,
            fileType: referenceObject.file_type,
          });
          return <FallbackModel color="red" />; // Red to indicate error
        }
      };
    }, [referenceObject, object.color, object.id, referenceObjectId]);

    React.useEffect(() => {
      if (groupRef.current) {
        groupRef.current.position.set(...object.position);
        groupRef.current.rotation.set(...object.orientation);
        groupRef.current.scale.set(...object.scale);
      }
    }, [object.position, object.orientation, object.scale]);

    return (
      <group ref={groupRef} onClick={handleClick} userData={{ id: object.id }}>
        <ErrorBoundary fallback={<FallbackModel color="red" />}>
          <ObjectModel />
        </ErrorBoundary>
      </group>
    );
  }
);

const getFileUrl = (file: string | File | Blob): string => {
  if (typeof file === "string") {
    return file; // It's already a URL
  } else if (file instanceof File || file instanceof Blob) {
    return URL.createObjectURL(file);
  } else {
    throw new Error("Invalid file type");
  }
};

const STLModel: React.FC<{ file: string | File | Blob; color: string }> = ({
  file,
  color,
}) => {
  const geometry = useLoader(STLLoader, getFileUrl(file));
  return <mesh geometry={geometry} material-color={color} />;
};

const OBJModel: React.FC<{ file: string | File | Blob }> = ({ file }) => {
  const obj = useLoader(OBJLoader, getFileUrl(file));
  return <primitive object={obj} />;
};

const GLTFModel: React.FC<{ file: string | File | Blob }> = ({ file }) => {
  const gltf = useLoader(GLTFLoader, getFileUrl(file));
  return <primitive object={gltf.scene} />;
};

const FallbackModel: React.FC<{ color: string }> = ({ color }) => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

export default SceneObject;
