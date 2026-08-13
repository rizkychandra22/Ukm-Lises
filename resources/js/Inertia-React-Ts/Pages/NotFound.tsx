import { Component, JSX, type ReactNode } from "react";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Frown } from "lucide-react";
import DashboardLayout from "../Layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { route } from "@admin/Lib/Route";

interface NotFoundProps {
  readonly status?: number;
}

export default function NotFound(_: NotFoundProps): JSX.Element {
  return (
    <DashboardLayout>
      <Head title="Halaman Tidak Ditemukan" />

      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 w-full">
        <div className="h-24 w-24 bg-red-500/10 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-6">
          <Frown className="h-12 w-12" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3 font-display">
          Oops! Halaman Tidak Ditemukan
        </h1>
        <p className="text-muted-foreground max-w-md mb-8 text-base leading-relaxed">
          Maaf, halaman atau rute yang Anda cari tidak tersedia, telah dipindahkan, atau metode
          aksesnya tidak diizinkan.
        </p>
        <Button
          asChild
          className="h-10 px-6 rounded-full font-medium shadow-sm transition-all hover:scale-105 active:scale-95"
        >
          <Link href={route("dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Dashboard
          </Link>
        </Button>
      </div>
    </DashboardLayout>
  );
}

interface ErrorBoundaryProps {
  readonly children: ReactNode;
}

interface ErrorBoundaryState {
  readonly hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return {
      hasError: true,
    };
  }

  // public componentDidCatch(): void {
  //   // Integrasikan logger seperti Sentry/Bugsnag bila diperlukan.
  // }

  public render(): ReactNode {
    if (this.state.hasError) {
      return <NotFound />;
    }

    return this.props.children;
  }
}
