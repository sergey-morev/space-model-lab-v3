PROJECT_SOURCE.md - Space Model Lab v3

Status: ACTIVE CANONICAL PROJECT SOURCE
Project line: Space Model Lab v3
Mode: clean-room rebuild with visual inheritance
Source marker: SML-V3-CANONICAL
Date: 2026-06-23
Revision: 2026-07-05 recovery capsule sync

---

1. Purpose

This file defines the active project direction for Space Model Lab v3.

It is the highest-level source document for the project.

All other source documents, prompts, and implementation work must remain consistent with this file.

00_READ_FIRST.md is the repo-local recovery capsule for new Codex or new-chat runs.

It is a recovery pointer and milestone summary, not a replacement for this canonical project source.

---

2. Project identity

Space Model Lab v3 is a small, browser-based, 2D Newtonian gravity sandbox.

It is designed as an inspectable scientific toy-lab:

* visual
* educational
* deterministic enough for engineering verification
* architecturally clean
* small enough for human review
* safe for staged AI-assisted implementation

The product should feel like a compact scientific cockpit, not a game engine, not a wallpaper, and not an overclaimed astronomy simulator.

---

3. Core direction

v3 is a clean-room rebuild.

The project keeps the useful product direction and hard engineering lessons, but the implementation starts fresh.

The active foundation is:

* clean source documents
* small module boundaries
* headless physics verification
* narrow Codex tasks
* no legacy implementation carryover
* no broad AI rewrite

The project should proceed through small accepted steps, not through one-shot generation.

---

4. What v3 is

v3 is:

* a 2D Newtonian N-body sandbox
* a browser canvas application
* a visually clear orbit playground
* a small engineering system with explicit boundaries
* a project designed for staged AI-assisted implementation
* a system with a headless physics-contract baseline

v3 should support:

* bodies moving under gravity
* visual trails if simple
* camera zoom
* play/pause/reset
* speed control
* simple body inspection
* readable physics diagnostics
* source-level verification

---

5. What v3 is not

v3 is not:

* a real astronomical prediction system
* a NASA ephemeris tool
* a relativistic simulator
* a black-hole simulator
* an eclipse predictor
* a mission planner
* a 3D engine
* a collision physics engine
* a framework showcase
* a benchmark of visual complexity

Any future expansion must be explicitly decided and documented before implementation.

---

6. Primary engineering principle

Physics must be independent from presentation.

Physics must not depend on:

* canvas size
* viewport size
* browser window size
* devicePixelRatio
* CSS layout
* camera zoom
* render scale
* UI panel state
* mouse state
* keyboard state

Physics state is world state.

Render state is presentation state.

Camera state is projection state.

UI state is interaction state.

This boundary is mandatory.

---

7. Physics direction

The core physics model is simple 2D Newtonian N-body gravity.

Expected model:

* world-space positions
* world-space velocities
* mass-based gravitational acceleration
* fixed timestep
* gravitational softening in world units
* Velocity Verlet / Kick-Drift-Kick style integration
* centralized initial presets
* no collision behavior by default

The physics model must be honest about its limits.

It may be educational and approximate.

It must not claim real ephemeris accuracy.

---

8. Baseline direction

The project baseline is a headless physics-contract baseline.

It must run through Node.

Expected command:

node src/dev/baseline.js

The baseline must not require:

* browser
* DOM
* canvas
* CSS
* screenshots
* CDP
* remote browser debugging
* manual visual inspection

The baseline must check physical contracts and numerical sanity.

Primary checks:

* no NaN
* no Infinity
* stable body count
* stable timestep count
* bounded relative energy drift
* bounded momentum drift
* bounded angular momentum drift
* repeatable report for the same initial state and same engine path
* no viewport/render/camera dependency

Position hashes may be secondary diagnostics.

Pixel hashes are not a physics baseline.

---

9. Source authority

The active source set is defined by:

