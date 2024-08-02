import TheViewer from "./TheViewer.tsx";
import DefaultLayout from "@/components/default-layout.tsx";
import { ModelContextProvider } from "@/contexts/SelectedModelContext.tsx";
function App() {
  return (
    <ModelContextProvider>
      <div className="flex overflow-y-hidden">
        <TheViewer className="bg-black" />;
        <DefaultLayout />
      </div>
    </ModelContextProvider>
  );
}

export default App;
