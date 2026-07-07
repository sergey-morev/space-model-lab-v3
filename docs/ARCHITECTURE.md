ARCHITECTURE.md - Space Model Lab v3

Status: ACTIVE CANONICAL ARCHITECTURE
Project line: Space Model Lab v3
Mode: clean-room rebuild with visual inheritance
Source marker: SML-V3-CANONICAL
Date: 2026-06-23
Revision: 2026-07-05 launch documentation sync

---

1. Purpose

This document defines the architecture of Space Model Lab v3.

It specifies:

* module boundaries
* allowed dependencies
* forbidden dependencies
* ownership of state
* expected source tree
* implementation constraints

This file is binding for implementation, review, and Codex prompts.

---

2. Architecture goal

Space Model Lab v3 must be small, inspectable, and boundary-correct.

The architecture must prevent accidental coupling between:

* physics
* simulation orchestration
* render
* camera
* UI
* development baseline

The project should remain simple enough for direct human review.

No framework is required by default.

No build system is required by default.

No browser automation is required for core verification.

---

3. Core boundary rule

Physics must be independent from presentation.

Physics must not import, read, or depend on:

* DOM
* canvas
* CSS
* browser window
* viewport
* devicePixelRatio
* camera
* render scale
* UI controls
* mouse state
* keyboard state

Render may read world state.

Camera may project world coordinates into screen coordinates.

UI may send user intent through explicit callbacks.

Physics must not know that a screen exists.

---

4. Intended source tree

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

No additional files should be created unless an accepted decision or approved prompt authorizes them.

Do not create src/physics/collisions.js without a future accepted decision.

Deferred future prompt paths (approved names, not yet created): prompts/codex_physics_kernel.md, prompts/codex_render_ui.md.

Tool metadata directories such as .git/ and .agents/ may exist in the repository root. They are tool metadata, not source files.

---

5. Layer model

The architecture has six conceptual layers.

1. Config
2. Physics
3. Simulation
4. Render and camera
5. UI
6. Development baseline

Allowed direction:

* config may be imported by other layers
* physics may import config and vector helpers
* simulation may import config and physics
* render may import camera and read simulation state
* UI may be wired through main
* baseline may import config, physics, simulation, and diagnostics

Forbidden direction:

* physics to render
* physics to camera
* physics to UI
* physics to DOM
* physics to browser APIs
* simulation to DOM
* simulation to renderer
* baseline to renderer
* baseline to UI
* baseline to main browser loop

---

6. Root files

index.html

Purpose:

* define minimal DOM shell
* include canvas
* include control containers
* include inspector containers
* load src/main.js as a module

Must not contain:

* physics logic
* body presets
* simulation constants
* large inline scripts
* hidden behavior

---

styles.css

Purpose:

* define dark scientific cockpit layout
* style canvas
* style panels
* style controls
* style inspector

Must not contain:

* physics constants
* simulation behavior
* layout values used by physics

CSS affects presentation only.

---

package.json

Purpose:

* minimal Node runtime metadata for ES module execution
* optional baseline script (node src/dev/baseline.js)

Must not contain:

* dependencies
* devDependencies
* build tooling
* framework tooling
* test tooling

package.json is runtime metadata only, not a build system.

---

7. src/config.js

Purpose:

* define stable configuration constants
* define default timestep
* define default speed multiplier
* define gravitational constant in normalized units
* define softening in world units
* define baseline steps and tolerances if needed

Allowed:

* numerical constants
* named configuration objects
* no DOM access

Forbidden:

* reading window size
* reading canvas size
* reading CSS
* importing render modules
* importing UI modules

---

8. src/state.js

Purpose:

* define app state shape
* define state ownership conventions
* expose state factory if needed

Expected state categories:

* simulation state
* diagnostics state
* camera state
* UI state
* render state if needed

Simulation state must not contain:

* canvas
* viewport
* DOM nodes
* UI controls
* camera zoom
* render scale

Camera state may contain center and zoom.

UI state may contain selected body id, pause/play state, and speed selection.

Diagnostics state may contain read-only reference/current invariant snapshots and drift comparisons.

Diagnostics state must not contain mutable body ownership.

---

9. src/physics/vector.js

Purpose:

* small vector math helpers
* no side effects
* no DOM
* no canvas
* no camera

Allowed helpers:

* add
* subtract
* scale
* dot
* length
* length squared
* normalize if needed
* clone/copy if needed

Vector helpers should operate on simple numeric objects or arrays.

