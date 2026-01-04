/**
 * Project ChargeLab: Chemistry Module
 * Stoichiometry Calculator and Chemical Reaction Simulations
 * @version 1.0.0
 */

// ============================================
// Constants
// ============================================
const CHEMISTRY_CONSTANTS = {
    // Default molar masses (g/mol)
    MOLAR_MASS_ZN: 65.38,
    MOLAR_MASS_MNO2: 86.936,
    MOLAR_MASS_ZNO: 81.38,
    MOLAR_MASS_MN2O3: 157.87,

    // Faraday constant (C/mol)
    FARADAY: 96485,

    // Default cell voltage (V)
    DEFAULT_VOLTAGE: 1.5,

    // Electrons per reaction (default)
    DEFAULT_ELECTRONS: 2,

    // Stoichiometric coefficients for: Zn + 2MnO₂ → ZnO + Mn₂O₃
    STOICH: {
        ZN: 1,
        MNO2: 2,
        ZNO: 1,
        MN2O3: 1
    }
};

// ============================================
// Presets
// ============================================
const CHEMISTRY_PRESETS = {
    A: { name: 'Preset A', massZn: 1.0, massMnO2: 2.0 },
    B: { name: 'Preset B', massZn: 10.0, massMnO2: 100.0 },
    C: { name: 'Preset C', massZn: 5.0, massMnO2: 3.0 }
};

// ============================================
// Chemistry Calculator Class
// ============================================
class ChemistryCalculator {
    constructor(options = {}) {
        // User-editable parameters
        this.molarMassZn = options.molarMassZn || CHEMISTRY_CONSTANTS.MOLAR_MASS_ZN;
        this.molarMassMnO2 = options.molarMassMnO2 || CHEMISTRY_CONSTANTS.MOLAR_MASS_MNO2;
        this.electronsPerReaction = options.electronsPerReaction || CHEMISTRY_CONSTANTS.DEFAULT_ELECTRONS;
        this.cellVoltage = options.cellVoltage || CHEMISTRY_CONSTANTS.DEFAULT_VOLTAGE;

        // Input values
        this.massZn = options.massZn || 0;
        this.massMnO2 = options.massMnO2 || 0;
        this.resistance = options.resistance || null;

        // Calculated results
        this.results = null;
        this.workSteps = [];
    }

