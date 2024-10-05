import React, { useState, useEffect } from "react";
import { HashLoader } from "react-spinners";
import { motion } from "framer-motion";

const loadingMessages = [
  "Oiling the joints...",
  "Calibrating sensors...",
  "Loading objects...",
  "Connecting to the server...",
  "Initializing scene...",
  "Setting up robots...",
  "Fetching data...",
  "Rendering magic...",
  "Almost there...",
  "Preparing workspace...",
  "Waking up the robots",
  "Entering the metaverse...",
  "Teaching robots to dance...",
  "Untangling virtual wires...",
  "Polishing pixels to perfection...",
  "Convincing AI not to take over...",
  "Reticulating splines...",
  "Generating witty loading messages...",
  "Solving captchas for robots...",
  "Buffering buffering...",
  "Herding digital cats...",
  "Applying laws of physics...",
  "Downloading more RAM...",
  "Charging flux capacitors...",
  "Tuning quantum harmonics...",
  "Aligning parallel universes...",
  "Feeding the hamsters powering the servers...",
  "Calculating the meaning of life...",
  "Inflating the cloud...",
  "Warming up the internet tubes...",
  "Convincing 1s and 0s to get along...",
  "Preparing to bend reality...",
  "Crafting robot parts...",
  "Mining for rare earth magnets...",
  "Gathering redstone for circuits...",
  "Spawning helper bots...",
  "Generating robot biomes...",
  "Rendering chunks of code...",
  "Taming wild algorithms...",
  "Smelting silicon for chips...",
  "Assembling blocky robots...",
  "Enchanting servos with efficiency...",
  "Digging for buried features...",
  "Placing robot spawn eggs...",
  "Brewing potions of optimization...",
  "Building redstone computers...",
  "Crafting diamond-tipped soldering irons...",
  "Exploring randomly generated algorithms...",
  "Collecting XP for robot upgrades...",
  "Respawning crashed processes...",
];

const LoadingScreen = () => {
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingMessage(
        loadingMessages[Math.floor(Math.random() * loadingMessages.length)]
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col justify-between bg-[#121212] text-gray-300 font-sans">
      <div className="flex-grow flex justify-center items-center">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <HashLoader size={80} color={"#e0e0e0"} loading={true} />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-white">
              Loading Scene
            </h2>
            <motion.p
              key={loadingMessage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-lg text-gray-400"
            >
              {loadingMessage}
            </motion.p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
