import { useMemo, useState } from "react";
import AppLayout from "@admin/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";
import { Activity, ArrowUpDown, MousePointerClick } from "lucide-react";
import { SystemProps } from "../Feature/Dev/Types";
import { DataTable } from "../../Components/DataTable";
import { LegacyColumnDef as ColumnDef } from "@tanstack/react-table/legacy";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Visitor {
  id: number;
  ip_address: string;
  device_name: string;
  visit_date: string;
  created_at: string;
}

export interface LogVisitorProps extends SystemProps {
  guests: Visitor[];
}

export default function LogVisitor({ dbInfo, diskInfo, guests }: LogVisitorProps) {
  const isHealthy = dbInfo.status === "Connected" && diskInfo.usage_percent < 90;

  const [dateFilter, setDateFilter] = useState("all");
  const [deviceFilter, setDeviceFilter] = useState("all");

  const filteredData = useMemo(() => {
    return guests.filter((g) => {
      if (dateFilter !== "all" && g.visit_date !== dateFilter) return false;
      if (deviceFilter !== "all" && (g.device_name || "Unknown") !== deviceFilter) return false;
      return true;
    });
  }, [guests, dateFilter, deviceFilter]);

  const uniqueDates = useMemo(() => {
    return Array.from(new Set(guests.map((g) => g.visit_date))).sort((a, b) => (a < b ? 1 : -1));
  }, [guests]);

  const uniqueDevices = useMemo(() => {
    return Array.from(new Set(guests.map((g) => g.device_name || "Unknown"))).sort();
  }, [guests]);

  const columns = useMemo<ColumnDef<Visitor, any>[]>(
    () => [
      {
        accessorKey: "ip_address",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            IP Address <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: Visitor } }) => (
          <span className="font-mono font-medium text-sm text-foreground">
            {row.original.ip_address}
          </span>
        ),
      },
      {
        accessorKey: "device_name",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Device Name <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: Visitor } }) => (
          <span className="font-medium text-sm text-foreground">
            {row.original.device_name || "Unknown"}
          </span>
        ),
      },
      {
        accessorKey: "visit_date",
        header: ({ column }: { column: any }) => (
          <Button
            variant="ghost"
            className="-ml-4 hover:bg-transparent text-sm font-semibold"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tanggal Kunjungan <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }: { row: { original: Visitor } }) => (
          <span className="font-medium text-sm text-foreground">
            {new Date(row.original.visit_date).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <AppLayout>
      <Head title="Log Visitor" />
      <div className="flex flex-col gap-4 max-w-7xl mx-auto pb-12 relative">
        {/* Header Section */}
        <div className="w-full">
          <div className="flex flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-foreground font-display tracking-tight flex items-center">
              <MousePointerClick className="w-5 h-5 mr-3 text-primary" /> Log Visitor
            </h2>
            <div className="flex shrink-0 mt-1 sm:mt-0">
              <Badge variant={isHealthy ? "default" : "destructive"} className="text-xs">
                <Activity className="mr-1 w-3 h-3" />
                {isHealthy ? "Healthy" : "Issues Detected"}
              </Badge>
            </div>
          </div>
          <p className="w-full text-sm text-muted-foreground mt-1">
            List of visitor data for the website Ukm Lises
          </p>
        </div>

        <div className="w-full border-b border-border mt-2" />

        <DataTable
          columns={columns}
          data={filteredData}
          searchPlaceholder="Cari IP Address atau Device..."
          mobileLayout="row"
          toolbarExtra={
            <div className="flex gap-2 w-full sm:w-auto">
              <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                <SelectTrigger className="flex-1 sm:w-[130px] h-8 text-[13px]">
                  <SelectValue placeholder="Pilih Device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Device</SelectItem>
                  {uniqueDevices.map((dev) => (
                    <SelectItem key={dev} value={dev}>
                      {dev}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="flex-1 sm:w-[150px] h-8 text-[13px]">
                  <SelectValue placeholder="Pilih Tanggal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tanggal</SelectItem>
                  {uniqueDates.map((date) => (
                    <SelectItem key={date} value={date}>
                      {new Date(date).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
        />
      </div>
    </AppLayout>
  );
}
