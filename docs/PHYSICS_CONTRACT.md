PHYSICS_CONTRACT.md - Space Model Lab v3

Status: ACTIVE CANONICAL PHYSICS CONTRACT
Project line: Space Model Lab v3
Mode: clean-room rebuild with visual inheritance
Source marker: SML-V3-CANONICAL
Date: 2026-06-23
Revision: 2026-07-05 inspector documentation sync

---

1. Purpose

This document defines the physics contract for Space Model Lab v3.

It specifies:

* what the simulation is allowed to claim
* what the simulation must verify
* what the simulation must not depend on
* what behavior is explicitly forbidden without future decision

This file is binding for implementation, baseline checks, architecture, and Codex prompts.

---

2. Physics identity

Space Model Lab v3 is a simple educational 2D Newtonian N-body gravity sandbox.

It is not:

* a real astronomical prediction tool
* a NASA ephemeris simulator
* a relativistic physics simulator
* a black-hole simulator
* an eclipse predictor
* a mission-planning tool
* a collision physics engine

v3 prioritizes:

* honest limited claims
* clean state boundaries
* inspectable physics
* stable verification
* educational visual behavior

---

3. Coordinate model

The simulation uses world-space coordinates.

Required distinction:

* world position: physical simulation coordinate
* screen position: rendered canvas coordinate
* camera transform: projection from world to screen
* UI state: user interaction state

Physics modules must not read screen coordinates.

Render modules may project world coordinates into screen coordinates.

UI modules may request simulation or camera changes through explicit application callbacks.

Physics must not know that a screen exists.

---

4. Units

The initial implementation may use normalized educational units.

The simulation does not need real SI units unless a future accepted decision requires them.

However, all internal physics quantities must be consistent.

Required quantity categories:

* position
* velocity
* acceleration
* mass
* timestep
* gravitational constant
* softening length

The code must not mix world units with pixels.

Softening must be defined in world units.

Visual radius must not become physical radius unless a future accepted decision explicitly defines that behavior.

---

5. Body model

A body has at minimum:

* id
* name
* mass
* position
* velocity
* visual radius
* visual color or visual class

A body may later have additional metadata.

Visual radius is presentation metadata only.

Visual radius must not imply collision behavior.

Visual radius must not affect gravity unless explicitly documented as part of a future physical model.

---

6. Gravity model

v3 uses pairwise Newtonian gravity in 2D.

For each body, acceleration is computed from other bodies using their masses and relative positions.

Required:

* world coordinates only
* mass-based acceleration
* explicit softening in world units
* no self-force
* no render dependency
* no camera dependency
* no UI dependency

Gravity calculation must not read:

* canvas size
* viewport size
* browser window size
* devicePixelRatio
* camera zoom
* render scale
* CSS layout
* UI panel state
* mouse state
* keyboard state

Gravity must be deterministic for the same body list, same order, same numeric implementation, same timestep, and same runtime path.

---

7. Softening

The simulation must use gravitational softening to avoid singular acceleration during very close approaches.

Softening must be:

* explicit
* documented
* in world units
* independent from pixels
* independent from body visual radius
* independent from camera zoom
* independent from render scale

Softening is a numerical stabilizer.

Softening is not a collision model.

Softening does not mean bodies collide, merge, bounce, absorb, fragment, or disappear.

---

8. Timestep

The simulation uses a fixed physics timestep.

The physics step must not depend directly on browser frame duration.

Browser animation timing may determine how many fixed steps to run, but the physics step itself must use fixed dt.

Required distinction:

* render frame delta: browser timing
* physics dt: fixed simulation timestep
* speed multiplier: user-controlled simulation rate
* step count: number of discrete physics steps executed

Speed controls may change the simulation rate by changing accumulated simulation time or step count.

Speed controls must not create frame-rate-dependent physics.

---

9. Integrator

The simulation uses Velocity Verlet / Kick-Drift-Kick style integration.

The integrator must be implemented in physics or simulation code, not render code and not UI code.

Integrator responsibilities:

* update velocities and positions from acceleration
* recompute acceleration consistently
* preserve reasonable orbital behavior for educational presets
* expose enough state for baseline diagnostics

The integrator is not expected to produce perfect astronomical accuracy.

Energy should remain bounded within documented tolerance for the baseline scenario.

---

10. No collision behavior without future decision

Collision behavior is not part of the default physics contract.

Forbidden without future accepted decision:

* collision detection as physical behavior
* merge
* bounce
* absorption
* deletion on contact
* fragmentation
* event horizon capture
* radius-based physical contact
* src/physics/collisions.js

Bodies may visually overlap in extreme or invalid scenarios.

That is acceptable unless a future decision defines collision behavior.

Collision behavior requires its own decision record before implementation.

---

11. No black-hole-specific physics by default

The simulation must not implement black-hole-specific physics unless a future accepted decision changes the physics scope.

Forbidden by default:

* event horizons
* relativistic capture
* singularity behavior
* gravitational lensing
* accretion disks as physics
* radius-based black-hole absorption
* wormholes
* relativistic time effects

A future "massive attractor" preset may reuse the same Newtonian engine, but it must not claim real black-hole behavior unless the physics model is explicitly changed and documented.

---

12. No real ephemerides by default

The simulation does not claim real planetary ephemerides.

A solar-system-like preset may be educational and approximate.

Forbidden claims:

* real current planetary positions
* date-accurate orbital prediction
* eclipse prediction
* mission planning
* long-term astronomical validity
* NASA-grade data fidelity

Allowed claim:

* approximate educational Newtonian sandbox with generic educational body names.

---

13. Baseline runner

The physics baseline must run headlessly through Node.

Expected command:

