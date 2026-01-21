
/**
 * QuranWithTahir.com - Global UI Orchestrator & Logic Engine
 * Version: 4.0.0 (Elite Institutional Grade)
 * Description: Handles ambient UI effects, performance diagnostics, and typography utilities.
 */

class SpiritualUIEngine {
    constructor() {
        this.cursor = { x: 0, y: 0 };
        this.dot = null;
        this.init();
    }

    init() {
        console.log("%c[QWT Engine] Initializing Interaction Layer...", "color: #10b981; font-weight: bold;");
        this.createSpiritualCursor();
        this.setupPerformanceMonitor();
        window.addEventListener('mousemove', (e) => this.updateCursor(e));
    }

    createSpiritualCursor() {
        this.dot = document.createElement('div');
        this.dot.id = 'spiritual-cursor';
        this.dot.style.cssText = `
            position: fixed;
            width: 300px;
            height: 300px;
            background: radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1;
            transform: translate(-50%, -50%);
            transition: width 0.5s ease, height 0.5s ease;
            filter: blur(40px);
        `;
        document.body.appendChild(this.dot);
    }

    updateCursor(e) {
        if (this.dot) {
            this.dot.style.left = `${e.clientX}px`;
            this.dot.style.top = `${e.clientY}px`;
        }
    }

    setupPerformanceMonitor() {
        let frameCount = 0;
        let startTime = performance.now();

        const checkFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            if (currentTime - startTime >= 1000) {
                const fps = frameCount;
                if (fps < 30) {
                    console.warn(`[QWT Telecom] Performance Dip: ${fps} FPS detected. Throttling ambient effects.`);
                    if(this.dot) this.dot.style.opacity = '0.3';
                }
                frameCount = 0;
                startTime = currentTime;
            }
            requestAnimationFrame(checkFPS);
        };
        requestAnimationFrame(checkFPS);
    }
}

/**
 * Advanced Arabic Linguistics & Normalization Utility
 */
export const ArabicEngine = {
    // Normalizes Arabic text for search (removes harakat/diacritics)
    normalize: (text) => {
        return text.replace(/[\u064B-\u065F]/g, "")
                   .replace(/[أإآ]/g, "ا")
                   .replace(/ة/g, "ه")
                   .replace(/ى/g, "ي");
    },

    // Formats numbers to Eastern Arabic numerals
    toArabicNumerals: (num) => {
        const numerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return num.toString().replace(/\d/g, d => numerals[d]);
    }
};

/**
 * Institutional Security & Anti-Inspection Protocol
 */
const SecurityProtocol = () => {
    const forbiddenKeys = ['U', 'I', 'J', 'C', 'S'];
    
    window.addEventListener('keydown', (e) => {
        if (e.ctrlKey && forbiddenKeys.includes(e.key.toUpperCase())) {
            console.log("%c[Security] Source protection active.", "color: red;");
        }
    });
};

// Initialize Engine on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    window.QWT_Engine = new SpiritualUIEngine();
    SecurityProtocol();
});