    /**
     * Calculate all stoichiometry results
     * @returns {Object} Calculation results
     */
    calculate() {
        this.workSteps = [];

        // Step 1: Calculate moles from mass
        const molesZn = this.massZn / this.molarMassZn;
        const molesMnO2 = this.massMnO2 / this.molarMassMnO2;

        this.workSteps.push({
            title: 'Convert mass to moles',
            description: 'Using n = m/M where n is moles, m is mass, M is molar mass',
            calculations: [
                `n(Zn) = ${this.massZn} g ÷ ${this.molarMassZn} g/mol = ${molesZn.toFixed(6)} mol`,
                `n(MnO₂) = ${this.massMnO2} g ÷ ${this.molarMassMnO2} g/mol = ${molesMnO2.toFixed(6)} mol`
            ]
        });

        // Step 2: Determine limiting reagent
        // Reaction: Zn + 2MnO₂ → ZnO + Mn₂O₃
        // For each mole of Zn, we need 2 moles of MnO₂
        const requiredMnO2ForZn = molesZn * CHEMISTRY_CONSTANTS.STOICH.MNO2;
        const requiredZnForMnO2 = molesMnO2 / CHEMISTRY_CONSTANTS.STOICH.MNO2;

        let limitingReagent, excessReagent, molesReacting, excessMoles;

        if (molesMnO2 < requiredMnO2ForZn) {
            // MnO₂ is limiting
            limitingReagent = 'MnO₂';
            excessReagent = 'Zn';
            molesReacting = molesMnO2 / CHEMISTRY_CONSTANTS.STOICH.MNO2;
            excessMoles = molesZn - requiredZnForMnO2;
        } else {
            // Zn is limiting
            limitingReagent = 'Zn';
            excessReagent = 'MnO₂';
            molesReacting = molesZn;
            excessMoles = molesMnO2 - requiredMnO2ForZn;
        }

        this.workSteps.push({
            title: 'Identify limiting reagent',
            description: 'Compare mole ratio to stoichiometric requirements (1 Zn : 2 MnO₂)',
            calculations: [
                `MnO₂ required for all Zn = ${molesZn.toFixed(6)} × 2 = ${requiredMnO2ForZn.toFixed(6)} mol`,
                `MnO₂ available = ${molesMnO2.toFixed(6)} mol`,
                `${molesMnO2 < requiredMnO2ForZn ? 'MnO₂ < required' : 'MnO₂ ≥ required'} → ${limitingReagent} is limiting`,
                `Excess ${excessReagent} = ${excessMoles.toFixed(6)} mol`
            ]
        });

        // Step 3: Calculate electrons transferred
        const totalElectrons = this.electronsPerReaction * molesReacting;

        this.workSteps.push({
            title: 'Calculate electrons transferred',
            description: `Each reaction unit transfers ${this.electronsPerReaction} electrons`,
            calculations: [
                `Moles of reaction = ${molesReacting.toFixed(6)} mol`,
                `Total electron-moles = ${this.electronsPerReaction} × ${molesReacting.toFixed(6)} = ${totalElectrons.toFixed(6)} mol e⁻`
            ]
        });

        // Step 4: Calculate charge (Coulombs)
        const chargeQ = totalElectrons * CHEMISTRY_CONSTANTS.FARADAY;

        this.workSteps.push({
            title: 'Calculate total charge',
            description: 'Using Q = n × F where F is Faraday constant (96485 C/mol)',
            calculations: [
                `Q = ${totalElectrons.toFixed(6)} mol × ${CHEMISTRY_CONSTANTS.FARADAY} C/mol`,
                `Q = ${chargeQ.toFixed(2)} C`
            ]
        });

        // Step 5: Calculate energy
        const energyJ = this.cellVoltage * chargeQ;
        const energyWh = energyJ / 3600;

        this.workSteps.push({
            title: 'Calculate theoretical energy',
            description: `Using E = V × Q with cell voltage = ${this.cellVoltage} V`,
            calculations: [
                `E = ${this.cellVoltage} V × ${chargeQ.toFixed(2)} C`,
                `E = ${energyJ.toFixed(2)} J`,
                `E = ${energyJ.toFixed(2)} ÷ 3600 = ${energyWh.toFixed(4)} Wh`
            ]
        });

        // Step 6: Optional - Calculate current and runtime
        let current = null, runtimeHours = null, runtimeMinutes = null;

        if (this.resistance && this.resistance > 0) {
            current = this.cellVoltage / this.resistance;
            runtimeHours = energyWh / (this.cellVoltage * current);
            runtimeMinutes = runtimeHours * 60;

            this.workSteps.push({
                title: 'Estimate current and runtime (approximation)',
                description: `With load resistance R = ${this.resistance} Ω`,
                calculations: [
                    `I = V/R = ${this.cellVoltage} V ÷ ${this.resistance} Ω = ${current.toFixed(4)} A`,
                    `Power = V × I = ${this.cellVoltage} × ${current.toFixed(4)} = ${(this.cellVoltage * current).toFixed(4)} W`,
                    `Runtime = E/P = ${energyWh.toFixed(4)} Wh ÷ ${(this.cellVoltage * current).toFixed(4)} W`,
                    `Runtime = ${runtimeHours.toFixed(4)} hours = ${runtimeMinutes.toFixed(2)} minutes`,
                    `Note: This is a theoretical estimate assuming constant voltage and no internal resistance.`
                ]
            });
        }

        // Calculate product masses
        const massZnO = molesReacting * CHEMISTRY_CONSTANTS.MOLAR_MASS_ZNO;
        const massMn2O3 = molesReacting * CHEMISTRY_CONSTANTS.MOLAR_MASS_MN2O3;

        this.results = {
            // Input values
            inputs: {
                massZn: this.massZn,
                massMnO2: this.massMnO2,
                molarMassZn: this.molarMassZn,
                molarMassMnO2: this.molarMassMnO2,
                electronsPerReaction: this.electronsPerReaction,
                cellVoltage: this.cellVoltage,
                resistance: this.resistance
            },

            // Stoichiometry results
            molesZn,
            molesMnO2,
            limitingReagent,
            excessReagent,
            molesReacting,
            excessMoles,

            // Product masses
            massZnO,
            massMn2O3,

            // Electrochemistry results
            totalElectrons,
            chargeQ,
            energyJ,
            energyWh,

            // Optional runtime estimates
            current,
            runtimeHours,
            runtimeMinutes,

            // Metadata
            timestamp: new Date().toISOString(),
            reaction: 'Zn + 2MnO₂ → ZnO + Mn₂O₃'
        };

        return this.results;
    }

