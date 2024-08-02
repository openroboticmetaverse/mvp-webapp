import { createContext, ReactNode, useContext, useState } from "react";

interface ModelContextType {
  modelName: string | null;
  sceneModelsList: Array<string>;
  setModelName: (modelName: string) => void;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

const ModelContextProvider = ({ children }: { children: ReactNode }) => {
  const [modelName, setModelName] = useState<string | null>(null);
  const [sceneModelsList, setSceneModelsList] = useState<Array<string>>([]);
  const handleSelectedModel = (modelName: string) => {
    setModelName(modelName);
    setSceneModelsList((prevState) => [...prevState, modelName]);
  };
  return (
    <ModelContext.Provider
      value={{ modelName, setModelName: handleSelectedModel, sceneModelsList }}
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
