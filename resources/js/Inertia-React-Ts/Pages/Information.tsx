import { Head, usePage } from "@inertiajs/react";
import AppLayout from "../Layouts/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Layers, Rocket } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SystemProps } from "./Feature/Dev/Types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FaPhp,
  FaLaravel,
  FaNodeJs,
  FaReact,
  FaDesktop,
  FaServer,
  FaDatabase,
  FaClock,
} from "react-icons/fa6";
import React from "react";

export interface Release {
  id: number;
  version: string;
  title: string;
  subtitle: string | null;
  description: string;
  created_at: string;
}

interface Props {
  dbInfo: SystemProps["dbInfo"];
  envInfo: SystemProps["envInfo"];
  releases: Release[];
}

export default function Information({ dbInfo, envInfo, releases = [] }: Props) {
  return (
    <AppLayout>
      <Head title="Release Information" />
      <div className="flex flex-col gap-4 max-w-7xl mx-auto pb-12 relative">
        {/* Header Section For System Information */}
        <div className="w-full">
          <div className="flex flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-foreground font-display tracking-tight flex items-center">
              <Layers className="w-5 h-5 mr-3 text-rose-500" /> System Information
            </h2>
            <div className="flex shrink-0 mt-1 sm:mt-0">
              <Badge variant="default" className="text-xs">
                <Rocket className="mr-1 w-3 h-3" />
                {(usePage().props as any).web_version || "Release v0.0.0"}
              </Badge>
            </div>
          </div>
          <p className="w-full text-sm text-muted-foreground mt-1">
            Detailed information regarding the server infrastructure running the application.
          </p>
        </div>
        <Card className="shadow-sm border-primary">
          <CardContent className="pt-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none flex items-center gap-1.5">
                  <FaPhp className="text-indigo-500 w-4 h-4" /> PHP Version
                </p>
                <p className="text-sm text-muted-foreground">{envInfo.php_version}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none flex items-center gap-1.5">
                  <FaLaravel className="text-red-500 w-4 h-4" /> Laravel Version
                </p>
                <p className="text-sm text-muted-foreground">{envInfo.laravel_version}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none flex items-center gap-1.5">
                  <FaNodeJs className="text-green-500 w-4 h-4" /> Node Version
                </p>
                <p className="text-sm text-muted-foreground">{envInfo.node_version}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none flex items-center gap-1.5">
                  <FaReact className="text-blue-500 w-4 h-4" /> React Version
                </p>
                <p className="text-sm text-muted-foreground">{React.version}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none flex items-center gap-1.5">
                  <FaDesktop className="text-slate-500 w-4 h-4" /> Operating System
                </p>
                <p className="text-sm text-muted-foreground">{envInfo.os}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none flex items-center gap-1.5">
                  <FaServer className="text-gray-500 w-4 h-4" /> Web Server
                </p>
                <p className="text-sm text-muted-foreground">{envInfo.server}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none flex items-center gap-1.5">
                  <FaDatabase className="text-teal-500 w-4 h-4" /> Database Name
                </p>
                <p className="text-sm text-muted-foreground">
                  {dbInfo.connection === "pgsql"
                    ? "PostgreSQL"
                    : dbInfo.connection === "mysql"
                      ? "MySQL"
                      : "Unknown"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none flex items-center gap-1.5">
                  <FaClock className="text-orange-500 w-4 h-4" /> Timezone
                </p>
                <p className="text-sm text-muted-foreground">{envInfo.timezone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Header Section For Release Information */}
        <div className="flex flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground font-display tracking-tight flex items-center">
              <Rocket className="w-5 h-5 mr-3 text-emerald-500" /> Release Information
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Information regarding the release version of the application.
            </p>
          </div>
        </div>
        <Card className="shadow-sm border-primary">
          <CardContent className="pt-5">
            {releases && releases.length > 0 ? (
              <Accordion
                type="single"
                collapsible
                className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4"
              >
                {releases.map((release) => (
                  <AccordionItem
                    key={release.id}
                    value={`item-${release.id}`}
                    className="border rounded-md px-4 bg-background shadow-sm"
                  >
                    <AccordionTrigger className="hover:no-underline hover:bg-muted/50 rounded-t-md transition-colors -mx-4 px-4">
                      <div className="flex flex-row items-center text-left gap-2 sm:gap-3">
                        <Badge variant="default" className="w-fit mr-1">
                          {release.version}
                        </Badge>
                        <span className="font-medium text-[15px]">{release.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4 text-muted-foreground border-t mt-1">
                      {release.subtitle && (
                        <p className="font-semibold text-foreground mb-2">{release.subtitle}</p>
                      )}
                      <div className="whitespace-pre-wrap">{release.description}</div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-6 text-sm text-muted-foreground">
                Belum ada data rilis.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
