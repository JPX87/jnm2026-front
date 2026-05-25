'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import './login.css';

gsap.registerPlugin(MotionPathPlugin);

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [takeoff, setTakeoff] = useState(false);

    const skyRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    const playTakeoff = useCallback(() => {
        const overlay = overlayRef.current;
        if (!overlay) return;

        const airplane = overlay.querySelector('.airplane') as HTMLElement;
        const contrail = overlay.querySelector('.contrail') as HTMLElement;
        const clouds = overlay.querySelectorAll('.cloud');
        const text = overlay.querySelector('.takeoff-text') as HTMLElement;
        const flash = overlay.querySelector('.takeoff-flash') as HTMLElement;

        const tl = gsap.timeline({
            defaults: { force3D: true },
            onComplete: () => {
                window.location.replace('/app');
            },
        });

        tl.to(skyRef.current, {
            opacity: 1,
            duration: 1.6,
            ease: 'power2.inOut',
        }, 0);

        tl.set(containerRef.current, { zIndex: 0 }, 0);
        tl.to(containerRef.current, {
            scale: 0.12,
            y: 320,
            rotation: 4,
            opacity: 0,
            duration: 1.1,
            ease: 'power3.in',
        }, 0);

        const vw = window.innerWidth;
        const vh = window.innerHeight;
        tl.fromTo(airplane,
            { opacity: 0, scale: 0.35 },
            {
                motionPath: {
                    path: [
                        { x: -vw * 0.55, y: vh * 0.42 },
                        { x: -vw * 0.3,  y: vh * 0.22 },
                        { x: -vw * 0.08, y: vh * 0.06 },
                        { x: 0,          y: 0 },
                        { x: vw * 0.12,  y: -vh * 0.08 },
                        { x: vw * 0.28,  y: -vh * 0.18 },
                        { x: vw * 0.45,  y: -vh * 0.3 },
                        { x: vw * 0.65,  y: -vh * 0.42 },
                    ],
                    curviness: 2,
                    autoRotate: true,
                },
                scale: 1.3,
                opacity: 1,
                duration: 3,
                ease: 'power2.inOut',
            },
            0.1,
        );

        tl.to(airplane, {
            opacity: 0,
            duration: 0.4,
            ease: 'power2.in',
        }, 2.7);

        tl.fromTo(contrail,
            { scaleX: 0, opacity: 0, rotation: -12, y: '25vh' },
            {
                scaleX: 1,
                rotation: -4,
                y: '-20vh',
                opacity: 0.45,
                duration: 2.6,
                ease: 'power1.inOut',
            },
            0.2,
        );
        tl.to(contrail, {
            opacity: 0,
            duration: 0.8,
            ease: 'power2.in',
        }, 2.4);

        clouds.forEach((cloud, i) => {
            const delay = 0.3 + i * 0.3;
            const duration = 3 + i * 0.3;
            tl.fromTo(cloud,
                { x: 100, opacity: 0 },
                {
                    x: -window.innerWidth - 200,
                    opacity: 0.6,
                    duration,
                    ease: 'power1.out',
                },
                delay,
            );
            tl.to(cloud, {
                opacity: 0,
                duration: duration * 0.3,
                ease: 'power1.in',
            }, delay + duration * 0.65);
        });

        tl.fromTo(text,
            { scale: 0, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.6,
                ease: 'back.out(1.4)',
            },
            0.8,
        );
        tl.to(text, {
            scale: 1.4,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.in',
        }, 2.2);

        tl.fromTo(flash,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 0.7,
                ease: 'power2.in',
            },
            2.5,
        );
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Erreur de connexion');
                return;
            }

            setTakeoff(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    playTakeoff();
                });
            });
        } catch {
            setError('Erreur de connexion au serveur');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page">
            <div className="sky-overlay" ref={skyRef} />

            <div className="login-container" ref={containerRef}>
                <div className="luggage-tag">
                    <div className="tag-left">
                        <div className="tag-hole">
                            <div className="tag-hole-dot"></div>
                        </div>
                        <div className="tag-destination">
                            <span className="tag-label">DESTINATION</span>
                            <span className="tag-code">TLS</span>
                            <span className="tag-city">TOULOUSE, FRANCE</span>
                        </div>
                    </div>

                    <div className="tag-right">
                        <form onSubmit={handleSubmit} className="tag-form">
                            <div className="tag-fields">
                                <div className="tag-field">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="cedricteyssié@wanadoo.fr"
                                        required
                                        className="tag-input"
                                    />
                                    <span className="tag-field-label">ADRESSE MAIL</span>
                                </div>
                                <div className="tag-field">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••"
                                        required
                                        className="tag-input"
                                    />
                                    <span className="tag-field-label">MOT DE PASSE</span>
                                </div>
                            </div>

                            {error && (
                                <p className="tag-error">{error}</p>
                            )}

                            <div className="tag-jnm">
                                <img
                                    src="/assets/logo/logo.png"
                                    className="tag-jnm-logo"
                                    alt="JNM"
                                />
                                <span className="tag-jnm-dates">26-29 MAI</span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || takeoff}
                                className="login-button"
                            >
                                {loading ? 'CONNEXION...' : 'CONNEXION'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {takeoff && (
                <div className="takeoff-overlay" ref={overlayRef}>
                    <div className="cloud cloud-1" />
                    <div className="cloud cloud-2" />
                    <div className="cloud cloud-3" />
                    <div className="contrail" />

                    <div className="airplane">
                        <svg viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="fuselageGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ffffff" />
                                    <stop offset="45%" stopColor="#f0f0f0" />
                                    <stop offset="100%" stopColor="#d8d8d8" />
                                </linearGradient>
                                <linearGradient id="wingGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#e0e0e0" />
                                    <stop offset="100%" stopColor="#c0c0c0" />
                                </linearGradient>
                                <linearGradient id="tailGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#e8729c" />
                                    <stop offset="100%" stopColor="#d45a82" />
                                </linearGradient>
                            </defs>
                            <path d="M30 50 Q30 38 45 36 L260 36 Q285 36 295 50 Q285 64 260 64 L45 64 Q30 62 30 50Z" fill="url(#fuselageGrad)" />
                            <path d="M260 36 Q280 36 296 44 Q298 48 296 50 L260 50Z" fill="#e8e8e8" />
                            <path d="M272 42 Q278 40 286 44 L283 46 Q276 43 272 44Z" fill="#2c3e50" opacity="0.85" />
                            <path d="M268 43 Q272 41.5 274 43 L273 45 Q271 43.5 268 44.5Z" fill="#2c3e50" opacity="0.7" />
                            <path d="M120 36 L88 6 L170 6 Q180 6 176 14 L155 36Z" fill="url(#wingGrad)" />
                            <path d="M120 64 L88 94 L170 94 Q180 94 176 86 L155 64Z" fill="url(#wingGrad)" />
                            <path d="M122 36 L95 10 L168 10 Q175 10 172 16 L153 36Z" fill="white" opacity="0.25" />
                            <rect x="105" y="11" width="28" height="11" rx="5" fill="#9e9e9e" />
                            <ellipse cx="106" cy="16.5" rx="5.5" ry="5.5" fill="#757575" />
                            <ellipse cx="106" cy="16.5" rx="3" ry="3" fill="#444" />
                            <rect x="105" y="78" width="28" height="11" rx="5" fill="#9e9e9e" />
                            <ellipse cx="106" cy="83.5" rx="5.5" ry="5.5" fill="#757575" />
                            <ellipse cx="106" cy="83.5" rx="3" ry="3" fill="#444" />
                            <path d="M42 36 L28 8 L55 8 Q62 8 58 16 L48 36Z" fill="url(#tailGrad)" />
                            <path d="M38 42 L22 28 L58 32 L48 42Z" fill="#e8e8e8" />
                            <path d="M38 58 L22 72 L58 68 L48 58Z" fill="#e8e8e8" />
                            {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(i => (
                                <circle key={i} cx={75 + i * 11} cy={42} r={1.8} fill="#4fc3f7" opacity={0.55} />
                            ))}
                            <line x1="40" y1="54" x2="270" y2="54" stroke="#e8729c" strokeWidth="2.5" opacity="0.75" />
                            <path d="M50 64 Q50 66 55 67 L255 67 Q260 66 260 64Z" fill="#bbb" opacity="0.3" />
                        </svg>
                    </div>

                    <div className="takeoff-text">BON VOYAGE !</div>
                    <div className="takeoff-flash" />
                </div>
            )}
        </div>
    );
}
