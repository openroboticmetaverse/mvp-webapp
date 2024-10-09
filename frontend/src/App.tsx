import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import MainScene from "./components/MainScene";
import DefaultLayout from "@/components/default-layout";
//import { sceneStore } from "./stores/scene-store";

const App: React.FC = observer(() => {
  /*   useEffect(() => {
    sceneStore.fetchReferenceData();
  }, []); */
  return (
    <div className="h-screen">
      {/* {sceneStore.selectedScene && (
        <MainScene sceneId={String(sceneStore.selectedScene.id || 1)} />
      )} */}
      <MainScene />
      <DefaultLayout children={undefined} />
    </div>
  );
});

export default App;
