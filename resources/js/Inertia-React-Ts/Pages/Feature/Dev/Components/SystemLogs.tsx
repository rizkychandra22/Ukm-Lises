import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldAlert, RefreshCcw, Terminal } from "lucide-react";

interface Props {
  logs: string[];
}

export function SystemLogs({ logs }: Props) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Error Log Viewer</CardTitle>
          <CardDescription>
            Membaca 100 baris terakhir dari <code>storage/logs/laravel.log</code>.
          </CardDescription>
        </div>
        <ShieldAlert className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="bg-black/90 dark:bg-black text-green-400 font-mono text-xs p-4 rounded-md overflow-hidden relative">
          <div className="absolute top-2 right-2 flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-6 w-6 bg-transparent text-white hover:text-black border-white/20"
              onClick={() => window.location.reload()}
              title="Refresh Logs"
            >
              <RefreshCcw className="h-3 w-3" />
            </Button>
          </div>
          <ScrollArea className="h-[400px] w-full pr-4">
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <div 
                  key={index} 
                  className={`mb-1 pb-1 border-b border-white/10 ${log.toLowerCase().includes('error') || log.toLowerCase().includes('exception') ? 'text-red-400 font-bold' : ''}`}
                >
                  {log}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                <Terminal className="mr-2 h-4 w-4" />
                Log file kosong atau tidak ditemukan.
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
