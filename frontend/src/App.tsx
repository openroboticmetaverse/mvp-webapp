import TheViewer from "./TheViewer.tsx";
import DefaultLayout from "@/components/default-layout.tsx";

function App() {
  return (
    <div className="h-screen">
      <TheViewer />;
      <DefaultLayout />
    </div>
  );
}

export default App;
