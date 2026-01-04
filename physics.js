/**
 * Project ChargeLab: Physics Module
 * Magnetic Field Simulator and Right-Hand Rule Demonstrator
 * @version 1.0.0
 */

// ============================================
// Constants
// ============================================
const PHYSICS_CONSTANTS = {
    // Permeability of free space (H/m)
    MU_0: 4 * Math.PI * 1e-7,

    // Relative permeability values
    PERMEABILITY: {
        air: { name: 'Air', value: 1 },
        ferrite: { name: 'Ferrite', value: 2000 },
        steel: { name: 'Steel', value: 4000 }
    },

    // Conductor types
    CONDUCTOR_TYPES: ['straight-wire', 'single-loop', 'solenoid']
};

// ============================================
// Presets
// ============================================
const PHYSICS_PRESETS = {
    'straight-wire': {
        name: 'Straight Wire Demo',
        type: 'straight-wire',
        current: 2,
        distances: [0.005, 0.01, 0.02] // 0.5cm, 1cm, 2cm in meters
    },
    'small-coil': {
        name: 'Small Coil (Phone-like)',
        type: 'single-loop',
        current: 1,
        turns: 30,
        radius: 0.012, // 1.2 cm
        material: 'air'
    },
    'solenoid': {
        name: 'Solenoid',
        type: 'solenoid',
        current: 2,
        turns: 200,
        length: 0.05, // 5 cm
        material: 'air'
    }
};

// ============================================
// Magnetic Field Calculator
// ============================================
class MagneticFieldCalculator {
    constructor(options = {}) {
        this.conductorType = options.conductorType || 'solenoid';
        this.current = options.current || 1; // Amperes
        this.turns = options.turns || 100;
        this.radius = options.radius || 0.01; // meters
        this.length = options.length || 0.05; // meters
        this.distance = options.distance || 0.01; // meters (for straight wire)
        this.material = options.material || 'air';

        this.results = null;
        this.workSteps = [];
    }

    /**
     * Get relative permeability for selected material
     */
    getMu_r() {
        return PHYSICS_CONSTANTS.PERMEABILITY[this.material]?.value || 1;
    }

    /**
     * Calculate magnetic field based on conductor type
     */
    calculate() {
        this.workSteps = [];
        const mu_r = this.getMu_r();
        const mu_0 = PHYSICS_CONSTANTS.MU_0;
        const mu = mu_0 * mu_r;

        let B, formula, description;

        switch (this.conductorType) {
            case 'straight-wire':
                B = this.calculateStraightWire(mu_0);
                formula = 'B = μ₀ × I / (2πr)';
                description = 'Magnetic field around an infinite straight conductor';
                break;

            case 'single-loop':
                B = this.calculateSingleLoop(mu_0, mu_r);
                formula = 'B ≈ μ₀ × μᵣ × N × I / (2r)';
                description = 'Magnetic field at the center of a circular loop (or coil)';
                break;

            case 'solenoid':
            default:
                B = this.calculateSolenoid(mu_0, mu_r);
                formula = 'B = μ₀ × μᵣ × N × I / L';
                description = 'Magnetic field inside a solenoid (center approximation)';
                break;
        }

        this.results = {
            B,
            B_mT: B * 1000, // Convert to milliTesla
            B_uT: B * 1e6, // Convert to microTesla
            formula,
            description,
            conductorType: this.conductorType,
            inputs: {
                current: this.current,
                turns: this.turns,
                radius: this.radius,
                length: this.length,
                distance: this.distance,
                material: this.material,
                mu_r
            },
            constants: {
                mu_0,
                mu: mu_0 * mu_r
            },
            timestamp: new Date().toISOString()
        };

        return this.results;
    }

