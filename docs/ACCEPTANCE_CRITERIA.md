ACCEPTANCE_CRITERIA.md - Space Model Lab v3

Status: ACTIVE CANONICAL ACCEPTANCE CRITERIA
Project line: Space Model Lab v3
Mode: clean-room rebuild with visual inheritance
Source marker: SML-V3-CANONICAL
Date: 2026-06-23
Revision: 2026-07-05 launch documentation sync

---

1. Purpose

This document defines what "accepted" means for Space Model Lab v3.

It is binding for implementation, review, and Codex prompts.

A file, feature, task, or implementation slice is not accepted because it looks plausible.

It is accepted only when the relevant checks below pass.

---

2. Acceptance philosophy

v3 acceptance is based on:

* source clarity
* architectural boundaries
* headless verification
* small scope
* explicit behavior
* no implementation carryover
* no hidden browser dependency in physics
* no invented future features
* observed evidence over completion claims

The first goal is not feature richness.

The first goal is a small system that can be trusted, inspected, and extended.

---

3. Global acceptance gates

Every v3 task must satisfy these gates.

Gate 1 - Correct source root

Accepted only if work happens in the intended v3 project root.

Codex must confirm working directory before modifying files.

If the root is wrong, the task fails.

Gate 2 - Active source only

Accepted only if the task follows active v3 source files.

Implementation must not rely on inactive notes, abandoned plans, or unapproved prompts.

Gate 3 - No implementation carryover

Accepted only if implementation is cleanly created from v3 source documents.

Visual direction may be inherited.

Code must be clean.

Gate 4 - Scope control

Accepted only if the task does exactly what was requested.

No extra features.

No speculative modules.

No "while I was there" changes.

No future behavior.

Gate 5 - Report

Accepted only if the task produces a short completion report:

* files created
* files modified
* files intentionally not created
* checks run
* known limitations
* next safe step

---

4. Source-set acceptance

The active source set is accepted when it contains exactly one active version of each canonical source document.

Required active documents:

* PROJECT_SOURCE.md
* MANIFEST.md
* docs/DECISION_LOG.md
* docs/LESSONS_INHERITED.md
* docs/PHYSICS_CONTRACT.md
* docs/ARCHITECTURE.md
* docs/ACCEPTANCE_CRITERIA.md

Required active prompt when created:

* prompts/codex_scaffold.md

Source-set acceptance fails if:

* two active versions of the same canonical document exist
* active files use conflicting markers
* active files define conflicting source authority
* unapproved files constrain implementation
* marker names are confused with canonical repository paths

---

5. Scaffold acceptance

The scaffold is accepted when the intended source tree exists and contains only minimal wiring.

Required root files:

* README.md
* PROJECT_SOURCE.md
* MANIFEST.md
* package.json (minimal Node runtime metadata: type module, optional baseline script; no dependencies, devDependencies, build, framework, or test tooling)
* index.html
* styles.css

Required docs:

* docs/DECISION_LOG.md
* docs/LESSONS_INHERITED.md
* docs/PHYSICS_CONTRACT.md
* docs/ARCHITECTURE.md
* docs/ACCEPTANCE_CRITERIA.md

Required prompt:

* prompts/codex_scaffold.md

Required src tree:

* src/main.js
* src/config.js
* src/state.js
* src/physics/vector.js
* src/physics/gravity.js
* src/physics/integrator.js
* src/simulation/presets.js
* src/simulation/reset.js
* src/simulation/step.js
* src/render/camera.js
* src/render/renderer.js
* src/ui/controls.js
* src/dev/baseline.js

Forbidden in scaffold:

* src/physics/collisions.js
* black-hole modules
* event-horizon modules
* real-ephemeris modules
* framework setup
* TypeScript setup
* build-system setup
* Web Worker setup
* browser automation setup
* copied inactive implementation code

Tool metadata directories (.git/, .agents/) may exist in the repository root. They are not source files and are not scaffold violations.

