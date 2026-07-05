codex_scaffold.md - Space Model Lab v3

Status: ACTIVE CODEX PROMPT
Project line: Space Model Lab v3
Prompt role: clean scaffold creation
Source marker: SML-V3-CANONICAL
Date: 2026-06-23
Revision: 2026-07-01 hygiene patch (Klim audit)

---

1. Task

Create the clean Space Model Lab v3 repository scaffold.

This is a scaffold task only.

Do not implement the physics kernel yet.

Do not implement full simulation behavior yet.

Do not implement future features.

Do not copy inactive implementation code.

Create the approved file tree, minimal browser shell, minimal module files, and a headless scaffold baseline that runs through Node and clearly reports that physics checks are not implemented yet.

Stop after the scaffold is complete.

---

2. Required root confirmation

Historical local Codex workspace used during v0 scaffold/import:

C:\Users\infor\Documents\Codex\2026-07-01\new-chat

This path records the original local workspace used by Codi. It is not a portable project root for future environments.

For future clone/pull runs, use the checked-out GitHub repository root as the working root.

If a task requires an exact local path, confirm the current environment path before modifying any files.

Before making any changes, inspect the current working directory.

Report:

* current working directory
* top-level files
* whether this appears to be the intended Space Model Lab v3 root

If the current directory is not the intended clean v3 repository root, stop immediately.

Do not create files in a wrong root.

Do not modify parent directories.

Do not search the whole machine.

Do not touch system folders.

---

3. Allowed source authority

Use only the active Space Model Lab v3 source documents.

Expected active source documents:

* PROJECT_SOURCE.md
* MANIFEST.md
* docs/DECISION_LOG.md
* docs/LESSONS_INHERITED.md
* docs/PHYSICS_CONTRACT.md
* docs/ARCHITECTURE.md
* docs/ACCEPTANCE_CRITERIA.md
* prompts/codex_scaffold.md

If these canonical documents already exist in the repository, preserve them unless this task explicitly requires creating missing scaffold files.

If the active source documents are present only as marked source-collection files, copy their contents into canonical repository paths without the marker and without the source-collection suffix.

If the active source documents are missing, do not invent their full content.

Instead, create the scaffold files that are safe to create and report which required source documents are missing.

---

4. Forbidden inputs

Do not use:

* inactive source files
* previous marker files
* compressed source archives
* abandoned prompt files
* unrelated notes
* screenshots
* browser artifacts
* generated reports from previous attempts
* external internet sources
* implementation code from a prior version

Do not infer source authority from filenames outside the active v3 source set.

Do not copy implementation behavior from inactive files.

---

5. Allowed file creation

You may create only these files and directories.

Root:

* README.md
* PROJECT_SOURCE.md
* MANIFEST.md
* index.html
* styles.css
* package.json

Docs:

* docs/DECISION_LOG.md
* docs/LESSONS_INHERITED.md
* docs/PHYSICS_CONTRACT.md
* docs/ARCHITECTURE.md
* docs/ACCEPTANCE_CRITERIA.md

Prompts:

* prompts/codex_scaffold.md

Source:

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

Do not create additional files.

Do not create additional directories.

---

6. Why package.json is allowed

package.json is allowed only to enable plain JavaScript module execution in Node.

It must stay minimal.

Required package.json content:

* project name
* private true
* type module
* script for scaffold baseline if useful

Do not add dependencies.

Do not add devDependencies.

Do not add build tooling.

Do not add framework tooling.

Do not add test framework tooling.

This package.json is runtime metadata only, not a build system.

---

7. Forbidden file creation

Do not create:

* src/physics/collisions.js
* black-hole modules
* event-horizon modules
* wormhole modules
* real-ephemeris modules
* eclipse modules
* mission-planning modules
* 3D modules
* Web Worker modules
* framework files
* TypeScript configuration
* bundler configuration
* browser automation files
* screenshot baseline files
* large generated assets
* hidden state files
* temporary debug files

