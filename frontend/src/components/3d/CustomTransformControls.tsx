import React, { useEffect, useRef, useCallback, useState } from "react";
import { TransformControls as DreiTransformControls } from "@react-three/drei";
import { Object3D } from "three";
import { errorLoggingService } from "@/services/error-logging-service";

interface CustomTransformControlsProps {
  object: Object3D;
  onObjectChange: (event: any) => void;
}

const CustomTransformControls: React.FC<CustomTransformControlsProps> =
  React.memo(({ object, onObjectChange }) => {
    const controlsRef = useRef<any>(null);
    const [mode, setMode] = useState<"translate" | "rotate" | "scale">(
      "translate"
    );

    useEffect(() => {
      errorLoggingService.debug("CustomTransformControls mounted", {
        objectId: object?.userData?.id,
        hasObject: !!object,
      });

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "m" || event.key === "M") {
          setMode((prevMode) => {
            switch (prevMode) {
              case "translate":
                return "rotate";
              case "rotate":
                return "scale";
              case "scale":
                return "translate";
            }
          });
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        errorLoggingService.debug("CustomTransformControls unmounted", {
          objectId: object?.userData?.id,
        });
      };
    }, [object]);

    const handleChange = useCallback(
      (event: any) => {
        if (event.target !== controlsRef.current) {
          onObjectChange(event);
        }
      },
      [onObjectChange]
    );

    if (!object) {
      errorLoggingService.warn(
        "CustomTransformControls rendered without object"
      );
      return null;
    }

    return (
      <DreiTransformControls
        ref={controlsRef}
        object={object}
        onObjectChange={handleChange}
        size={0.7}
        mode={mode}
      />
    );
  });

export default CustomTransformControls;