The scaffold is accepted if files exist with correct responsibilities and minimal placeholders, even before full product behavior exists.

---

6. Architecture acceptance

Architecture is accepted when module boundaries are enforceable.

Required:

* physics modules do not import render modules
* physics modules do not import UI modules
* physics modules do not import main.js
* physics modules do not import camera module
* physics modules do not access DOM
* physics modules do not access canvas
* physics modules do not access window
* physics modules do not access devicePixelRatio
* physics modules do not read camera zoom
* physics modules do not read render scale
* simulation modules can run without browser APIs
* baseline can run without browser APIs
* renderer reads simulation state but does not own physics
* UI sends commands but does not implement physics
* main.js composes modules but does not become a monolith

Architecture fails if presentation state affects physical behavior.

---

7. Physics acceptance

The physics implementation is accepted when it satisfies the physics contract.

Required:

* world-space positions
* world-space velocities
* mass-based pairwise gravity
* no self-force
* explicit softening in world units
* fixed timestep
* Velocity Verlet / Kick-Drift-Kick style integration
* approximate educational solar-system preset
* no collision behavior without future decision
* no black-hole-specific behavior without future decision
* no real-ephemeris claims

Physics fails if:

* softening is based on pixels
* visual radius affects gravity without documented decision
* camera zoom affects acceleration
* canvas size affects collision or motion
* frame delta is used directly as physics dt
* body count changes unexpectedly
* NaN or Infinity appears
* collision behavior is implemented prematurely

---

8. Baseline acceptance

Scope note: for a scaffold-only task, baseline acceptance is limited to scaffold/module availability checks with an honest NOT CHECKED status for physics invariants. The full invariant-based acceptance in this section applies only after the physics kernel is implemented.

The baseline is accepted when it runs headlessly through Node.

Expected command:

node src/dev/baseline.js

Required:

* no browser
* no canvas
* no DOM
* no CSS
* no CDP
* no screenshots
* no manual visual inspection
* no renderer import
* no UI import
* no main.js import

Required output:

* PASS or FAIL
* number of bodies
* number of steps
* timestep
* initial total energy
* final total energy
* relative energy drift
* initial total momentum
* final total momentum
* momentum drift
* initial angular momentum
* final angular momentum
* angular momentum drift
* NaN/Infinity status
* viewport-independence status or boundary explanation

The baseline is accepted only if the primary oracle is invariant-based.

Position hashes may exist only as secondary diagnostics.

Pixel hashes are not accepted as physics baseline.

---

9. Tolerance acceptance

Baseline tolerances are accepted if they are explicit and documented.

Suggested starting tolerances:

* NaN: zero tolerance
* Infinity: zero tolerance
* body count drift: zero tolerance
* timestep count drift: zero tolerance
* relative total energy drift: less than or equal to 1e-3 for the baseline scenario
* total momentum drift: less than or equal to 1e-9 in normalized units, or documented equivalent
* angular momentum drift: less than or equal to 1e-6 relative drift, or documented equivalent

Tolerance changes are accepted only if documented.

Tolerance changes fail if they are silently loosened to hide a broken baseline.

---

10. Render acceptance

The renderer is accepted when it draws the current world state without owning physics.

Required:

* canvas clears and redraws
* bodies are drawn from simulation state
* world positions are projected through camera
* visual radius is presentation only
* body color or class is presentation only
* renderer does not advance physics
* renderer does not compute gravitational acceleration
* renderer does not mutate mass, velocity, or physical position
* renderer does not implement collisions

Trails are optional.

If trails are included, they must not affect physics.

Render fails if drawing logic changes simulation behavior.

---

11. Camera acceptance

The camera is accepted when it controls projection only.

Required:

* world-to-screen transform
* screen-to-world transform if needed
* zoom affects presentation only
* center/pan affects presentation only
* camera does not alter physical state
* camera values are not read by physics

