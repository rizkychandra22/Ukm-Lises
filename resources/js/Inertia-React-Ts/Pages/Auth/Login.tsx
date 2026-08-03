import { Head, useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Moon, Sun, AlertCircle } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        login: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isDark, setIsDark] = useState(false);

    // Captcha states
    const [captchaCode, setCaptchaCode] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaError, setCaptchaError] = useState('');

    const generateCaptcha = () => {
        const randomNum = Math.floor(1000 + Math.random() * 9000).toString();
        setCaptchaCode(randomNum);
        setCaptchaInput('');
        setCaptchaError('');
    };

    useEffect(() => {
        generateCaptcha();

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

    const [loginError, setLoginError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(false);

        // Hanya blokir jika captcha sudah diisi tapi salah
        if (captchaInput && captchaInput !== captchaCode) {
            setCaptchaError('Captcha tidak sesuai!');
            generateCaptcha();
            return;
        }

        // Jika captcha kosong, biarkan backend validasi form
        if (!captchaInput) {
            post('/auth/login', {
                onError: () => {
                    setLoginError(true);
                    generateCaptcha();
                },
                onSuccess: () => setLoginError(false),
            });
            return;
        }

        setCaptchaError('');
        post('/auth/login', {
            onError: () => {
                setLoginError(true);
                generateCaptcha();
            },
            onSuccess: () => setLoginError(false),
        });
    };

    return (
        <div className="min-h-screen flex w-full">
            <Head title="Login Admin" />

            {/* Left Panel - Hidden on mobile */}
            <div className="hidden lg:flex w-[50%] bg-gradient-gold p-8 flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-ink font-bold text-base tracking-tighter uppercase font-display">Lises Asmarandana</h2>
                </div>

                <div className="relative z-10 space-y-4 max-w-md">
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-ink leading-tight font-display">
                        Manajemen Organisasi,<br />Disederhanakan.
                    </h1>
                    <p className="text-ink/80 text-base leading-relaxed">
                        Kelola data anggota, pantau agenda kegiatan latihan, tangani persetujuan acara, dan awasi inventaris — semuanya dalam satu tempat.
                    </p>

                    <div className="flex flex-wrap gap-2 mt-6">
                        <span className="px-3 py-1.5 bg-ink/10 border border-ink/20 rounded-full text-ink font-medium text-xs">Manajemen Anggota</span>
                        <span className="px-3 py-1.5 bg-ink/10 border border-ink/20 rounded-full text-ink font-medium text-xs">Jadwal Latihan</span>
                        <span className="px-3 py-1.5 bg-ink/10 border border-ink/20 rounded-full text-ink font-medium text-xs">Event & Penugasan</span>
                        {/* <span className="px-4 py-2 bg-ink/10 border border-ink/20 rounded-full text-ink font-medium text-sm">Pelacakan Inventaris</span> */}
                    </div>
                </div>

                <div className="relative z-10 text-ink/70 text-xs">
                    Sistem Management Operasional Lises Asmarandana
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

                <div className="w-full max-w-[360px]">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-1 tracking-tight text-foreground">Selamat datang kembali</h2>
                        <p className="text-muted-foreground text-xs">Silahkan login untuk management internal</p>
                    </div>

                    {loginError && (
                        <Alert variant="destructive" className="mb-4 bg-destructive/10 border-destructive/20 text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="ml-2">
                                Silakan masukkan akun dan kata sandi yang benar
                            </AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="space-y-2">
                            <Label htmlFor="login">Akun</Label>
                            <Input
                                type="text"
                                name="login"
                                id="login"
                                value={data.login}
                                onChange={(e) => setData('login', e.target.value)}
                                className="h-10 bg-background text-sm"
                                placeholder="Username atau Email"
                            />
                            {errors.login && <p className="text-xs text-destructive mt-1">{errors.login}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Kata Sandi</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    id="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="h-10 bg-background pr-10 text-sm"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="captcha">Captcha <span className="text-destructive">*</span></Label>
                            <div className="flex gap-4">
                                <Input
                                    type="text"
                                    id="captcha"
                                    value={captchaInput}
                                    onChange={(e) => setCaptchaInput(e.target.value)}
                                    className="h-10 flex-1 bg-background text-sm"
                                    placeholder="Masukkan captcha"
                                />
                                <div
                                    onClick={generateCaptcha}
                                    title="Klik untuk mengganti captcha"
                                    className="w-[100px] h-10 bg-white rounded-md border border-border flex items-center justify-center relative overflow-hidden select-none cursor-pointer group"
                                >
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
                                            <text x="56" y="34" fontFamily="monospace" fontSize="28" fontWeight="bold" fill="#537b75" textAnchor="middle" className="blur-[1.5px]" transform="rotate(-5 60 24) skewX(10)">
                                                {captchaCode}
                                            </text>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            {captchaError && <p className="text-xs text-destructive mt-1">{captchaError}</p>}
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full h-10 mt-2 text-sm font-semibold"
                        >
                            {processing ? (
                                <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                "Masuk"
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
