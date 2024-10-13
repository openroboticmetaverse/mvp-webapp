import React, { useEffect, useRef } from "react";
import { TransformControls as DreiTransformControls } from "@react-three/drei";
import { Object3D } from "three";
import { errorLoggingService } from "@/services/error-logging-service";

interface CustomTransformControlsProps {
  object: Object3D;
  onObjectChange: (event: any) => void;
}

const CustomTransformControls: React.FC<CustomTransformControlsProps> = ({
  object,
  onObjectChange,
}) => {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    errorLoggingService.debug("CustomTransformControls mounted", {
      objectId: object?.userData?.id,
      hasObject: !!object,
    });

    return () => {
      errorLoggingService.debug("CustomTransformControls unmounted", {
        objectId: object?.userData?.id,
      });
    };
  }, [object]);

  useEffect(() => {
    if (controlsRef.current) {
      const controls = controlsRef.current;
      controls.addEventListener(
        "dragging-changed",
        (event: { value: boolean }) => {
          errorLoggingService.debug("Transform controls dragging changed", {
            isDragging: event.value,
            objectId: object?.userData?.id,
          });
        }
      );
    }
  }, [object]);

  if (!object) {
    errorLoggingService.warn("CustomTransformControls rendered without object");
    return null;
  }

  return (
    <DreiTransformControls
      ref={controlsRef}
      object={object}
      onObjectChange={(event) => {
        errorLoggingService.debug("Transform controls object changed", {
          objectId: object?.userData?.id,
          position: object.position.toArray(),
          rotation: object.rotation.toArray(),
          scale: object.scale.toArray(),
        });
        onObjectChange(event);
      }}
      size={0.7}
    />
  );
};

export default CustomTransformControls;
