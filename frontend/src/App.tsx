import TheViewer from "./TheViewer.tsx";
import DefaultLayout from "@/components/default-layout.tsx";

function App() {
  return (
    <div className="flex overflow-y-hidden">
      <TheViewer />;
      <DefaultLayout />
    </div>
  );
}

export default App;