    /**
     * Get work steps for display
     */
    getWorkSteps() {
        return this.workSteps;
    }

    /**
     * Export results as JSON
     */
    exportJSON() {
        return {
            results: this.results,
            workSteps: this.workSteps,
            constants: CHEMISTRY_CONSTANTS
        };
    }

    /**
     * Generate printable report HTML
     */
    generateReport() {
        if (!this.results) this.calculate();

        return `
      <div class="report">
        <h1>Stoichiometry Calculation Report</h1>
        <p class="report-date">Generated: ${new Date().toLocaleString()}</p>
        
        <h2>Reaction</h2>
        <p class="reaction-equation">Zn + 2MnO₂ → ZnO + Mn₂O₃</p>
        
        <h2>Input Values</h2>
        <table>
          <tr><th>Parameter</th><th>Value</th><th>Unit</th></tr>
          <tr><td>Mass of Zinc</td><td>${this.massZn}</td><td>g</td></tr>
          <tr><td>Mass of MnO₂</td><td>${this.massMnO2}</td><td>g</td></tr>
          <tr><td>Molar Mass Zn</td><td>${this.molarMassZn}</td><td>g/mol</td></tr>
          <tr><td>Molar Mass MnO₂</td><td>${this.molarMassMnO2}</td><td>g/mol</td></tr>
          <tr><td>Cell Voltage</td><td>${this.cellVoltage}</td><td>V</td></tr>
          <tr><td>Electrons per Reaction</td><td>${this.electronsPerReaction}</td><td>-</td></tr>
        </table>
        
        <h2>Results</h2>
        <table>
          <tr><th>Result</th><th>Value</th><th>Unit</th></tr>
          <tr><td>Moles of Zn</td><td>${this.results.molesZn.toFixed(6)}</td><td>mol</td></tr>
          <tr><td>Moles of MnO₂</td><td>${this.results.molesMnO2.toFixed(6)}</td><td>mol</td></tr>
          <tr class="highlight"><td>Limiting Reagent</td><td colspan="2">${this.results.limitingReagent}</td></tr>
          <tr><td>Excess ${this.results.excessReagent}</td><td>${this.results.excessMoles.toFixed(6)}</td><td>mol</td></tr>
          <tr><td>Charge (Q)</td><td>${this.results.chargeQ.toFixed(2)}</td><td>C</td></tr>
          <tr><td>Energy</td><td>${this.results.energyJ.toFixed(2)}</td><td>J</td></tr>
          <tr class="highlight"><td>Energy</td><td>${this.results.energyWh.toFixed(4)}</td><td>Wh</td></tr>
          ${this.results.current ? `<tr><td>Estimated Current</td><td>${this.results.current.toFixed(4)}</td><td>A</td></tr>` : ''}
          ${this.results.runtimeMinutes ? `<tr><td>Estimated Runtime</td><td>${this.results.runtimeMinutes.toFixed(2)}</td><td>min</td></tr>` : ''}
        </table>
        
        <h2>Step-by-Step Work</h2>
        ${this.workSteps.map((step, i) => `
          <div class="work-step">
            <h3>Step ${i + 1}: ${step.title}</h3>
            <p>${step.description}</p>
            <ul>
              ${step.calculations.map(calc => `<li><code>${calc}</code></li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    `;
    }

    /**
     * Load state from URL parameters
     */
    static fromURLParams(params) {
        const calc = new ChemistryCalculator({
            massZn: parseFloat(params.massZn) || 0,
            massMnO2: parseFloat(params.massMnO2) || 0,
            molarMassZn: parseFloat(params.molarMassZn) || CHEMISTRY_CONSTANTS.MOLAR_MASS_ZN,
            molarMassMnO2: parseFloat(params.molarMassMnO2) || CHEMISTRY_CONSTANTS.MOLAR_MASS_MNO2,
            cellVoltage: parseFloat(params.voltage) || CHEMISTRY_CONSTANTS.DEFAULT_VOLTAGE,
            electronsPerReaction: parseInt(params.electrons) || CHEMISTRY_CONSTANTS.DEFAULT_ELECTRONS,
            resistance: parseFloat(params.resistance) || null
        });
        return calc;
    }

    /**
     * Generate URL parameters from current state
     */
    toURLParams() {
        const params = new URLSearchParams();
        params.set('massZn', this.massZn);
        params.set('massMnO2', this.massMnO2);
        if (this.molarMassZn !== CHEMISTRY_CONSTANTS.MOLAR_MASS_ZN) {
            params.set('molarMassZn', this.molarMassZn);
        }
        if (this.molarMassMnO2 !== CHEMISTRY_CONSTANTS.MOLAR_MASS_MNO2) {
            params.set('molarMassMnO2', this.molarMassMnO2);
        }
        if (this.cellVoltage !== CHEMISTRY_CONSTANTS.DEFAULT_VOLTAGE) {
            params.set('voltage', this.cellVoltage);
        }
        if (this.electronsPerReaction !== CHEMISTRY_CONSTANTS.DEFAULT_ELECTRONS) {
            params.set('electrons', this.electronsPerReaction);
        }
        if (this.resistance) {
            params.set('resistance', this.resistance);
        }
        return params.toString();
    }
}

// ============================================
// Calculator UI Controller
// ============================================
class ChemistryCalculatorUI {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.calculator = new ChemistryCalculator();
        this.init();
        this.loadFromURL();
    }

    init() {
        this.bindElements();
        this.bindEvents();
        this.bindPresets();
        this.updateUI();
    }

    bindElements() {
        // Input fields
        this.inputs = {
            massZn: this.container.querySelector('#input-mass-zn'),
            massMnO2: this.container.querySelector('#input-mass-mno2'),
            molarMassZn: this.container.querySelector('#input-molar-mass-zn'),
            molarMassMnO2: this.container.querySelector('#input-molar-mass-mno2'),
            voltage: this.container.querySelector('#input-voltage'),
            electrons: this.container.querySelector('#input-electrons'),
            resistance: this.container.querySelector('#input-resistance')
        };

        // Result displays
        this.results = {
            molesZn: this.container.querySelector('#result-moles-zn'),
            molesMnO2: this.container.querySelector('#result-moles-mno2'),
            limitingReagent: this.container.querySelector('#result-limiting'),
            chargeQ: this.container.querySelector('#result-charge'),
            energyJ: this.container.querySelector('#result-energy-j'),
            energyWh: this.container.querySelector('#result-energy-wh'),
            current: this.container.querySelector('#result-current'),
            runtime: this.container.querySelector('#result-runtime')
        };

        // Buttons
        this.calculateBtn = this.container.querySelector('#btn-calculate');
        this.exportJsonBtn = this.container.querySelector('#btn-export-json');
        this.exportPdfBtn = this.container.querySelector('#btn-export-pdf');
        this.shareBtn = this.container.querySelector('#btn-share');
        this.printBtn = this.container.querySelector('#btn-print');

        // Work panel
        this.workPanel = this.container.querySelector('#work-steps-content');
    }

    bindEvents() {
        // Calculate on button click
        this.calculateBtn?.addEventListener('click', () => this.calculate());

        // Also calculate on Enter key in inputs
        Object.values(this.inputs).forEach(input => {
            input?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.calculate();
            });

            // Real-time calculation on input change
            input?.addEventListener('input', window.ChargeLab.Utils.debounce(() => {
                this.calculate();
            }, 300));
        });

