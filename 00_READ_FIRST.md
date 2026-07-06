# Space Model Lab v3 - Read First

Status: RECOVERY CAPSULE
Project line: Space Model Lab v3
Milestone: v0 Local Milestone
Date: 2026-07-05

---

## Purpose

This file is a repo-local recovery checkpoint for future Codex or new-chat runs.

It is not a replacement for canonical source documents.

If this file conflicts with the working tree or canonical docs, prefer:

1. observed repo working tree
2. PROJECT_SOURCE.md
3. MANIFEST.md
4. docs/DECISION_LOG.md
5. docs/ARCHITECTURE.md
6. docs/ACCEPTANCE_CRITERIA.md
7. docs/PHYSICS_CONTRACT.md
8. fresh runtime validation output

Do not assume external uploaded ChatGPT source files exist in this repo unless they are actually present on disk.

---

## Current Milestone

Space Model Lab v3 v0 Local Milestone is accepted.

Accepted state:

* normalized Newtonian 2D N-body physics v0
* browser sandbox
* visual polish
* renderer-owned deterministic starfield
* renderer-owned bounded trails
* educational inspector diagnostics
* no-dependency Node local server
* Windows launcher

Original local Codex workspace used during v0 import:

```text
C:\Users\infor\Documents\Codex\2026-07-01\new-chat
```

This path is historical import context, not a portable project root.

Do not assume this local path exists in future environments.

Codi currently works in this local workspace. The portable canonical project root is the checked-out GitHub repository root after clone or pull. Future agents should treat that repository root as the working root.

Canonical Windows launch path:

```text
start-space-model-lab.bat
```

Canonical local server:

```text
tools/serve-local.js
```

Canonical browser URL:

```text
http://127.0.0.1:4173/
```

Direct `file:// index.html` is not an acceptance path for this ES-module app.

---

## Physics Baseline

Accepted baseline command:

```sh
node src/dev/baseline.js
```

Accepted baseline metrics:

* G = 1
* dt = 0.001
* softening = 0.001
* step count = 5000
* body count start/end = 6/6
* timestep count start/end = 0/5000
* relative energy drift = 4.290851857533e-11
* momentum drift = 7.808913380318e-20
* relative angular momentum drift = 3.213114654476e-15
* final status = PASS

Runtime preset:

* id: normalized-educational-nbody
* name: Normalized educational N-body baseline
* bodies: Sun, Inner A, Inner B, Middle, Outer A, Outer B
* normalized educational units only
* not real ephemeris data
* not date-accurate astronomy
* not NASA data
* not real solar-system scale

---

## Architecture Boundaries

Physics and simulation must remain independent from DOM, canvas, viewport, renderer, UI, camera, and browser launch code.

Accepted render/UI boundaries:

* renderer imports no physics modules
* UI imports no physics modules
* camera imports no physics or simulation modules
* baseline imports no renderer, UI, main, camera, DOM, canvas, or viewport modules
* renderer/UI/main do not assign to body mass, position, velocity, or acceleration
* UI derived diagnostics are display-only and not stored into body or state

Accepted presentation caches:

* starfield is renderer-owned presentation memory
* trails are renderer-owned presentation memory
* trails are bounded to 150 points per body
* trails are not stored on simulation bodies
* trails are not stored in state.simulation
* Reset clears trails through renderer presentation reset

---

## Launcher Boundaries

Accepted launcher:

* `start-space-model-lab.bat` starts the local server on Windows
* `tools/serve-local.js` uses only Node built-in modules
* server binds `127.0.0.1`
* server uses port `4173`
* `/` serves `index.html`
* JavaScript is served with ES-module-safe MIME
* path traversal is blocked in tested cases
* `.git`, `.agents`, and `.codex` are blocked
* directory listing is not implemented

Not accepted:

* .exe packaging
* Python launcher
* Electron
* Tauri
* bundler
* dependencies
* devDependencies
* build system

---

## Validation Checklist

Use this short validation after docs-only recovery tasks:

```sh
node src/dev/baseline.js
node --check tools/serve-local.js
```

If runtime code was touched, also run:

```sh
node --check src/ui/controls.js
node --check src/main.js
node --check src/render/renderer.js
node --check src/render/camera.js
node --check src/state.js
node --check src/simulation/presets.js
node --check src/simulation/reset.js
node --check src/simulation/step.js
node --check src/physics/gravity.js
node --check src/physics/integrator.js
node --check src/dev/baseline.js
```

Browser QA for launcher/runtime tasks:

* launch through `start-space-model-lab.bat` or `node tools/serve-local.js`
* open `http://127.0.0.1:4173/`
* bodies visible
* Play/Pause works
* Reset works
* Speed works
* Zoom works
* body selection works
* empty-space click clears selection
* inspector updates
* normalized educational disclaimer visible
* selected body diagnostics visible
* trails appear while running
* trails clear after Reset
* no visible console errors

---

## Audit Policy

After v0 local milestone, use full read-only audits only for risky changes:

* physics
* simulation
* main loop
* renderer/camera/UI state boundaries
* launcher/server/security-sensitive code
* package/dependency/build changes
* major canonical docs/source rewrites

For small docs-only changes, use a short validation checklist:

* baseline PASS
* no src changes
* no dependencies
* source markers still present in canonical docs

---

## Known Limitations

* git is unavailable in PATH in this environment, so git diff/status may not be available
* port 4173 can already be in use
* PowerShell execution policy may block `npm run preview`
* launcher browser opening is shell-dependent
* local server remains security-sensitive despite tested traversal protection
* labels and inspector can be dense on small screens
* normalized units can be confused with real astronomy if the disclaimer is ignored
* .exe packaging is not accepted yet

---

## Where Details Live

* Project direction: PROJECT_SOURCE.md
* File inventory and active source set: MANIFEST.md
* Decisions: docs/DECISION_LOG.md
* Architecture: docs/ARCHITECTURE.md
* Acceptance: docs/ACCEPTANCE_CRITERIA.md
* Physics contract: docs/PHYSICS_CONTRACT.md
* Operational lessons: docs/LESSONS_INHERITED.md
