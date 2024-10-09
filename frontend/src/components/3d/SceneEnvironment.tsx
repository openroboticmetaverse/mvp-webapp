import React from "react";
import {
  GizmoHelper,
  GizmoViewport,
  Grid,
  OrbitControls,
  StatsGl,
} from "@react-three/drei";

/**
 * SceneEnvironment component renders the environment for the scene.
 * It includes a grid, a set of lights, an orbit control, and a gizmo helper.
 * The gizmo helper provides a viewport gizmo that displays the scene axis and
 * the camera position.
 *
 * The grid is infinite and has a fade distance of 120 units. The section color
 * is set to 0xdee2e6 and the cell color is set to 0xdee2e6. The section size is
 * set to 10 units and the cell size is set to 1 unit. The fade strength is set
 * to 2.
 *
 * The ambient light has an intensity of 0.5 and the point light has a position
 * of [10, 10, 10].
 *
 * The StatsGl component is used to display the frame rate and other statistics.
 *
 * The GizmoHelper component is used to display the gizmo viewport. The
 * alignment is set to "bottom-right" and the margin is set to [70, 70].
 */
const SceneEnvironment: React.FC = () => {
  return (
    <>
      <OrbitControls makeDefault />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Grid
        args={[10, 100]}
        infiniteGrid
        fadeDistance={120}
        sectionColor={0xdee2e6}
        cellColor={0xdee2e6}
        sectionSize={10}
        cellSize={1}
        fadeStrength={2}
      />
      <StatsGl />
      <GizmoHelper alignment="bottom-right" margin={[70, 70]}>
        <GizmoViewport
          axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
          labelColor="white"
        />
      </GizmoHelper>
    </>
  );
};

export default SceneEnvironment;
