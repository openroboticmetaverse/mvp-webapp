# Contributing to open robotic metaverse - frontend mvp

## Table of Contents
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Code Style Guidelines](#code-style-guidelines)
- [Making Contributions](#making-contributions)
- [Testing](#testing)
- [Documentation](#documentation)
- [Reporting Issues](#reporting-issues)

## Getting Started

Thank you for considering contributing to Open Robotic Metaverse! This document will guide you through the contribution process.

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Basic knowledge of React, TypeScript, and Three.js
- Understanding of WebSocket communication
- Familiarity with MobX state management

## Development Setup

1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/openroboticmetaverse/mvp-webapp.git
cd mvp-webapp
```

3. Docker Compose 🐳

```bash
docker compose up -d
```

4. Start Development Server

```bash
docker exec -it mvp_frontend /bin/bash
```

In the container console:

```bash
yarn
```

```bash
yarn dev --host
```

## Project Structure

The project follows a modular architecture:

```
src/
├── components/
│   ├── 3d/          # Three.js components
│   ├── ui/          # UI components
│   └── windows/     # Window system components
├── stores/          # MobX stores
├── services/        # Application services
├── types/          # TypeScript types
└── utils/          # Utility functions
```

### Key Components

1. **Robot Components**: Handle 3D robot models and animations
Reference: 

```171:218:frontend/src/components/3d/MCXRobot.tsx
const MCXRobot: React.FC<MCXRobotProps> = ({
  modelUrl,
  position = [0, 0, 0],
  rotation = [-1.5707963267948966, 0, 0],
  scale = [1, 1, 1],
  jointConfig = DEFAULT_JOINT_CONFIG,
  websocketConfig,
  id = "mcx-robot",
  debug = false,
}) => {
  // Refs
  const groupRef = useRef<THREE.Group>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
  const reconnectAttemptsRef = useRef(0);
  const reconnectAttemptsRef = useRef(0);
  // State
  const [isConnected, setIsConnected] = useState(false);
  const [jointStates, setJointStates] = useState<Record<string, number>>({});
  const [jointStates, setJointStates] = useState<Record<string, number>>({});
  // Load the GLTF model with error handling
  const gltf = useLoader(GLTFLoader, modelUrl, (loader) => {
    loader.manager.onError = (url) => {
      errorLoggingService.error(
        `Failed to load resource: ${url}`,
        new Error(`Failed to load resource: ${url}`),
        { robotId: id }
      );
    };
  });
  });
  /**
   * Handle incoming WebSocket message
   */
  const handleWebSocketMessage = useCallback(
    (message: WebSocketMessage) => {
      if (message.jointPositions) {
        setJointStates(message.jointPositions);
        if (debug) {
          errorLoggingService.debug(`Received joint positions`, {
            robotId: id,
            jointPositions: message.jointPositions,
          });
          });
        }
    },
    [id, debug]
  );
```


2. **Scene Management**: Manages 3D scene and object placement
Reference:

```14:63:frontend/src/components/3d/DemoScene.tsx
const DemoScene: React.FC = () => {
  // Optional custom joint configuration
  const jointConfig_1 = [
    { name: "Base", axis: "" as const },
    { name: "Link1", axis: "rz" as const },
    { name: "Link2", axis: "ry" as const },
    { name: "Link3", axis: "ry" as const },
    { name: "Link4", axis: "rz" as const },
    { name: "Link5", axis: "ry" as const },
    { name: "Link6", axis: "rz" as const },
  ];

  const jointConfig_2 = [
    { name: "Base", axis: "" as const },
    { name: "Link1", axis: "rz" as const },
    { name: "Link2", axis: "ry" as const },
    { name: "Link3", axis: "ry" as const },
    { name: "Link4", axis: "ry" as const },
    { name: "Link5", axis: "rz" as const },
    { name: "Link6", axis: "ry" as const },
  ];

  const websocketConfig_1 = {
    url: "ws://localhost:8765",
    //url: "ws://localhost:8082/",
    reconnectAttempts: 5,
    reconnectInterval: 5000,
    messageType: "joint_states", // Optional: specify if server sends typed messages
  };
  const websocketConfig_2 = {
    //url: "ws://134.61.134.249:8081/",
    url: "ws://localhost:8765",
    reconnectAttempts: 5,
    reconnectInterval: 5000,
    messageType: "joint_states",
  };
  /*   const websocketConfig_Local = {
    url: "ws://localhost:8085",
    reconnectAttempts: 5,
    reconnectInterval: 5000,
    messageType: "joint_states",
  };
 */

  const rosConfig = {
    url: "localhost",
    port: "9090",
    topicName: "/joint_states",
    messageType: "sensor_msgs/JointState",
  };
```


## Code Style Guidelines

### TypeScript Usage
- Use strict type checking
- Define interfaces for all props
- Avoid using `any` type
- Use proper type annotations

Example:
```typescript
interface RobotProps {
  modelUrl: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  jointConfig?: JointConfig[];
  websocketConfig: WebSocketConfig;
  id?: string;
  debug?: boolean;
}
```

### Component Structure
1. Use functional components with TypeScript
2. Implement error boundaries
3. Use proper loading states
4. Handle WebSocket connections properly

Reference:

```195:248:frontend/src/components/3d/SceneRobot.tsx
  const handleWebSocketMessage = (data: {
    jointPositions: Record<string, number>;
  }) => {
    /* errorLoggingService.info(
      `Received WebSocket data for robot ${robot.id}:`,
      data
    ); */
    if (data && data.jointPositions) {
      jointAngles.current = data.jointPositions;
    } else {
      errorLoggingService.warn(
        `Received unexpected data structure for robot ${robot.id}:`,
        data
      );
    }
  };
  };
  const applyJointAngles = useCallback(
    (
      model: THREE.Object3D,
      config: { name: string; axis: "rx" | "ry" | "rz" | "" }[],
      angles: Record<string, number>
    ) => {
      model.traverse((child) => {
        if (child instanceof THREE.Object3D) {
          const jointConfigItem = config.find(
            (item) => item.name === child.name
          );
          if (jointConfigItem && jointConfigItem.axis !== "") {
            const angle = angles[jointConfigItem.name];
            if (typeof angle === "number") {
              switch (jointConfigItem.axis) {
                case "rx":
                  child.rotation.x = angle;
                  break;
                case "ry":
                  child.rotation.y = angle;
                  break;
                case "rz":
                  child.rotation.z = angle;
                  break;
              }
              /* errorLoggingService.info(
                `Applied rotation to joint ${child.name}: ${angle} on axis ${jointConfigItem.axis}`
              ); */
            } else {
              errorLoggingService.warn(`No angle data for joint ${child.name}`);
            }
            }
          }
      });
    },
    []
  );
```


### State Management
1. Use MobX stores for state management
2. Implement proper actions and computed properties
3. Follow proper store patterns

Reference:

```922:949:frontend/src/stores/scene-store.ts
  @computed
  get allSimulationsRunning() {
    return Array.from(this.websocketStatus.values()).every(
      (status) => status === "connected"
    );
  }
  @computed
  @action
  updateWebSocketStatus(robotId: string, status: WebSocketStatus) {
    this.websocketStatus.set(robotId, status);
    errorLoggingService.info(
      `WebSocket status updated in store for robot ${robotId}: ${status}`
    );
  }
  updateWebSocketStatus(robotId: string, status: WebSocketStatus) {
  @computed
  get overallWebSocketStatus(): WebSocketStatus {
    const statuses = Array.from(this.websocketStatus.values());
    errorLoggingService.info(
      `Current WebSocket statuses: ${JSON.stringify(Object.fromEntries(this.websocketStatus))}`
    );
  @computed
    if (statuses.length === 0) return "disconnected";
    if (statuses.every((status) => status === "connected")) return "connected";
    if (statuses.some((status) => status === "error")) return "error";
    if (statuses.some((status) => status === "connecting")) return "connecting";
    return "disconnected";
  }
```


## Making Contributions

1. Create a new branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes following the code style guidelines

3. Commit your changes:
```bash
git commit -m "feat: add new feature description"
```

Follow conventional commit messages:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `refactor:` for refactoring
- `test:` for test additions/changes

4. Push to your fork and create a Pull Request

## Testing

1. Write tests for new features
2. Ensure existing tests pass
3. Test WebSocket connections
4. Verify 3D rendering performance

### Error Handling
Implement proper error logging:
```typescript
errorLoggingService.error(
  "Error message",
  error as Error,
  { contextData: "value" }
);
```

## Documentation

1. Add JSDoc comments for new components and functions
2. Update README.md when adding new features
3. Document WebSocket message formats
4. Include usage examples

Example documentation:
```typescript
/**
 * Robot model component that handles the GLTF model and joint animations
 * @param props - Component properties
 * @param props.modelUrl - URL to the GLTF model
 * @param props.jointConfig - Joint configuration array
 */
```

## Reporting Issues

When reporting issues, please include:
1. Description of the issue
2. Steps to reproduce
3. Expected behavior
4. Actual behavior
5. Browser and environment details
6. Screenshots if applicable
7. Error messages and stack traces


## Questions?

If you have questions, please:
1. Check existing issues
2. Review documentation
3. Join our Discord community
4. Contact maintainers
