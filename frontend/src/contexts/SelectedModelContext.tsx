import { createContext, ReactNode, useContext, useState } from "react";

interface ModelContextType {
  modelName: string | null;
  sceneModelsList: Array<string>;
  setModelName: (modelName: string) => void;
  modelUUID: string | null;
  setModelUUID: (modelName: string) => void;
  sceneModelsUUIDList: Array<string>;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

const ModelContextProvider = ({ children }: { children: ReactNode }) => {
  const [modelName, setModelName] = useState<string | null>(null);
  const [sceneModelsList, setSceneModelsList] = useState<Array<string>>([]);
  const [sceneModelsUUIDList, setSceneModelsUUIDList] = useState<Array<string>>(
    []
  );

  const [modelUUID, setModelUUID] = useState<string | null>(null);
  const handleSelectedModel = (modelName: string) => {
    setModelName(modelName);
    setSceneModelsList((prevState) => [...prevState, modelName]);
  };
  const handleModelUUID = (modelUUID: string) => {
    setModelUUID(modelUUID);
    setSceneModelsUUIDList((prevState) => [...prevState, modelUUID]);
  };

  console.log(sceneModelsUUIDList);
  return (
    <ModelContext.Provider
      value={{
        modelName,
        setModelName: handleSelectedModel,
        sceneModelsList,
        modelUUID,
        sceneModelsUUIDList,
        setModelUUID: handleModelUUID,
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
      "useModelContext must be used within a ModelContextProvider"
    );
  }
  return context;
};

export { ModelContextProvider, useModel };
