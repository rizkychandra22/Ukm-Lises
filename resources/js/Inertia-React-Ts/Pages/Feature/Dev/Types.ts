export interface SystemProps {
  envInfo: {
    app_name: string;
    environment: string;
    debug_mode: boolean;
    php_version: string;
    node_version: string;
    laravel_version: string;
    os: string;
    server: string;
    timezone: string;
  };
  diskInfo: {
    total: string;
    used: string;
    free: string;
    usage_percent: number;
  };
  dbInfo: {
    connection: string;
    status: string;
    active_connections: number;
  };
  sysInfo: {
    memory_usage: string;
    memory_peak: string;
  };
  logs: string[];
}
