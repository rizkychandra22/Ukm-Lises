import { Head, useForm } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";

export default function Register({ majors }: { majors: any[] }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: "",
    major_id: "",
    year: "",
    whatsapp: "",
    instagram: "",
    image: null as File | null,
  });

  const [selectedFaculty, setSelectedFaculty] = useState("");
  const uniqueFaculties = Array.from(new Set(majors?.map((m: any) => m.faculty_id))).filter(
    Boolean,
  );
  const filteredMajors = selectedFaculty
    ? majors?.filter((m: any) => m.faculty_id === selectedFaculty)
    : [];

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (
      storedTheme === "dark" ||
      (!storedTheme && document.documentElement.classList.contains("dark"))
    ) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/member/registration", {
      onSuccess: () => {
        reset();
      },
      onError: () => {
        toast.error("Mohon isi dan lengkapi formulir pendaftaran ini dengan benar.");
      },
    });
  };

  return (
    <div className="min-h-screen flex w-full">
      <Toaster position="top-right" richColors />
      <Head title="Registrasi Anggota Baru" />

      {/* Left Panel - Hidden on mobile */}
      <div className="hidden lg:flex w-[50%] bg-gradient-gold p-8 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10 flex items-center justify-between">
          <h2 className="text-ink font-bold text-base tracking-tighter uppercase font-display">
            Lises Asmarandana
          </h2>
          {/* <Link href="/" className="flex items-center text-ink/80 hover:text-ink transition-colors text-sm font-medium gap-2">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link> */}
        </div>

        <div className="relative z-10 space-y-4 max-w-md">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-ink leading-tight font-display">
            Mari Bergabung Bersama
            <br />
            Keluarga Lises!
          </h1>
          <p className="text-ink/80 text-base leading-relaxed">
            Daftarkan diri Anda untuk menjadi bagian dari Unit Kegiatan Mahasiswa (UKM) Lingkung
            Seni Lises Asmarandana Universitas Muhammadiyah Sukabumi.
          </p>

          <div className="flex flex-wrap gap-2 mt-6">
            <span className="px-3 py-1.5 bg-ink/10 border border-ink/20 rounded-full text-ink font-medium text-xs">
              Seni Tari Tradisional
            </span>
            <span className="px-3 py-1.5 bg-ink/10 border border-ink/20 rounded-full text-ink font-medium text-xs">
              Seni Musik Tradisional
            </span>
            <span className="px-3 py-1.5 bg-ink/10 border border-ink/20 rounded-full text-ink font-medium text-xs">
              Event Kesenian
            </span>
          </div>
        </div>

        <div className="relative z-10 text-ink/70 text-xs">
          Pendaftaran Anggota Baru UKM Lises Asmarandana
        </div>

        {/* Decorative glow effects */}
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-ink/5 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[50%] h-[50%] bg-white/20 rounded-full blur-[80px]" />
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[50%] bg-background text-foreground flex flex-col items-center justify-center p-6 relative transition-colors duration-300">
        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-2 rounded-lg border border-border bg-card hover:bg-muted transition-colors text-muted-foreground"
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="w-full max-w-[400px]">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-1 tracking-tight text-foreground">
              Formulir Pendaftaran
            </h2>
            <p className="text-muted-foreground text-xs">
              Isi data di bawah ini untuk bergabung di Lises Asmarandana
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nama Lengkap <span className="text-destructive">*</span>
              </Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                className="h-10 bg-background text-sm"
                placeholder="Masukkan nama lengkap"
              />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="faculty">
                  Fakultas <span className="text-destructive">*</span>
                </Label>
                <select
                  id="faculty"
                  value={selectedFaculty}
                  onChange={(e) => {
                    setSelectedFaculty(e.target.value);
                    setData("major_id", "");
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled>
                    Pilih Fakultas
                  </option>
                  {uniqueFaculties.map((faculty: any, idx) => (
                    <option key={idx} value={faculty}>
                      {faculty}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="major_id">
                  Jurusan <span className="text-destructive">*</span>
                </Label>
                <select
                  id="major_id"
                  name="major_id"
                  value={data.major_id}
                  onChange={(e) => setData("major_id", e.target.value)}
                  disabled={!selectedFaculty}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled>
                    Pilih Jurusan
                  </option>
                  {filteredMajors.map((major: any) => (
                    <option key={major.id} value={major.id}>
                      {major.name_id}
                    </option>
                  ))}
                </select>
                {errors.major_id && (
                  <p className="text-xs text-destructive mt-1">{errors.major_id}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">
                Angkatan Masuk <span className="text-destructive">*</span>
              </Label>
              <Input
                type="text"
                name="year"
                id="year"
                maxLength={4}
                value={data.year}
                onChange={(e) => setData("year", e.target.value.replace(/\D/g, ""))}
                className="h-10 bg-background text-sm"
                placeholder="Contoh: 2024"
              />
              {errors.year && <p className="text-xs text-destructive mt-1">{errors.year}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">
                No. WhatsApp <span className="text-destructive">*</span>
              </Label>
              <Input
                type="text"
                name="whatsapp"
                id="whatsapp"
                value={data.whatsapp}
                onChange={(e) => setData("whatsapp", e.target.value)}
                className="h-10 bg-background text-sm"
                placeholder="Contoh: 081234567890"
              />
              {errors.whatsapp && (
                <p className="text-xs text-destructive mt-1">{errors.whatsapp}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">
                Username Instagram <span className="text-destructive">*</span>
              </Label>
              <Input
                type="text"
                name="instagram"
                id="instagram"
                value={data.instagram}
                onChange={(e) => setData("instagram", e.target.value)}
                className="h-10 bg-background text-sm"
                placeholder="Contoh: @lisesasmarandana"
              />
              {errors.instagram && (
                <p className="text-xs text-destructive mt-1">{errors.instagram}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Foto Profil (Opsional)</Label>
              <Input
                type="file"
                name="image"
                id="image"
                accept="image/*"
                onChange={(e) => setData("image", e.target.files ? e.target.files[0] : null)}
                className="bg-background text-sm file:text-foreground file:bg-muted file:border-0 file:rounded-md file:px-2 file:py-1 file:mr-2"
              />
              {errors.image && <p className="text-xs text-destructive mt-1">{errors.image}</p>}
            </div>

            <Button
              type="submit"
              disabled={processing}
              className="w-full h-10 mt-2 text-sm font-semibold"
            >
              {processing ? (
                <svg
                  className="animate-spin h-5 w-5 text-current"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Daftar Sekarang"
              )}
            </Button>

            <div className="text-center pt-4">
              <p className="text-xs text-muted-foreground">
                Sistem Manajemen Internal Ukm Lises Realese v1.7.0
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