Do not over-abstract.

---

10. src/physics/gravity.js

Purpose:

* compute gravitational acceleration
* compute pairwise contribution if needed
* support diagnostics if appropriate

Required:

* world coordinates only
* mass-based acceleration
* explicit softening in world units
* no self-force
* no render dependency
* no camera dependency
* no UI dependency

Forbidden:

* canvas access
* viewport access
* DOM access
* camera access
* browser access
* visual radius as collision radius
* body color affecting gravity
* UI metadata affecting gravity

---

11. src/physics/integrator.js

Purpose:

* implement fixed-step integration
* use Velocity Verlet / Kick-Drift-Kick style update
* update positions and velocities from physics quantities

Allowed:

* receive bodies and dt
* call gravity calculation
* return updated bodies or mutate clearly owned simulation bodies

Forbidden:

* render calls
* DOM calls
* UI calls
* camera calls
* browser frame delta as direct physics dt

The integrator must be usable by both simulation step and headless baseline.

---

12. src/simulation/presets.js

Purpose:

* define initial educational body preset
* keep initial values centralized

Initial preset includes:

* Sun
* Inner A
* Inner B
* Middle
* Outer A
* Outer B

Preset values are educational normalized values.

They are not real ephemerides.

They are not date-accurate astronomy, NASA data, or real solar-system scale.

Runtime preset documentation must use the generic accepted body names above unless runtime code is explicitly changed in a later task.

Forbidden:

* scattering preset values across render, UI, HTML, and main
* claiming date-accurate positions
* using visual radius as physical behavior

---

13. src/simulation/reset.js

Purpose:

* create fresh simulation state from preset
* reset body positions and velocities
* reset simulation clock
* reset step counters

Required:

* copy preset data safely
* avoid mutating preset definitions
* no DOM access
* no canvas access
* no camera dependency

Reset may be called by UI, main loop, and baseline.

---

14. src/simulation/step.js

Purpose:

* orchestrate fixed physics steps
* own simulation clock progression
* call physics integrator
* maintain step count

Allowed:

* simulation state
* fixed dt
* step count
* speed multiplier as orchestration input

Forbidden:

* DOM access
* canvas access
* direct rendering
* direct UI handling
* reading browser frame delta as physics dt

The render loop may request simulation advancement.

The simulation step must remain independent.

---

14a. src/simulation/diagnostics.js

Purpose:

* provide shared pure invariant calculations
* provide invariant snapshots and comparisons for baseline and browser telemetry
* keep scientific observability logic out of UI and renderer code

Allowed:

* read body mass, position, velocity, and acceleration values
* import pure physics helpers such as computePotentialEnergy
* compute energy, momentum, angular momentum, finite-state status, and drift comparisons

Forbidden:

* mutating bodies
* mutating app state
* importing DOM, canvas, renderer, UI, main, Date, performance, or random APIs

---

15. src/render/camera.js

Purpose:

* hold camera transform
* convert world coordinates to screen coordinates
* convert screen coordinates to world coordinates if needed for interaction

Allowed:

* camera center
* zoom
* viewport/canvas dimensions for projection only

Forbidden:

* modifying physical positions
* modifying mass
* modifying velocity
* modifying acceleration
* changing physics dt
* changing softening
* changing gravity

Camera is presentation.

Camera is not physics.

---

16. src/render/renderer.js

Purpose:

* draw current simulation state to canvas
* draw bodies
* draw trails if available
* draw labels/readouts if simple

Allowed:

* canvas context
* camera projection
* visual radius
* visual color/class
* presentation trails

Forbidden:

* advancing physics
* changing body mass
* changing body velocity
* changing body position except through approved simulation calls
* computing gravitational acceleration
* implementing collisions

Renderer reads world state.

Renderer does not own world state.

---

17. src/ui/controls.js

Purpose:

* bind buttons and sliders
* expose UI callbacks
* update selected body
* update pause/play state
* update speed selection
* update zoom commands

Allowed:

* DOM event handling
* UI state changes
* invoking provided callbacks

Forbidden:

* implementing physics
* computing gravity
* directly changing acceleration
* directly changing mass
* directly changing velocity unless a future feature explicitly allows it
* reading layout values for physics
* implementing collision behavior

UI sends intent.

Simulation executes physical state changes.

---

18. src/main.js

Purpose:

* compose modules
* initialize app
* own browser animation loop
* connect UI, simulation, camera, and renderer

Allowed:

