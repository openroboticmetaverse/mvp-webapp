import { useState, useEffect, ReactElement } from "react";
import ModelBrowser from "@/components/windows/ModelBrowser";
import SceneSelector from "./windows/scene-selector";
import SceneItemsList from "@/components/windows/SceneItemsList";

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
      case "items-list":
        setContent(<SceneItemsList />);
        break;
      case "scene-selector":
        setContent(<SceneSelector />);
        break;
      default:
        setContent(null);
    }
  }, [windowTag]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setContent(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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
          <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-3xl z-20 flex items-center justify-center rounded">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
                ></path>
              </svg>
              <p className="text-gray-200 text-3xl">Disabled in Demo mode</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Window;
