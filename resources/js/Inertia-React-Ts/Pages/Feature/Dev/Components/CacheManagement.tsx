import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface Props {
  processing: boolean;
  onClearCache: (type: string) => void;
}

export function CacheManagement({ processing, onClearCache }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cache Management</CardTitle>
        <CardDescription>
          Mengontrol penyimpanan sementara aplikasi Laravel. Bersihkan cache jika ada perubahan file
          `.env`, *routing*, atau *views* yang tidak langsung muncul.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="border rounded-lg p-4 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="font-semibold text-sm">Optimize / Clear All</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Menjalankan <code>php artisan optimize:clear</code>. Ini akan menghapus semua file
                cache termasuk route, config, dan view cache.
              </p>
            </div>
            <Button disabled={processing} onClick={() => onClearCache("optimize")}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Clear All Cache
            </Button>
          </div>

          <div className="border rounded-lg p-4 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="font-semibold text-sm">Route Cache</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Menjalankan <code>php artisan route:clear</code>. Gunakan ini jika ada penambahan
                rute API atau Web baru yang tidak terdeteksi.
              </p>
            </div>
            <Button variant="secondary" disabled={processing} onClick={() => onClearCache("route")}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Clear Route Cache
            </Button>
          </div>

          <div className="border rounded-lg p-4 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="font-semibold text-sm">Config Cache</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Menjalankan <code>php artisan config:clear</code>. Wajib dijalankan setiap kali
                melakukan perubahan pada file <code>.env</code>.
              </p>
            </div>
            <Button
              variant="secondary"
              disabled={processing}
              onClick={() => onClearCache("config")}
            >
              <RefreshCcw className="mr-2 h-4 w-4" /> Clear Config Cache
            </Button>
          </div>

          <div className="border rounded-lg p-4 flex flex-col justify-between space-y-4">
            <div>
              <h4 className="font-semibold text-sm">View Cache</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Menjalankan <code>php artisan view:clear</code>. Menghapus cache file Blade yang
                sudah di-compile.
              </p>
            </div>
            <Button variant="secondary" disabled={processing} onClick={() => onClearCache("view")}>
              <RefreshCcw className="mr-2 h-4 w-4" /> Clear View Cache
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
