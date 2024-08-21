import { createContext, ReactNode, useContext, useState } from "react";

// Define a data structure for storing model information globally
interface modelInfo {
  name: string | null,
  id: number | null,
  uuid: string | null,
}

// Define a data structure for exposing vairbales globally across all the 
// child components
interface ModelContextType {
  modelInfo: modelInfo | null;
  setModelInfo: (modelInfo: modelInfo) => void;
  updateModelInfo: (modelInfo: modelInfo) => void;
  sceneModelsInfoList: Array<modelInfo>;
  updateModelInfoUUID: (id: number, newUUID: string) => void;
  modelInfoToRemove: modelInfo | null;
  setmodelInfoToRemove: (modelInfo: modelInfo) => void;
  removeModelInfo: (idToRemove: number) => void; 
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

const ModelContextProvider = ({ children }: { children: ReactNode }) => {
  // Store current model info 
  const [modelInfo, setModelInfo] = useState<modelInfo | null>(null);
  // Store the list of modelInfo of all models loaded in the scene
  const [sceneModelsInfoList, setSceneModelsInfoList] = useState<Array<modelInfo>>([]);
  // Update the current model info and the list of models loaded in the scene 
  const handleNewModel = (modelInfo: modelInfo) => {
    // update current model info
    setModelInfo(modelInfo);
    // append to the list of models loaded in the scene
    setSceneModelsInfoList((prevState) => [...prevState, modelInfo]);
  };

  const updateModelInfo = (modelInfo: modelInfo) => {
    setModelInfo(modelInfo);
  }
  const updateModelInfoUUID = (id: number, newUUID: string) => {
    setSceneModelsInfoList(
      prevState => prevState.map(
        (model) => model.id == id ? {...model, uuid:newUUID}: model )
    )
  };
  const removeModelInfo = (idToRemove: number) => {
    if (sceneModelsInfoList.length !== 0){
      const indexToRemove = sceneModelsInfoList.findIndex(item => item.id === idToRemove);
      if (indexToRemove !== -1){
        sceneModelsInfoList.splice(indexToRemove, 1);
      }
    }
    //console.log(idToRemove);
  };
  const [modelInfoToRemove, setmodelInfoToRemove] = useState<modelInfo | null>(null);
  //console.log(modelInfoToRemove);
  console.log(sceneModelsInfoList);
  return (
    <ModelContext.Provider
      value={{
        modelInfo, 
        sceneModelsInfoList,
        setModelInfo: handleNewModel,
        updateModelInfo,
        updateModelInfoUUID,
        modelInfoToRemove,
        setmodelInfoToRemove,
        removeModelInfo,
      }}
    >
      {children}
    </ModelContext.Provider>
  );
};

const useModel = () => {
  const context = useContext(ModelContext);
  if (context === undefined) {
    throw new Error(
      "useModelContext must be used within a ModelContextProvider",
    );
  }
  return context;
};

export { ModelContextProvider, useModel };
