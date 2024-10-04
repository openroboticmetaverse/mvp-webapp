import MainScene from "./components/3d/MainScene.tsx";
import { SimpleScene } from "./components/3d/SimpleScene.tsx";
import DefaultLayout from "@/components/default-layout.tsx";

function App() {
  return (
    <div className="h-screen">
      <MainScene />
      <DefaultLayout />
    </div>
  );
}

export default App;
