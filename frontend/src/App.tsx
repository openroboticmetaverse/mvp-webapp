import { SimpleScene } from "./components/3d/SimpleScene.tsx";
import DefaultLayout from "@/components/default-layout.tsx";

function App() {
  return (
    <div className="h-screen">
      <SimpleScene />
      <DefaultLayout />
    </div>
  );
}

export default App;
