import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MOCKUP_PRESETS } from '../lib/mockup-presets';
import { Candy, Pill, FlaskConical, GlassWater, Utensils, Package } from 'lucide-react';

const formatIcons: Record<string, React.ReactNode> = {
    gummies: <Candy size={24} />,
    capsules: <Pill size={24} />,
    gel: <FlaskConical size={24} />,
    powders: <GlassWater size={24} />,
    spoons: <Utensils size={24} />
};

interface MockupGeneratorProps {
    initialFormat?: string;
}

const MockupGenerator: React.FC<MockupGeneratorProps> = ({ initialFormat }) => {
    const [step, setStep] = useState(1);
    const [selectedSlug, setSelectedSlug] = useState<string>(initialFormat || 'gummies');
    const [labelImage, setLabelImage] = useState<HTMLImageElement | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isRendering, setIsRendering] = useState(false);
    const [leadCaptured, setLeadCaptured] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '' });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const templateCache = useRef<Record<string, HTMLImageElement>>({});

    // Guard against invalid slugs from props or state updates
    const preset = MOCKUP_PRESETS[selectedSlug] || MOCKUP_PRESETS['gummies'];
    const BASE_RES = 1200; // Slightly higher base res for UI sharpness

    const render = useCallback(async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const drawRes = BASE_RES * preset.exportScale;
        if (canvas.width !== drawRes) {
            canvas.width = drawRes;
            canvas.height = drawRes;
        }

        setIsRendering(true);

        try {
            let templateImg = templateCache.current[selectedSlug];
            if (!templateImg) {
                templateImg = await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => resolve(img);
                    img.onerror = () => reject(new Error(`Failed to load template`));
                    img.src = preset.templateSrc;
                });
                templateCache.current[selectedSlug] = templateImg;
            }

            ctx.clearRect(0, 0, drawRes, drawRes);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, drawRes, drawRes);
            ctx.drawImage(templateImg, 0, 0, drawRes, drawRes);

            if (labelImage) {
                const { x, y, w, h } = preset.labelBox;
                const targetX = (x / 1000) * drawRes;
                const targetY = (y / 1000) * drawRes;
                const targetW = (w / 1000) * drawRes;
                const targetH = (h / 1000) * drawRes;

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
        } catch (err) {
            console.error(err);
            setError('System update in progress. Please try another format.');
        } finally {
            setIsRendering(false);
        }
    }, [selectedSlug, labelImage, preset]);

    useEffect(() => {
        render();
    }, [render]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                setLabelImage(img);
                setError(null);
                setStep(3); // Auto-advance to preview
            };
            img.onerror = () => setError('Invalid image file. Please use JPG, PNG or SVG.');
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const link = document.createElement('a');
        link.download = `vitaorg-${selectedSlug}-mockup.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    };

    const handleLeadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = { ...formData, format: selectedSlug, timestamp: new Date().toISOString() };
        localStorage.setItem('lead_mockup', JSON.stringify(payload));
        setLeadCaptured(true);
        handleDownload();
    };


    return (
        <div className="mockup-exp" style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem', minHeight: '600px', background: 'transparent', color: 'var(--color-white)' }}>

            {/* ── LEFT: INTERACTIVE CONTROLS ── */}
            <div className="exp-controls" style={{
                background: 'transparent',
                borderRadius: 'var(--radius-xl)',
                padding: '2.5rem 3.5rem',
                border: '0px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{
                            height: '4px',
                            flex: 1,
                            borderRadius: '2px',
                            background: step >= i ? 'var(--color-green)' : 'var(--color-border-light)'
                        }} />
                    ))}
                </div>

                {/* STEP 1: SELECT FORMAT */}
                {step === 1 && (
                    <div className="fade-in">
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-green)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 01</span>
                        <h2 style={{ fontSize: '1.75rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Select Format</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {Object.entries(MOCKUP_PRESETS).map(([slug, p]) => (
                                <button key={slug} onClick={() => { setSelectedSlug(slug); setStep(2); }} className={`format-card ${selectedSlug === slug ? 'active' : ''}`}>
                                    <span className="icon-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', marginBottom: '8px', transition: 'color 0.2s' }}>
                                        {formatIcons[slug] || <Package size={24} />}
                                    </span>
                                    <span>{p.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* STEP 2: UPLOAD DESIGN */}
                {step === 2 && (
                    <div className="fade-in">
                        <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: 'var(--color-ink-muted)', fontSize: '13px', cursor: 'pointer', marginBottom: '1rem', padding: 0 }}>← Back to selection</button>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-green)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 02</span>
                        <h2 style={{ fontSize: '1.75rem', marginTop: '0.5rem', marginBottom: '1rem' }}>Upload Brand Asset</h2>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem', lineHeight: '1.5' }}>Upload your current label design or logo to see it applied to our {preset.label} packaging.</p>

                        <div className="upload-zone" onClick={() => document.getElementById('file-up')?.click()}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ marginBottom: '12px', color: 'var(--color-green)' }}>
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                            </svg>
                            <span style={{ fontSize: '14px', fontWeight: 600 }}>Click to choose file</span>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>PNG, JPG or SVG • Min 1000px</span>
                            <input id="file-up" type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
                        </div>

                        <div style={{ marginTop: '2rem', padding: '1.25rem', borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.05)', fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                            <strong>Design Specs:</strong> 2000 x 2000px recommended for high-res output. Our engine will auto-scale to fit the specific area.
                        </div>
                    </div>
                )}

                {/* STEP 3: PREVIEW & EXPORT */}
                {step === 3 && (
                    <div className="fade-in">
                        <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '13px', cursor: 'pointer', marginBottom: '1rem', padding: 0 }}>← Re-upload</button>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-green)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Step 03</span>
                        <h2 style={{ fontSize: '1.75rem', marginTop: '0.5rem', marginBottom: '1.5rem' }}>Visual Ready</h2>

                        {!leadCaptured ? (
                            <form onSubmit={handleLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: 'var(--radius-lg)', marginBottom: '0.5rem' }}>
                                    ✨ <strong>Almost there!</strong> Enter your email to unlock your high-res 2000x2000px branding export instantly.
                                </p>
                                <input
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    style={{ width: '100%', padding: '14px', borderRadius: 'var(--radius)', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '15px' }}
                                />
                                <button type="submit" className="btn btn-primary btn-full" style={{ padding: '16px' }}>
                                    Get High-Res Export →
                                </button>
                                <p style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>By clicking, you'll receive your mockup and production tips.</p>
                            </form>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '1rem' }}>
                                <div style={{ width: '48px', height: '48px', background: 'var(--color-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" width="24"><polyline points="20 6 9 17 4 12" /></svg>
                                </div>
                                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Download Triggered!</h3>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginBottom: '1.5rem' }}>Your high-res mockup is being saved to your device.</p>
                                <button onClick={() => { setLeadCaptured(false); setStep(1); setLabelImage(null); }} style={{ background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '14px', borderRadius: 'var(--radius)', fontWeight: 600, cursor: 'pointer', width: '100%' }}>Create Another</button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* ── RIGHT: LIVE PREVIEW ── */}
            <div className="exp-viewport" style={{ position: 'relative' }}>
                <div style={{
                    position: 'sticky',
                    top: '120px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem'
                }}>
                    <div style={{
                        position: 'relative',
                        background: 'var(--color-surface)',
                        border: '1px solid var(--color-border-light)',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '600px',
                        width: '100%'
                    }}>
                        {isRendering && <div className="loader-overlay" />}
                        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0, background: '#fff' }} />
                        <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', color: '#fff', fontSize: '10px', padding: '4px 8px', borderRadius: 'var(--radius-pill)', fontWeight: 600 }}>LIVE PREVIEW</div>
                    </div>

                    <p style={{ fontSize: '13px', color: 'var(--color-ink-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
                        Professional Quality • {BASE_RES * (preset?.exportScale || 1)}px Resolution
                    </p>
                </div>
            </div>

            <style>{`
                .fade-in { animation: expFade 0.4s ease-out; }
                @keyframes expFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
                
                .format-card {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 1.25rem;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: var(--radius-lg);
                    background: transparent;
                    color: rgba(255,255,255,0.7);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    font-size: 13px;
                    font-weight: 600;
                }
                .format-card:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.05); color: white; }
                .format-card.active { border-color: var(--color-green); background: rgba(143, 194, 20, 0.1); color: white; }

                .format-card .icon-wrapper { color: rgba(255,255,255,0.4); }
                .format-card:hover .icon-wrapper { color: white; }
                .format-card.active .icon-wrapper { color: var(--color-green); }

                .upload-zone {
                    border: 2px dashed rgba(255,255,255,0.2);
                    border-radius: var(--radius-xl);
                    padding: 3rem 2rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .upload-zone:hover { background: rgba(255,255,255,0.05); border-color: var(--color-green); }

                .loader-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(255,255,255,0.7);
                    backdrop-filter: blur(2px);
                    z-index: 10;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                @media (max-width: 1024px) {
                    .mockup-exp { grid-template-columns: 1fr !important; }
                    .exp-viewport { min-height: auto; }
                    .exp-viewport > div { position: static !important; min-height: auto !important; margin-top: 2rem; }
                }
            `}</style>
        </div>
    );
};

export default MockupGenerator;
