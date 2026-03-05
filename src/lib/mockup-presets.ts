/**
 * Mockup Presets System
 * 
 * This file defines the coordinate mapping for label placement on manufacturing templates.
 * All units (x, y, w, h) are normalized to a 1000x1000 coordinate space to ensure 
 * consistent rendering regardless of the internal canvas resolution.
 * 
 * TUNING GUIDE:
 * 1. Open the template image (e.g., gummies.png) in an editor.
 * 2. Identify the top-left (x, y) and bottom-right corner of the intended branding area.
 * 3. Convert those pixels to a 0-1000 scale: (pixel / totalWidth) * 1000.
 * 4. Update the 'labelBox' values below.
 */

export interface MockupPreset {
    label: string;
    templateSrc: string;
    labelBox: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    exportScale: number; // Final multiplier for crisp downloads (e.g. 2.0 = 2000x2000px)
}

export const MOCKUP_PRESETS: Record<string, MockupPreset> = {
    gummies: {
        label: 'Gummies',
        templateSrc: '/mockups/gummies.png',
        labelBox: { x: 320, y: 380, w: 360, h: 400 },
        exportScale: 2.0,
    },
    capsules: {
        label: 'Capsules',
        templateSrc: '/mockups/capsules.png',
        labelBox: { x: 280, y: 420, w: 440, h: 350 },
        exportScale: 2.0,
    },
    gel: {
        label: 'Honey Gel',
        templateSrc: '/mockups/gel.png',
        labelBox: { x: 350, y: 350, w: 300, h: 450 },
        exportScale: 2.0,
    },
    powders: {
        label: 'Powders',
        templateSrc: '/mockups/powders.png',
        labelBox: { x: 250, y: 380, w: 500, h: 420 },
        exportScale: 2.0,
    },
    spoons: {
        label: 'Honey Spoon',
        templateSrc: '/mockups/spoons.png',
        labelBox: { x: 430, y: 250, w: 140, h: 600 },
        exportScale: 2.0,
    }
};