* DOM lookup
* canvas setup
* requestAnimationFrame
* event wiring
* calling simulation step
* calling renderer
* wiring reset/play/pause/speed/zoom

Forbidden:

* hiding physics equations
* defining body presets
* defining baseline logic
* implementing collision behavior
* becoming a large mixed-responsibility monolith

main.js may coordinate.

main.js must not become the architecture.

---

19. src/dev/baseline.js

Purpose:

* run headless physics-contract baseline through Node
* import only the modules needed to run and evaluate simulation
* print PASS/FAIL report

Required:

* no DOM
* no canvas
* no browser APIs
* no renderer import
* no UI import
* no main.js import

Baseline checks:

* finite numbers
* stable body count
* stable timestep count
* bounded energy drift
* bounded momentum drift
* bounded angular momentum drift
* repeatable report for same engine path
* no viewport/render/camera dependency

Baseline is development verification.

Baseline is not a browser test.

---

20. Dependency rules

Allowed imports:

* config may be imported anywhere
* physics may import config and vector helpers
* simulation may import config and physics
* render may import camera and read simulation state
* UI may be wired by main
* main may import browser-side modules
* baseline may import config, physics, simulation, and diagnostics only

Forbidden imports:

* physics importing render
* physics importing UI
* physics importing main
* physics importing camera
* physics importing DOM/browser APIs
* simulation importing DOM
* simulation importing renderer
* baseline importing renderer
* baseline importing UI
* baseline importing main
* renderer importing UI controls
* UI implementing physics formulas

---

21. Data ownership

Simulation state owns:

* bodies
* simulation time
* step count

Camera state owns:

* center
* zoom
* projection parameters

UI state owns:

* paused/play state
* selected body id
* selected speed multiplier
* UI toggles

Render state owns:

* canvas context
* presentation cache if needed
* screen dimensions
* renderer-owned starfield
* renderer-owned visual trails

Config owns:

* constants
* tolerances
* defaults

No layer should silently own state from another layer.

---

22. Mutation policy

All mutations must be explicit.

Allowed mutations:

* simulation step updates simulation state
* reset creates or replaces simulation state
* UI updates UI state or calls explicit callbacks
* camera controls update camera state
* renderer may update presentation-only caches

Forbidden mutations:

* renderer mutating physics
* UI mutating body positions directly
* physics mutating camera
* physics mutating UI
* physics reading or mutating DOM
* baseline mutating global browser state
* hidden global state used by physics

---

23. Trails policy

Simple visual trails are accepted for the Task 4C browser milestone.

The accepted trail implementation is:

* renderer-owned
* stored in a local Map inside renderer.js
* bounded to 150 points per body
* cleared through renderer presentation reset on simulation reset
* absent from simulation bodies
* absent from state.simulation
* absent from baseline state

Trails must not:

* affect gravity
* affect collision behavior
* affect timestep
* affect acceleration
* affect force
* affect velocity
* affect position
* affect baseline physics checks unless explicitly treated as non-physics diagnostics

Future simulation-owned trails require an explicit decision before implementation.

---

24. Inspector policy

The inspector may show:

* selected body name
* selected body role
* position
* velocity
* speed
* mass
* distance from origin/Sun
* visual radius
* color
* simulation time
* speed multiplier
* basic diagnostic values if simple

The inspector is read-only diagnostic UI.

The inspector may compute derived display-only values from body position and velocity.

Derived inspector values must not be stored into body or state.

Invariant telemetry formulas must not live in the inspector. Shared diagnostics owns invariant calculations.

The inspector may display formatted read-only invariant telemetry from state.diagnostics.

The inspector must not become a physics editor by default.

The inspector must not mutate simulation state except through approved controls.

The inspector must not import physics modules.

The inspector must not mutate body mass, position, velocity, acceleration, visualRadius, or color.

Selected body identity remains state.ui.selectedBodyId.

---

25. Controls policy

Allowed initial controls:

* play/pause
* reset
* speed control
* zoom control
* body selection
* simple inspector toggle if needed

Do not add by default:

* scenario editor
* save/load
* advanced presets
* mission tools
* collision settings
* ephemeris controls
* black-hole controls

Controls must remain minimal.

---

26. Error handling

The system should fail loudly in development if:

* canvas is missing
* required modules cannot import
* required state shape is invalid
* physics generates NaN
* physics generates Infinity
* baseline checks fail

Do not silently swallow physics failures.

Baseline must report failed checks explicitly.

---

27. Performance policy

Correctness and inspectability outrank performance at the foundation stage.

