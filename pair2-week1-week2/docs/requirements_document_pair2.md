# Closet Design Game Requirements Document Draft

Prepared for Pair 2: Chloe Patrick and Camryn Morris  
Sprint Cycle 1, Weeks 1-2

## 1. Overview

Closet Design Game is a web-based single page application where users design outfits on a mannequin using historical and region-based clothing templates. The project combines a studio-style user interface, a drawing canvas, and a static garment catalog so users can browse an era and geographic region, choose clothing categories, customize garments with brush tools, and eventually save or share completed outfits.

The first increment focuses on proving the core studio workspace. Pair 2 is responsible for the visible application layout and selection flow around the canvas. By the end of Week 2, the interface must include a top navigation bar, left and right slide-out drawers, era and region selectors, and clothing category buttons for tops, bottoms, and hats. These controls will later connect to the shared canvas and catalog state so a selected garment can be placed on the mannequin.

## 2. Functional Requirements

FR-1. The system shall display a main studio page with a top navigation bar, central canvas area, and side drawers for user controls.

FR-2. The system shall provide a left slide-out drawer for browsing eras such as the 1970s, 1980s, 1990s, and other supported time periods.

FR-3. The system shall provide region selection controls for geographic categories such as Western Europe, East Asia, West Africa, and North America.

FR-4. The system shall provide clothing category controls for at least tops, bottoms, and hats.

FR-5. The system shall visually show the user's current era, region, and clothing category selections.

FR-6. The system shall keep the studio controls in React state so later canvas integration can use the selected era, region, and clothing category to spawn matching garment assets.

FR-7. The system shall reserve a stable central canvas area where Pair 1's Fabric.js canvas can be mounted without changing the surrounding studio layout.

FR-8. The system shall include placeholder toolbar actions for expected studio tools such as brush, palette, cut, layers, undo, redo, history, save, and gallery access.

FR-9. The system shall allow users to open and close each side drawer without reloading the page.

FR-10. The system shall support responsive use on desktop and smaller browser widths by preserving access to the main canvas area and core controls.

## 3. Non-Functional Requirements

NFR-1. Usability: The studio interface shall use clear icons, readable labels, and consistent button states so users can understand which filters are currently active.

NFR-2. Responsiveness: The layout shall adapt to different browser widths without causing text overlap, clipped controls, or canvas layout shifts.

NFR-3. Maintainability: UI state shall be separated into clear React values for selected era, region, and clothing category so future canvas and catalog integration requires minimal rewiring.

NFR-4. Reliability: Opening, closing, and changing drawer selections shall not crash the page or require a refresh.

NFR-5. Accessibility: Interactive controls shall include accessible labels or visible text, keyboard focus styles, and sufficient color contrast for normal use.

NFR-6. Performance: The initial studio shell shall remain lightweight so Fabric.js drawing performance is not reduced by unnecessary UI rendering.

NFR-7. Visual Consistency: Styling shall use Tailwind CSS utility classes and Lucide icons so Pair 2's work follows the technology plan listed in the proposal.

## 6. Operating Environment

The application is intended to run as a browser-based single page web application on desktop and mobile browsers. The planned frontend stack is React with Vite for development tooling, Tailwind CSS for styling, and Lucide React for icon controls. The drawing surface is expected to use Fabric.js in the central canvas area once Pair 1's work is integrated.

Target user devices include laptops, desktops, tablets, and phones with current versions of Chrome, Safari, Firefox, or Edge. Because the project is client-side for the first increment, no account system or backend server is required for the Week 1-2 Pair 2 deliverables. Later milestones may use browser storage APIs such as LocalStorage or IndexedDB for saved outfits and browser sharing APIs for exports.

## 7. Assumptions

A-1. Pair 1 will provide a Fabric.js canvas component that can be mounted inside the central canvas handoff area.

A-2. Pair 3 will provide a catalog schema and normalized garment assets that Pair 2's selectors can reference when users choose an era, region, and clothing category.

A-3. The first increment does not require final garment placement behavior from Pair 2; the Week 2 requirement is to build selection drawers and category controls.

A-4. The app can run without user accounts during Sprint Cycle 1.

A-5. Early era and region values may be placeholder catalog options until the team finalizes the full historical clothing dataset.

A-6. Social sharing, saved outfit galleries, body type controls, and final export screens are later milestones and are not required for the Week 1-2 Pair 2 scope.

A-7. Tailwind CSS and Lucide React are acceptable third-party libraries based on the approved project proposal.
