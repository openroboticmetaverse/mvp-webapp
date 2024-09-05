import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

const WebGLNotSupported = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tl from-[#242625] to-[#313131] p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <Card className="max-w-md w-full bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl relative z-10">
        <CardHeader>
          <div className="flex items-center justify-center">
            <AlertTriangle className="w-16 h-16 text-orange-300" />
          </div>
          <CardTitle className="text-3xl font-bold text-center mt-4 text-white">
            WebGL Not Supported
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert
            variant="destructive"
            className="mb-6 bg-red-500/20 border-red-400/50 backdrop-blur-sm"
          >
            <AlertTitle className="text-white text-lg font-semibold">
              Compatibility Issue
            </AlertTitle>
            <AlertDescription className="text-white/90">
              Your device or browser doesn't support WebGL, which is required to
              visit our metaverse
            </AlertDescription>
          </Alert>
          <p className="text-center text-white/80 mb-4 text-lg">
            Please try updating your browser or using a different device.
          </p>

          <p className="text-center text-white/80 mb-4 text-lg">
            You can read more here:{" "}
            <a className="text-blue-200" href="https://get.webgl.org/">
              get.webgl.org
            </a>
          </p>
        </CardContent>
        <CardFooter className="flex justify-center center gap-3 container mx-auto">
          <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/50 backdrop-blur-sm transition-all duration-300 text-lg">
            <a href="mailto:support@openroboticmetaverse.org">
              Contact Support
            </a>
          </Button>
          <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/50 backdrop-blur-sm transition-all duration-300 text-lg">
            <a href="https://openroboticmetaverse.org">Visit Website </a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default WebGLNotSupported;
