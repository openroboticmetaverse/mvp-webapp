import MainScene from "./components/3d/MainScene";
import DefaultLayout from "@/components/default-layout";
import { Provider } from "mobx-react";
import { sceneStore } from "./stores/scene-store";

export default function App() {
  return (
    <div className="h-screen">
      <Provider sceneStore={sceneStore}>
        <MainScene sceneId={sceneStore.selectedScene?.id || "1"} />
        <DefaultLayout />
      </Provider>
    </div>
  );
}
