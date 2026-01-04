/**
 * Project ChargeLab: Simulations Module
 * Virtual Lab Controllers for Interactive Experiments
 * @version 1.0.0
 */

// ============================================
// Limiting Reagent Lab
// ============================================
class LimitingReagentLab {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.massZn = 5;
        this.massMnO2 = 10;
        this.molarMassZn = 65.38;
        this.molarMassMnO2 = 86.936;

        this.init();
    }

    init() {
        this.bindElements();
        this.bindEvents();
        this.update();
    }

    bindElements() {
        this.sliderZn = this.container.querySelector('#lab-slider-zn');
        this.sliderMnO2 = this.container.querySelector('#lab-slider-mno2');
        this.displayZn = this.container.querySelector('#lab-display-zn');
        this.displayMnO2 = this.container.querySelector('#lab-display-mno2');
        this.visualization = this.container.querySelector('#lab-visualization');
        this.resultsPanel = this.container.querySelector('#lab-results');
    }

    bindEvents() {
        this.sliderZn?.addEventListener('input', () => {
            this.massZn = parseFloat(this.sliderZn.value);
            if (this.displayZn) this.displayZn.textContent = this.massZn.toFixed(1) + ' g';
            this.update();
        });

        this.sliderMnO2?.addEventListener('input', () => {
            this.massMnO2 = parseFloat(this.sliderMnO2.value);
            if (this.displayMnO2) this.displayMnO2.textContent = this.massMnO2.toFixed(1) + ' g';
            this.update();
        });
    }

    update() {
        // Calculate moles
        const molesZn = this.massZn / this.molarMassZn;
        const molesMnO2 = this.massMnO2 / this.molarMassMnO2;

        // Determine limiting reagent (1 Zn : 2 MnO2)
        const requiredMnO2 = molesZn * 2;
        const isZnLimiting = requiredMnO2 > molesMnO2;
        const limitingReagent = isZnLimiting ? 'Zn' : 'MnO₂';

        // Calculate amounts used and leftover
        let znUsed, mno2Used, znLeftover, mno2Leftover;

        if (isZnLimiting) {
            // MnO2 is limiting
            mno2Used = molesMnO2;
            znUsed = molesMnO2 / 2;
            znLeftover = molesZn - znUsed;
            mno2Leftover = 0;
        } else {
            // Zn is limiting
            znUsed = molesZn;
            mno2Used = molesZn * 2;
            mno2Leftover = molesMnO2 - mno2Used;
            znLeftover = 0;
        }

        // Update visualization
        this.renderVisualization(molesZn, molesMnO2, znUsed, mno2Used, znLeftover, mno2Leftover);

        // Update results
        this.renderResults(molesZn, molesMnO2, limitingReagent, znLeftover, mno2Leftover);
    }

    renderVisualization(molesZn, molesMnO2, znUsed, mno2Used, znLeftover, mno2Leftover) {
        if (!this.visualization) return;

        const maxMoles = Math.max(molesZn, molesMnO2, 0.2);
        const scale = 150 / maxMoles;

        this.visualization.innerHTML = `
      <div class="lab-viz">
        <div class="lab-viz__beaker">
          <div class="lab-viz__label">Reactants</div>
          <div class="lab-viz__bar-container">
            <div class="lab-viz__bar">
              <div class="lab-viz__bar-fill lab-viz__bar-fill--zn" 
                   style="height: ${Math.min(molesZn * scale, 150)}px">
                <span>Zn</span>
              </div>
            </div>
            <div class="lab-viz__bar">
              <div class="lab-viz__bar-fill lab-viz__bar-fill--mno2" 
                   style="height: ${Math.min(molesMnO2 * scale, 150)}px">
                <span>MnO₂</span>
              </div>
            </div>
          </div>
          <div class="lab-viz__values">
            <span>${molesZn.toFixed(4)} mol</span>
            <span>${molesMnO2.toFixed(4)} mol</span>
          </div>
        </div>
        
        <div class="lab-viz__arrow">→</div>
        
        <div class="lab-viz__beaker">
          <div class="lab-viz__label">After Reaction</div>
          <div class="lab-viz__bar-container">
            <div class="lab-viz__bar">
              <div class="lab-viz__bar-fill lab-viz__bar-fill--zn lab-viz__bar-fill--leftover" 
                   style="height: ${Math.min(znLeftover * scale, 150)}px">
                <span>${znLeftover > 0.0001 ? 'Zn' : ''}</span>
              </div>
            </div>
            <div class="lab-viz__bar">
              <div class="lab-viz__bar-fill lab-viz__bar-fill--mno2 lab-viz__bar-fill--leftover" 
                   style="height: ${Math.min(mno2Leftover * scale, 150)}px">
                <span>${mno2Leftover > 0.0001 ? 'MnO₂' : ''}</span>
              </div>
            </div>
          </div>
          <div class="lab-viz__values">
            <span>${znLeftover.toFixed(4)} mol</span>
            <span>${mno2Leftover.toFixed(4)} mol</span>
          </div>
        </div>
      </div>
    `;
    }

    renderResults(molesZn, molesMnO2, limitingReagent, znLeftover, mno2Leftover) {
        if (!this.resultsPanel) return;

        this.resultsPanel.innerHTML = `
      <div class="result-item result-item--highlight">
        <span class="result-item__label">Limiting Reagent:</span>
        <span class="result-item__value">${limitingReagent}</span>
      </div>
      <div class="result-item">
        <span class="result-item__label">Moles of Zn:</span>
        <span class="result-item__value">${molesZn.toFixed(5)} mol</span>
      </div>
      <div class="result-item">
        <span class="result-item__label">Moles of MnO₂:</span>
        <span class="result-item__value">${molesMnO2.toFixed(5)} mol</span>
      </div>
      <div class="result-item">
        <span class="result-item__label">Excess Zn remaining:</span>
        <span class="result-item__value">${znLeftover.toFixed(5)} mol</span>
      </div>
      <div class="result-item">
        <span class="result-item__label">Excess MnO₂ remaining:</span>
        <span class="result-item__value">${mno2Leftover.toFixed(5)} mol</span>
      </div>
      <div class="result-item">
        <span class="result-item__label">Reaction completion:</span>
        <span class="result-item__value">100% (of limiting reagent consumed)</span>
      </div>
    `;
    }

    saveScenario() {
        const scenario = {
            massZn: this.massZn,
            massMnO2: this.massMnO2,
            timestamp: new Date().toISOString()
        };

        const saved = window.ChargeLab.AppState.load('saved_scenarios') || [];
        saved.push(scenario);
        window.ChargeLab.AppState.save('saved_scenarios', saved.slice(-10)); // Keep last 10

        return scenario;
    }
}

