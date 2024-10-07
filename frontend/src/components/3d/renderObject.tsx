import { ObjectData } from "../../api/sceneService";

/**
 * Renders a 3D object according to the given ObjectData.
 * The object is clickable; when clicked, it sets the selected ID to the ID of the object.
 *
 * @param obj The ObjectData to render.
 * @param setSelectedId The callback to set the selected ID.
 * @returns A JSX element representing the object mesh.
 */
export const renderObject = (
  obj: ObjectData,
  setSelectedId: (id: string) => void
) => {
  return (
    <mesh onClick={() => setSelectedId(obj.id)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshMatcapMaterial color={obj.color} />
    </mesh>
  );
};
