# Make Letterbox fully interactive (UI only)

No backend, no database. All state lives in React memory (a small shared store), so taps, selections and progress feel real while you use the app.

## Sign in / sign up
- Add social buttons under the login form: Continue with Google, Continue with Apple, Continue with Phone — each with a real logo/icon mark, not emoji, styled as the existing rounded pill buttons.
- Working form state: typed values, show/hide secret code, disabled "Let's play" until fields are filled, short loading spinner then navigate to the Games Hub.
- Signup: character picker and age chips become real selections; the picked avatar carries into the profile.
- Phone option opens a lightweight 4-digit code sheet (UI only, any code works).

## Games Hub (home)
- Game cards tap with press/scale feedback and navigate to that game's journey.
- Daily challenge hero becomes a tappable card that flips to reveal the challenge and a "Claim +50 coins" button; claiming animates the coin counter upward and marks it done for the session.

## Journey page
- Tapping an unlocked level opens a bottom sheet with the level title, type and a Start button.
- Completing a level animates the node from current to done, advances the path, unlocks the next node, and adds XP/coins with a counter animation and confetti-style pop.

## Rewards
- Shop items are buyable: coin balance decrements, item shows an owned state, insufficient coins shakes the card with a toast.
- Savings goal has +/- contribution controls with an animated progress fill.
- Badges open a detail popover on tap.

## Leaderboard
- Filter tabs (Friends / Class / All time) switch the ranked list with a smooth cross-fade and re-ordering animation.
- Your row highlights and scrolls into view.

## Profile (interactive)
- Avatar picker: tapping any avatar actually selects it, updates the header avatar with a pop animation, and persists across pages in the session.
- Editable display name via an inline input.
- Settings rows become real controls: Sounds & music and Reminders get toggle switches; Grown-up zone and Safety & privacy open sheets with placeholder copy.
- Stats (coins, streak, XP) read from the shared session store so purchases and completions show up here.
- Log out resets the session state and returns to login.

## Technical notes
- New `src/state/session.tsx`: React context + provider mounted in `__root.tsx` holding coins, XP, streak, avatar, name, owned items, completed levels, settings toggles. Plain `useState`/`useReducer`, no persistence layer.
- Reuse existing shadcn primitives already in the project (sheet, dialog, switch, tabs, popover, sonner toasts) so styling stays consistent with the ivory/green tokens.
- Motion: keep existing `press`, `lift`, `animate-pop-in`, `animate-slide-up` utilities; add a count-up number animation and a node-complete pulse in `src/styles.css`. Reduced-motion rules already in place stay respected.
- No Cloud, no database, no server functions.