Camera fails if zoom or viewport changes gravity, radius, collision, timestep, or motion.

---

12. UI acceptance

The UI is accepted when it exposes minimal controls without implementing physics.

Allowed controls:

* play/pause
* reset
* speed selection
* zoom control
* body selection
* simple inspector if feasible

Allowed UI behavior:

* update UI state
* call explicit callbacks
* request reset
* request pause/play
* request speed change
* request camera zoom
* request selected body change

Forbidden UI behavior:

* implementing gravity
* directly changing acceleration
* directly changing mass
* directly changing velocity without explicit future decision
* creating collision behavior
* reading layout values for physics

UI fails if it becomes a physics controller.

---

13. Main loop acceptance

main.js is accepted when it composes the application without becoming a monolith.

Required:

* initialize canvas
* initialize simulation state
* initialize camera
* initialize UI
* start animation loop
* call simulation step
* call renderer
* wire reset/play/pause/speed/zoom

Forbidden:

* defining physics equations
* defining body presets
* implementing collision behavior
* implementing baseline logic
* hiding large behavior in main.js

main.js fails if it becomes the new monolith.

---

14. Preset acceptance

The initial preset is accepted when it defines a simple six-body normalized educational Newtonian scenario.

Required bodies:

* Sun
* Inner A
* Inner B
* Middle
* Outer A
* Outer B

Required properties:

* id
* name
* mass
* position
* velocity
* visual radius
* visual color or class

The preset must be centralized.

Preset values must not be scattered through UI, render, and main.

Preset fails if it claims real ephemeris data, date-accurate astronomy, NASA data, or real solar-system scale.

---

15. Visual acceptance

The visual style is accepted when it establishes the intended direction without violating architecture.

Required visual direction:

* dark scientific cockpit
* canvas-centered simulation
* readable control panel
* readable inspector area
* visible bodies
* visible motion
* minimal clutter

Optional:

* glow
* trails
* labels
* subtle grid
* focus/system visual mode

Visual acceptance is secondary to architecture and physics acceptance.

A beautiful but boundary-broken app fails.

---

16. Forbidden features without future decision

The implementation fails if it includes any of these without an explicit future accepted decision:

* collisions
* merge behavior
* bounce behavior
* absorption behavior
* fragmentation
* event horizons
* black-hole-specific physics
* wormholes
* relativistic effects
* real ephemerides
* eclipse prediction
* mission planning
* 3D
* Barnes-Hut
* Web Worker
* TypeScript
* framework
* save/load
* scenario editor
* remote browser debugging dependency
* screenshot-based baseline

---

17. Codex prompt acceptance

A Codex prompt is accepted only if it includes:

* exact task title
* exact intended working directory
* root confirmation requirement
* stop-if-wrong-root instruction
* allowed files
* forbidden files
* explicit scope
* acceptance checks
* completion report requirements
* stop condition

A Codex prompt fails if it allows broad autonomous implementation.

A Codex prompt fails if it asks Codex to do multiple stages at once.

A Codex prompt fails if it allows implementation carryover from inactive sources.

---

18. Codex output acceptance

A Codex output is accepted only if:

* it confirms the correct root
* it changes only allowed files
* it does not create forbidden files
* it does not copy inactive implementation code
* it does not expand scope
* it reports created/modified files
* it reports checks run
* it reports limitations
* it stops after the requested task

Codex output fails if it improvises architecture.

---

19. Review acceptance

Human review must check:

* file tree
* source authority
* forbidden files absent
* imports make sense
* physics/render/UI separation
* baseline command exists
* baseline does not import browser modules
* visual behavior does not hide physics failure
* no inactive implementation code is copied
* scope stayed small

Review should prefer observed facts over claimed completion.

If Codex says "implemented", verify by file tree and content.

---

20. Completion status categories

Use these status labels:

* ACCEPTED
* ACCEPTED WITH LIMITATIONS
* REJECTED
* DEFERRED
* NOT CHECKED