Do not create placeholder modules for forbidden behavior.

---

8. Scaffold scope

This task must create a minimal scaffold only.

Allowed scaffold behavior:

* browser entry loads
* canvas exists
* dark cockpit-style layout exists
* controls area exists
* inspector area exists
* JavaScript modules import without syntax errors
* main.js initializes the browser shell
* renderer draws a simple scaffold message or simple placeholder scene
* controls.js wires basic buttons without real physics behavior
* baseline.js runs through Node and reports scaffold status

Forbidden scaffold behavior:

* full N-body gravity implementation
* orbital simulation
* collision handling
* black-hole behavior
* real ephemeris behavior
* save/load
* scenario editor
* advanced UI
* performance optimization
* browser automation
* screenshot testing

---

9. Required repository tree

Create this final tree:

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

Do not add files beyond this tree.

---

10. README.md requirements

README.md must be short.

It must include:

* project name
* one-paragraph identity
* scaffold status
* how to open the browser app
* how to run the scaffold baseline
* warning that physics kernel is not implemented yet
* warning that this is a clean v3 scaffold

It must not claim that the simulation physics is complete.

---

11. index.html requirements

index.html must:

* be minimal
* load styles.css
* include one canvas
* include a control panel
* include an inspector panel
* load src/main.js as a module

index.html must not contain:

* physics logic
* body preset data
* large inline script
* hidden behavior

---

12. styles.css requirements

styles.css must create a simple dark scientific cockpit layout.

Required:

* dark background
* readable text
* canvas-centered simulation area
* side or bottom control panel
* visible buttons
* visible inspector area

Keep it simple.

Do not over-polish.

Do not add external fonts or external assets.

---

13. src/config.js requirements

Create minimal exported configuration.

It may include:

* app name
* scaffold status
* default canvas background
* default timestep placeholder
* default speed placeholder
* placeholder tolerance object

Do not implement full physics configuration yet.

Do not read window, canvas, CSS, DOM, devicePixelRatio, camera, or UI state inside config.

---

14. src/state.js requirements

Create a minimal state factory.

It should separate:

* simulation state
* camera state
* UI state

Simulation state may contain an empty body list or scaffold placeholder body list.

Camera state may contain center and zoom.

UI state may contain paused, selectedBodyId, and speed.

Do not mix camera or UI state into physics state.

Do not store DOM nodes in simulation state.

---

15. src/physics/vector.js requirements

Create small pure vector helper functions.

Allowed:

* add
* subtract
* scale
* dot
* lengthSquared
* length
* clone

No DOM.

No canvas.

No camera.

No UI.

No side effects.

---

16. src/physics/gravity.js requirements

Create a scaffold placeholder module.

It must clearly state that gravity calculation is not implemented in this scaffold task.

Allowed:

* exported function names that will be used later
* throwing or returning explicit NOT_IMPLEMENTED status
* comments pointing to PHYSICS_CONTRACT.md

Forbidden:

* real gravity implementation
* viewport reads
* canvas reads
* visual radius as physical radius
* collision behavior

---

17. src/physics/integrator.js requirements

Create a scaffold placeholder module.

It must clearly state that the integrator is not implemented in this scaffold task.

Allowed:

* exported function names for future integration
* explicit NOT_IMPLEMENTED status
* comments pointing to PHYSICS_CONTRACT.md

Forbidden:

* full Velocity Verlet implementation
* frame-delta physics
* browser dependency
* render dependency
* UI dependency
* camera dependency

---

18. src/simulation/presets.js requirements

Create a minimal educational preset placeholder.

It may include named body metadata for:

* Sun
* Mercury
* Venus
* Earth
* Mars
* Jupiter

But do not claim real ephemeris accuracy.

Do not implement tuned orbit values unless the physics kernel task explicitly asks for it.

Keep preset values clearly labeled as scaffold placeholders.

---

19. src/simulation/reset.js requirements

Create a minimal reset function.

It may return fresh state from the scaffold preset.

