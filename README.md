Frontend Technical Test for [TeamITG](https://teamitg.com/)

## System requirements
You’ll want to ensure you have the following already installed on your local machine before getting started with the test:
* **Node 12+:** The current LTS (long-term support) release. We like to use a [Node Version Manager like NVM](https://github.com/nvm-sh/nvm).
* **NPM 6+ or Yarn:** Both of these package managers have ups and downs, choose whichever you prefer. Follow the installation instructions for Yarn or NPM to make sure you're using the latest version.

## Setup Instructions
1. Clone this repository
2. Type the following command to install the dependencies and run the project
````
npm install && npm start
````

## Task Instructions
1. API Implementation
    * You will receive a list of general vehicle information by making an initial api request to endpoint `/api/vehicles.json`
    * You are now required to traverse the API and make further calls on a detail endpoint (`apiUrl`) to get vehicle-specific details such as price and description
    * Ignore vehicles with broken apiUrl or without any price information
    * All API related logic should be implemented inside `getData()` available at `src/api/index.js`

2. Using `getData()` in a React component
    * React component `VehicleList` is configured to use `getData()` through a custom hook `useData`
    * If you prefer to use class-based component, then the rule to make a single function to obtain all vehicles through `getData()` needs to be respected
    * No other components are allowed to make any network request

3. UI Design
    * You are required to produce the following designs on different viewports to match as closely as possible, ready for a designer to review
    * [Mobile](https://raw.githubusercontent.com/connect-group/frontend-technical-test/master/designs/mobile.png)
    * [Tablet](https://raw.githubusercontent.com/connect-group/frontend-technical-test/master/designs/tablet.png)
    * [Desktop](https://raw.githubusercontent.com/connect-group/frontend-technical-test/master/designs/desktop.png)

## Browser Support
We expect the solution to work in the latest version of Chrome

## Acceptance criteria

**We have a high focus on attention to details in code**
* Solution should be written in either Reactjs or VanillaJS
* The formatting of the codebase should be consistent and written in a modular approach
* We expect the codebase to be written using ES6+ and libraries kept to a minimum
* We expect the code to be written with unit testing & performance in mind
* We expect the code to be included in the relevant files
* We prefer native Browser Api over JS libraries
* Mobile-first development approach using min-width media queries
* Solution should be accessible and meet WCAG 2.1
* No CSS framework allowed
* Internally, we use BEM - but we are open to other CSS naming conventions as long as it's built with scale and maintenance in mind

**We have a high focus on attention to details in design**
* We expect the designs to match as closely as possible, ready for a designer to review
* Correct semantic HTML mark-up and/or CSS should be used to achieve the size and aspect ratio of the images in the design
* Interactions and animations to be considered but not distracting users away from the experience
* Minimal visual bugs when going resizing to mobile and large screen sizes

## Nice to have
If you have achieved primary tasks and would like to showcase your skills by implementing additional feature(s) then you can consider the following:
- An [accessible modal implementation](https://www.w3.org/TR/wai-aria-practices-1.1/#dialog_modal) which displays the additional vehicle information e.g. emission, bodystyle
- Implement "Read more" which Show/Hide additional vehicle information
- A staggered fade in vehicle cards on load
- Redux
- Anything else which we cannot think of!

## Tips
Use linting to format the code and autofix most of the formatting issues
```shell script
npm run lint
```

## Implementation notes

The original brief above is unchanged. This section documents how the solution was built, how it maps to the requirements, and what was deliberately left out.

### Requirements coverage

| Area | Approach |
|------|----------|
| **API** | `request()` in `src/api/helpers.js` is the only `fetch` wrapper. `getData()` loads `/api/vehicles.json`, follows each `apiUrl` in parallel with `Promise.allSettled`, merges summary + detail, and drops vehicles whose detail call failed or has no price. |
| **React data flow** | `VehicleList` reads data only through `useData()` — no component-level network calls. The hook cancels in-flight fetches on unmount and exposes `retry` after errors. |
| **Layout** | Mobile-first BEM in `src/components/VehicleList/style.scss`. Breakpoints: tablet `768px`, desktop `1024px`. Design tokens live in `src/_variables.scss`. |
| **Images** | Native `<picture>` with a `min-width: 768px` `<source>` for 16×9 and a 1×1 `<img>` fallback from `vehicle.media`. |
| **Extra vehicle info** | Native `<dialog>` opened with `showModal()` — passengers, drivetrain, body style, and emissions. No Redux or UI libraries. |
| **Tooling** | ES6+, Airbnb ESLint, Stylelint, Jest 26, Testing Library 11, `jest-axe@4.1.0`. `npm test` and `npm run lint` both pass. |

Vehicles shown after filtering: **XE, F-PACE, F-TYPE, I-PACE**. Excluded: **XF** (empty price), **XJ** (no price key), **problematic** (broken `apiUrl` — a deliberate starter fixture).

### Design alignment

Visual source of truth: `designs/mobile.png`, `designs/tablet.png`, `designs/desktop.png`. Checked in Chrome at 375px, 820px, and 1440px.

**Mobile (375px)**
- Single-column list with hairline row dividers.
- 1×1 image flush to the left edge (~24% column width), filling the row height.
- Name, `From {price}`, and description left-aligned in the remaining space.
- Three-level grey hierarchy: title `#1a1a1a`, price `#4a4a4a`, description `#757575`.

**Tablet (768px+)**
- 2×2 grid, 16×9 images, centred copy, tight grid with hairline rules (no large gutters).
- Title framed by **2px** horizontal rules the width of the name, with **5px** vertical padding inside the rules.
- Dark hover overlay on the **image only** — title and body text are unaffected.

**Desktop (1024px+)**
- Four columns with thin vertical hairlines between cards; same card treatment as tablet.

**Typography**
- `Helvetica Neue` / Helvetica / Arial — closest system sans-serif to the mockup geometric face without adding a web font.
- Title letter-spacing `0.1em`; the word **From** uses `0.14em` tracking, separate from the price amount.
- Description is `13px` on mobile, `14px` from tablet upward.

**Interactions**
- Staggered card fade-in on load (`400ms`, `60ms` delay per index). Disabled when `prefers-reduced-motion: reduce`.
- Image overlay transition also honours reduced motion.

### Design decisions

- **Native APIs over libraries.** `fetch`, `Promise.allSettled`, `<picture>`, and `<dialog>` keep the bundle small and lean on platform behaviour (focus trap, Escape, backdrop click).
- **Card as stretched link, title as button.** The vehicle name is a real `<button>` inside `<h2>`. A `::after` pseudo-element on the button makes the whole card clickable for pointer users while keeping a single focusable control for keyboard and screen-reader users. The full description is already on the card — nothing is truncated.
- **Modal instead of “Read more”.** The API exposes `description` on the card and `meta` (passengers, drivetrain, bodystyles, emissions) in the detail payload. The modal shows all useful `meta` fields. A show/hide “Read more” would surface the same data with weaker keyboard and focus behaviour, so it was not implemented. `modelYear` and `emissions.template` are not displayed.
- **Defensive rendering.** Vehicles without `meta` do not open the dialog. Partial `meta` omits empty rows but always renders a title and Close button. `findMediaUrl` returns `''` for missing media so no empty `<img src="">` is emitted.
- **Node 18 on a webpack 4 starter.** `.npmrc` sets `legacy-peer-deps=true`; start/build scripts use `NODE_OPTIONS=--openssl-legacy-provider`. Targeted `postcss` overrides unblock Stylelint and Sass on current Node. Webpack was not upgraded.

### Accessibility (WCAG 2.1 AA)

**What is covered**

- **Structure:** `<main>`, visually hidden `<h1>Vehicle range</h1>`, `<ul>` / `<li>` / `<article>`, `<dl>` in the modal, heading hierarchy (`h1` → `h2` per card).
- **Names and roles:** Real `<button>` for the card action and modal Close. Decorative images use `alt=""` so the model name is not announced twice.
- **States:** Loading and empty use `role="status"`; error uses `role="alert"` with a **Try again** button wired to `retry`.
- **Keyboard:** Card button is focusable (`type="button"`). Modal Close is keyboard-reachable; native `<dialog>` provides focus trap and Escape dismissal; backdrop click closes the dialog.
- **Focus:** `:focus-visible` rings on interactive elements. Native `showModal()` restores focus to the opener on close in supporting browsers.
- **Motion:** Stagger animation and image overlay transition disabled under `prefers-reduced-motion: reduce`.
- **Colour:** Description `#757575` on white is **4.54:1** (AA for normal text). Price `#4a4a4a` is **9.7:1**.
- **Linting:** `eslint-plugin-jsx-a11y` stays enabled; the only suppression is a scoped comment on the dialog backdrop `onClick` (Escape and Close cover keyboard dismissal).
- **Automated checks:** `jest-axe` runs against loading, error, empty, list, and open-modal render paths in unit tests (22 tests total).

**Gaps and where end-to-end accessibility testing would help**

Unit tests and `jest-axe` in jsdom catch markup and many ARIA issues, but they cannot fully substitute for a real browser and assistive technology. Gaps worth covering with E2E (e.g. Playwright or Cypress + `@axe-core/playwright`):

| Gap | Suggested E2E check |
|-----|---------------------|
| **Enter / Space** opens the modal | Focus the card button, press Enter and Space, assert dialog visibility and focus on Close. (jsdom does not synthesise button activation from keyboard.) |
| **Focus return** after modal close | Open dialog from a card, close via Close / Escape / backdrop, assert focus returns to that card button. |
| **Focus trap** while modal is open | Tab through the dialog and assert focus does not escape to the page behind. |
| **Screen reader announcements** | Loading → results transition; error alert; whether live regions actually announce (static `role="status"` on mount may not be read — `aria-live="polite"` on state changes could be verified with AT or axe + manual pass). |
| **Responsive layout** | axe scan at 375 / 820 / 1440 after load; no horizontal scroll or clipped focus rings. |
| **Hover overlay** | Pointer hover on image shows overlay without reducing text contrast (visual regression or computed-style check). |
| **Colour in real rendering** | axe colour-contrast in a headed browser confirms token values under actual font smoothing. |

**Other minor items not blocking AA**

- Loading and empty states have no BEM styling (error state does).
- The stretched-link pattern prevents selecting description text with the mouse.
- Grid hairline rules are authored for exactly four vehicles; a different count would need divider tweaks.
- One expected **404** in the network log for `/api/vehicle_problematic.json` — intentional broken-URL fixture; the vehicle is correctly excluded.

### Testing summary

- **API (6 tests):** Original five starter tests kept and unskipped, plus a merge test. Covers traversal, failed detail calls, missing/empty price, and merged payloads.
- **VehicleList (16 tests):** Original three `data-testid` cases (loading / error / results), empty state, retry, modal open / close / reopen / backdrop, partial `meta`, `findMediaUrl`, keyboard focusability, and a single `jest-axe` sweep across all render paths.
- **Not covered:** E2E, visual regression, performance budgets, or manual screen-reader sign-off.

### Nice-to-have features

| Feature | Status |
|---------|--------|
| Accessible modal for `meta` | Done — native `<dialog>` |
| Staggered fade-in on load | Done — with `prefers-reduced-motion` |
| “Read more” show/hide | Not implemented — modal already exposes all `meta`; description is fully visible on the card |
| Redux | Not implemented — unnecessary for this scope |

### Running the project

```shell
npm install && npm start
```

Open `http://localhost:8080` in Chrome. Run `npm test` and `npm run lint` before submitting.