Do not use vague labels like:

* looks good
* probably fine
* mostly done
* should work
* seems okay

Every acceptance statement should say what was checked and what was not checked.

---

21. Minimum accepted implementation

A minimum accepted implementation requires:

* active source docs exist
* scaffold tree exists
* browser entry loads
* physics modules are separate
* simulation modules are separate
* render modules are separate
* UI modules are separate
* baseline file exists
* baseline runs through Node
* baseline reports PASS/FAIL
* no forbidden early features exist
* no inactive implementation code is copied

If any of these are missing, the implementation is not accepted.

---

22. Accepted browser sandbox criteria

The Task 4C browser sandbox milestone is accepted only when all of these remain true.

Launch:

* browser preview uses the Node local HTTP server
* start-space-model-lab.bat is the canonical Windows launch path
* tools/serve-local.js is the canonical Node local server
* http://127.0.0.1:4173/ is the accepted local preview path
* npm run preview is an alternate script path when npm is available
* direct file:// index.html is not the canonical acceptance path because browser ES module loading is not reliable there

Browser behavior:

* bodies are visible at load
* darker cockpit-style scene is visible
* deterministic starfield/background does not flicker while paused
* play/pause works
* reset works
* speed works as fixed integer steps per animation frame
* zoom works as render-only camera projection
* body selection works
* selected body highlight works
* empty-space click clears selection
* inspector updates every frame
* selected body inspector fields appear when a body is selected
* trails appear while running
* trails clear after reset
* no visible console errors

Architecture preservation:

* renderer imports no physics modules
* renderer imports no simulation modules
* renderer/UI/main do not assign body mass, position, velocity, or acceleration
* camera imports no physics modules
* camera imports no simulation modules
* camera zoom is render-only
* trails are renderer-owned presentation memory
* trails are bounded to 150 points per body
* trails are not stored on simulation bodies
* trails are not stored in state.simulation
* starfield is renderer-owned presentation memory
* visual caches do not affect physics

Verification:

* node src/dev/baseline.js must remain PASS after visual changes
* finite-state check must remain PASS
* repeatability check must remain PASS
* body count must remain stable
* timestep count must remain stable
* relative energy drift must remain within tolerance
* momentum drift must remain within tolerance
* relative angular momentum drift must remain within tolerance

Task 4C observed accepted values:

* relative energy drift: 4.290851857533e-11
* momentum drift: 7.808913380318e-20
* relative angular momentum drift: 3.213114654476e-15

Accepted limitation:

Git was unavailable in PATH during Task 4C, so forbidden file change history was checked through file content inspection and the Task 4B report rather than git diff.

---

23. Educational inspector acceptance

The Task 5C educational inspector refinement is accepted only when all of these remain true.

Browser behavior:

* normalized-units disclaimer is visible
* no-selection educational message is visible
* selected body diagnostics are visible after selecting a body
* speed magnitude updates while running
* distance from origin/Sun updates while running
* no visible console errors

Architecture preservation:

* diagnostics are read-only
* UI imports no physics modules
* UI does not change physics constants
* UI does not assign to body mass, position, velocity, acceleration, visualRadius, or color
* UI does not store derived diagnostics into body or state
* selected body remains driven by state.ui.selectedBodyId
* no approximate orbital period is included in Task 5B/5C

Verification:

* node src/dev/baseline.js must remain PASS
* finite-state check must remain PASS
* repeatability check must remain PASS
* body count must remain stable
* timestep count must remain stable
* relative energy drift must remain within tolerance
* momentum drift must remain within tolerance
* relative angular momentum drift must remain within tolerance

Task 5C observed accepted values:

* relative energy drift: 4.290851857533e-11
* momentum drift: 7.808913380318e-20
* relative angular momentum drift: 3.213114654476e-15

Accepted limitations:

* git unavailable in PATH
* missing/non-finite fallback was code-inspected, not forced in browser

