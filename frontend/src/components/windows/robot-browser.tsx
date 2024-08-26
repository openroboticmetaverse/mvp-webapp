import WindowCard from "@/components/ui/window-card.tsx";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Bot, Box, Cylinder, Globe } from "lucide-react";
import { useModel } from "@/contexts/SelectedModelContext.tsx";

const RobotBrowser = () => {
  // Load the global context function to update the recently selected model info
  // and the list of infos of all the models loaded in the scene
  const { setModelInfo } = useModel();

  // Define the list of available models infos
  // TODO: Each modelInfo should have a name, a react-generated unique id and a
  // threejs-generated unique uuid.
  // The react-generated unique id should be used to identify and delete the model.
  // The threejs-generated  uuid can be used to delete the mesh.
  // For now, the loaded models such as franka, sawyer use the same uuid as the
  // mesh is just imported from an external urdf file. Therefore, uuid can't be
  // used to delete the robots.
  const robotsList = [
    {
      name: "Cube",
      description: "A basic cube",
      icon: <Box size={50} />,
      lastUpdated: "June 2024",
      id: Date.now(),
    },
    {
      name: "Sphere",
      description: "A basic sphere",
      icon: <Globe size={50} />,
      id: Date.now(),
    },
    {
      name: "Cylinder",
      description: "A basic cylinder",
      icon: <Cylinder size={50} />,
      id: Date.now(),
    },
    {
      name: "Franka",
      description: "A Franka Emika robot arm",
      icon: <Bot size={50} />,
      id: Date.now(),
    },
    {
      name: "Sawyer",
      description: "A Sawyer robot arm",
      icon: <Bot size={50} />,
      id: Date.now(),
    },
    {
      name: "Motocortex",
      description: "A Motocortex robot arm",
      icon: <Bot size={50} />,
      id: Date.now(),
    },
  ];

  // Update the global context vairbales  `modelInfo` and `sceneModelsInfoList`
  // when the user clicks on the model icon div.
  const handleSelectedModel = (modelInfo: {
    name: string;
    id: number;
    uuid: string;
  }) => {
    setModelInfo(modelInfo);
  };

  return (
    <div className="flex flex-wrap  gap-5 ">
      {robotsList.map(({ name, description, icon, lastUpdated, id }) => {
        return (
          <HoverCard openDelay={200} closeDelay={200} key={name}>
            <HoverCardTrigger>
              <div
                onClick={() =>
                  handleSelectedModel({ name: name, id: id, uuid: "" })
                }
                className="rounded border hover:bg-white p-2
                hover:bg-opacity-25 hover:text-muted cursor-pointer"
              >
                {icon}
              </div>
            </HoverCardTrigger>
            <HoverCardContent>
              <WindowCard
                description={description}
                title={name}
                lastUpdated={lastUpdated}
              />
            </HoverCardContent>
          </HoverCard>
        );
      })}
    </div>
  );
};

export default RobotBrowser;
