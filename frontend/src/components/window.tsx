import { useState, useEffect, ReactElement } from "react";
import ModelBrowser from "@/components/windows/ModelBrowser";
import DeleteRobot from "@/components/windows/delete-robot";
import SceneSelector from "./windows/scene-selector";

interface WindowProps {
  position: "left" | "right";
  windowTag: string | null;
}

const Window = ({ position = "left", windowTag }: WindowProps) => {
  const computedPosition = position === "left" ? "left-16" : "right-16";
  const [content, setContent] = useState<ReactElement | null>(null);

  useEffect(() => {
    switch (windowTag) {
      case "start":
        break;
      case "robot-browser":
        setContent(<ModelBrowser />);
        break;
      case "delete":
        setContent(<DeleteRobot />);
        break;
      case "scene-selector":
        setContent(<SceneSelector />);
        break;
      default:
        setContent(null);
    }
  }, [windowTag]);

  return (
    <>
      {content && (
        <div
          className={`fixed bottom-36 ${computedPosition} top-12 h-[80%] w-[25%] bg-white bg-opacity-10 backdrop-blur-sm flex flex-col text-white z-10 rounded-lg`}
        >
          {/*<X*/}
          {/*  className="cursor-pointer ml-auto m-3"*/}
          {/*  onClick={() => setContent(null)}*/}
          {/*/>*/}
          <div className="p-4 h-full overflow-hidden flex flex-col">
            {content}
          </div>
        </div>
      )}
    </>
  );
};

export default Window;
