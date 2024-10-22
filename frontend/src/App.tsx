import React from "react";
import { observer } from "mobx-react-lite";
import MainScene from "./components/MainScene";
import DefaultLayout from "@/components/default-layout";
import { errorLoggingService } from "./services/error-logging-service";
import DemoScene from "./components/3d/DemoScene";

// Enable logging in development mode
if (process.env.NODE_ENV === "development") {
  errorLoggingService.enable();
}

const App: React.FC = observer(() => {
  return (
    <div className="h-screen">
      {/* <MainScene /> */}
      <DemoScene />
      <DefaultLayout children={undefined} />
    </div>
  );
});

export default App;
