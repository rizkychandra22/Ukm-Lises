import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AppLayout from "../../Layouts/AppLayout";
import { route } from "../../Lib/Route";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Activity, Layers } from "lucide-react";
import { toast } from "sonner";
import { SystemProps } from "../Feature/Dev/Types";
import { SystemOverview } from "../Feature/Dev/Components/SystemOverview";
import { CacheManagement } from "../Feature/Dev/Components/CacheManagement";
import { SystemLogs } from "../Feature/Dev/Components/SystemLogs";

export default function IndexSystem({ envInfo, diskInfo, dbInfo, sysInfo, logs }: SystemProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { post, processing } = useForm({
    type: "",
  });

  const handleClearCache = (type: string) => {
    post(route("system.clear-cache", { type }), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success(`Berhasil mengeksekusi aksi: ${type}`);
      },
      onError: () => {
        toast.error(`Gagal mengeksekusi aksi: ${type}`);
      },
    });
  };

  const isHealthy = dbInfo.status === "Connected" && diskInfo.usage_percent < 90;

  return (
    <AppLayout>
      <Head title="IT System Dashboard" />
      <div className="flex flex-col gap-4 max-w-7xl mx-auto pb-12 relative">
        {/* Header Section */}
        <div className="w-full">
          <div className="flex flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-foreground font-display tracking-tight flex items-center">
              <Layers className="w-5 h-5 mr-3 text-primary" /> System Dashboard
            </h2>
            <div className="flex shrink-0 mt-1 sm:mt-0">
              <Badge variant={isHealthy ? "default" : "destructive"} className="text-xs">
                <Activity className="mr-1 w-3 h-3" />
                {isHealthy ? "Healthy" : "Issues Detected"}
              </Badge>
            </div>
          </div>
          <p className="w-full text-sm text-muted-foreground mt-1">
            Server health, infrastructure, scheduled jobs, and caching control.
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="w-full border-b border-border">
          <div className="flex flex-col sm:flex-row gap-4 w-full items-start sm:items-center">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full sm:w-auto relative"
            >
              <TabsList className="grid grid-cols-3 w-full sm:flex sm:w-auto h-auto p-0 bg-transparent sm:gap-6 justify-start rounded-none border-none">
                <TabsTrigger
                  value="overview"
                  className="rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1.5 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="cache"
                  className="rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1.5 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground"
                >
                  Cache / Optimization
                </TabsTrigger>
                <TabsTrigger
                  value="logs"
                  className="rounded-none border-b-2 border-transparent px-1 pb-2.5 pt-1.5 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none hover:text-foreground"
                >
                  Logs
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Tab Content Wrapper */}
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="overview" className="mt-0 space-y-4">
            <SystemOverview
              sysInfo={sysInfo}
              dbInfo={dbInfo}
              diskInfo={diskInfo}
              envInfo={envInfo}
              processing={processing}
              onClearCache={handleClearCache}
            />
          </TabsContent>

          <TabsContent value="cache" className="mt-0 space-y-4">
            <CacheManagement processing={processing} onClearCache={handleClearCache} />
          </TabsContent>

          <TabsContent value="logs" className="mt-0 space-y-4">
            <SystemLogs logs={logs} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
