import { X } from "lucide-react";
import React, { useState, useEffect, ReactElement } from "react";
import RobotBrowser from "@/components/windows/robot-browser.tsx";
import { useModel } from "@/contexts/SelectedModelContext.tsx";

interface WindowProps {
  position: "left" | "right";
  windowTag: string | null;
}

const Window = ({ position = "left", windowTag }: WindowProps) => {
  const computedPosition = position === "left" ? "left-16" : "right-16";
  const [content, setContent] = useState<ReactElement | null>(null);
  const { sceneModelsList } = useModel();
  useEffect(() => {
    switch (windowTag) {
      case "start":
        setContent(<div>{sceneModelsList.map((model) => model)}</div>);
        break;
      case "robot-browser":
        setContent(<RobotBrowser />);
        break;
      case "delete":
        setContent(<div>Delete Window</div>);
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
          <div className="p-5">{content}</div>
        </div>
      )}
    </>
  );
};

export default Window;
