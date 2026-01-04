# Project ChargeLab: From Atoms to Fields

An interactive educational website connecting stoichiometry and electrochemistry (Chemistry 30S) with magnetic fields and electromagnetism (Physics 30S).

## 🚀 Quick Start

1. **Clone or download** this repository
2. **Open `index.html`** in any modern web browser
3. No build step or server required — it's all static files!

```bash
# If you have Python installed, you can also run a local server:
python3 -m http.server 8000
# Then open http://localhost:8000
```

## 📖 Features

### Chemistry Module

- Mole concept and molar mass explanations
- Interactive stoichiometry calculator
- Limiting reagent detection
- Redox reaction visualization
- Faraday's law application (Q = nF)
- 3 preset scenarios & 3 worked examples

### Physics Module  

- Current as moving charge
- Interactive B-field simulator
- Right-hand rule demonstrator
- Solenoid, loop, and wire calculations
- Material permeability effects
- 3 preset configurations & 3 worked examples

### Integration Features

- Chemistry → Physics data passing
- Energy flow visualization (Sankey-style)
- Virtual labs for experimentation
- Deep-linkable URLs for sharing

### Accessibility

- Dark / Light / High-Contrast themes
- Large text mode
- ARIA labels and keyboard navigation
- Print-optimized styles

## 📁 Project Structure

```
ChargeLab/
├── index.html          # Landing page
├── chemistry.html      # Chemistry module
├── physics.html        # Physics module
├── integrated.html     # Combined view
├── simulations.html    # Virtual labs
├── glossary.html       # 35+ term definitions
├── sources.html        # APA references
├── about.html          # Teacher summary & rubric
├── styles/
│   └── style.css       # Complete design system (~1100 lines)
├── scripts/
│   ├── main.js         # Core functionality
│   ├── chemistry.js    # Stoichiometry calculator
│   ├── physics.js      # B-field simulator
│   └── simulations.js  # Lab controllers
├── assets/
│   ├── logo.svg        # Project logo
│   ├── favicon.svg     # Browser icon
│   └── icons/          # 18 SVG icons
├── README.md           # This file
├── LICENSE             # MIT License
└── TEST_RESULTS.md     # Verification data
```

## 🧮 Formulas Used

### Chemistry

| Formula | Description |
|---------|-------------|
| `n = m / M` | Moles from mass |
| `Q = n × F` | Charge from moles of electrons |
| `E = V × Q` | Energy from voltage and charge |
| `1 Wh = 3600 J` | Energy unit conversion |

### Physics

| Formula | Description |
|---------|-------------|
| `B = μ₀I/(2πr)` | Straight wire |
| `B ≈ μ₀NI/(2r)` | Circular loop/coil |
| `B = μ₀μᵣNI/L` | Solenoid |

### Constants

- **Faraday constant (F)**: 96,485 C/mol
- **Permeability of free space (μ₀)**: 4π × 10⁻⁷ H/m
- **Molar mass Zn**: 65.38 g/mol
- **Molar mass MnO₂**: 86.936 g/mol

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Responsive Design

The site is fully responsive and works on:

- Desktop (1200px+)
- Tablet (768px - 1199px)  
- Mobile (< 768px)

## 🎓 Curriculum Alignment

### Chemistry 30S (Manitoba)

- Mole concept and calculations
- Chemical equations and stoichiometry
- Oxidation-reduction reactions

### Physics 30S (Manitoba)

- Electric circuits and current
- Magnetism and electromagnetism
- Electromagnetic applications

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Physical constants from NIST CODATA 2018
- Atomic masses from IUPAC 2021
- Inspiration from PhET Interactive Simulations

---

**Project ChargeLab** — Grade 11 Chemistry + Physics Final Project
