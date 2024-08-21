import { useModel } from "@/contexts/SelectedModelContext.tsx";


const DeleteRobot = () => {
  const {
    modelInfo,
    updateModelInfo,
    sceneModelsInfoList,
    setmodelInfoToRemove,
    removeModelInfo} = useModel();
  const handleSelectedModel = (modelToBeRemoved: typeof modelInfo) => {
    if(modelToBeRemoved){
      if (modelToBeRemoved.id){
          setmodelInfoToRemove(modelToBeRemoved);
          removeModelInfo(modelToBeRemoved.id);
          //updateModelInfo(sceneModelsInfoList.at(-1));
      }
    }
    //modelToBeRemoved ? console.log(modelToBeRemoved.name, modelToBeRemoved.id): null;
  };

  return (
    <div className="flex flex-wrap gap-5">
      <h3>Recently loaded Model: {modelInfo ? modelInfo.name: 'No active model in the scene'}</h3>
      <h3>List of all loaded Models: </h3>
      {
        sceneModelsInfoList.length === 0 ? (
          <p> No models available to view</p>
        ) : (
        sceneModelsInfoList.map((model) => {
          return (
            <div
              key={model.id}
              onClick={() => handleSelectedModel(model)}
              className="rounded border hover:bg-white p-2 
              hover:bg-opacity-25 hover:text-muted cursor-pointer"
            >
              { model.name }
            </div>
          );
        })
        )
      }
    </div>
  );
};

export default DeleteRobot;
