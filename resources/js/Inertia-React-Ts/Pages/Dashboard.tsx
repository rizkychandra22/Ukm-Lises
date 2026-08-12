import { Head, usePage } from "@inertiajs/react";
import { Users, UserMinus, UserCheck, GraduationCap, Rocket, MousePointerClick, Image, Newspaper, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "../Layouts/AppLayout";
import { Badge } from "@/components/ui/badge";

interface User {
  id: number;
  name?: string;
  username?: string;
  roles?: string[];
}

interface SharedProps {
  auth: {
    user: User;
  };
  stats?: {
    total_anggota: number;
    demisioner: number;
    kepengurusan: number;
    total_angkatan: number;
    total_pengunjung: number;
    total_galeri: number;
    total_berita: number;
    total_event: number;
  };
  [key: string]: unknown;
}

export default function Dashboard() {
  const { auth, stats } = usePage<SharedProps>().props;
  const user = auth.user;

  const hasRole = (roleNames: string | string[]) => {
    if (!user?.roles) return false;
    if (Array.isArray(roleNames)) {
      return roleNames.some((role) => user.roles?.includes(role));
    }
    return user.roles.includes(roleNames);
  };

  return (
    <AdminLayout>
      <Head title="Dashboard" />

      <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12 relative">
        {/* Header Section */}
        <div className="flex flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground font-display tracking-tight">
              Dashboard
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {hasRole("Developer") ? (
                <>
                  Halo{" "}
                  <i>
                    <b>{user?.roles?.[0]}</b>
                  </i>
                  , selamat datang kembali, silakan pantau data web dan server Anda.
                </>
              ) : hasRole("Admin") ? (
                <>
                  Halo{" "}
                  <i>
                    <b>{user?.name}</b>
                  </i>
                  , selamat datang kembali di pusat management internal <b>Lises Asmarandana</b>.
                </>
              ) : hasRole("User") ? (
                <>
                  Halo Angkatan{" "}
                  <i>
                    <b>{user?.name}</b>
                  </i>
                  , selamat datang kembali di <b>Lises Asmarandana</b>. Silahkan lihat daftar teman
                  angkatan kalian yaa.
                </>
              ) : null}
            </p>
          </div>
          <div className="flex shrink-0 mt-1 sm:mt-0">
            <Badge variant="default" className="text-xs">
              <Rocket className="mr-1 w-3 h-3" />
              {(usePage().props as any).web_version || "Release v0.0.0"}
            </Badge>
          </div>
        </div>

        {/* Stats Cards Section */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
            {/* Card 1: Total Anggota */}
            <Card className="border-l-4 border-l-indigo-500 shadow-sm rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-5">
                <CardTitle className="tracking-tight text-xs sm:text-sm font-medium text-muted-foreground">
                  Total Anggota
                </CardTitle>
                <Users className="h-4 w-4 text-indigo-500" />
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <div className="text-2xl sm:text-3xl font-bold">{stats.total_anggota}</div>
                <p className="text-[10px] sm:text-[12px] text-muted-foreground leading-tight mt-1">
                  Demisioner & Kepengurusan
                </p>
              </CardContent>
            </Card>

            {/* Card 2: Demisioner */}
            <Card className="border-l-4 border-l-amber-500 shadow-sm rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-5">
                <CardTitle className="tracking-tight text-xs sm:text-sm font-medium text-muted-foreground">
                  Demisioner
                </CardTitle>
                <UserMinus className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <div className="text-2xl sm:text-3xl font-bold">{stats.demisioner}</div>
                <p className="text-[10px] sm:text-[12px] text-muted-foreground leading-tight mt-1">
                  Data seluruh demisioner
                </p>
              </CardContent>
            </Card>

            {/* Card 3: Kepengurusan */}
            <Card className="border-l-4 border-l-emerald-500 shadow-sm rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-5">
                <CardTitle className="tracking-tight text-xs sm:text-sm font-medium text-muted-foreground">
                  Kepengurusan
                </CardTitle>
                <UserCheck className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <div className="text-2xl sm:text-3xl font-bold">{stats.kepengurusan}</div>
                <p className="text-[10px] sm:text-[12px] text-muted-foreground leading-tight mt-1">
                  Data seluruh kepengurusan
                </p>
              </CardContent>
            </Card>

            {/* Card 4: Total Angkatan */}
            <Card className="border-l-4 border-l-rose-500 shadow-sm rounded-xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-5">
                <CardTitle className="tracking-tight text-xs sm:text-sm font-medium text-muted-foreground">
                  Total Angkatan
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-rose-500" />
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                <div className="text-2xl sm:text-3xl font-bold">{stats.total_angkatan}</div>
                <p className="text-[10px] sm:text-[12px] text-muted-foreground leading-tight mt-1">
                  Data total angkatan
                </p>
              </CardContent>
            </Card>

            {!hasRole("User") && (
              <>
                {/* Card 5: Total Pengunjung */}
                <Card className="border-l-4 border-l-indigo-500 shadow-sm rounded-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-5">
                    <CardTitle className="tracking-tight text-xs sm:text-sm font-medium text-muted-foreground">
                      Total Pengunjung
                    </CardTitle>
                    <MousePointerClick className="h-4 w-4 text-indigo-500" />
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                    <div className="text-2xl sm:text-3xl font-bold">{stats.total_pengunjung}</div>
                    <p className="text-[10px] sm:text-[12px] text-muted-foreground leading-tight mt-1">
                      Data klik dan kunjungan web
                    </p>
                  </CardContent>
                </Card>

                {/* Card 6: Total Galeri */}
                <Card className="border-l-4 border-l-amber-500 shadow-sm rounded-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-5">
                    <CardTitle className="tracking-tight text-xs sm:text-sm font-medium text-muted-foreground">
                      Total Galeri
                    </CardTitle>
                    <Image className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                    <div className="text-2xl sm:text-3xl font-bold">{stats.total_galeri}</div>
                    <p className="text-[10px] sm:text-[12px] text-muted-foreground leading-tight mt-1">
                      Data seluruh galeri foto
                    </p>
                  </CardContent>
                </Card>

                {/* Card 7: Total Berita */}
                <Card className="border-l-4 border-l-emerald-500 shadow-sm rounded-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-5">
                    <CardTitle className="tracking-tight text-xs sm:text-sm font-medium text-muted-foreground">
                      Total Berita
                    </CardTitle>
                    <Newspaper className="h-4 w-4 text-emerald-500" />
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                    <div className="text-2xl sm:text-3xl font-bold">{stats.total_berita}</div>
                    <p className="text-[10px] sm:text-[12px] text-muted-foreground leading-tight mt-1">
                      Data seluruh artikel berita
                    </p>
                  </CardContent>
                </Card>

                {/* Card 8: Total Event */}
                <Card className="border-l-4 border-l-rose-500 shadow-sm rounded-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-3 sm:p-5">
                    <CardTitle className="tracking-tight text-xs sm:text-sm font-medium text-muted-foreground">
                      Total Event
                    </CardTitle>
                    <CalendarDays className="h-4 w-4 text-rose-500" />
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                    <div className="text-2xl sm:text-3xl font-bold">{stats.total_event}</div>
                    <p className="text-[10px] sm:text-[12px] text-muted-foreground leading-tight mt-1">
                      Data seluruh kegiatan event
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