    /**
     * Calculate B-field for straight wire at distance r
     * B = μ₀ × I / (2πr)
     */
    calculateStraightWire(mu_0) {
        const B = (mu_0 * this.current) / (2 * Math.PI * this.distance);

        this.workSteps.push({
            title: 'Apply Biot-Savart law for straight wire',
            description: 'For an infinitely long straight conductor carrying current I',
            calculations: [
                `Formula: B = μ₀ × I / (2πr)`,
                `μ₀ = ${mu_0.toExponential(4)} H/m`,
                `I = ${this.current} A`,
                `r = ${this.distance * 100} cm = ${this.distance} m`,
                `B = (${mu_0.toExponential(4)} × ${this.current}) / (2π × ${this.distance})`,
                `B = ${B.toExponential(4)} T = ${(B * 1e6).toFixed(2)} μT`
            ]
        });

        this.workSteps.push({
            title: 'Direction (Right-Hand Rule)',
            description: 'Point thumb in direction of current flow',
            calculations: [
                'Fingers curl in direction of magnetic field lines',
                'Field forms concentric circles around the wire',
                'Field strength decreases with distance (1/r relationship)'
            ]
        });

        return B;
    }

    /**
     * Calculate B-field at center of single loop or coil
     * B = μ₀ × μᵣ × N × I / (2r)
     */
    calculateSingleLoop(mu_0, mu_r) {
        const B = (mu_0 * mu_r * this.turns * this.current) / (2 * this.radius);

        this.workSteps.push({
            title: 'Calculate field at center of circular coil',
            description: `For ${this.turns} turns of radius ${this.radius * 100} cm`,
            calculations: [
                `Formula: B = μ₀ × μᵣ × N × I / (2r)`,
                `μ₀ = ${mu_0.toExponential(4)} H/m`,
                `μᵣ = ${mu_r} (${this.material})`,
                `N = ${this.turns} turns`,
                `I = ${this.current} A`,
                `r = ${this.radius * 100} cm = ${this.radius} m`,
                `B = (${mu_0.toExponential(4)} × ${mu_r} × ${this.turns} × ${this.current}) / (2 × ${this.radius})`,
                `B = ${B.toExponential(4)} T = ${(B * 1000).toFixed(4)} mT`
            ]
        });

        this.workSteps.push({
            title: 'Direction (Right-Hand Rule for Loops)',
            description: 'Curl fingers in direction of current around loop',
            calculations: [
                'Thumb points in direction of B-field through center',
                'Field is strongest at the center of the loop',
                'This approximation applies at the exact center only'
            ]
        });

        return B;
    }

    /**
     * Calculate B-field inside solenoid (center)
     * B = μ₀ × μᵣ × N × I / L
     */
    calculateSolenoid(mu_0, mu_r) {
        const B = (mu_0 * mu_r * this.turns * this.current) / this.length;

        this.workSteps.push({
            title: 'Apply solenoid formula',
            description: `For solenoid with ${this.turns} turns over ${this.length * 100} cm length`,
            calculations: [
                `Formula: B = μ₀ × μᵣ × N × I / L`,
                `μ₀ = ${mu_0.toExponential(4)} H/m`,
                `μᵣ = ${mu_r} (${this.material})`,
                `N = ${this.turns} turns`,
                `I = ${this.current} A`,
                `L = ${this.length * 100} cm = ${this.length} m`,
                `B = (${mu_0.toExponential(4)} × ${mu_r} × ${this.turns} × ${this.current}) / ${this.length}`,
                `B = ${B.toExponential(4)} T = ${(B * 1000).toFixed(4)} mT`
            ]
        });

        this.workSteps.push({
            title: 'Solenoid field properties',
            description: 'Understanding the approximation limits',
            calculations: [
                'This formula gives the field at the CENTER of a long solenoid',
                'Accuracy improves when length >> radius',
                'Field is approximately uniform inside, near zero outside',
                'At the ends, B ≈ half the center value'
            ]
        });

        this.workSteps.push({
            title: 'Turns density (n)',
            description: 'Alternative formulation using turns per unit length',
            calculations: [
                `n = N/L = ${this.turns}/${this.length} = ${(this.turns / this.length).toFixed(1)} turns/m`,
                `B = μ₀ × μᵣ × n × I`,
                `This shows B is proportional to turns density, not total turns`
            ]
        });

        return B;
    }

    /**
     * Calculate B-field at multiple distances (for straight wire demo)
     */
    calculateAtDistances(distances) {
        return distances.map(d => {
            this.distance = d;
            const result = this.calculate();
            return { distance: d, B: result.B };
        });
    }

    /**
     * Get work steps
     */
    getWorkSteps() {
        return this.workSteps;
    }

    /**
     * Export as JSON
     */
    exportJSON() {
        return {
            results: this.results,
            workSteps: this.workSteps,
            constants: PHYSICS_CONSTANTS
        };
    }

