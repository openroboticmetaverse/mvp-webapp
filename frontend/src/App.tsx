import Scene from "./components/3d/Scene.tsx";
import TheViewer from "./TheViewer.tsx";
import DefaultLayout from "@/components/default-layout.tsx";

function App() {
  return (
    <div className="h-screen">
      <Scene />;
      <DefaultLayout />
    </div>
  );
}

export default App;
