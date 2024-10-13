import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "@/hooks/use-toast";

/** Possible log levels */
type LogLevel = "info" | "warn" | "error" | "debug";

/** Structure of a log entry */
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

/** Configuration options for ErrorLoggingService */
interface ErrorLogConfig {
  maxLogEntries: number;
  showToastInDevelopment: boolean;
}

/**
 * Extended Error class that includes metadata
 */
class ExtendedError extends Error {
  metadata?: Record<string, any>;

  /**
   * @param message - The error message
   * @param metadata - Optional metadata associated with the error
   */
  constructor(message: string, metadata?: Record<string, any>) {
    super(message);
    this.name = "ExtendedError";
    this.metadata = metadata;
  }
}

/**
 * Service for logging errors and messages.
 * Provides toast notifications for log entries and can be enabled or disabled.
 * If disabled, only errors are logged.
 */
class ErrorLoggingService {
  private errors: ExtendedError[] = [];
  private logs: LogEntry[] = [];
  private enabled: boolean = false;
  private config: ErrorLogConfig = {
    maxLogEntries: 1000,
    showToastInDevelopment: true,
  };

  constructor() {
    makeAutoObservable(this);
  }

  /** Enable the logging service */
  enable() {
    this.enabled = true;
  }

  /** Disable the logging service. When disabled, only errors are logged */
  disable() {
    this.enabled = false;
  }

  /**
   * Internal method to log messages
   * @param level - The log level
   * @param message - The message to log
   * @param metadata - Optional metadata to include with the log
   * @param error - Optional error object
   */
  private log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, any>,
    error?: ExtendedError
  ) {
    if (!this.enabled && level !== "error") return;

    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      metadata,
    };

    runInAction(() => {
      this.logs.push(logEntry);
      if (this.logs.length > this.config.maxLogEntries) {
        this.logs.shift(); // Remove the oldest log entry
      }
      if (level === "error") {
        const extendedError = error || new ExtendedError(message, metadata);
        this.errors.push(extendedError);
      }
    });

    console[level](message, ...(metadata ? [metadata] : []), error);

    if (
      (process.env.NODE_ENV === "development" &&
        this.config.showToastInDevelopment) ||
      level === "error"
    ) {
      this.showToast(level, message);
    }
  }

  /**
   * Show a toast notification for a log entry
   * @param level - The log level
   * @param message - The message to show in the toast
   */
  private showToast(level: LogLevel, message: string) {
    toast({
      title: level.toUpperCase(),
      description: message,
      variant: level === "error" ? "destructive" : "default",
    });
  }

  /**
   * Log an info message
   * @param message - The message to log
   * @param metadata - Optional metadata to include with the log
   */
  info(message: string, metadata?: Record<string, any>) {
    this.log("info", message, metadata);
  }

  /**
   * Log a warning message
   * @param message - The message to log
   * @param metadata - Optional metadata to include with the log
   */
  warn(message: string, metadata?: Record<string, any>) {
    this.log("warn", message, metadata);
  }

  /**
   * Log an error message
   * @param message - The error message
   * @param error - Optional Error or ExtendedError object
   * @param metadata - Optional metadata to include with the log
   */
  error(
    message: string,
    error?: Error | ExtendedError,
    metadata?: Record<string, any>
  ) {
    const extendedError =
      error instanceof ExtendedError
        ? error
        : new ExtendedError(error?.message || message, metadata);
    this.log("error", message, metadata, extendedError);
  }

  /**
   * Log a debug message
   * @param message - The message to log
   * @param metadata - Optional metadata to include with the log
   */
  debug(message: string, metadata?: Record<string, any>) {
    this.log("debug", message, metadata);
  }

  /** Clear all stored errors */
  clearErrors() {
    runInAction(() => {
      this.errors = [];
    });
  }

  /** Clear all stored logs */
  clearLogs() {
    runInAction(() => {
      this.logs = [];
    });
  }

  /**
   * Get all stored errors
   * @returns An array of ExtendedError objects
   */
  getErrors(): ExtendedError[] {
    return this.errors;
  }

  /**
   * Get all stored logs
   * @returns An array of LogEntry objects
   */
  getLogs(): LogEntry[] {
    return this.logs;
  }

  /**
   * Update the service configuration
   * @param config - Partial configuration object to merge with existing config
   */
  setConfig(config: Partial<ErrorLogConfig>) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Serialize all logs to a JSON string
   * @returns A JSON string representation of all logs
   */
  serializeLogs(): string {
    return JSON.stringify(this.logs);
  }
}

export const errorLoggingService = new ErrorLoggingService();
