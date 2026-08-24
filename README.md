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

## Design decisions

- **API.** `request()` wraps native `fetch`. `getData()` loads `/api/vehicles.json`, follows each `apiUrl` with `Promise.allSettled`, and drops failed details or missing prices (XF, `problematic`).
- **Native APIs.** `<picture>` picks 1×1 vs 16×9. Extra vehicle info uses `<dialog>.showModal()` (focus trap, Escape, backdrop).
- **Layout.** Mobile-first BEM. Tokens in `src/_variables.scss`. Tight grid and hairline rules to match `designs/`, not large gutters. Hover is a dark overlay on the image.
- **Accessibility.** WCAG 2.1 AA: `<main>`, list/article semantics, live regions, decorative `alt=""`, `:focus-visible`, `prefers-reduced-motion`. Description `#666` on white meets 4.5:1.
- **Tests.** Starter API tests unskipped and extended with a merge case. Component tests cover empty, retry, modal reopen, `findMediaUrl`, and jest-axe on each state.
- **Node 18.** `.npmrc` `legacy-peer-deps=true` and `NODE_OPTIONS=--openssl-legacy-provider` on start/build so the 2021 webpack 4 starter still installs and runs. Webpack was not upgraded.