* PROJECT_SOURCE.md
* MANIFEST.md
* docs/DECISION_LOG.md
* docs/LESSONS_INHERITED.md
* docs/PHYSICS_CONTRACT.md
* docs/ARCHITECTURE.md
* docs/ACCEPTANCE_CRITERIA.md
* approved prompts under prompts/
* implementation files under the approved source tree

The current source collection uses the SML-V3-CANONICAL marker for active files.

Canonical repository paths do not include the marker.

Only one active version of each canonical file may exist.

---

10. Implementation style

v3 implementation should be:

* plain JavaScript modules first
* no framework by default
* no build system by default
* no TypeScript by default
* no Web Worker by default
* no premature optimization
* no speculative files
* no placeholder modules for undecided behavior
* package.json allowed only as minimal Node runtime metadata for ES module execution (type module; no dependencies, devDependencies, build, framework, or test tooling)

The first usable system should be small, readable, and verifiable.

Complexity must be earned by later decisions.

---

11. Expected repository shape

Target repository structure:

space-model-lab-v3/
README.md
PROJECT_SOURCE.md
MANIFEST.md
package.json
index.html
styles.css
docs/
DECISION_LOG.md
LESSONS_INHERITED.md
PHYSICS_CONTRACT.md
ARCHITECTURE.md
ACCEPTANCE_CRITERIA.md
prompts/
codex_scaffold.md
src/
main.js
config.js
state.js
physics/
vector.js
gravity.js
integrator.js
simulation/
presets.js
reset.js
step.js
render/
camera.js
renderer.js
ui/
controls.js
dev/
baseline.js

This structure should stay small unless a later accepted decision changes it.

Deferred future prompt paths (approved names, not yet created): prompts/codex_physics_kernel.md, prompts/codex_render_ui.md. They join the tree only when the corresponding prompt is approved and created.

---

12. Forbidden early behavior

The following must not be implemented without explicit future decision:

* collision behavior
* merge behavior
* bounce behavior
* absorption behavior
* fragmentation
* event horizon behavior
* black-hole-specific physics
* wormholes
* relativistic effects
* real ephemerides
* eclipse prediction
* mission planning
* 3D
* Barnes-Hut
* Web Worker
* framework migration
* TypeScript migration
* screenshot-based baseline
* browser-automation baseline

Do not create files that imply these behaviors.

---

13. Codex role

Codex is an executor, not the architect.

Codex tasks must be narrow.

Every Codex prompt must include:

* intended working directory
* root confirmation requirement
* stop-if-wrong-root instruction
* allowed files
* forbidden files
* exact scope
* acceptance checks
* report requirements
* stop condition

Codex must not:

* broaden scope
* invent architecture
* add future features
* create speculative modules
* implement multiple stages at once
* continue after the requested task is complete

---

14. Review rule

Review must use observed evidence.

Accepted evidence:

* actual file tree
* actual file contents
* import boundaries
* command output
* baseline PASS/FAIL report
* visible browser behavior after source and baseline checks

Weak evidence:

* "looks good"
* "should work"
* "implemented"
* "tested" without concrete output

Use precise status labels:

* ACCEPTED
* ACCEPTED WITH LIMITATIONS
* REJECTED
* DEFERRED
* NOT CHECKED

---

15. Product tone

The visual identity should be:

* dark
* scientific
* calm
* readable
* cockpit-like
* educational
* not cluttered
* not toy-like in a childish way
* not overdesigned before the core works

The first priority is not visual polish.

The first priority is a clean, inspectable, working system.

---

16. Success definition

Space Model Lab v3 is moving correctly when:

* source authority is singular
* file tree is small
* physics is independent from render/UI/camera
* simulation can run headlessly
* baseline verifies physics contracts
* browser rendering shows the same world state
* UI controls do not implement physics
* Codex tasks remain narrow
* no speculative features are added early

The project fails if it becomes a large impressive prototype with hidden coupling.

---

17. Current accepted milestone

Current accepted milestone:

