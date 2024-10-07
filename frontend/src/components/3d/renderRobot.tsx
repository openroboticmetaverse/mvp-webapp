import { RobotData } from "@/types/Interfaces";

/**
 * Renders a 3D representation of a robot. The placeholder mesh is a box with the given color,
 * and it is clickable. When clicked, it sets the selected ID to the ID of the
 * robot.
 *
 * @param robot The robot data to render.
 * @param setSelectedId The callback to set the selected ID.
 * @returns A JSX element representing the robot mesh.
 */
export const renderRobot = (
  robot: RobotData,
  setSelectedId: (id: string | null) => void
) => {
  return (
    <mesh
      onClick={(event) => {
        event.stopPropagation();
        setSelectedId(robot.id);
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};