node src/dev/baseline.js

The baseline must not require:

* browser
* canvas
* DOM
* CSS
* CDP
* remote debugging
* screenshots
* manual visual inspection

The baseline must import only modules needed to run and evaluate the simulation.

The baseline must not import:

* renderer
* UI
* browser main loop
* DOM-only modules

---

14. Baseline output

The baseline must print a simple report to stdout.

Required output categories:

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

Optional diagnostics:

* position summary
* velocity summary
* secondary diagnostic hash

The output must be readable by a human.

No complex test framework is required unless a future decision adds one.

---

15. Baseline primary oracle

The primary baseline oracle is invariant-based.

Primary checks:

* finite numeric state
* stable body count
* stable timestep count
* bounded relative energy drift
* bounded momentum drift
* bounded angular momentum drift
* repeatable report for same initial state and same engine path
* no render/camera/viewport dependency

Position hashes are secondary diagnostics only.

Pixel hashes are not part of the physics baseline.

Visual screenshots are not part of the physics baseline.

---

16. Tolerance policy

Tolerance values must be explicit and documented.

Initial suggested tolerances:

* no NaN: zero tolerance
* no Infinity: zero tolerance
* body count drift: zero tolerance
* timestep count drift: zero tolerance
* relative total energy drift: less than or equal to 1e-3 for the baseline scenario
* total momentum drift: less than or equal to 1e-9 in normalized units, or documented equivalent
* angular momentum drift: less than or equal to 1e-6 relative drift, or documented equivalent

These tolerances may be refined after implementation evidence exists.

Do not silently loosen tolerances to make a failing baseline pass.

Any tolerance change must explain:

* previous value
* new value
* reason for change
* observed baseline behavior
* risk of masking regression

---

17. Viewport independence

Physics must be independent from viewport and render state.

The same physical initial state must produce the same physical report regardless of:

* canvas width
* canvas height
* devicePixelRatio
* camera zoom
* render scale
* CSS layout

The preferred design is to make viewport dependency impossible:

physics modules should not accept viewport, canvas, camera, CSS, or render-scale values.

If physics functions cannot receive presentation values, that boundary itself is evidence.

---

18. Determinism definition

v3 uses practical engineering determinism.

Required determinism:

* same initial state
* same body order
* same timestep
* same runtime path
* same implementation
* same environment

should produce the same baseline report.

Not required:

* identical coordinates after arbitrary internal refactor
* identical coordinates across every JavaScript engine
* identical pixel output across devices
* identical long-term chaotic trajectory under changed operation order

The goal is stable engineering verification, not pretending floating-point N-body dynamics are immune to chaos.

---

19. State mutation rule

Physics state updates must be explicit.

A simulation step should either:

* return a new simulation state, or
* mutate a clearly owned simulation state object

It must not mutate:

* UI state
* camera state
* render state
* DOM
* canvas
* global browser objects

Hidden global state is forbidden in physics.

---

20. Simulation preset rule

The initial educational preset includes:

* Sun
* Inner A
* Inner B
* Middle
* Outer A
* Outer B

The preset should be stable enough for a short baseline run and visually plausible in the browser.

The preset is not real ephemeris data, not date-accurate astronomy, not NASA data, and not real solar-system scale.

Preset values must be centralized.

Codex must not scatter initial values across UI, renderer, main loop, and physics modules.

UI inspector diagnostics may derive display-only values from body position and velocity.

Those derived values are not physics state and must not be stored into bodies or simulation state.

---

21. Energy calculation

The baseline should compute total mechanical energy:

* kinetic energy
* gravitational potential energy

The exact normalized formula must match the normalized unit system used in implementation.

Energy diagnostics are for regression detection.

They are not a claim of real astronomical precision.

---

22. Momentum calculation

The baseline should compute total linear momentum.

Total momentum should remain bounded in a closed N-body system.

Momentum diagnostics help detect:

* force asymmetry
* integration errors
* accidental external forces
* hidden state mutation
* incorrect mass handling

---

23. Angular momentum calculation

The baseline should compute total angular momentum in 2D.

Angular momentum should remain bounded for the closed educational baseline scenario.

Angular momentum diagnostics help detect:

* asymmetry
* state corruption
* incorrect integration
* unintended external torque

---

24. Failure conditions

The baseline must fail if:

* any position is NaN
* any velocity is NaN
* any acceleration is NaN
* any position is Infinity
* any velocity is Infinity
* any acceleration is Infinity
* body count changes unexpectedly
* timestep count differs from expected
* energy drift exceeds tolerance
* momentum drift exceeds tolerance
* angular momentum drift exceeds tolerance
* physics result depends on render/camera/viewport state
* baseline imports browser-only modules
* collision behavior appears without future decision

Failure output should explain which check failed.

---

25. Non-goals

The physics contract does not require solving:

* close-encounter accuracy
* collision modeling
* long-term Solar System stability
* real planetary ephemerides
* relativistic effects
* tidal physics
* spin
* non-spherical mass distributions
* atmospheric drag
* spacecraft trajectories
* high-performance large-N simulation
* 3D physics

These are out of scope unless future accepted decisions change the contract.

---

26. Acceptance statement

A physics implementation is acceptable only if:

* physics is independent from render/UI/camera/browser state
* fixed timestep exists
* pairwise Newtonian gravity exists
* softening exists in world units
* Velocity Verlet / Kick-Drift-Kick style integration exists
* educational preset exists
* headless Node baseline runs
* invariant checks pass under documented tolerances
* no collision behavior is implemented without future decision
* no black-hole-specific behavior is implemented without future decision
* no real-ephemeris claims are made

If any of these are false, the physics contract is not satisfied.
