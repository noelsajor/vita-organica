import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MOCKUP_PRESETS, type MockupPreset } from '../lib/mockup-presets';

const MockupGenerator: React.FC = () => {
    const getDefaultFormat = () => {
        if (typeof window === 'undefined') return Object.keys(MOCKUP_PRESETS)[0];
        const params = new URLSearchParams(window.location.search);
        const formatParam = params.get('format');
        return (formatParam && MOCKUP_PRESETS[formatParam]) ? formatParam : Object.keys(MOCKUP_PRESETS)[0];
    };

    const [selectedSlug, setSelectedSlug] = useState<string>(getDefaultFormat());
    const [labelImage, setLabelImage] = useState<HTMLImageElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isRendering, setIsRendering] = useState(false);
    const [leadCaptured, setLeadCaptured] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const templateCache = useRef<Record<string, HTMLImageElement>>({});

    const preset = MOCKUP_PRESETS[selectedSlug];
    // Base internal resolution for logic (normalized to presets)
    const BASE_RES = 1000;

    const render = useCallback(async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set internal canvas resolution based on preset scale
        const drawRes = BASE_RES * preset.exportScale;
        if (canvas.width !== drawRes) {
            canvas.width = drawRes;
            canvas.height = drawRes;
        }

        setIsRendering(true);

        try {
            // 1. Load Template
            let templateImg = templateCache.current[selectedSlug];
            if (!templateImg) {
                templateImg = await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => resolve(img);
                    img.onerror = () => reject(new Error(`Failed to load template for ${preset.label}`));
                    img.src = preset.templateSrc;
                });
                templateCache.current[selectedSlug] = templateImg;
            }

            // 2. Clear and Set Background
            ctx.clearRect(0, 0, drawRes, drawRes);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, drawRes, drawRes);

            // 3. Draw Template
            ctx.drawImage(templateImg, 0, 0, drawRes, drawRes);

            // 4. Draw Label if exists
            if (labelImage) {
                const { x, y, w, h } = preset.labelBox;

                // Scale normalized preset to current draw resolution
                const targetX = (x / BASE_RES) * drawRes;
                const targetY = (y / BASE_RES) * drawRes;
                const targetW = (w / BASE_RES) * drawRes;
                const targetH = (h / BASE_RES) * drawRes;

                const imgRatio = labelImage.width / labelImage.height;
                const boxRatio = targetW / targetH;

                let renderW, renderH, renderX, renderY;

                if (imgRatio > boxRatio) {
                    renderW = targetW;
                    renderH = targetW / imgRatio;
                    renderX = targetX;
                    renderY = targetY + (targetH - renderH) / 2;
                } else {
                    renderH = targetH;
                    renderW = targetH * imgRatio;
                    renderY = targetY;
                    renderX = targetX + (targetW - renderW) / 2;
                }

                ctx.drawImage(labelImage, renderX, renderY, renderW, renderH);
            }

            setError(null);
        } catch (err) {
            console.error(err);
            setError('Could not load packaging template. Please try another format.');
        } finally {
            setIsRendering(false);
        }
    }, [selectedSlug, labelImage, preset]);

    useEffect(() => {
        render();
    }, [render]);

    // Handle Calendly Script Injection
    useEffect(() => {
        if (leadCaptured) {
            const script = document.createElement('script');
            script.src = "https://assets.calendly.com/assets/external/widget.js";
            script.async = true;
            document.body.appendChild(script);
            return () => {
                document.body.removeChild(script);
            };
        }
    }, [leadCaptured]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                setLabelImage(img);
                setError(null);
            };
            img.onerror = () => setError('Invalid image file.');
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `vita-organica-${selectedSlug}-mockup.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    };

    const handleReset = () => {
        setLabelImage(null);
        setError(null);
        setLeadCaptured(false);
    };

    const handleLeadSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Store in localStorage as requested
        const payload = {
            ...formData,
            format: selectedSlug,
            mockupGenerated: true,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('vita_mockup_lead', JSON.stringify(payload));

        setLeadCaptured(true);
    };

    return (
        <div className="mockup-generator" style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2fr', gap: '3rem', alignItems: 'start' }}>

            {/* ── CONTROLS ── */}
            <div className="generator-controls" style={{ background: 'var(--color-white)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem' }}>Configurator</h2>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--color-ink-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                        1. Packaging Format
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        {Object.entries(MOCKUP_PRESETS).map(([slug, p]) => (
                            <button
                                key={slug}
                                onClick={() => setSelectedSlug(slug)}
                                className={`btn ${selectedSlug === slug ? 'btn-primary' : 'btn-ghost'}`}
                                style={{ fontSize: '13px', padding: '0.5rem' }}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--color-ink-muted)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                        2. Design Upload
                    </label>
                    <input type="file" accept="image/*" onChange={handleFileUpload} style={{ width: '100%', fontSize: '13px' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <button disabled={!labelImage} onClick={handleDownload} className="btn btn-primary btn-full">
                        Export PNG
                    </button>
                    <button onClick={handleReset} className="btn btn-ghost btn-full" style={{ color: 'var(--color-red)' }}>
                        Reset Canvas
                    </button>
                </div>

                {error && <div style={{ color: 'var(--color-red)', marginTop: '1rem', fontSize: '13px' }}>{error}</div>}
            </div>

            {/* ── PREVIEW ── */}
            <div className="generator-preview-column">
                <div className="generator-preview-card" style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', padding: '20px', textAlign: 'center' }}>
                    <canvas ref={canvasRef} style={{ maxWidth: '100%', height: 'auto', borderRadius: '4px', boxShadow: 'var(--shadow-md)', background: '#fff' }} />
                    <p style={{ marginTop: '1rem', fontSize: '12px', color: 'var(--color-ink-muted)' }}>
                        Rendering at {BASE_RES * preset.exportScale} x {BASE_RES * preset.exportScale} px
                    </p>
                </div>

                {/* ── CONVERSION STEP ── */}
                {labelImage && !leadCaptured && (
                    <div className="mockup-conversion-step" style={{
                        marginTop: '2rem',
                        padding: '2.5rem',
                        background: 'var(--color-white)',
                        borderRadius: 'var(--radius-lg)',
                        border: '2px solid var(--color-primary-soft)',
                        textAlign: 'left'
                    }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Ready to Scale This Product?</h3>
                        <p style={{ color: 'var(--color-ink-soft)', marginBottom: '1.5rem', fontSize: '14px' }}>
                            Send us this mockup and book a 15-minute technical discovery call to discuss your production timeline.
                        </p>

                        <form onSubmit={handleLeadSubmit} style={{ display: 'grid', gap: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--color-ink-muted)' }}>Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Optional"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--color-ink-muted)' }}>Work Email*</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="Required"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid var(--color-border)' }}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary btn-full" style={{ padding: '14px' }}>
                                Send Mockup & Book Call →
                            </button>
                        </form>
                    </div>
                )}

                {/* ── CALENDLY REVEAL ── */}
                {leadCaptured && (
                    <div className="calendly-reveal" style={{ marginTop: '2rem', padding: '2rem', background: '#fff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{ width: '48px', height: '48px', background: 'var(--color-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" style={{ width: '24px', height: '24px' }}>
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                            </div>
                            <h3>Mockup Saved!</h3>
                            <p style={{ fontSize: '14px', color: 'var(--color-ink-muted)' }}>Select a time below for your discovery call.</p>
                        </div>

                        <div
                            className="calendly-inline-widget"
                            data-url="https://calendly.com/vita-organica/discovery"
                            style={{ minWidth: '320px', height: '700px' }}
                        ></div>
                    </div>
                )}
            </div>

            <style>{`
                @media (max-width: 900px) {
                    .mockup-generator { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default MockupGenerator;
