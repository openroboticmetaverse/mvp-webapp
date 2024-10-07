import MainScene from "./components/3d/MainScene.tsx";
import { SimpleScene } from "./components/3d/SimpleScene.tsx";
import DefaultLayout from "@/components/default-layout.tsx";
import { Provider } from "mobx-react";
import { sceneStore } from "./stores/scene-store.ts";

function App() {
  return (
    <div className="h-screen">
      <Provider sceneStore={sceneStore}>
        <MainScene sceneId="1" />
        <DefaultLayout />
      </Provider>
    </div>
  );
}

export default App;