---

24. Local launcher acceptance

The Task 6C local launcher milestone is accepted only when all of these remain true.

Launch path:

* start-space-model-lab.bat starts the local preview on Windows
* tools/serve-local.js serves the project with Node built-in modules only
* canonical browser URL is http://127.0.0.1:4173/
* direct file:// index.html is not an acceptance path

Server behavior:

* server binds 127.0.0.1
* server uses port 4173
* root / serves index.html
* existing files return 200
* missing files return 404
* tested traversal attempts return 403 or are safely blocked
* .git, .agents, and .codex are blocked
* directory listing is not implemented
* JavaScript files are served with MIME suitable for ES modules

Forbidden launch additions:

* .exe packaging
* Python launcher
* Electron or Tauri
* bundler
* dependencies or devDependencies
* build system

Architecture preservation:

* launcher does not change app runtime behavior
* launcher does not import physics, simulation, renderer, UI, camera, or baseline modules
* physics baseline remains PASS
* browser QA remains PASS through the canonical URL

Accepted limitations:

* PowerShell execution policy may block npm run preview through npm.ps1
* git unavailable in PATH during Task 6C
* external default-browser opening from .bat was initiated but not directly observable from the automation surface

---

25. Live invariant telemetry acceptance

The Task 10B live invariant telemetry milestone is accepted only when all of these remain true.

Browser behavior:

* invariant telemetry is visible on initial load
* telemetry shows total energy
* telemetry shows relative energy drift since reset/reference
* telemetry shows total momentum magnitude
* telemetry shows relative angular momentum drift since reset/reference
* telemetry values are labeled as normalized educational units
* reset resets the reference snapshot
* speed and zoom do not change telemetry semantics

Architecture preservation:

* invariant formulas live in src/simulation/diagnostics.js
* src/dev/baseline.js uses shared diagnostics logic
* UI displays formatted diagnostics but does not implement invariant formulas
* renderer does not import diagnostics
* diagnostics do not mutate simulation bodies
* diagnostics state remains separate from state.simulation bodies

Verification:

* node src/dev/baseline.js must remain PASS
* relative energy drift must remain 4.290851857533e-11
* momentum drift must remain 7.808913380318e-20
* relative angular momentum drift must remain 3.213114654476e-15

Not included:

* barycenter marker
* oscilloscope graph
* time reversal
* integrator race
* new presets
* screenshot
* GitHub Pages

---

26. Barycenter marker acceptance

The Task 10C barycenter marker milestone is accepted only when all of these remain true.

Browser behavior:

* barycenter marker is visible
* marker is modest and visually distinct
* marker does not look like another body or planet
* marker projects with camera zoom and does not change camera semantics
* live invariant telemetry remains visible
* play, pause, reset, speed, and zoom continue to work

Architecture preservation:

* barycenter is computed in src/simulation/diagnostics.js
* barycenter is included in the invariant snapshot
* compareInvariantSnapshot does not compare barycenter in Task 10C
* renderer reads state.diagnostics.current.barycenter
* renderer does not compute barycenter
* UI does not compute barycenter
* simulation bodies and physics state are not mutated

Verification:

* node src/dev/baseline.js must remain PASS
* relative energy drift must remain 4.290851857533e-11
* momentum drift must remain 7.808913380318e-20
* relative angular momentum drift must remain 3.213114654476e-15

Not included:

* barycenter toggle
* barycenter trail/history
* oscilloscope graph
* time reversal
* integrator race
* new presets
* screenshot
* GitHub Pages

---

27. Final acceptance statement

The implementation is accepted only when this statement is true:

Space Model Lab v3 has a small clean source tree, separated physics/simulation/render/UI layers, a browser-visible educational gravity sandbox, and a headless invariant-based baseline that verifies core physics behavior without relying on canvas, viewport, browser automation, inactive implementation code, or visual inspection.

If this statement is not true, the implementation is not accepted.
