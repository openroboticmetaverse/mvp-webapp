import { errorLoggingService } from "@/services/error-logging-service";
import { robotStore } from "@/stores/scene-store";

export type WebSocketStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

class WebSocketConnection {
  private ws: WebSocket | null = null;
  private url: string;
  private status: WebSocketStatus = "disconnected";
  private onMessageCallback: ((data: any) => void) | null = null;
  private robotId: string;

  constructor(robotId: string, url: string) {
    this.robotId = robotId;
    this.url = sanitizeWebSocketUrl(url);
  }

  private updateStatus(newStatus: WebSocketStatus) {
    this.status = newStatus;
    robotStore.updateWebSocketStatus(this.robotId, newStatus);
    errorLoggingService.info(
      `WebSocket status updated for robot ${this.robotId}: ${newStatus}`
    );
  }

  connect() {
    if (this.status === "connected" || this.status === "connecting") return;

    this.updateStatus("connecting");
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        this.updateStatus("connected");
        errorLoggingService.info(
          `WebSocket connected: ${this.url} for robot ${this.robotId}`
        );
      };

      this.ws.onmessage = (event) => {
        if (this.onMessageCallback) {
          try {
            const data = JSON.parse(event.data);
            this.onMessageCallback(data);
          } catch (error) {
            errorLoggingService.error(
              `Error parsing WebSocket message for robot ${this.robotId}`,
              error as unknown as Error
            );
          }
        }
      };

      this.ws.onerror = (error) => {
        this.updateStatus("error");
        errorLoggingService.error(
          `WebSocket error for robot ${this.robotId}: ${this.url}`,
          error as unknown as Error
        );
      };

      this.ws.onclose = () => {
        this.updateStatus("disconnected");
        errorLoggingService.info(
          `WebSocket disconnected for robot ${this.robotId}: ${this.url}`
        );
      };
    } catch (error) {
      this.updateStatus("error");
      errorLoggingService.error(
        `Error creating WebSocket for robot ${this.robotId}: ${this.url}`,
        error as Error
      );
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.updateStatus("disconnected");
  }

  getStatus(): WebSocketStatus {
    return this.status;
  }

  setOnMessageCallback(callback: (data: any) => void) {
    this.onMessageCallback = callback;
  }
}

export class WebSocketManager {
  private connections: Map<string, WebSocketConnection> = new Map();

  createConnection(robotId: string, url: string) {
    if (!this.connections.has(robotId)) {
      const connection = new WebSocketConnection(robotId, url);
      this.connections.set(robotId, connection);
      connection.connect(); // Automatically connect when creating the connection
    }
  }

  connectAll() {
    this.connections.forEach((connection) => connection.connect());
  }

  disconnectAll() {
    this.connections.forEach((connection) => connection.disconnect());
  }

  getStatus(robotId: string): WebSocketStatus {
    const connection = this.connections.get(robotId);
    return connection ? connection.getStatus() : "disconnected";
  }

  setOnMessageCallback(robotId: string, callback: (data: any) => void) {
    const connection = this.connections.get(robotId);
    if (connection) {
      connection.setOnMessageCallback(callback);
    }
  }
}

function sanitizeWebSocketUrl(url: string): string {
  // Remove any protocol prefix if present
  let cleanUrl = url.replace(/^(ws:\/\/|wss:\/\/|http:\/\/|https:\/\/)/, "");

  // Remove any path or query parameters
  cleanUrl = cleanUrl.split("/")[0];

  // Ensure it starts with ws://
  return `ws://${cleanUrl}`;
}

export const webSocketManager = new WebSocketManager();
