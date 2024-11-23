import { observer } from "mobx-react-lite";
import { sceneStore, objectStore } from "@/stores/scene-store";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { runInAction } from "mobx";

const PropertiesPanel = observer(() => {
  const selectedObject = sceneStore.selectedItem;

  if (!selectedObject) {
    return <div>No object selected</div>;
  }

  const handlePropertyChange = (property: string, value: string | number) => {
    if (!selectedObject) return;
    
    // Batch all updates into a single object
    const updates: any = {};
    
    // Use more efficient property updates
    if (property.startsWith("position.") || property.startsWith("orientation.") || property.startsWith("scale.")) {
      const [prop, axis] = property.split(".");
      const index = axis === "x" ? 0 : axis === "y" ? 1 : 2;
      
      // Only create a new array if we don't already have one for this property
      if (!updates[prop]) {
        updates[prop] = [...selectedObject[prop]];
      }
      updates[prop][index] = Number(value);
    } else {
      updates[property] = value;
    }

    // Apply all updates in a single transaction
    runInAction(() => {
      objectStore.updateObject(selectedObject.id, updates);
    });
  };

  return (
    <div className="flex flex-col gap-4 h-[600px] overflow-y-auto p-4">
      <div className="text-lg font-bold mb-2">{selectedObject.name || "Properties"}</div>
      
      {/* Basic Properties */}
      <div className="space-y-2">
        <Label>Name</Label>
        <Input 
          value={selectedObject.name || ""} 
          onChange={(e) => handlePropertyChange("name", e.target.value)}
          className="text-black"
        />
      </div>

      {/* Position */}
      <div className="space-y-2">
        <Label>Position</Label>
        <div className="grid grid-cols-3 gap-2">
          {["x", "y", "z"].map((axis, index) => (
            <div key={`position-${axis}`}>
              <Label>{axis.toUpperCase()}</Label>
              <Input 
                type="number"
                value={selectedObject.position[index]}
                onChange={(e) => handlePropertyChange(`position.${axis}`, e.target.value)}
                step="0.1"
                className="text-black"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Orientation */}
      <div className="space-y-2">
        <Label>Orientation</Label>
        <div className="grid grid-cols-3 gap-2">
          {["x", "y", "z"].map((axis, index) => (
            <div key={`orientation-${axis}`}>
              <Label>{axis.toUpperCase()}</Label>
              <Input 
                type="number"
                value={selectedObject.orientation[index]}
                onChange={(e) => handlePropertyChange(`orientation.${axis}`, e.target.value)}
                step="0.1"
                className="text-black"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Scale */}
      <div className="space-y-2">
        <Label>Scale</Label>
        <div className="grid grid-cols-3 gap-2">
          {["x", "y", "z"].map((axis, index) => (
            <div key={`scale-${axis}`}>
              <Label>{axis.toUpperCase()}</Label>
              <Input 
                type="number"
                value={selectedObject.scale[index]}
                onChange={(e) => handlePropertyChange(`scale.${axis}`, e.target.value)}
                step="0.1"
                className="text-black"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

export default PropertiesPanel;
