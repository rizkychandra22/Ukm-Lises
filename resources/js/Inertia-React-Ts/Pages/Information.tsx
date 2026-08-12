import { Head, usePage } from "@inertiajs/react";
import AppLayout from "../Layouts/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Layers, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SystemProps } from "./Feature/Dev/Types";
import { FaPhp, FaLaravel, FaNodeJs, FaReact, FaDesktop, FaServer, FaDatabase, FaClock } from "react-icons/fa6";
import React from "react";

interface Props {
  dbInfo: SystemProps["dbInfo"];
  envInfo: SystemProps["envInfo"];
}

export default function Information({ dbInfo, envInfo }: Props) {
  return(
    <AppLayout>
      <Head title="Release Information" />
      <div className="flex flex-col gap-4 max-w-7xl mx-auto pb-12 relative">
        {/* Header Section */}
        <div className="flex flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground font-display tracking-tight flex items-center">
              <Layers className="w-5 h-5 mr-3 text-rose-500" /> System Information
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Detailed information regarding the server infrastructure running the application.
            </p>
          </div>
          <div className="flex shrink-0 mt-1 sm:mt-0">
            <Badge variant="default" className="text-xs">
              <Rocket className="mr-1 w-3 h-3" />
              {(usePage().props as any).web_version || "Release v0.0.0"}
            </Badge>
          </div>
        </div>

        {/* <div className="w-full border-b border-border mt-2" /> */}

        <Card className="shadow-sm border-primary">
          <CardContent className="pt-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none flex items-center gap-1.5"><FaPhp className="text-indigo-500 w-4 h-4" /> PHP Version</p>
                <p className="text-sm text-muted-foreground">{envInfo.php_version}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none flex items-center gap-1.5"><FaLaravel className="text-red-500 w-4 h-4" /> Laravel Version</p>
                <p className="text-sm text-muted-foreground">{envInfo.laravel_version}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none flex items-center gap-1.5"><FaNodeJs className="text-green-500 w-4 h-4" /> Node Version</p>
                <p className="text-sm text-muted-foreground">{envInfo.node_version}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none flex items-center gap-1.5"><FaReact className="text-blue-500 w-4 h-4" /> React Version</p>
                <p className="text-sm text-muted-foreground">{React.version}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none flex items-center gap-1.5"><FaDesktop className="text-slate-500 w-4 h-4" /> Operating System</p>
                <p className="text-sm text-muted-foreground">{envInfo.os}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none flex items-center gap-1.5"><FaServer className="text-gray-500 w-4 h-4" /> Web Server</p>
                <p className="text-sm text-muted-foreground">{envInfo.server}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none flex items-center gap-1.5"><FaDatabase className="text-teal-500 w-4 h-4" /> Database Name</p>
                <p className="text-sm text-muted-foreground">{dbInfo.connection === "pgsql" ? "PostgreSQL" : dbInfo.connection === "mysql" ? "MySQL" : "Unknown"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none flex items-center gap-1.5"><FaClock className="text-orange-500 w-4 h-4" /> Timezone</p>
                <p className="text-sm text-muted-foreground">{envInfo.timezone}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div >
    </AppLayout>
  )
}