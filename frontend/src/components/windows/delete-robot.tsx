import useModelStore from "@/stores/model-store";
import { useCallback } from "react";

const DeleteRobot = () => {
  const { sceneModels, setModelToRemove } = useModelStore();

  const handleDeleteModel = useCallback(
    (model: ModelInfo) => {
      console.log("Triggering deletion for model:", model);
      setModelToRemove(model);
    },
    [setModelToRemove]
  );

  return (
    <div className="flex flex-col gap-5">
      <h3>Models in the Scene: </h3>
      <div className="flex flex-wrap gap-3">
        {sceneModels.length === 0 ? (
          <p>No models in the scene</p>
        ) : (
          sceneModels.map((model, index) => (
            <div
              key={`${model.id}-${model.name}-${index}`}
              onClick={() => handleDeleteModel(model)}
              className="rounded border hover:bg-white p-2 
              hover:bg-opacity-25 hover:text-muted cursor-pointer"
            >
              {model.name}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeleteRobot;