// ============================================
// Field Mapping Lab
// ============================================
class FieldMappingLab {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.canvas = null;
        this.ctx = null;

        this.current = 2;
        this.turns = 100;
        this.length = 0.05;
        this.probeX = 0;
        this.probeY = 0;

        this.fieldData = [];
        this.isAnimating = false;

        this.init();
    }

    init() {
        this.bindElements();
        this.setupCanvas();
        this.bindEvents();
        this.update();
    }

    bindElements() {
        this.sliderCurrent = this.container.querySelector('#field-slider-current');
        this.sliderTurns = this.container.querySelector('#field-slider-turns');
        this.displayCurrent = this.container.querySelector('#field-display-current');
        this.displayTurns = this.container.querySelector('#field-display-turns');
        this.readout = this.container.querySelector('#field-readout');
        this.plotContainer = this.container.querySelector('#field-plot');
    }

    setupCanvas() {
        this.canvas = this.container.querySelector('#field-map-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resize();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        if (!this.canvas) return;

        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = Math.min(rect.height, 300);
        this.draw();
    }

    bindEvents() {
        this.sliderCurrent?.addEventListener('input', () => {
            this.current = parseFloat(this.sliderCurrent.value);
            if (this.displayCurrent) this.displayCurrent.textContent = this.current.toFixed(1) + ' A';
            this.update();
        });

        this.sliderTurns?.addEventListener('input', () => {
            this.turns = parseInt(this.sliderTurns.value);
            if (this.displayTurns) this.displayTurns.textContent = this.turns + ' turns';
            this.update();
        });

        // Canvas click for probe placement
        this.canvas?.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.probeX = e.clientX - rect.left;
            this.probeY = e.clientY - rect.top;
            this.updateProbeReading();
            this.draw();
        });

        // Record data button
        this.container.querySelector('#btn-record-data')?.addEventListener('click', () => {
            this.recordDataPoint();
        });

        // Clear data button
        this.container.querySelector('#btn-clear-data')?.addEventListener('click', () => {
            this.clearData();
        });
    }

    update() {
        this.calculateFieldMap();
        this.draw();
        this.updateReadout();
        this.updatePlot();
    }

    calculateFieldMap() {
        // Calculate B-field for solenoid
        const mu0 = 4 * Math.PI * 1e-7;
        this.bCenter = (mu0 * this.turns * this.current) / this.length;
    }

    draw() {
        if (!this.ctx) return;

        const { ctx, canvas } = this;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw solenoid outline
        const solenoidWidth = canvas.width * 0.5;
        const solenoidHeight = 60;
        const startX = centerX - solenoidWidth / 2;
        const endX = centerX + solenoidWidth / 2;

        ctx.strokeStyle = '#3EF1C6';
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, centerY - solenoidHeight / 2, solenoidWidth, solenoidHeight);

        // Draw field intensity grid
        this.drawFieldGrid(centerX, centerY, startX, endX, solenoidHeight);

        // Draw probe if placed
        if (this.probeX && this.probeY) {
            ctx.beginPath();
            ctx.arc(this.probeX, this.probeY, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#00D1FF';
            ctx.fill();
            ctx.strokeStyle = '#F8FAFC';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Probe label
            ctx.fillStyle = '#F8FAFC';
            ctx.font = '11px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('Probe', this.probeX, this.probeY + 25);
        }

        // Legend
        ctx.fillStyle = '#B6C0C9';
        ctx.font = '11px Inter';
        ctx.textAlign = 'left';
        ctx.fillText('Click to place probe', 10, canvas.height - 10);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#3EF1C6';
        ctx.fillText('■ Strong field', canvas.width - 10, canvas.height - 25);
        ctx.fillStyle = '#00D1FF';
        ctx.fillText('■ Medium field', canvas.width - 10, canvas.height - 10);
    }

    drawFieldGrid(centerX, centerY, startX, endX, solenoidHeight) {
        const { ctx, canvas, bCenter } = this;
        const gridSize = 20;

        for (let x = gridSize; x < canvas.width; x += gridSize) {
            for (let y = gridSize; y < canvas.height; y += gridSize) {
                // Determine if inside or outside solenoid
                const inside = x > startX && x < endX &&
                    y > centerY - solenoidHeight / 2 &&
                    y < centerY + solenoidHeight / 2;

                // Calculate approximate field strength (simplified model)
                let fieldStrength;
                if (inside) {
                    fieldStrength = 1; // Uniform inside
                } else {
                    // Field drops off outside
                    const distFromCenter = Math.sqrt(
                        Math.pow((x - centerX) / canvas.width, 2) +
                        Math.pow((y - centerY) / canvas.height, 2)
                    );
                    fieldStrength = Math.max(0, 0.3 - distFromCenter);
                }

                // Draw field intensity dot
                const alpha = fieldStrength * 0.6;
                const radius = 3 + fieldStrength * 3;

                if (alpha > 0.05) {
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.fillStyle = inside
                        ? `rgba(62, 241, 198, ${alpha})`
                        : `rgba(0, 209, 255, ${alpha})`;
                    ctx.fill();
                }
            }
        }
    }

    updateProbeReading() {
        if (!this.canvas) return;

        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const solenoidWidth = this.canvas.width * 0.5;
        const solenoidHeight = 60;
        const startX = centerX - solenoidWidth / 2;
        const endX = centerX + solenoidWidth / 2;

        // Check if probe is inside solenoid
        const inside = this.probeX > startX && this.probeX < endX &&
            this.probeY > centerY - solenoidHeight / 2 &&
            this.probeY < centerY + solenoidHeight / 2;

        if (inside) {
            this.probeB = this.bCenter;
            this.probeLocation = 'inside solenoid';
        } else {
            // Simplified: field drops off outside
            const distFromCenter = Math.sqrt(
                Math.pow((this.probeX - centerX) / this.canvas.width, 2) +
                Math.pow((this.probeY - centerY) / this.canvas.height, 2)
            );
            this.probeB = this.bCenter * Math.max(0, 0.3 - distFromCenter);
            this.probeLocation = 'outside solenoid';
        }
    }

    updateReadout() {
        if (!this.readout) return;

        const bDisplay = this.bCenter > 0.001
            ? (this.bCenter * 1000).toFixed(3) + ' mT'
            : (this.bCenter * 1e6).toFixed(2) + ' μT';

        let probeDisplay = '—';
        if (this.probeB !== undefined) {
            probeDisplay = this.probeB > 0.001
                ? (this.probeB * 1000).toFixed(3) + ' mT'
                : (this.probeB * 1e6).toFixed(2) + ' μT';
        }

        this.readout.innerHTML = `
      <div class="result-item">
        <span class="result-item__label">B at center:</span>
        <span class="result-item__value">${bDisplay}</span>
      </div>
      <div class="result-item">
        <span class="result-item__label">B at probe:</span>
        <span class="result-item__value">${probeDisplay}</span>
      </div>
      ${this.probeLocation ? `
        <div class="result-item">
          <span class="result-item__label">Probe location:</span>
          <span class="result-item__value">${this.probeLocation}</span>
        </div>
      ` : ''}
    `;
    }

    recordDataPoint() {
        if (this.probeB !== undefined) {
            this.fieldData.push({
                current: this.current,
                turns: this.turns,
                B: this.probeB,
                location: this.probeLocation,
                timestamp: new Date().toISOString()
            });
            this.updatePlot();
        }
    }

    clearData() {
        this.fieldData = [];
        this.updatePlot();
    }

    updatePlot() {
        if (!this.plotContainer || this.fieldData.length === 0) {
            if (this.plotContainer) {
                this.plotContainer.innerHTML = '<p class="text-muted">Record data points to see a plot</p>';
            }
            return;
        }

        // Simple text-based data table
        this.plotContainer.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Current (A)</th>
            <th>Turns</th>
            <th>B (mT)</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          ${this.fieldData.map((d, i) => `
            <tr>
              <td>${i + 1}</td>
              <td>${d.current.toFixed(1)}</td>
              <td>${d.turns}</td>
              <td>${(d.B * 1000).toFixed(4)}</td>
              <td>${d.location}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    }
}

// ============================================
// Integrated Pipeline Visualization
// ============================================
class IntegratedPipeline {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.chemistryData = null;
        this.physicsData = null;

        this.init();
    }

    init() {
        this.chemistryPanel = this.container.querySelector('#pipeline-chemistry');
        this.physicsPanel = this.container.querySelector('#pipeline-physics');
        this.sankeyContainer = this.container.querySelector('#pipeline-sankey');
        this.interpretationPanel = this.container.querySelector('#pipeline-interpretation');

        // Listen for chemistry updates
        window.addEventListener('storage', (e) => {
            if (e.key === 'chargelab_chemistry_results') {
                this.loadChemistryData();
                this.update();
            }
        });

        this.loadChemistryData();
        this.bindEvents();
        this.update();
    }

    loadChemistryData() {
        this.chemistryData = window.ChargeLab?.AppState?.load('chemistry_results');
    }

    bindEvents() {
        // Chain button
        this.container.querySelector('#btn-chain-results')?.addEventListener('click', () => {
            this.chainResults();
        });

        // Recalculate button
        this.container.querySelector('#btn-recalculate')?.addEventListener('click', () => {
            this.update();
        });
    }

    chainResults() {
        if (!this.chemistryData) {
            alert('Please run the Chemistry calculator first to generate electron/current data.');
            return;
        }

        // Use chemistry current in physics
        if (window.physicsCalculatorUI) {
            window.physicsCalculatorUI.importFromChemistry();
        }

        this.update();
    }

    update() {
        this.renderSankey();
        this.renderInterpretation();
    }

    renderSankey() {
        if (!this.sankeyContainer) return;

        const chemData = this.chemistryData;

        if (!chemData) {
            this.sankeyContainer.innerHTML = `
        <div class="sankey-placeholder">
          <p class="text-muted">Run the Chemistry calculator to visualize the energy flow</p>
        </div>
      `;
            return;
        }

        // Simple Sankey-style visualization using HTML/CSS
        const energyWh = chemData.energyWh || 0;
        const chargeC = chemData.chargeQ || 0;

        // Assume some losses for visualization
        const chemicalEnergy = energyWh * 1.3; // Assume ~77% efficiency
        const electricalEnergy = energyWh;
        const magneticWork = energyWh * 0.1; // Small fraction to magnetic field
        const heatLoss = chemicalEnergy - electricalEnergy;

        this.sankeyContainer.innerHTML = `
      <div class="sankey">
        <div class="sankey__stage">
          <div class="sankey__node sankey__node--source">
            <div class="sankey__label">Chemical Energy</div>
            <div class="sankey__value">${(chemicalEnergy * 3600).toFixed(1)} J</div>
          </div>
        </div>
        
        <div class="sankey__flow">
          <div class="sankey__arrow sankey__arrow--main" style="flex: ${electricalEnergy}">
            <span>Electron Flow</span>
            <span>${chargeC.toFixed(0)} C</span>
          </div>
          <div class="sankey__arrow sankey__arrow--loss" style="flex: ${heatLoss}">
            <span>Heat Loss</span>
          </div>
        </div>
        
        <div class="sankey__stage">
          <div class="sankey__node sankey__node--middle">
            <div class="sankey__label">Electrical Energy</div>
            <div class="sankey__value">${electricalEnergy.toFixed(4)} Wh</div>
          </div>
        </div>
        
        <div class="sankey__flow">
          <div class="sankey__arrow sankey__arrow--work" style="flex: ${magneticWork}">
            <span>To Magnetic Field</span>
          </div>
          <div class="sankey__arrow sankey__arrow--output" style="flex: ${electricalEnergy - magneticWork}">
            <span>Useful Work</span>
          </div>
        </div>
        
        <div class="sankey__stage">
          <div class="sankey__node sankey__node--output">
            <div class="sankey__label">Magnetic Field Energy</div>
            <div class="sankey__value">+ External Work</div>
          </div>
        </div>
      </div>
    `;
    }

    renderInterpretation() {
        if (!this.interpretationPanel) return;

        const chemData = this.chemistryData;

        if (!chemData) {
            this.interpretationPanel.innerHTML = '';
            return;
        }

        const energyWh = chemData.energyWh || 0;
        const current = chemData.current;

        let interpretation = `
      <h4>Interpretation</h4>
      <p>
        The redox reaction between zinc and manganese dioxide releases electrons that flow 
        through an external circuit. This chemical-to-electrical energy conversion is the 
        fundamental principle behind batteries.
      </p>
      <p>
        <strong>Energy Output:</strong> ${energyWh.toFixed(4)} Wh of electrical energy is 
        theoretically available from the given amounts of reactants.
      </p>
    `;

        if (current) {
            interpretation += `
        <p>
          <strong>Current:</strong> At the calculated current of ${current.toFixed(4)} A, 
          this current flowing through a solenoid or coil would produce a magnetic field 
          whose strength depends on the number of turns and geometry of the conductor.
        </p>
      `;
        }

        interpretation += `
      <p>
        <strong>Real-World Application:</strong> This is how alkaline batteries (like AA or 9V) 
        power electromagnets, motors, and speakers. The chemical energy stored in the battery 
        is converted to electrical current, which then produces magnetic fields used for 
        mechanical work.
      </p>
    `;

        this.interpretationPanel.innerHTML = interpretation;
    }
}

// ============================================
// Scenario Manager
// ============================================
class ScenarioManager {
    constructor() {
        this.scenarios = this.loadScenarios();
    }

    loadScenarios() {
        return window.ChargeLab?.AppState?.load('saved_scenarios') || [];
    }

    saveScenario(name, data) {
        const scenario = {
            name,
            data,
            id: Date.now().toString(36),
            timestamp: new Date().toISOString()
        };

        this.scenarios.push(scenario);
        window.ChargeLab.AppState.save('saved_scenarios', this.scenarios);

        return scenario;
    }

    deleteScenario(id) {
        this.scenarios = this.scenarios.filter(s => s.id !== id);
        window.ChargeLab.AppState.save('saved_scenarios', this.scenarios);
    }

    getScenario(id) {
        return this.scenarios.find(s => s.id === id);
    }

    generateShareURL(scenario) {
        const params = new URLSearchParams();
        Object.entries(scenario.data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                params.set(key, value);
            }
        });
        return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    }
}

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Limiting Reagent Lab
    const limitingLabContainer = document.getElementById('limiting-reagent-lab');
    if (limitingLabContainer) {
        window.limitingReagentLab = new LimitingReagentLab('limiting-reagent-lab');
    }

    // Initialize Field Mapping Lab
    const fieldLabContainer = document.getElementById('field-mapping-lab');
    if (fieldLabContainer) {
        window.fieldMappingLab = new FieldMappingLab('field-mapping-lab');
    }

    // Initialize Integrated Pipeline
    const pipelineContainer = document.getElementById('integrated-pipeline');
    if (pipelineContainer) {
        window.integratedPipeline = new IntegratedPipeline('integrated-pipeline');
    }

    // Initialize Scenario Manager
    window.scenarioManager = new ScenarioManager();
});

// Add CSS for Sankey and Lab visualizations
const labStyles = document.createElement('style');
labStyles.textContent = `
  .lab-viz {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 1rem;
  }
  
  .lab-viz__beaker {
    text-align: center;
  }
  
  .lab-viz__label {
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--color-text-primary);
  }
  
  .lab-viz__bar-container {
    display: flex;
    gap: 1rem;
    justify-content: center;
    align-items: flex-end;
    height: 160px;
    padding: 0.5rem;
    background: var(--color-bg-tertiary);
    border-radius: var(--radius-md);
  }
  
  .lab-viz__bar {
    width: 50px;
    height: 150px;
    display: flex;
    align-items: flex-end;
  }
  
  .lab-viz__bar-fill {
    width: 100%;
    transition: height 0.3s ease;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
  }
  
  .lab-viz__bar-fill span {
    color: var(--color-bg-primary);
    font-weight: 600;
    font-size: 0.75rem;
    padding: 0.25rem;
  }
  
  .lab-viz__bar-fill--zn {
    background: linear-gradient(180deg, #3EF1C6, #2BC5AA);
  }
  
  .lab-viz__bar-fill--mno2 {
    background: linear-gradient(180deg, #00D1FF, #0099CC);
  }
  
  .lab-viz__bar-fill--leftover {
    opacity: 0.5;
  }
  
  .lab-viz__values {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 0.5rem;
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }
  
  .lab-viz__arrow {
    font-size: 2rem;
    color: var(--color-accent-cyan);
  }
  
  .sankey {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .sankey__stage {
    display: flex;
    justify-content: center;
  }
  
  .sankey__node {
    padding: 1rem 2rem;
    border-radius: var(--radius-md);
    text-align: center;
  }
  
  .sankey__node--source {
    background: linear-gradient(135deg, #3EF1C6, #2BC5AA);
    color: var(--color-bg-primary);
  }
  
  .sankey__node--middle {
    background: linear-gradient(135deg, #00D1FF, #0099CC);
    color: var(--color-bg-primary);
  }
  
  .sankey__node--output {
    background: var(--color-bg-secondary);
    border: 2px solid var(--color-accent-cyan);
  }
  
  .sankey__label {
    font-weight: 600;
  }
  
  .sankey__value {
    font-family: var(--font-mono);
    font-size: 0.9rem;
  }
  
  .sankey__flow {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    padding: 0 2rem;
  }
  
  .sankey__arrow {
    padding: 0.5rem 1rem;
    background: rgba(0, 209, 255, 0.2);
    border-radius: var(--radius-sm);
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.75rem;
    color: var(--color-text-muted);
  }
  
  .sankey__arrow--main {
    background: rgba(0, 209, 255, 0.3);
    color: var(--color-accent-cyan);
  }
  
  .sankey__arrow--loss {
    background: rgba(255, 100, 100, 0.2);
    color: #FF6464;
  }
  
  .sankey__arrow--work {
    background: rgba(62, 241, 198, 0.2);
    color: var(--color-accent-teal);
  }
  
  .sankey__arrow--output {
    background: rgba(0, 209, 255, 0.2);
    color: var(--color-accent-cyan);
  }
`;
document.head.appendChild(labStyles);

// Export for use in other modules
window.ChargeLab = window.ChargeLab || {};
window.ChargeLab.Simulations = {
    LimitingReagentLab,
    FieldMappingLab,
    IntegratedPipeline,
    ScenarioManager
};