* Task 11B - GitHub Pages public preview accepted

Original local Codex workspace used during v0 import:

* C:\Users\infor\Documents\Codex\2026-07-01\new-chat

This path is historical import context, not portable canon.

The portable canonical project root is the checked-out GitHub repository root after clone or pull.

Accepted implementation state:

* normalized Newtonian N-body physics kernel
* G=1
* dt=0.001
* softening=0.001
* Velocity Verlet / Kick-Drift-Kick integration
* six-body educational preset: Sun, Inner A, Inner B, Middle, Outer A, Outer B
* no real ephemerides
* no collisions
* no GR, black holes, or lensing
* browser sandbox visible through local HTTP
* render/UI/camera separated from physics
* fixed integer steps per animation frame
* camera zoom is render-only
* body selection and empty-space clear work
* inspector updates every frame
* inspector shows normalized educational units disclaimer
* selected-body inspector diagnostics are UI-only and read-only
* derived inspector values are not stored in body or state
* live invariant telemetry visible in the browser
* barycenter / center-of-mass marker visible in the browser
* deterministic renderer-owned starfield
* renderer-owned bounded trails
* no-dependency local HTTP launcher accepted
* Windows launcher accepted as the canonical double-click launch path
* repo-local recovery capsule accepted
* GitHub Pages public preview accepted at https://drmorev.github.io/space-model-lab-v3/

Task 5C accepted baseline:

* final status PASS
* finite-state PASS
* repeatability PASS
* body count stable
* timestep count stable
* relative energy drift: 4.290851857533e-11
* momentum drift: 7.808913380318e-20
* relative angular momentum drift: 3.213114654476e-15

Task 5C accepted limitations:

* git unavailable in PATH
* missing/non-finite inspector fallback was code-inspected, not forced in browser

Task 6C accepted launch path:

* start-space-model-lab.bat is the canonical Windows launch path
* tools/serve-local.js is the canonical Node built-in local server
* http://127.0.0.1:4173/ is the canonical browser URL
* npm run preview is an alternate script path when npm is available
* direct file:// index.html is not an acceptance path for the ES-module app

Task 6C accepted launcher constraints:

* no .exe packaging
* no Python launcher
* no Electron or Tauri
* no bundler
* no dependencies
* no build system

Task 7B accepted recovery path:

* 00_READ_FIRST.md is the first file a future Codex/new-chat run should read
* 00_READ_FIRST.md summarizes the v0 local milestone and points to canonical docs
* 00_READ_FIRST.md does not replace PROJECT_SOURCE.md, MANIFEST.md, or docs/
* repo working tree and canonical docs remain authoritative if a conflict appears
* local Codex workspace paths are historical import context unless a future task explicitly declares otherwise

Task 11B accepted public preview path:

* GitHub Pages public preview is live at https://drmorev.github.io/space-model-lab-v3/
* Pages source is branch main, folder / root
* accepted deployed commit at verification time is 843ca0143b3fe644445f466297ea9871d1b36866
* live cockpit includes T10B live invariant telemetry and T10C barycenter marker
* Pages does not replace local baseline validation
* screenshot remains deferred and optional

Current constraints remain:

* no framework
* no dependencies
* no build system
* no new physics beyond accepted Newtonian v0
* no collision, ephemeris, GR, black-hole, or lensing behavior
* start-space-model-lab.bat plus Node local server is the canonical local launch path
* local HTTP server at http://127.0.0.1:4173/ is the canonical local browser preview path
* GitHub Pages at https://drmorev.github.io/space-model-lab-v3/ is the accepted public preview path
* direct file:// index.html is not the canonical acceptance path

---

18. Active decision

Space Model Lab v3 proceeds as a clean-room rebuild with visual inheritance.

The project prioritizes:

* clean source
* explicit boundaries
* invariant-based baseline
* small implementation steps
* staged review
* no legacy implementation carryover
* no one-shot AI rewrite

This file is the active project source.
