import { IObject } from "@/types/Interfaces";

/**
 * Renders a 3D object according to the given ObjectData.
 * The object is clickable; when clicked, it sets the selected ID to the ID of the object.
 *
 * @param obj The ObjectData to render.
 * @param setSelectedId The callback to set the selected ID.
 * @returns A JSX element representing the object mesh.
 */
export const renderObject = (
  obj: IObject,
  setSelectedId: (id: string | null) => void
) => {
  return (
    <mesh
      onClick={(event) => {
        event.stopPropagation();
        setSelectedId(obj.id);
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshMatcapMaterial color={obj.color} />
    </mesh>
  );
};
