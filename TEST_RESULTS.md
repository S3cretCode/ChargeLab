# Test Results - Project ChargeLab

This document records the verification testing performed on Project ChargeLab.

## Calculator Verification

### Chemistry Calculator Tests

#### Test 1: Preset A (1.0 g Zn, 2.0 g MnO₂)

| Property | Expected | Calculated | ✓/✗ |
|----------|----------|------------|-----|
| Moles Zn | 0.01530 mol | 0.01530 mol | ✓ |
| Moles MnO₂ | 0.02301 mol | 0.02301 mol | ✓ |
| Limiting Reagent | MnO₂ | MnO₂ | ✓ |
| Moles reaction | 0.01150 mol | 0.01150 mol | ✓ |
| Moles electrons | 0.02301 mol | 0.02301 mol | ✓ |
| Charge (Q) | 2220.6 C | 2220.8 C | ✓ |
| Energy (J) | 3330.9 J | 3331.2 J | ✓ |
| Energy (Wh) | 0.9253 Wh | 0.9253 Wh | ✓ |

#### Test 2: Preset B (10 g Zn, 100 g MnO₂)

| Property | Expected | Calculated | ✓/✗ |
|----------|----------|------------|-----|
| Moles Zn | 0.1530 mol | 0.1530 mol | ✓ |
| Moles MnO₂ | 1.1503 mol | 1.1503 mol | ✓ |
| Limiting Reagent | Zn | Zn | ✓ |
| Charge (Q) | 29,522 C | 29,522 C | ✓ |
| Energy (Wh) | 12.30 Wh | 12.30 Wh | ✓ |

#### Test 3: Preset C (5.0 g Zn, 3.0 g MnO₂)

| Property | Expected | Calculated | ✓/✗ |
|----------|----------|------------|-----|
| Limiting Reagent | MnO₂ | MnO₂ | ✓ |
| Charge (Q) | 3331 C | 3331 C | ✓ |

### Physics Simulator Tests

#### Test 4: Solenoid (N=200, I=2A, L=5cm, air)

| Property | Expected | Calculated | ✓/✗ |
|----------|----------|------------|-----|
| B-field | 0.01005 T | 0.01005 T | ✓ |
| B-field (mT) | 10.05 mT | 10.05 mT | ✓ |

#### Test 5: Solenoid with Ferrite Core (μᵣ=2000)

| Property | Expected | Calculated | ✓/✗ |
|----------|----------|------------|-----|
| B-field | 20.1 T | 20.1 T | ✓ |

#### Test 6: Small Coil (N=30, I=1A, r=1.2cm)

| Property | Expected | Calculated | ✓/✗ |
|----------|----------|------------|-----|
| B-field | 1.57 mT | 1.57 mT | ✓ |

#### Test 7: Straight Wire (I=2A, r=1cm)

| Property | Expected | Calculated | ✓/✗ |
|----------|----------|------------|-----|
| B-field | 40 μT | 40.0 μT | ✓ |

## Integration Tests

### Test 8: Chemistry to Physics Pipeline

| Step | Expected | Actual | ✓/✗ |
|------|----------|--------|-----|
| Chemistry calculates current | 0.15 A (with 10Ω load) | 0.15 A | ✓ |
| Current transfers to physics | Value preserved | 0.15 A | ✓ |
| Physics uses imported current | B calculated | 0.000754 T | ✓ |

## UI/UX Tests

### Test 9: Theme Switching

| Theme | Background | Text | Accent | ✓/✗ |
|-------|------------|------|--------|-----|
| Dark (default) | #071733 | #F8FAFC | #00D1FF | ✓ |
| Light | #F8FAFC | #0A1628 | #0077B3 | ✓ |
| High Contrast | #000000 | #FFFFFF | #00FFFF | ✓ |

### Test 10: Responsive Breakpoints

| Viewport | Layout | Navigation | ✓/✗ |
|----------|--------|------------|-----|
| 1400px | Full width | Horizontal nav | ✓ |
| 900px | Contained | Horizontal nav | ✓ |
| 600px | Mobile | Hamburger menu | ✓ |

### Test 11: Accessibility

| Feature | Implementation | ✓/✗ |
|---------|----------------|-----|
| Skip link | Present, visible on focus | ✓ |
| ARIA labels | Navigation, buttons, toggles | ✓ |
| Keyboard navigation | All interactive elements | ✓ |
| Focus indicators | Visible on :focus | ✓ |
| Alt text | Images and icons | ✓ |

## Deep-Linking Tests

### Test 12: URL Parameters

| URL | Expected Behavior | ✓/✗ |
|-----|-------------------|-----|
| `chemistry.html?massZn=5&massMnO2=10` | Loads with those values | ✓ |
| `physics.html?current=2&turns=200` | Calculator pre-filled | ✓ |
| `index.html?mode=physics` | Physics mode active | ✓ |

## Browser Compatibility

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | 120 | ✓ Pass | Full functionality |
| Firefox | 121 | ✓ Pass | Full functionality |
| Safari | 17 | ✓ Pass | Full functionality |
| Edge | 120 | ✓ Pass | Full functionality |

## Performance

| Metric | Target | Actual | ✓/✗ |
|--------|--------|--------|-----|
| Initial load (local) | < 2s | ~0.5s | ✓ |
| Calculator response | < 100ms | ~10ms | ✓ |
| Animation FPS | 60 | 60 | ✓ |
| Total file size | < 500KB | ~180KB | ✓ |

## Summary

- **Total Tests**: 12 test categories
- **Passed**: 12/12 (100%)
- **Failed**: 0

All core functionality verified and working correctly.

---

*Test Date: 2024*
*Tested By: ChargeLab Development*
