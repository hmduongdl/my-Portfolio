# Quick Reference: Scroll System

## 🎯 The 20/80 Rule

### What it means:
Each section is divided into **20% (stay)** and **80% (advance)** zones.

```
┌─────────────────────────────────────┐
│ Section (e.g., Skills 20-40%)       │
├─────────────────────────────────────┤
│ 20% - STAY ZONE                     │ ← First 20%: Snap back to current
│ (Snap to current section)           │
├─────────────────────────────────────┤
│                                      │
│                                      │
│ 80% - ADVANCE ZONE                  │ ← Last 80%: Allow forward
│ (Allow snap to next section)        │
│                                      │
│                                      │
└─────────────────────────────────────┘
```

## 📍 Section Milestones

| Section    | Scroll Range | Milestone | Color     |
|-----------|--------------|-----------|-----------|
| Experience | 0% - 20%    | 0%        | Green     |
| Skills     | 20% - 40%   | 25%       | Green     |
| Projects   | 40% - 60%   | 50%       | Green     |
| Contact    | 60% - 80%   | 75%       | Green     |
| Thank You  | 80% - 100%  | 100%      | Green     |

## 🎨 Progress Bars

### Top of page has 2 bars:

1. **Gray bar** (background) - Shows actual scroll position (smooth)
2. **Green bar** (foreground) - Shows which section you're in (instant jump)
3. **Tick marks** - 5 vertical lines at 0%, 25%, 50%, 75%, 100%

## ⚡ Navigation Methods

### 1. Menu Click (Header Navigation)
- **Behavior**: Instant jump (`auto`)
- **Speed**: Immediate
- **Animation**: None (hotload)

### 2. Manual Scroll
- **Behavior**: Free scroll until stop
- **Snap**: After 250ms pause
- **Rule**: 20/80 applies

### 3. Scroll Stop
- **Delay**: 250ms after last scroll
- **Action**: Snap to nearest valid milestone
- **Duration**: 600ms smooth scroll

## 🔧 Key Parameters

```typescript
// Timing
scrollStopDebounce: 250ms
snapDuration: 600ms
profileReveal: 30ms
navigationFlag: 1500ms

// Thresholds
stayZone: 0-20% of section
advanceZone: 80-100% of section
```

## 🐛 Debugging

### Check if in correct section:
```javascript
// Open browser console
const scrollPct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
console.log('Scroll %:', scrollPct);

// Should be:
// 0-20: Experience
// 20-40: Skills
// 40-60: Projects
// 60-80: Contact
// 80-100: Thank You
```

### Check progress bar:
```javascript
// Green bar width should match section milestone
const greenBar = document.getElementById('scroll-progress');
console.log('Green bar:', greenBar.style.width);
// Should be: 0%, 25%, 50%, 75%, or 100%

const grayBar = document.getElementById('scroll-progress-hidden');
console.log('Gray bar:', grayBar.style.width);
// Should smoothly track actual scroll
```

## 🎬 Animation Flow

### Normal Scroll Through Sections:
1. User scrolls down
2. Gray bar slides smoothly
3. Content layer fades in/out
4. User reaches 80% of section
5. After 250ms pause → Snap to next milestone
6. Green bar jumps instantly
7. Content layer activates

### Menu Click:
1. User clicks "Projects"
2. `__isNavigating = true`
3. Instant jump to 50% milestone
4. Green bar updates immediately
5. Projects content appears instantly (no fade)
6. After 1500ms: `__isNavigating = false`

## 📝 Common Adjustments

### Make snapping more/less aggressive:
```typescript
// In PortfolioController.ts
this.scrollStopTimer = window.setTimeout(() => this.handleScrollStop(), 250);
// ↑ Increase = less aggressive (more time to scroll)
// ↓ Decrease = more aggressive (snaps faster)
```

### Change 20/80 split:
```typescript
// In scroll.ts snapToLayerIfClose()
if (positionInSection >= 80) {  // ← Change to 70, 90, etc.
    // Snap forward
} else if (positionInSection <= 20) {  // ← Change to 30, 10, etc.
    // Snap back
}
```

### Adjust section boundaries:
```typescript
// Change from 5 sections to 4? Adjust here:
const sections = [
    { name: 'experience', start: 0, end: 25, milestone: 0 },
    { name: 'skills', start: 25, end: 50, milestone: 33 },
    { name: 'projects', start: 50, end: 75, milestone: 66 },
    { name: 'contact', start: 75, end: 100, milestone: 100 },
];
```

## ⚠️ Things NOT to Change

1. Don't re-enable proximity snapping (causes chaos)
2. Don't add transition to green progress bar (should jump)
3. Don't reduce profile reveal below 30ms (won't fire reliably)
4. Don't set scroll stop below 150ms (too twitchy)

## 🎯 Expected Behavior

✅ **Scroll feels natural** - no forced jumping while actively scrolling
✅ **Sections are sticky** - won't advance until 80% through
✅ **Menu is instant** - click and you're there
✅ **Visual feedback is clear** - always know which section you're in
✅ **Progress bar reflects reality** - gray shows position, green shows section

---

Last Updated: 2026-01-16
