# Closet Design Game - Pair 2 Week 1-2 Deliverable

This folder contains the Pair 2 Studio UI deliverable for Sprint Cycle 1, Weeks 1 and 2.

## Included

- React + Vite app shell
- Tailwind CSS configuration and styling
- Lucide React icon buttons
- Top navbar with placeholder studio controls
- Slide-out era/region drawer
- Slide-out garment category drawer
- Category buttons for tops, bottoms, and hats
- Central canvas handoff area for Pair 1's Fabric.js component
- Requirements Document draft sections:
  - Section 1: Overview
  - Section 2: Functional Requirements
  - Section 3: Non-Functional Requirements
  - Section 6: Operating Environment
  - Section 7: Assumptions

## Run Locally

If dependencies are already installed:

```bash
npm run dev
```

If starting fresh:

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Verification

The production build was verified with:

```bash
node ./node_modules/vite/bin/vite.js build
```

The UI was also opened in-browser to confirm that changing era and category selections updates the visible Studio State.
