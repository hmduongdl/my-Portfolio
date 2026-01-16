# Scroll & Progress Update

Summary of recent updates to the site scroll behavior and progress UI

- Fixed ReferenceError by importing `snapToLayerIfClose` into `src/app/PortfolioController.ts`.
- Snapping centers updated to five equidistant markers: 0%, 25%, 50%, 75%, 100%.
  - Layer mapping: `experience` → 0%, `skills` → 25%, `projects` → 50%, `contact` → 75%, `thankyou` → 100% (optional layer).
- Dual-progress UI:
  - `#scroll-progress-hidden`: continuous progress bar reflecting true scroll percentage (updated each scroll tick).
  - `#scroll-progress`: visible snapping progress that snaps to the five markers when the active layer changes.
- Improved visible snapping animation: increased transition duration and changed easing so the visible bar animates smoothly between markers.
- Layer switching now supports a `thankyou` final partition (80-100%). If you want a real `thankyou` section, add an element with id `thankyou-layer` in the About markup.

Recommended next steps

- Add visual tick marks (0/25/50/75/100) to the progress bar for clarity.
- Replace timeout-based sequencing for split/reveal with `transitionend` event listeners for deterministic coordination.
- Refactor global timers into a small timer manager module to avoid cross-module globals.

Files changed

- `src/app/PortfolioController.ts` — import `snapToLayerIfClose`, updated snapping and progress sync logic.
- `src/utils/scroll.ts` — snapping centers and optional `thankyou` layer logic.
- `src/style.css` — visible progress transition tuned.

Build

- Run `npm run build` to validate TypeScript and Vite build after changes.

Additional changes (20/80 skip rule)

- The proximity snap and scroll-stop snap logic were updated to enforce the 20/80 rule:
  - Forward snapping is blocked when the current scroll percentage is less than 20%.
  - On scroll stop the controller advances at most one section forward if the user is in the latter 80%.
  - Backward snapping (moving to an earlier section) remains allowed via proximity checks.

Files changed (delta)

- `src/utils/scroll.ts` — `snapToLayerIfClose` now checks the active layer and enforces 20/80 for forward jumps.
- `src/app/PortfolioController.ts` — `handleScrollStop` now implements the one-step-forward behavior and updates visible progress after snap.
- `src/app/PortfolioController.ts` — added visual tick marks at 0/25/50/75/100% on the progress bar for clarity.