        // Export buttons
        this.exportJsonBtn?.addEventListener('click', () => this.exportJSON());
        this.exportPdfBtn?.addEventListener('click', () => this.exportPDF());
        this.shareBtn?.addEventListener('click', () => this.shareLink());
        this.printBtn?.addEventListener('click', () => this.print());
    }

    bindPresets() {
        this.container.querySelectorAll('[data-preset]').forEach(btn => {
            btn.addEventListener('click', () => {
                const presetKey = btn.getAttribute('data-preset');
                this.loadPreset(presetKey);

                // Update active state
                this.container.querySelectorAll('[data-preset]').forEach(b => {
                    b.classList.remove('preset-btn--active');
                });
                btn.classList.add('preset-btn--active');
            });
        });
    }

    loadPreset(presetKey) {
        const preset = CHEMISTRY_PRESETS[presetKey];
        if (!preset) return;

        if (this.inputs.massZn) this.inputs.massZn.value = preset.massZn;
        if (this.inputs.massMnO2) this.inputs.massMnO2.value = preset.massMnO2;

        this.calculate();
    }

    loadFromURL() {
        const params = new URLSearchParams(window.location.search);

        if (params.has('massZn')) {
            this.calculator = ChemistryCalculator.fromURLParams(Object.fromEntries(params));

            // Update input fields
            if (this.inputs.massZn) this.inputs.massZn.value = this.calculator.massZn;
            if (this.inputs.massMnO2) this.inputs.massMnO2.value = this.calculator.massMnO2;
            if (this.inputs.molarMassZn) this.inputs.molarMassZn.value = this.calculator.molarMassZn;
            if (this.inputs.molarMassMnO2) this.inputs.molarMassMnO2.value = this.calculator.molarMassMnO2;
            if (this.inputs.voltage) this.inputs.voltage.value = this.calculator.cellVoltage;
            if (this.inputs.electrons) this.inputs.electrons.value = this.calculator.electronsPerReaction;
            if (this.inputs.resistance && this.calculator.resistance) {
                this.inputs.resistance.value = this.calculator.resistance;
            }

            this.calculate();
        }
    }

    calculate() {
        // Read input values
        this.calculator.massZn = parseFloat(this.inputs.massZn?.value) || 0;
        this.calculator.massMnO2 = parseFloat(this.inputs.massMnO2?.value) || 0;
        this.calculator.molarMassZn = parseFloat(this.inputs.molarMassZn?.value) || CHEMISTRY_CONSTANTS.MOLAR_MASS_ZN;
        this.calculator.molarMassMnO2 = parseFloat(this.inputs.molarMassMnO2?.value) || CHEMISTRY_CONSTANTS.MOLAR_MASS_MNO2;
        this.calculator.cellVoltage = parseFloat(this.inputs.voltage?.value) || CHEMISTRY_CONSTANTS.DEFAULT_VOLTAGE;
        this.calculator.electronsPerReaction = parseInt(this.inputs.electrons?.value) || CHEMISTRY_CONSTANTS.DEFAULT_ELECTRONS;
        this.calculator.resistance = parseFloat(this.inputs.resistance?.value) || null;

        // Perform calculation
        const results = this.calculator.calculate();

        // Update UI
        this.updateUI();

        // Store results for physics integration
        this.storeForPhysics(results);

        return results;
    }

    updateUI() {
        const results = this.calculator.results;
        if (!results) return;

        const { Utils } = window.ChargeLab;

        // Update result displays
        if (this.results.molesZn) {
            this.results.molesZn.textContent = Utils.formatNumber(results.molesZn, 6, 'mol');
        }
        if (this.results.molesMnO2) {
            this.results.molesMnO2.textContent = Utils.formatNumber(results.molesMnO2, 6, 'mol');
        }
        if (this.results.limitingReagent) {
            this.results.limitingReagent.textContent = results.limitingReagent;
            this.results.limitingReagent.classList.toggle('text-cyan', results.limitingReagent === 'Zn');
            this.results.limitingReagent.classList.toggle('text-teal', results.limitingReagent === 'MnO₂');
        }
        if (this.results.chargeQ) {
            this.results.chargeQ.textContent = Utils.formatNumber(results.chargeQ, 2, 'C');
        }
        if (this.results.energyJ) {
            this.results.energyJ.textContent = Utils.formatNumber(results.energyJ, 2, 'J');
        }
        if (this.results.energyWh) {
            this.results.energyWh.textContent = Utils.formatNumber(results.energyWh, 4, 'Wh');
        }
        if (this.results.current) {
            this.results.current.textContent = results.current
                ? Utils.formatNumber(results.current, 4, 'A')
                : '—';
        }
        if (this.results.runtime) {
            this.results.runtime.textContent = results.runtimeMinutes
                ? Utils.formatNumber(results.runtimeMinutes, 2, 'min')
                : '—';
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

    storeForPhysics(results) {
        // Store calculated current for physics module to potentially use
        if (results && results.chargeQ) {
            window.ChargeLab.AppState.save('chemistry_results', {
                chargeQ: results.chargeQ,
                energyWh: results.energyWh,
                current: results.current,
                timestamp: results.timestamp
            });
        }
    }

    exportJSON() {
        const data = this.calculator.exportJSON();
        window.ChargeLab.ExportUtils.exportJSON(data, 'chargelab-chemistry-results.json');
    }

    exportPDF() {
        const reportElement = this.container.querySelector('.results-panel');
        if (reportElement) {
            window.ChargeLab.ExportUtils.generatePDF('.calculator-panel', 'chargelab-chemistry-report.pdf');
        }
    }

    shareLink() {
        const params = this.calculator.toURLParams();
        const url = `${window.location.origin}${window.location.pathname}?${params}`;
        window.ChargeLab.DeepLinking.copyURL({ ...Object.fromEntries(new URLSearchParams(params)) });
    }

    print() {
        window.ChargeLab.ExportUtils.print('.calculator-panel');
    }
}

// ============================================
// Half-Reaction Animation
// ============================================
class HalfReactionAnimation {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.electrons = [];
        this.isRunning = false;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = Math.min(rect.height, 200);
    }

    start(electronCount = 10) {
        this.isRunning = true;
        this.electrons = [];

        // Create electrons
        for (let i = 0; i < electronCount; i++) {
            this.electrons.push({
                x: 50 + Math.random() * 50,
                y: this.canvas.height / 2 + (Math.random() - 0.5) * 40,
                vx: 1 + Math.random() * 2,
                phase: Math.random() * Math.PI * 2
            });
        }

        this.animate();
    }

    stop() {
        this.isRunning = false;
    }

    animate() {
        if (!this.isRunning) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw electrode zones
        this.drawElectrodes();

        // Draw and update electrons
        this.electrons.forEach(e => {
            // Update position
            e.x += e.vx;
            e.y = this.canvas.height / 2 + Math.sin(e.x / 30 + e.phase) * 20;

            // Reset if off screen
            if (e.x > this.canvas.width - 50) {
                e.x = 50;
            }

            // Draw electron
            this.ctx.beginPath();
            this.ctx.arc(e.x, e.y, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = '#00D1FF';
            this.ctx.fill();

            // Draw glow
            this.ctx.beginPath();
            this.ctx.arc(e.x, e.y, 8, 0, Math.PI * 2);
            const gradient = this.ctx.createRadialGradient(e.x, e.y, 2, e.x, e.y, 8);
            gradient.addColorStop(0, 'rgba(0, 209, 255, 0.5)');
            gradient.addColorStop(1, 'rgba(0, 209, 255, 0)');
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }

    drawElectrodes() {
        // Anode (Zn)
        this.ctx.fillStyle = '#3EF1C6';
        this.ctx.fillRect(20, this.canvas.height / 2 - 40, 30, 80);
        this.ctx.fillStyle = '#F8FAFC';
        this.ctx.font = '12px Inter';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Zn', 35, this.canvas.height / 2 + 60);
        this.ctx.fillText('(Anode)', 35, this.canvas.height / 2 + 75);

        // Cathode (MnO₂)
        this.ctx.fillStyle = '#00D1FF';
        this.ctx.fillRect(this.canvas.width - 50, this.canvas.height / 2 - 40, 30, 80);
        this.ctx.fillText('MnO₂', this.canvas.width - 35, this.canvas.height / 2 + 60);
        this.ctx.fillText('(Cathode)', this.canvas.width - 35, this.canvas.height / 2 + 75);

        // Arrow showing electron flow direction
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2 - 30, this.canvas.height / 2 - 50);
        this.ctx.lineTo(this.canvas.width / 2 + 30, this.canvas.height / 2 - 50);
        this.ctx.lineTo(this.canvas.width / 2 + 20, this.canvas.height / 2 - 55);
        this.ctx.moveTo(this.canvas.width / 2 + 30, this.canvas.height / 2 - 50);
        this.ctx.lineTo(this.canvas.width / 2 + 20, this.canvas.height / 2 - 45);
        this.ctx.stroke();

        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.fillText('e⁻ flow', this.canvas.width / 2, this.canvas.height / 2 - 60);
    }
}

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize calculator if container exists
    const calcContainer = document.getElementById('chemistry-calculator');
    if (calcContainer) {
        window.chemistryCalculatorUI = new ChemistryCalculatorUI('chemistry-calculator');
    }

    // Initialize half-reaction animation
    const animCanvas = document.getElementById('half-reaction-canvas');
    if (animCanvas) {
        window.halfReactionAnimation = new HalfReactionAnimation('half-reaction-canvas');

        // Start animation when section is visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    window.halfReactionAnimation.start(8);
                } else {
                    window.halfReactionAnimation.stop();
                }
            });
        });

        observer.observe(animCanvas.parentElement);
    }
});

// Export for use in other modules
window.ChargeLab = window.ChargeLab || {};
window.ChargeLab.Chemistry = {
    Calculator: ChemistryCalculator,
    CalculatorUI: ChemistryCalculatorUI,
    CONSTANTS: CHEMISTRY_CONSTANTS,
    PRESETS: CHEMISTRY_PRESETS
};
