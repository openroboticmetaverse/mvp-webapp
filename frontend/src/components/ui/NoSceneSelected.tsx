import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Box, Bot, Plus, Loader, Rotate3D, Move3D } from "lucide-react";
import { sceneStore } from "@/stores/scene-store";
import { errorLoggingService } from "@/services/error-logging-service";
import { observer } from "mobx-react";

const messages = [
  "Ready to create your next masterpiece?",
  "The stage is set, waiting for your direction",
  "A blank canvas for your robotic dreams",
  "Where will your imagination take you today?",
  "The future of robotics starts with a single scene",
  "Shaping the future of robotics, one scene at a time",
  "Your next robotics project awaits",
];

const NoSceneSelected = observer(() => {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [isCreatingScene, setIsCreatingScene] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(messages[Math.floor(Math.random() * messages.length)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleCreateScene = async () => {
    setIsCreatingScene(true);
    setError(null);
    try {
      const currentDate = new Date();
      const sceneName = `New Scene - ${currentDate.toLocaleString()}`;
      await sceneStore.fetchScenes();

      const newScene = await sceneStore.createScene({
        name: sceneName,
        description: "A new scene created from the dashboard.",
      });

      if (!newScene || !newScene.id) {
        throw new Error("Failed to create new scene");
      }

      await sceneStore.setActiveScene(newScene.id);

      // Verify that the active scene has been set correctly
      if (sceneStore.activeSceneId !== newScene.id) {
        throw new Error("Failed to set the new scene as active");
      }

      errorLoggingService.info(`Created and activated new scene: ${sceneName}`);
    } catch (error) {
      const errorMessage =
        (error as Error).message || "An unknown error occurred";
      setError(errorMessage);
      errorLoggingService.error(
        "Failed to create or activate scene",
        error as Error
      );
    } finally {
      setIsCreatingScene(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#121212] text-gray-300 font-sans">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{
            rotate: [0, 5, 0, -5, 0],
            scale: [1, 1.1, 1, 1.1, 1],
          }}
          transition={{ repeat: Infinity, duration: 10 }}
          className="relative mb-8 w-40 h-40 mx-auto"
        >
          <Box size={80} className="text-gray-500 absolute inset-0 m-auto" />
          <Rotate3D
            size={30}
            className="text-gray-300 absolute top-10 left-0"
          />
          <Bot size={60} className="text-gray-300 absolute bottom-2 right-0" />
          <Move3D
            size={30}
            className="text-gray-300 absolute bottom-0 left-0"
          />
        </motion.div>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-3xl font-bold mb-4 text-white"
        >
          No Scene Selected
        </motion.h2>
        <motion.p
          key={currentMessage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-lg text-gray-400 mb-8"
        >
          {currentMessage}
        </motion.p>
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 mb-4"
          >
            Error: {error}
          </motion.p>
        )}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCreateScene}
          disabled={isCreatingScene}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full flex items-center justify-center mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreatingScene ? (
            <>
              <Loader className="mr-2 animate-spin" /> Creating Scene...
            </>
          ) : (
            <>
              <Plus className="mr-2" /> Create New Scene
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
});

export default NoSceneSelected;
