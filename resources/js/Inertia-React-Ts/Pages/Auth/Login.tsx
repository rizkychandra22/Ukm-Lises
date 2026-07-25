import { Head } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Moon, Sun } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Initialize theme based on document class or localStorage
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark' || (!storedTheme && document.documentElement.classList.contains('dark'))) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        setIsDark(!isDark);
        if (!isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        (e.target as HTMLFormElement).submit();
    };

    return (
        <div className="min-h-screen flex w-full">
            <Head title="Login Admin" />

            {/* Left Panel - Hidden on mobile */}
            <div className="hidden lg:flex w-[55%] bg-gradient-gold p-12 flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-ink font-bold text-2xl tracking-tighter uppercase font-display">Lises Asmarandana</h2>
                </div>
                
                <div className="relative z-10 space-y-6 max-w-lg">
                    <h1 className="text-4xl lg:text-5xl font-extrabold text-ink leading-tight font-display">
                        Manajemen Organisasi,<br/>Disederhanakan.
                    </h1>
                    <p className="text-ink/80 text-lg leading-relaxed">
                        Kelola data anggota, pantau agenda kegiatan latihan, tangani persetujuan acara, dan awasi inventaris — semuanya dalam satu tempat.
                    </p>
                    
                    <div className="flex flex-wrap gap-3 mt-8">
                        <span className="px-4 py-2 bg-ink/10 border border-ink/20 rounded-full text-ink font-medium text-sm">Manajemen Anggota</span>
                        <span className="px-4 py-2 bg-ink/10 border border-ink/20 rounded-full text-ink font-medium text-sm">Jadwal Latihan</span>
                        <span className="px-4 py-2 bg-ink/10 border border-ink/20 rounded-full text-ink font-medium text-sm">Event & Penugasan</span>
                        {/* <span className="px-4 py-2 bg-ink/10 border border-ink/20 rounded-full text-ink font-medium text-sm">Pelacakan Inventaris</span> */}
                    </div>
                </div>

                <div className="relative z-10 text-ink/70 text-sm">
                    Sistem Manajemen Internal Lises Realese v1.0
                </div>

                {/* Decorative glow effects */}
                <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-ink/5 rounded-full blur-[80px]" />
                <div className="absolute bottom-[-10%] left-[-20%] w-[50%] h-[50%] bg-white/20 rounded-full blur-[80px]" />
            </div>
            
            {/* Right Panel - Form */}
            <div className="w-full lg:w-[45%] bg-background text-foreground flex flex-col items-center justify-center p-8 relative transition-colors duration-300">
                {/* Theme Toggle */}
                <button 
                    type="button"
                    onClick={toggleTheme}
                    className="absolute top-6 right-6 p-2 rounded-lg border border-border bg-card hover:bg-muted transition-colors text-muted-foreground"
                    aria-label="Toggle Theme"
                >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <div className="w-full max-w-[400px]">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold mb-2 tracking-tight text-foreground">Selamat datang kembali</h2>
                        <p className="text-muted-foreground text-sm">Masuk ke akun Anda untuk melanjutkan</p>
                    </div>

                    <form action="/auth/login" method="POST" onSubmit={handleSubmit} className="space-y-6">
                        <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
                        
                        <div className="space-y-2">
                            <Label htmlFor="username">Akun</Label>
                            <Input
                                type="text"
                                name="username"
                                id="username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="h-12 bg-background"
                                placeholder="Username"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Kata Sandi</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-12 bg-background pr-12"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="captcha">Captcha <span className="text-destructive">*</span></Label>
                            <div className="flex gap-4">
                                <Input
                                    type="text"
                                    id="captcha"
                                    className="h-12 flex-1 bg-background"
                                    placeholder="Masukkan captcha"
                                />
                                <div className="w-[120px] h-12 bg-white rounded-md border border-border flex items-center justify-center relative overflow-hidden select-none">
                                    <div className="absolute inset-0">
                                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 48">
                                            <g stroke="#537b75" strokeWidth="1.5" strokeLinecap="round">
                                                {/* Noise lines */}
                                                <path d="M 10 20 Q 30 45 60 35 T 115 15" fill="none" strokeDasharray="2,3" />
                                                <path d="M 75 45 L 115 15" fill="none" strokeDasharray="1,2" />
                                                
                                                {/* Crosses */}
                                                <path d="M 22 15 L 26 15 M 24 13 L 24 17" />
                                                <path d="M 30 22 L 34 22 M 32 20 L 32 24" />
                                                <path d="M 88 12 L 92 12 M 90 10 L 90 14" />
                                                <path d="M 64 34 L 68 34 M 66 32 L 66 36" />
                                                <path d="M 104 25 L 108 25 M 106 23 L 106 27" />
                                                <path d="M 94 20 L 98 20 M 96 18 L 96 22" />
                                            </g>
                                            
                                            {/* Blurry text */}
                                            <text x="56" y="34" fontFamily="monospace" fontSize="28" fontWeight="bold" fill="#537b75" textAnchor="middle" className="blur-[1.5px]" transform="rotate(-5 60 24) skewX(10)">0276</text>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 mt-6 text-base font-semibold"
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                "Masuk"
                            )}
                        </Button>
                        
                        <div className="text-center pt-8">
                            <p className="text-xs text-muted-foreground">
                                Sistem Management Operasional Lises Asmarandana
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