Do not add by default:

* Web Worker
* Barnes-Hut
* spatial index
* GPU acceleration
* complex caching
* framework state manager

Performance work is deferred until the simple architecture is accepted.

---

28. Browser support

The browser application targets modern desktop browsers.

Mobile optimization is not required by default.

Cross-browser pixel-perfect behavior is not required by default.

Physics baseline must be independent from browser rendering.

---

29. Tooling policy

Use plain JavaScript modules unless a future accepted decision changes this.

Do not add by default:

* React
* Vue
* Svelte
* Angular
* Vite
* Webpack
* TypeScript
* test framework
* lint framework
* build system

The first goal is architectural clarity, not tooling.

---

30. Architecture acceptance

The architecture is acceptable when:

* intended file tree exists
* physics imports no render/UI/browser modules
* physics imports no camera module
* baseline imports no browser modules
* simulation can run without canvas
* render can draw state without owning physics
* UI sends commands without implementing physics
* main composes modules without becoming a monolith
* no collision module exists without future decision
* no black-hole/event-horizon behavior exists without future decision

If these are false, the architecture is not accepted.

---

31. Accepted Task 4C architecture state

The accepted browser sandbox architecture after Task 4C is:

* physics, simulation, and baseline remain independent from DOM, canvas, viewport, renderer, UI, and camera modules
* renderer owns presentation-only starfield and trails
* renderer reads body position, mass, visual radius, color, id, and name for drawing only
* renderer does not mutate body mass, position, velocity, or acceleration
* main loop uses fixed integer calls to stepSimulation(state)
* no variable browser frame dt is passed into physics
* speed controls the number of fixed simulation steps per animation frame
* camera projection and zoom are render-only
* inspector is read-only diagnostic UI
* start-space-model-lab.bat plus the Node local server is the canonical launch path
* local HTTP at http://127.0.0.1:4173/ is the canonical browser preview path
* direct file:// index.html is not an acceptance path

Task 4C browser QA accepted:

* bodies visible at load
* play/pause/reset/speed/zoom work
* body selection works
* empty-space click clears selection
* selected body highlight works
* inspector updates
* selected body fields appear
* trails appear while running
* reset clears visual trails
* no visible console errors

Known visual risks:

* labels can crowd near Sun/Inner on narrow viewport
* glow radius can extend beyond hit radius
* higher speed increases visual trail density, while memory remains bounded

---

32. Accepted Task 5C inspector state

The accepted educational inspector refinement after Task 5C is:

* normalized-units disclaimer is visible
* no-selection educational message is visible
* selected-body diagnostics are visible when a body is selected
* role, normalized mass, position, velocity, speed magnitude, distance from origin/Sun, visual radius, and color are display-only
* missing or non-finite display values fall back to n/a by code inspection
* no approximate orbital period is included
* UI imports no physics modules
* UI does not store derived diagnostics into body or state
* UI does not assign to body mass, position, velocity, acceleration, visualRadius, or color
* browser manual QA passed through http://127.0.0.1:4173/

Known Task 5C limitations:

* git unavailable in PATH
* missing/non-finite fallback was code-inspected, not forced in browser

---

33. Accepted Task 6C launch architecture

The accepted local launch architecture after Task 6C is:

* start-space-model-lab.bat is the canonical Windows double-click launch helper
* tools/serve-local.js is the canonical no-dependency Node built-in HTTP server
* the server binds to 127.0.0.1
* the server uses port 4173
* the canonical browser URL is http://127.0.0.1:4173/
* root / serves index.html
* JavaScript modules are served with JavaScript MIME
* tested traversal attempts are blocked
* .git, .agents, and .codex are not served
* no directory listing is implemented
* npm run preview is an alternate script path when npm is available
* direct file:// index.html is not an acceptance path

This launch architecture must remain separate from physics, simulation, renderer, UI, camera, and baseline behavior.

Forbidden launch architecture:

* .exe packaging without a future decision
* Python launcher
* Electron or Tauri
* bundler
* dependencies or devDependencies
* build system

Known Task 6C limitations:

* PowerShell execution policy may block npm run preview through npm.ps1
* git unavailable in PATH
* external default-browser opening from .bat was initiated but not directly observable from the automation surface

---

34. Summary

Space Model Lab v3 architecture is built around one rule:

Physics is world-state logic.
Render is presentation.
Camera is projection.
UI is user intent.
Baseline is headless verification.

The architecture must make the correct thing easy and the old failure mode difficult.
