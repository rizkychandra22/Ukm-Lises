import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Cpu, Database, HardDrive, Server, Zap, Code } from "lucide-react";
import { SystemProps } from "../Types";

interface Props {
  sysInfo: SystemProps["sysInfo"];
  dbInfo: SystemProps["dbInfo"];
  diskInfo: SystemProps["diskInfo"];
  envInfo: SystemProps["envInfo"];
  processing: boolean;
  onClearCache: (type: string) => void;
}

export function SystemOverview({ sysInfo, dbInfo, diskInfo, envInfo, processing, onClearCache }: Props) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
        {/* CPU / MEMORY Card */}
        <Card className="border-l-4 border-l-emerald-500 shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-5">
            <CardTitle className="tracking-tight text-xs sm:text-sm font-medium text-muted-foreground">
              PHP Memory Usage
            </CardTitle>
            <Cpu className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-bold">{sysInfo.memory_usage}</div>
            <p className="text-[10px] sm:text-[12px] text-muted-foreground leading-tight mt-1">
              Peak: {sysInfo.memory_peak}
            </p>
          </CardContent>
        </Card>

        {/* Database Connections */}
        <Card className="border-l-4 border-l-indigo-500 shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-5">
            <CardTitle className="tracking-tight text-xs sm:text-sm font-medium text-muted-foreground">
              DB Pool / Connections
            </CardTitle>
            <Database className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-bold">{dbInfo.active_connections}</div>
            <p className="text-[10px] sm:text-[12px] text-muted-foreground leading-tight mt-1">
              Active threads ({dbInfo.connection})
            </p>
          </CardContent>
        </Card>

        {/* Storage */}
        <Card className="border-l-4 border-l-amber-500 shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-5">
            <CardTitle className="tracking-tight text-xs sm:text-sm font-medium text-muted-foreground">
              Local Disk Space
            </CardTitle>
            <HardDrive className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-bold">{diskInfo.free}</div>
            <p className="text-[10px] sm:text-[12px] text-muted-foreground leading-tight mt-1">
              Free of {diskInfo.total}
            </p>
            <Progress value={diskInfo.usage_percent} className="h-1 mt-2" />
          </CardContent>
        </Card>

        {/* Environment */}
        <Card className="border-l-4 border-l-rose-500 shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-5">
            <CardTitle className="tracking-tight text-xs sm:text-sm font-medium text-muted-foreground">
              Environment
            </CardTitle>
            <Server className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
            <div className="text-2xl sm:text-3xl font-bold capitalize">{envInfo.environment}</div>
            <p className="text-[10px] sm:text-[12px] text-muted-foreground leading-tight mt-1 truncate">
              Debug: {envInfo.debug_mode ? "Enabled" : "Disabled"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-7">
        {/* Resource Utilization Details */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>
              Informasi detail mengenai infrastruktur server yang menjalankan aplikasi.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">PHP Version</p>
                  <p className="text-sm text-muted-foreground">{envInfo.php_version}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Laravel Version</p>
                  <p className="text-sm text-muted-foreground">{envInfo.laravel_version}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Node Version</p>
                  <p className="text-sm text-muted-foreground">{envInfo.node_version}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">React Version</p>
                  <p className="text-sm text-muted-foreground">{React.version}</p>
                </div>
              </div>
              
              {/* Right Column */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Operating System</p>
                  <p className="text-sm text-muted-foreground">{envInfo.os}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Web Server</p>
                  <p className="text-sm text-muted-foreground truncate">{envInfo.server}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Database Name</p>
                  <p className="text-sm text-muted-foreground">{dbInfo.database_name}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Timezone</p>
                  <p className="text-sm text-muted-foreground">{envInfo.timezone}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jalan pintas untuk optimasi sistem.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              disabled={processing}
              onClick={() => onClearCache("optimize")}
            >
              <Zap className="mr-2 h-4 w-4" />
              Optimize All Cache
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              disabled={processing}
              onClick={() => window.open('/sitemap.xml', '_blank')}
            >
              <Code className="mr-2 h-4 w-4" />
              Check Sitemap XML
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