It must not mutate preset definitions.

It must not access DOM, canvas, render, camera, or UI modules.

---

20. src/simulation/step.js requirements

Create a minimal simulation step placeholder.

It must not implement real physics yet.

It may increment a step counter or return explicit SCAFFOLD_ONLY status.

It must not import renderer, UI, DOM, canvas, or main.js.

---

21. src/render/camera.js requirements

Create a minimal camera module.

Allowed:

* createCamera
* worldToScreen placeholder
* screenToWorld placeholder

Camera may use viewport dimensions only for projection.

Camera must not mutate physical state.

Camera must not alter mass, velocity, position, acceleration, timestep, gravity, or softening.

---

22. src/render/renderer.js requirements

Create a minimal renderer.

Allowed:

* clear canvas
* draw simple scaffold text
* draw placeholder bodies if present
* use camera projection if simple

Forbidden:

* advancing physics
* implementing gravity
* implementing collisions
* mutating physical body properties

Renderer reads state.

Renderer does not own physics.

---

23. src/ui/controls.js requirements

Create minimal UI wiring.

Allowed:

* bind play/pause button
* bind reset button
* bind speed control placeholder
* bind zoom controls placeholder
* update inspector text
* call explicit callbacks

Forbidden:

* implementing physics
* computing gravity
* mutating body velocity
* mutating body mass
* implementing collision behavior

UI sends intent only.

---

24. src/main.js requirements

Create browser composition.

main.js may:

* find DOM elements
* initialize canvas
* create app state
* create camera
* initialize controls
* initialize renderer
* run a requestAnimationFrame loop
* draw scaffold state

main.js must not:

* define physics equations
* define full body presets
* implement collisions
* implement baseline logic
* become a monolith

main.js may show clearly that the app is scaffold-only.

---

25. src/dev/baseline.js requirements

Create a headless Node runner.

It must run with:

node src/dev/baseline.js

It must not import:

* renderer
* UI
* main.js
* DOM-only modules
* canvas-only modules

Because this is a scaffold task, it must not claim physics acceptance.

It should print:

* SCAFFOLD BASELINE
* PASS for scaffold file/module availability if checks pass
* NOT CHECKED for physics invariants
* explanation that physics kernel is not implemented yet
* list of expected future physics checks

It may verify:

* key modules import
* vector helpers work
* state factory works
* reset function returns state
* no physics PASS is claimed

The baseline must be honest.

Do not print "physics PASS" in this task.

---

26. Import boundary requirements

The following imports are forbidden:

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

Keep imports simple.

---

27. Checks to run

After creating files, run these checks if available in the environment:

1. Print the file tree.
2. Run:

node src/dev/baseline.js

3. Verify forbidden files are absent.
4. Verify no dependencies were installed.
5. Verify package.json has no dependencies or devDependencies.
6. Verify baseline does not claim physics acceptance.
7. Verify src/physics/collisions.js does not exist.

If a command cannot be run, report that explicitly.

Do not pretend a check passed if it was not run.

---

28. Completion report requirements

At the end, report:

* confirmed working directory
* files created
* files modified
* files intentionally not created
* checks run
* command output summary
* known limitations
* next safe task

Use these status labels only:

* ACCEPTED
* ACCEPTED WITH LIMITATIONS
* REJECTED
* DEFERRED
* NOT CHECKED

Do not use vague claims like:

* looks good
* should work
* probably fine
* mostly done

---

29. Stop condition

Stop after the scaffold is created and checked.

Do not continue to physics kernel.

Do not continue to render polish.

Do not continue to UI expansion.

Do not create future prompt files.

Do not create additional tasks for yourself.

Do not broaden scope.

---

30. Expected final status

Expected final status for this task:

ACCEPTED WITH LIMITATIONS

Reason:

The repository scaffold should exist and the scaffold baseline should run, but the actual physics kernel and invariant-based physics baseline are intentionally not implemented yet.

The next safe task after this is a separate narrow prompt for the physics kernel.