    /**
     * Load from URL parameters
     */
    static fromURLParams(params) {
        return new MagneticFieldCalculator({
            conductorType: params.type || 'solenoid',
            current: parseFloat(params.current) || 1,
            turns: parseInt(params.turns) || 100,
            radius: parseFloat(params.radius) || 0.01,
            length: parseFloat(params.length) || 0.05,
            distance: parseFloat(params.distance) || 0.01,
            material: params.material || 'air'
        });
    }

    /**
     * Generate URL parameters
     */
    toURLParams() {
        const params = new URLSearchParams();
        params.set('type', this.conductorType);
        params.set('current', this.current);
        params.set('turns', this.turns);
        params.set('radius', this.radius);
        params.set('length', this.length);
        params.set('distance', this.distance);
        params.set('material', this.material);
        return params.toString();
    }
}

// ============================================
// Magnetic Field Simulator (Canvas)
// ============================================
class MagneticFieldSimulator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.calculator = new MagneticFieldCalculator();

        this.isRunning = false;
        this.animationFrame = null;
        this.time = 0;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = Math.min(rect.height, 400);
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }

    /**
     * Update calculator parameters
     */
    setParameters(params) {
        Object.assign(this.calculator, params);
        this.calculator.calculate();
        this.draw();
    }

    /**
     * Start animation
     */
    start() {
        this.isRunning = true;
        this.animate();
    }

    /**
     * Stop animation
     */
    stop() {
        this.isRunning = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    /**
     * Animation loop
     */
    animate() {
        if (!this.isRunning) return;

        this.time += 0.02;
        this.draw();

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }

    /**
     * Draw the simulation
     */
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        switch (this.calculator.conductorType) {
            case 'straight-wire':
                this.drawStraightWire();
                break;
            case 'single-loop':
                this.drawSingleLoop();
                break;
            case 'solenoid':
            default:
                this.drawSolenoid();
                break;
        }

        // Draw field strength indicator
        this.drawFieldIndicator();
    }

    /**
     * Draw straight wire visualization
     */
    drawStraightWire() {
        const { ctx, centerX, centerY, canvas } = this;

        // Draw the wire (going into/out of page)
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
        ctx.fillStyle = '#3EF1C6';
        ctx.fill();
        ctx.strokeStyle = '#00D1FF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw current direction indicator (dot = out of page, x = into page)
        ctx.fillStyle = '#071733';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Draw concentric field lines
        const numLines = 6;
        for (let i = 1; i <= numLines; i++) {
            const radius = 30 + i * 35;
            const opacity = 1 - (i / numLines) * 0.6;

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 209, 255, ${opacity})`;
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 5]);
            ctx.lineDashOffset = -this.time * 20;
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw arrows on field lines
            const arrowAngle = this.time + i * 0.5;
            this.drawArrowOnCircle(centerX, centerY, radius, arrowAngle, this.calculator.current > 0);
        }

        // Label
        ctx.fillStyle = '#F8FAFC';
        ctx.font = '14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('I = ' + this.calculator.current + ' A', centerX, canvas.height - 20);
        ctx.fillText('(current out of page)', centerX, canvas.height - 5);
    }

    /**
     * Draw single loop visualization
     */
    drawSingleLoop() {
        const { ctx, centerX, centerY, canvas } = this;
        const loopRadius = Math.min(canvas.width, canvas.height) * 0.25;

        // Draw the loop
        ctx.beginPath();
        ctx.arc(centerX, centerY, loopRadius, 0, Math.PI * 2);
        ctx.strokeStyle = '#3EF1C6';
        ctx.lineWidth = 6;
        ctx.stroke();

        // Draw current direction arrows around the loop
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
            const x = centerX + Math.cos(angle) * loopRadius;
            const y = centerY + Math.sin(angle) * loopRadius;
            this.drawCurrentArrow(x, y, angle + Math.PI / 2);
        }

        // Draw field lines through center
        const numLines = 5;
        for (let i = 0; i < numLines; i++) {
            const offset = (i - (numLines - 1) / 2) * 15;

            ctx.beginPath();
            ctx.moveTo(centerX + offset, centerY - loopRadius * 1.5);
            ctx.lineTo(centerX + offset, centerY + loopRadius * 1.5);
            ctx.strokeStyle = 'rgba(0, 209, 255, 0.6)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([8, 4]);
            ctx.lineDashOffset = -this.time * 30;
            ctx.stroke();
            ctx.setLineDash([]);

            // Arrow at top
            this.drawArrow(centerX + offset, centerY - loopRadius * 1.3, Math.PI / 2);
        }

        // Draw B-field indicator at center
        ctx.fillStyle = 'rgba(0, 209, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#00D1FF';
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('B', centerX, centerY);

        // Labels
        ctx.fillStyle = '#F8FAFC';
        ctx.font = '12px Inter';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText(`N = ${this.calculator.turns} turns`, centerX, canvas.height - 30);
        ctx.fillText(`I = ${this.calculator.current} A`, centerX, canvas.height - 15);
    }

    /**
     * Draw solenoid visualization
     */
    drawSolenoid() {
        const { ctx, centerX, centerY, canvas } = this;

        const solenoidWidth = canvas.width * 0.6;
        const solenoidHeight = 80;
        const startX = centerX - solenoidWidth / 2;
        const endX = centerX + solenoidWidth / 2;

        // Draw coil turns
        const numTurnsDrawn = Math.min(20, this.calculator.turns);
        const turnSpacing = solenoidWidth / numTurnsDrawn;

        for (let i = 0; i <= numTurnsDrawn; i++) {
            const x = startX + i * turnSpacing;

            // Draw ellipse for each turn
            ctx.beginPath();
            ctx.ellipse(x, centerY, 8, solenoidHeight / 2, 0, 0, Math.PI * 2);
            ctx.strokeStyle = i % 2 === 0 ? '#3EF1C6' : '#2BC5AA';
            ctx.lineWidth = 3;
            ctx.stroke();
        }

        // Draw horizontal connecting lines
        ctx.beginPath();
        ctx.moveTo(startX, centerY - solenoidHeight / 2);
        ctx.lineTo(endX, centerY - solenoidHeight / 2);
        ctx.moveTo(startX, centerY + solenoidHeight / 2);
        ctx.lineTo(endX, centerY + solenoidHeight / 2);
        ctx.strokeStyle = '#3EF1C6';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw internal field lines
        const numFieldLines = 5;
        for (let i = 0; i < numFieldLines; i++) {
            const yOffset = (i - (numFieldLines - 1) / 2) * 12;

            ctx.beginPath();
            ctx.moveTo(startX - 30, centerY + yOffset);
            ctx.lineTo(endX + 30, centerY + yOffset);
            ctx.strokeStyle = 'rgba(0, 209, 255, 0.5)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([6, 4]);
            ctx.lineDashOffset = -this.time * 25;
            ctx.stroke();
            ctx.setLineDash([]);

            // Arrows
            this.drawArrow(centerX, centerY + yOffset, 0);
        }

        // Draw external return field lines (curved)
        ctx.beginPath();
        ctx.moveTo(endX + 30, centerY - 30);
        ctx.quadraticCurveTo(endX + 80, centerY - 100, centerX, centerY - 120);
        ctx.quadraticCurveTo(startX - 80, centerY - 100, startX - 30, centerY - 30);
        ctx.strokeStyle = 'rgba(0, 209, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(endX + 30, centerY + 30);
        ctx.quadraticCurveTo(endX + 80, centerY + 100, centerX, centerY + 120);
        ctx.quadraticCurveTo(startX - 80, centerY + 100, startX - 30, centerY + 30);
        ctx.stroke();

        // N and S pole labels
        ctx.fillStyle = '#00D1FF';
        ctx.font = 'bold 16px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('N', startX - 45, centerY + 5);
        ctx.fillStyle = '#3EF1C6';
        ctx.fillText('S', endX + 45, centerY + 5);

        // Info labels
        ctx.fillStyle = '#F8FAFC';
        ctx.font = '12px Inter';
        ctx.fillText(`N = ${this.calculator.turns} turns, L = ${(this.calculator.length * 100).toFixed(1)} cm`, centerX, canvas.height - 30);
        ctx.fillText(`I = ${this.calculator.current} A, μᵣ = ${this.calculator.getMu_r()}`, centerX, canvas.height - 15);
    }

    /**
     * Draw arrow helper
     */
    drawArrow(x, y, angle) {
        const { ctx } = this;
        const size = 8;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.moveTo(size, 0);
        ctx.lineTo(-size, -size / 2);
        ctx.lineTo(-size, size / 2);
        ctx.closePath();
        ctx.fillStyle = '#00D1FF';
        ctx.fill();

        ctx.restore();
    }

    /**
     * Draw arrow on circular path
     */
    drawArrowOnCircle(cx, cy, radius, angle, clockwise) {
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        const tangentAngle = angle + (clockwise ? Math.PI / 2 : -Math.PI / 2);
        this.drawArrow(x, y, tangentAngle);
    }

    /**
     * Draw current direction arrow
     */
    drawCurrentArrow(x, y, angle) {
        const { ctx } = this;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.moveTo(10, 0);
        ctx.lineTo(-5, -5);
        ctx.lineTo(-5, 5);
        ctx.closePath();
        ctx.fillStyle = '#F8FAFC';
        ctx.fill();

        ctx.restore();
    }

    /**
     * Draw field strength indicator
     */
    drawFieldIndicator() {
        const { ctx, canvas } = this;

        if (!this.calculator.results) return;

        const B = this.calculator.results.B;
        const B_display = B > 0.001 ? (B * 1000).toFixed(3) + ' mT' :
            B > 0.000001 ? (B * 1e6).toFixed(2) + ' μT' :
                B.toExponential(2) + ' T';

        // Background box
        ctx.fillStyle = 'rgba(7, 23, 51, 0.9)';
        ctx.fillRect(10, 10, 140, 50);
        ctx.strokeStyle = '#00D1FF';
        ctx.lineWidth = 1;
        ctx.strokeRect(10, 10, 140, 50);

        // Text
        ctx.fillStyle = '#B6C0C9';
        ctx.font = '11px Inter';
        ctx.textAlign = 'left';
        ctx.fillText('B-field (center):', 20, 30);

        ctx.fillStyle = '#3EF1C6';
        ctx.font = 'bold 16px Inter';
        ctx.fillText(B_display, 20, 50);
    }
}

// ============================================
// Right-Hand Rule Demonstrator
// ============================================
class RightHandRuleDemonstrator {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.canvas = this.container.querySelector('canvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.container.appendChild(this.canvas);
        }

        this.ctx = this.canvas.getContext('2d');
        this.mode = 'wire'; // 'wire' or 'loop'
        this.rotation = 0;

        this.resize();
        this.draw();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = Math.min(rect.height, 300);
    }

    setMode(mode) {
        this.mode = mode;
        this.draw();
    }

    draw() {
        const { ctx, canvas } = this;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.mode === 'wire') {
            this.drawWireRule(centerX, centerY);
        } else {
            this.drawLoopRule(centerX, centerY);
        }
    }

    drawWireRule(cx, cy) {
        const { ctx } = this;

        // Title
        ctx.fillStyle = '#F8FAFC';
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Right-Hand Rule for Straight Wire', cx, 25);

        // Instructions
        ctx.font = '12px Inter';
        ctx.fillStyle = '#B6C0C9';
        ctx.fillText('Point thumb in direction of current (I)', cx, 45);
        ctx.fillText('Fingers curl in direction of B-field', cx, 60);

        // Draw hand representation
        // Thumb (current direction)
        ctx.fillStyle = '#3EF1C6';
        ctx.beginPath();
        ctx.ellipse(cx - 30, cy, 15, 50, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2BC5AA';
        ctx.beginPath();
        ctx.ellipse(cx - 30, cy - 55, 12, 15, 0, 0, Math.PI * 2);
        ctx.fill();

        // Current arrow
        ctx.strokeStyle = '#00D1FF';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx - 30, cy + 30);
        ctx.lineTo(cx - 30, cy - 80);
        ctx.stroke();
        this.drawArrowHead(cx - 30, cy - 80, -Math.PI / 2);

        ctx.fillStyle = '#00D1FF';
        ctx.font = 'bold 14px Inter';
        ctx.fillText('I', cx - 15, cy - 70);

        // Curling fingers (B-field direction)
        for (let i = 0; i < 4; i++) {
            const angle = Math.PI * 0.3 + i * 0.35;
            const radius = 60 + i * 5;
            const startAngle = -Math.PI / 4;
            const endAngle = Math.PI * 0.8;

            ctx.strokeStyle = `rgba(0, 209, 255, ${0.8 - i * 0.15})`;
            ctx.lineWidth = 3 - i * 0.5;
            ctx.beginPath();
            ctx.arc(cx - 30, cy, radius, startAngle, endAngle);
            ctx.stroke();
        }

        // B-field label
        ctx.fillStyle = '#F8FAFC';
        ctx.font = '12px Inter';
        ctx.fillText('B (curls around wire)', cx + 50, cy + 70);
    }

    drawLoopRule(cx, cy) {
        const { ctx } = this;

        // Title
        ctx.fillStyle = '#F8FAFC';
        ctx.font = 'bold 14px Inter';
        ctx.textAlign = 'center';
        ctx.fillText('Right-Hand Rule for Loops/Solenoids', cx, 25);

        // Instructions
        ctx.font = '12px Inter';
        ctx.fillStyle = '#B6C0C9';
        ctx.fillText('Curl fingers in direction of current', cx, 45);
        ctx.fillText('Thumb points in direction of B-field (N pole)', cx, 60);

        // Draw loop
        ctx.strokeStyle = '#3EF1C6';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(cx, cy + 20, 70, 30, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Current arrows around loop
        const arrowPositions = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
        arrowPositions.forEach(angle => {
            const x = cx + Math.cos(angle) * 70;
            const y = cy + 20 + Math.sin(angle) * 30;
            this.drawArrowHead(x, y, angle + Math.PI / 2);
        });

        ctx.fillStyle = '#3EF1C6';
        ctx.font = '12px Inter';
        ctx.fillText('I', cx + 85, cy + 25);

        // B-field through center (thumb direction)
        ctx.strokeStyle = '#00D1FF';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(cx, cy + 80);
        ctx.lineTo(cx, cy - 60);
        ctx.stroke();
        ctx.setLineDash([]);

        this.drawArrowHead(cx, cy - 60, -Math.PI / 2);

        ctx.fillStyle = '#00D1FF';
        ctx.font = 'bold 14px Inter';
        ctx.fillText('B', cx + 15, cy - 50);
        ctx.font = '12px Inter';
        ctx.fillText('(N pole)', cx + 15, cy - 35);
    }

    drawArrowHead(x, y, angle) {
        const { ctx } = this;
        const size = 10;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-size, -size / 2);
        ctx.lineTo(-size, size / 2);
        ctx.closePath();
        ctx.fillStyle = '#00D1FF';
        ctx.fill();

        ctx.restore();
    }
}

// ============================================
// Physics Calculator UI
// ============================================
class PhysicsCalculatorUI {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.calculator = new MagneticFieldCalculator();
        this.simulator = null;

        this.init();
        this.loadFromURL();
    }

    init() {
        this.bindElements();
        this.bindEvents();
        this.bindPresets();

        // Initialize simulator
        const simCanvas = this.container.querySelector('#field-simulator-canvas');
        if (simCanvas) {
            this.simulator = new MagneticFieldSimulator('field-simulator-canvas');
            this.simulator.start();
        }

        // Initialize right-hand rule demonstrator
        const rhrContainer = document.getElementById('right-hand-rule-demo');
        if (rhrContainer) {
            this.rhrDemo = new RightHandRuleDemonstrator('right-hand-rule-demo');
        }

        this.calculate();
    }

    bindElements() {
        this.inputs = {
            conductorType: this.container.querySelector('#input-conductor-type'),
            current: this.container.querySelector('#input-current'),
            currentDisplay: this.container.querySelector('#current-display'),
            turns: this.container.querySelector('#input-turns'),
            radius: this.container.querySelector('#input-radius'),
            length: this.container.querySelector('#input-length'),
            distance: this.container.querySelector('#input-distance'),
            material: this.container.querySelector('#input-material')
        };

        this.results = {
            bField: this.container.querySelector('#result-b-field'),
            formula: this.container.querySelector('#result-formula')
        };

        this.workPanel = this.container.querySelector('#physics-work-steps');

        // Control groups for showing/hiding based on conductor type
        this.controlGroups = {
            turns: this.container.querySelector('#control-turns'),
            radius: this.container.querySelector('#control-radius'),
            length: this.container.querySelector('#control-length'),
            distance: this.container.querySelector('#control-distance'),
            material: this.container.querySelector('#control-material')
        };
    }

    bindEvents() {
        // Conductor type change
        this.inputs.conductorType?.addEventListener('change', () => {
            this.updateControlVisibility();
            this.calculate();
            if (this.rhrDemo) {
                this.rhrDemo.setMode(this.inputs.conductorType.value === 'straight-wire' ? 'wire' : 'loop');
            }
        });

        // Current slider
        this.inputs.current?.addEventListener('input', () => {
            if (this.inputs.currentDisplay) {
                this.inputs.currentDisplay.textContent = this.inputs.current.value + ' A';
            }
            this.calculate();
        });

        // Other inputs
        ['turns', 'radius', 'length', 'distance', 'material'].forEach(key => {
            this.inputs[key]?.addEventListener('input', () => this.calculate());
            this.inputs[key]?.addEventListener('change', () => this.calculate());
        });

        // Import from chemistry toggle
        const importToggle = this.container.querySelector('#import-chemistry');
        if (importToggle) {
            importToggle.addEventListener('change', () => {
                if (importToggle.checked) {
                    this.importFromChemistry();
                }
            });
        }

        // Export buttons
        this.container.querySelector('#btn-physics-export')?.addEventListener('click', () => {
            this.exportJSON();
        });

        this.container.querySelector('#btn-physics-share')?.addEventListener('click', () => {
            this.shareLink();
        });
    }

    bindPresets() {
        this.container.querySelectorAll('[data-physics-preset]').forEach(btn => {
            btn.addEventListener('click', () => {
                const presetKey = btn.getAttribute('data-physics-preset');
                this.loadPreset(presetKey);

                // Update active state
                this.container.querySelectorAll('[data-physics-preset]').forEach(b => {
                    b.classList.remove('preset-btn--active');
                });
                btn.classList.add('preset-btn--active');
            });
        });
    }

    loadPreset(presetKey) {
        const preset = PHYSICS_PRESETS[presetKey];
        if (!preset) return;

        if (this.inputs.conductorType) this.inputs.conductorType.value = preset.type;
        if (this.inputs.current) {
            this.inputs.current.value = preset.current;
            if (this.inputs.currentDisplay) {
                this.inputs.currentDisplay.textContent = preset.current + ' A';
            }
        }
        if (this.inputs.turns && preset.turns) this.inputs.turns.value = preset.turns;
        if (this.inputs.radius && preset.radius) this.inputs.radius.value = preset.radius * 100; // Convert to cm
        if (this.inputs.length && preset.length) this.inputs.length.value = preset.length * 100;
        if (this.inputs.material && preset.material) this.inputs.material.value = preset.material;

        this.updateControlVisibility();
        this.calculate();

        if (this.rhrDemo) {
            this.rhrDemo.setMode(preset.type === 'straight-wire' ? 'wire' : 'loop');
        }
    }

    updateControlVisibility() {
        const type = this.inputs.conductorType?.value || 'solenoid';

        // Show/hide relevant controls
        if (this.controlGroups.turns) {
            this.controlGroups.turns.style.display = type !== 'straight-wire' ? 'block' : 'none';
        }
        if (this.controlGroups.radius) {
            this.controlGroups.radius.style.display = type === 'single-loop' ? 'block' : 'none';
        }
        if (this.controlGroups.length) {
            this.controlGroups.length.style.display = type === 'solenoid' ? 'block' : 'none';
        }
        if (this.controlGroups.distance) {
            this.controlGroups.distance.style.display = type === 'straight-wire' ? 'block' : 'none';
        }
        if (this.controlGroups.material) {
            this.controlGroups.material.style.display = type !== 'straight-wire' ? 'block' : 'none';
        }
    }

    loadFromURL() {
        const params = new URLSearchParams(window.location.search);

        if (params.has('current') || params.has('type')) {
            this.calculator = MagneticFieldCalculator.fromURLParams(Object.fromEntries(params));

            // Update inputs
            if (this.inputs.conductorType) this.inputs.conductorType.value = this.calculator.conductorType;
            if (this.inputs.current) {
                this.inputs.current.value = this.calculator.current;
                if (this.inputs.currentDisplay) {
                    this.inputs.currentDisplay.textContent = this.calculator.current + ' A';
                }
            }
            if (this.inputs.turns) this.inputs.turns.value = this.calculator.turns;
            if (this.inputs.radius) this.inputs.radius.value = this.calculator.radius * 100;
            if (this.inputs.length) this.inputs.length.value = this.calculator.length * 100;
            if (this.inputs.distance) this.inputs.distance.value = this.calculator.distance * 100;
            if (this.inputs.material) this.inputs.material.value = this.calculator.material;

            this.updateControlVisibility();
            this.calculate();
        }
    }

    calculate() {
        // Read inputs
        this.calculator.conductorType = this.inputs.conductorType?.value || 'solenoid';
        this.calculator.current = parseFloat(this.inputs.current?.value) || 1;
        this.calculator.turns = parseInt(this.inputs.turns?.value) || 100;
        this.calculator.radius = (parseFloat(this.inputs.radius?.value) || 1) / 100; // Convert cm to m
        this.calculator.length = (parseFloat(this.inputs.length?.value) || 5) / 100;
        this.calculator.distance = (parseFloat(this.inputs.distance?.value) || 1) / 100;
        this.calculator.material = this.inputs.material?.value || 'air';

        // Calculate
        const results = this.calculator.calculate();

        // Update UI
        this.updateUI(results);

        // Update simulator
        if (this.simulator) {
            this.simulator.setParameters({
                conductorType: this.calculator.conductorType,
                current: this.calculator.current,
                turns: this.calculator.turns,
                radius: this.calculator.radius,
                length: this.calculator.length,
                distance: this.calculator.distance,
                material: this.calculator.material
            });
        }

        return results;
    }

    updateUI(results) {
        if (!results) return;

        // Format B-field display
        let bDisplay;
        if (results.B > 0.001) {
            bDisplay = results.B_mT.toFixed(4) + ' mT';
        } else if (results.B > 0.000001) {
            bDisplay = results.B_uT.toFixed(2) + ' μT';
        } else {
            bDisplay = results.B.toExponential(3) + ' T';
        }

        if (this.results.bField) {
            this.results.bField.textContent = bDisplay;
        }

        if (this.results.formula) {
            this.results.formula.textContent = results.formula;
        }

        // Update work steps
        this.updateWorkSteps();
    }

    updateWorkSteps() {
        if (!this.workPanel) return;

        const steps = this.calculator.getWorkSteps();
        this.workPanel.innerHTML = steps.map((step, i) => `
      <div class="work-step">
        <span class="work-step__number">${i + 1}</span>
        <div class="work-step__content">
          <strong>${step.title}</strong>
          <p class="text-muted">${step.description}</p>
          ${step.calculations.map(calc => `
            <p class="work-step__formula">${calc}</p>
          `).join('')}
        </div>
      </div>
    `).join('');
    }

    importFromChemistry() {
        const chemResults = window.ChargeLab.AppState.load('chemistry_results');
        if (chemResults && chemResults.current) {
            this.inputs.current.value = chemResults.current;
            if (this.inputs.currentDisplay) {
                this.inputs.currentDisplay.textContent = chemResults.current.toFixed(4) + ' A';
            }
            this.calculate();
        }
    }

    exportJSON() {
        const data = this.calculator.exportJSON();
        window.ChargeLab.ExportUtils.exportJSON(data, 'chargelab-physics-results.json');
    }

    shareLink() {
        const params = this.calculator.toURLParams();
        window.ChargeLab.DeepLinking.copyURL({ ...Object.fromEntries(new URLSearchParams(params)) });
    }
}

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize physics calculator if container exists
    const physicsContainer = document.getElementById('physics-calculator');
    if (physicsContainer) {
        window.physicsCalculatorUI = new PhysicsCalculatorUI('physics-calculator');
    }
});

// Export for use in other modules
window.ChargeLab = window.ChargeLab || {};
window.ChargeLab.Physics = {
    Calculator: MagneticFieldCalculator,
    CalculatorUI: PhysicsCalculatorUI,
    Simulator: MagneticFieldSimulator,
    RightHandRule: RightHandRuleDemonstrator,
    CONSTANTS: PHYSICS_CONSTANTS,
    PRESETS: PHYSICS_PRESETS
};
