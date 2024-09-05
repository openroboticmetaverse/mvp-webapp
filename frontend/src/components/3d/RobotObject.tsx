import React, { useState, useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { LoaderUtils } from "three";
import { XacroLoader } from "xacro-parser";
import URDFLoader from "urdf-loader";
import { Object3D } from "three";
import CustomObject3D from "./CustomObject3D";

interface RobotObjectProps {
  name: string;
  type: string;
  sceneId: string;
  position: [number, number, number];
}

const RobotObject: React.FC<RobotObjectProps> = ({
  name,
  type,
  sceneId,
  position,
}) => {
  const [robotUrl, setRobotUrl] = useState<string | null>(null);
  const robotRef = useRef<Object3D | null>(null);
  const { scene } = useThree();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const robotUrls: { [key: string]: string } = {
      panda:
        "https://raw.githubusercontent.com/openroboticmetaverse/robot-description/main/packages/franka_description/robots/panda_arm_hand.urdf.xacro",
      sawyer:
        "https://raw.githubusercontent.com/openroboticmetaverse/mvp-test/master/assets/models/sawyer_description/urdf/sawyer_rocksi_arm.urdf.xacro",
    };

    setRobotUrl(robotUrls[type]);
  }, [type]);

  useEffect(() => {
    if (!robotUrl) return;

    const loadRobot = async () => {
      try {
        const response = await fetch(robotUrl);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const xacroLoader = new XacroLoader();
        (xacroLoader as any).rospackCommands = {
          find: function (pkg: any) {
            switch (pkg) {
              case "moveit_resources_panda_description":
                return "https://raw.githubusercontent.com/moveit/moveit_resources/ros2/panda_description";
              case "franka_description":
                return "https://raw.githubusercontent.com/openroboticmetaverse/robot-description/main/packages/franka_description";
              case "sawyer":
                return "https://raw.githubusercontent.com/openroboticmetaverse/mvp-test/master/assets/models/sawyer_description";
              case " robotiq_2f_85_gripper_visualization":
                return "https://raw.githubusercontent.com/openroboticmetaverse/mvp-test/master/assets/models/robotiq_3f_gripper_visualization";
            }
          },
        };

        xacroLoader.load(
          robotUrl,
          (xml) => {
            const urdfLoader = new URDFLoader();
            const workingPath = LoaderUtils.extractUrlBase(robotUrl);
            urdfLoader.workingPath = workingPath;
            urdfLoader.packages =
              "https://raw.githubusercontent.com/openroboticmetaverse/robot-description/main/packages";

            const robot = urdfLoader.parse(xml);
            robot.rotation.set(-Math.PI / 2, 0, 0);
            robot.scale.set(2, 2, 2);
            robot.setJointValue("panda_joint6", -1.04);
            robot.setJointValue("panda_joint2", 2.04);
            robot.setJointValue("panda_joint4", 1.04);
            robot.setJointValue("panda_joint3", 3.04);
            robot.setJointValue("panda_joint5", -1.04);
            robotRef.current = robot;
            setIsLoading(false);
          },
          (progress) => {
            console.log(`[RobotObject] XacroLoader progress:`, progress);
          }
        );
      } catch (err) {
        console.error(`[RobotObject] Error in loadRobot:`, err);
        setError(err instanceof Error ? err.message : "Failed to load robot");
        setIsLoading(false);
      }
    };

    loadRobot();

    return () => {
      if (robotRef.current) {
        scene.remove(robotRef.current);
      }
    };
  }, [robotUrl, scene]);

  if (!robotUrl) {
    console.warn(`No robot model found for type: ${type}`);
    return null;
  }

  if (isLoading) {
    return (
      <CustomObject3D position={position} sceneId={sceneId} name={name}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshMatcapMaterial color="gray" />
        </mesh>
      </CustomObject3D>
    );
  }

  if (error) {
    return (
      <CustomObject3D position={position} sceneId={sceneId} name={name}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshMatcapMaterial color="red" />
        </mesh>
      </CustomObject3D>
    );
  }

  return (
    <CustomObject3D position={position} sceneId={sceneId} name={name}>
      {robotRef.current && <primitive object={robotRef.current} />}
    </CustomObject3D>
  );
};

export default RobotObject;
