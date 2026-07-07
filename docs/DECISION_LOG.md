DECISION_LOG.md - Space Model Lab v3

Status: ACTIVE CANONICAL DECISION LOG
Project line: Space Model Lab v3
Mode: clean-room rebuild with visual inheritance
Source marker: SML-V3-CANONICAL
Date opened: 2026-06-23
Revision: 2026-07-04 milestone documentation sync

---

1. Purpose

This file records accepted project decisions for Space Model Lab v3.

It is not a progress log.

It is not a migration diary.

It is not a place for speculative ideas.

Only decisions that constrain implementation, architecture, verification, source authority, or scope belong here.

---

2. Decision format

Each decision should include:

* decision ID
* status
* context
* decision
* rationale
* consequences
* not decided

Accepted status labels:

* ACCEPTED
* SUPERSEDED
* DEFERRED
* REJECTED

Use short operational records.

Do not turn decisions into essays.

---

D-v3-001 - Clean-room rebuild

Status: ACCEPTED
Date: 2026-06-23

Context

The project needs a clean, inspectable foundation.

The product direction is still valid: a visual educational gravity sandbox with a scientific cockpit feel.

The implementation strategy must avoid hidden coupling, source drift, and uncontrolled AI-assisted expansion.

Decision

Space Model Lab v3 is a clean-room rebuild with visual inheritance.

Implementation starts from the active v3 source documents and approved source tree.

Rationale

A small clean system is safer than continuing from a coupled prototype.

The useful inheritance is product direction and engineering lessons, not implementation carryover.

Consequences

v3 uses new source authority, new architecture boundaries, new acceptance criteria, and narrow Codex prompts.

Implementation must be built cleanly from the v3 source documents.

Not decided

This does not decide future advanced features.

This does not decide final visual polish.

---

D-v3-002 - One active source set

Status: ACCEPTED
Date: 2026-06-23

Context

The project requires a single source of truth.

Multiple active drafts create ambiguity for humans and Codex.

Decision

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

Rationale

A single active source set prevents source drift.

Codex must not infer authority from inactive drafts or unapproved files.

Consequences

Only one active version of each canonical file may exist.

Files outside the active source set do not constrain implementation.

Not decided

This does not decide how future releases will be packaged.

---

D-v3-003 - No legacy implementation carryover

Status: ACCEPTED
Date: 2026-06-23

Context

v3 is a clean rebuild, not a continuation of old implementation structure.

Visual direction may be useful, but implementation coupling must not be carried forward.

Decision

v3 must not copy prior implementation code.

v3 may inherit:

* visual direction
* product intent
* engineering lessons
* known failure modes

v3 must not inherit implementation behavior by default.

Rationale

Clean-room rebuild loses value if old code or old behavior silently re-enters the system.

Consequences

All behavior must be re-specified through v3 source documents and re-implemented cleanly.

Codex must not copy implementation code from inactive sources.

Not decided

This does not prohibit manually restating useful lessons in v3 docs.

---

D-v3-004 - Physics is independent from presentation

Status: ACCEPTED
Date: 2026-06-23

Context

A trustworthy simulation must keep physical behavior separate from rendering and UI.

Presentation state must not affect physical state.

Decision

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

Rationale

Changing screen size, zoom, or layout must not change gravity, acceleration, timestep, radius, or motion.

Consequences

Physics modules must be runnable without browser APIs.

The headless baseline must not import render, UI, or browser main loop.

Any presentation-to-physics dependency is a regression.

Not decided

This does not decide final camera API or final renderer details.

---

D-v3-005 - Headless invariant-based baseline

Status: ACCEPTED
Date: 2026-06-23

Context

A visual simulation can look correct while the physics is wrong.

A brittle trajectory hash can fail on harmless refactors.

The baseline must verify meaningful contracts.

Decision

v3 uses a headless physics-contract baseline.

Expected command:

node src/dev/baseline.js

The baseline must not require:

* browser
* DOM
* canvas
* CSS
* screenshot comparison
* CDP
* remote browser debugging
* manual visual inspection

The primary oracle is invariant-based.

Required checks:

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

Pixel hashes are not accepted as the physics baseline.

Rationale

The baseline should catch real physics regressions without punishing harmless internal organization changes.

Consequences

Simulation must be runnable without browser modules.

Baseline output must be readable and report PASS/FAIL.

Not decided

Exact numeric tolerances are defined in the physics contract and may be adjusted only by explicit documentation.

---

D-v3-006 - Minimal Newtonian physics model

Status: ACCEPTED
Date: 2026-06-23

Context

The project needs honest limited physics, not overclaimed astronomy.

Decision

The core model is simple 2D Newtonian N-body gravity.

Required model properties:

* world-space positions
* world-space velocities
* mass-based pairwise gravity
* fixed timestep
* gravitational softening in world units
* Velocity Verlet / Kick-Drift-Kick style integration
* centralized educational preset

Rationale

This model is sufficient for a small educational gravity sandbox and remains inspectable.

Consequences

The project must not claim real astronomical prediction.

The model must remain explicit and verifiable.

Not decided

This does not decide future real ephemerides, advanced integrators, or performance optimizations.

---

D-v3-007 - No collision behavior without a future decision

Status: ACCEPTED
Date: 2026-06-23

Context

Collision behavior is a design and physics decision, not a small implementation detail.

Different collision policies imply different product behavior.

Decision

Do not implement collision behavior unless a future accepted decision authorizes it.

Forbidden without future decision:

* collision detection as physical behavior
* merge
* bounce
* absorption
* deletion on contact
* fragmentation
* event horizon capture
* radius-based physical contact

Do not create src/physics/collisions.js without future decision.

Rationale

Creating a collision module invites premature behavior.

The initial system should keep physical behavior minimal and explicit.

Consequences

Bodies may visually overlap in extreme scenarios.

Visual radius is presentation metadata only unless later decided otherwise.

Not decided

This does not decide the future collision model.

---

D-v3-008 - No black-hole, relativistic, or ephemeris claims by default

Status: ACCEPTED
Date: 2026-06-23

Context

The product may visually involve space and gravity, but it must not overclaim its physics.

Decision

Do not implement or claim:

* black-hole physics
* event horizons
* relativistic effects
* wormholes
* gravitational lensing
* real ephemerides
* eclipse prediction
* mission planning

unless a future accepted decision changes the physics scope.

Rationale

The project is an educational Newtonian sandbox, not a scientific prediction tool.

Consequences

The visual system can be attractive without making unsupported claims.

Future advanced features require explicit source updates.

Not decided

This does not prohibit future experimental presets if clearly labeled and documented.

---

D-v3-009 - Plain JavaScript first

Status: ACCEPTED
Date: 2026-06-23

Context

The project should stay inspectable and small.

Tooling can obscure the early architecture.

Decision

The initial implementation uses plain JavaScript modules.

Do not add by default:

* framework
* TypeScript
* bundler
* build system
* Web Worker
* state-management library
* test framework

Rationale

Small plain files are easier to inspect, review, and correct.

Complexity should be added only after the core architecture is accepted.

Consequences

The first source tree should run with minimal tooling.

Any future tooling migration requires explicit decision.

Not decided

This does not reject future TypeScript, build tooling, or performance work.

---

D-v3-010 - Codex is executor only

Status: ACCEPTED
Date: 2026-06-23

Context

AI-assisted implementation must not become uncontrolled architecture generation.

Codex needs precise task boundaries.

Decision

Codex is an executor, not the architect.

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

Rationale

Narrow task boundaries reduce source drift and hidden scope expansion.

Consequences

Codex work must happen in small reviewable increments.

Broad "make it work" prompts are rejected.

Not decided

This does not decide which future tasks Codex may perform.

---

D-v3-011 - Review uses observed evidence

Status: ACCEPTED
Date: 2026-06-23

Context

Claims of completion are weak without observed evidence.

The project needs verification discipline.

Decision

Review must rely on observed facts:

* file tree
* file contents
* import boundaries
* command output
* baseline PASS/FAIL report
* visible browser behavior after source and baseline checks

Weak evidence:

* "looks good"
* "should work"
* "probably fine"
* "implemented"
* "tested" without output

Accepted status labels:

* ACCEPTED
* ACCEPTED WITH LIMITATIONS
* REJECTED
* DEFERRED
* NOT CHECKED

Rationale

Observed evidence prevents false completion.

Consequences

Every Codex report must include what changed and what was checked.

Human review should verify rather than trust claims.

Not decided

This does not define a full CI system.

---

D-v3-012 - Manifest is permanent source control, not a progress tracker

Status: ACCEPTED
Date: 2026-06-23

Context

The manifest must remain useful beyond the initial scaffold.

Temporary stage-specific language makes it stale quickly.

Decision

The manifest defines the active source set and target source structure.

It must not become a temporary checklist or progress log.

Rationale

A stable manifest prevents long-term source drift.

Consequences

Implementation progress belongs in task reports, not in the manifest.

Not decided

This does not prohibit updating the manifest when the canonical source set changes.

---

D-v3-013 - Runtime and tool metadata are sanctioned

Status: ACCEPTED
Date: 2026-07-01

Context

Codex legitimately created package.json per codex_scaffold.md, but the canonical tree in MANIFEST, PROJECT_SOURCE, ARCHITECTURE, and ACCEPTANCE_CRITERIA did not list it. Tool metadata directories (.git/, .agents/) also exist in the repository root and are not source files. Docs must match legitimate repo reality, or every audit fails on known-good files.

Decision

package.json is part of the canonical tree as minimal Node runtime metadata: project name, private true, type module, optional baseline script. It must not introduce dependencies, devDependencies, build tooling, framework tooling, or test tooling.

Tool metadata directories (.git/, .agents/, similar tool caches) are allowed, are not source files, and are not listed in the canonical tree.

Rationale

The manifest must sanction what legitimately exists.

Consequences

MANIFEST, PROJECT_SOURCE, ARCHITECTURE, and ACCEPTANCE_CRITERIA list package.json with the constraint above. Audits must not flag sanctioned metadata as violations.

Not decided

Future tooling changes still require explicit decision per D-v3-009.

---

D-v3-014 - Stable repository root

Status: ACCEPTED
Date: 2026-07-01

Context

The scaffold was created inside an ephemeral dated agent-session directory. Wrong-root work is a known project risk; ephemeral roots multiply it across sessions.

Decision

The repository must live at a stable, explicitly chosen absolute path, not inside auto-generated session directories. Every Codex prompt must pin the exact absolute root path. Moving the root requires updating every pinned path and recording the move.

Rationale

Root confirmation is only meaningful against a stable intended root.

Consequences

The current session-directory location must be migrated to a stable path before the physics kernel task. codex_scaffold.md carries an explicit intended-working-directory block.

Not decided

The specific path is the owner's choice. Remote git hosting is not decided.

---

D-v3-015 - Publication boundary

Status: ACCEPTED
Date: 2026-07-01

Context

The previous project line maintained an explicit publication boundary against overclaiming the product. v3 physics documents forbid overclaim at the physics level, but no v3 decision covered public and product-level descriptions. This decision is a v3-native restatement, not a copy of the prior document.

Decision

Public and internal descriptions of the product must not claim: real astronomical prediction, real ephemerides, black-hole physics, relativistic physics, eclipse prediction, mission planning, or scientific-instrument status.

Allowed claim: approximate educational 2D Newtonian gravity sandbox.

Completion and capability claims in any public description follow the same observed-evidence rule as internal review (D-v3-011).

Rationale

Anti-overclaim doctrine must cover communication, not only implementation.

Consequences

README, page descriptions, and announcements are reviewable artifacts against this boundary.

Not decided

If the prior PUBLICATION_BOUNDARY document contains additional specifics worth keeping, they may be merged by a later revision.

---

D-v3-016 - Browser sandbox milestone accepted

Status: ACCEPTED
Date: 2026-07-04

Context

Tasks 2B, 3, 4B, and 4C established the first accepted browser-visible Space Model Lab v3 sandbox.

The accepted implementation has a normalized Newtonian physics kernel, a local browser preview, renderer-owned visual polish, and a read-only regression audit after polish.

Decision

Milestone 4C is accepted as the current project milestone.

Accepted constraints:

* physics/render separation remains mandatory
* visual polish is accepted only as presentation behavior
* renderer-owned bounded trails are accepted
* deterministic renderer-owned starfield is accepted
* local HTTP launch is the canonical browser preview path
* direct file:// launch is not the acceptance path

The accepted physics kernel remains:

* normalized Newtonian N-body
* G=1
* dt=0.001
* softening=0.001
* Velocity Verlet / Kick-Drift-Kick
* six-body educational preset
* no real ephemerides
* no collisions
* no GR, black holes, or lensing

Task 4C observed baseline status:

* final status PASS
* finite-state PASS
* repeatability PASS
* body count stable
* timestep count stable
* relative energy drift: 4.290851857533e-11
* momentum drift: 7.808913380318e-20
* relative angular momentum drift: 3.213114654476e-15

Rationale

The browser sandbox is now useful while preserving the original architecture rule: physics is world-state logic and presentation is separate.

Consequences

Future work must preserve the Task 4C boundary:

* renderer imports no physics or simulation modules
* renderer/UI/main do not assign body mass, position, velocity, or acceleration
* camera imports no physics or simulation modules
* trails and starfield do not affect physics
* browser preview should use http://127.0.0.1:4173/ or an equivalent local HTTP server

Known limitations

Git was unavailable in PATH during the Task 4C audit, so forbidden file change history was checked through file content inspection and the Task 4B report rather than git diff.

Risks to monitor:

* labels can crowd near Sun/Inner on narrow viewport
* glow radius can extend beyond hit radius
* higher speed increases visual trail density, while trail memory remains bounded
* local HTTP launch is required for reliable browser preview

Not decided

This does not authorize new physics, collision behavior, real ephemerides, frameworks, dependencies, build tooling, or a publication release.

---

D-v3-017 - Educational inspector refinement accepted

Status: ACCEPTED WITH LIMITATIONS
Date: 2026-07-05

Context

Task 5B refined the browser inspector after the accepted Task 4C browser sandbox milestone.

At the Task 5C milestone, the runtime preset remained the normalized educational N-body baseline:

* id: normalized-educational-nbody
* name: Normalized educational N-body baseline
* bodies: Sun, Inner, Second, Third, Fourth, Outer
* not real ephemeris data
* not date-accurate astronomy
* not NASA data
* not real solar-system scale

Decision

The educational inspector refinement is accepted.

Accepted constraints:

* derived inspector diagnostics are UI-only and read-only
* no preset numeric values changed
* no physics changes were accepted
* no simulation changes were accepted
* no approximate orbital period was added in this task
* selected body remains driven by state.ui.selectedBodyId
* UI must not import physics modules
* UI must not store derived diagnostics into body or state

Task 5C observed baseline status:

* final status PASS
* finite-state PASS
* repeatability PASS
* body count stable
* timestep count stable
* relative energy drift: 4.290851857533e-11
* momentum drift: 7.808913380318e-20
* relative angular momentum drift: 3.213114654476e-15

Rationale

The inspector can improve educational usefulness without becoming part of the physics engine, as long as all derived values remain display-only and are clearly labeled as normalized educational units.

Consequences

Future UI diagnostics must preserve the same boundary:

* read body values only
* compute display values locally
* do not write derived values into body or state
* do not imply real astronomy, real dates, NASA data, or real solar-system scale

Known limitations

Git was unavailable in PATH during the Task 5C audit.

The missing/non-finite inspector fallback was code-inspected, not forced in browser.

Not decided

This does not authorize body editing, dragging, collisions, real ephemerides, approximate orbital-period claims, new physics, frameworks, dependencies, or build tooling.

---

D-v3-018 - Local launch path accepted

Status: ACCEPTED WITH LIMITATIONS
Date: 2026-07-05

Context

Task 6B added a no-dependency local launch path for the ES-module browser app.

Task 6C audited that launch path after implementation.

Decision

The canonical launch path is now:

* double-click start-space-model-lab.bat on Windows
* the launcher starts tools/serve-local.js
* tools/serve-local.js serves the project through Node built-in HTTP modules
* the canonical browser URL is http://127.0.0.1:4173/

Direct file:// index.html is not an acceptance path.

Accepted constraints:

* no .exe packaging
* no Python launcher
* no Electron or Tauri
* no bundler
* no dependencies or devDependencies
* no build system
* no runtime app behavior changes
* no physics, simulation, renderer, UI, camera, index, styles, docs, or prompts changes were required for Task 6B implementation

Task 6C observed launch audit:

* tools/serve-local.js uses only Node built-in modules
* server binds 127.0.0.1
* server uses port 4173
* root / serves index.html
* /src/main.js is served with JavaScript MIME suitable for ES modules
* missing files return 404
* tested traversal attempts return 403
* .git, .agents, and .codex are blocked
* directory listing is not implemented
* start-space-model-lab.bat starts the server and leaves the terminal visible

Task 6C observed baseline status:

* final status PASS
* finite-state PASS
* repeatability PASS
* body count stable
* timestep count stable
* relative energy drift: 4.290851857533e-11
* momentum drift: 7.808913380318e-20
* relative angular momentum drift: 3.213114654476e-15

Known limitations

PowerShell execution policy may block npm run preview through npm.ps1.

Git was unavailable in PATH during the Task 6C audit.

Opening the external default browser from the .bat launcher was initiated, but direct observation of that external window was limited from the automation surface.

Not decided

This does not authorize .exe packaging, installers, Electron, Tauri, Python launchers, bundlers, dependencies, build tooling, or deployment.

---

D-v3-019 - Recovery capsule accepted

Status: ACCEPTED
Date: 2026-07-05

Context

After the accepted v0 local milestone, future Codex or new-chat runs need a compact repo-local recovery entrypoint.

The working tree remains the source of truth for implementation.

Decision

00_READ_FIRST.md is accepted as the repo-local recovery capsule.

Accepted constraints:

* 00_READ_FIRST.md is a read-first pointer for future recovery
* it summarizes the accepted v0 local milestone
* it records source priority order
* it points to canonical docs for deeper details
* it does not replace PROJECT_SOURCE.md, MANIFEST.md, or docs/
* it must not authorize runtime behavior changes
* it must not imply external ChatGPT source files exist in this repository unless they are present on disk

Rationale

The project has reached a stable v0 local milestone, and a small root-level recovery capsule reduces context loss without adding a new authority layer.

Consequences

Future docs-only recovery updates may use short validation:

* baseline PASS
* no src changes
* no dependencies
* canonical source markers remain present

Full read-only audits remain reserved for risky areas such as physics, simulation, main loop, state-affecting render/UI/camera changes, launcher/server code, package/dependency/build changes, and major canonical source rewrites.

Not decided

This does not authorize new physics, runtime feature work, packaging, dependencies, build tooling, or deployment.

---

D-v3-020 - Public recovery wording clarified

Status: ACCEPTED
Date: 2026-07-05

Context

After the initial public import, the recovery capsule and canonical docs still recorded the original local Codex workspace path.

That path is useful provenance for the v0 import, but it is not portable across future environments.

Decision

00_READ_FIRST.md remains the repo-local recovery capsule.

The local Codex workspace path is historical import context, not portable canon.

The portable canonical project root is the checked-out GitHub repository root after clone or pull.

Runtime was not changed.

Rationale

Public recovery guidance should help future agents work from a fresh checkout without assuming the original Windows path exists.

Consequences

Future agents should treat the repository root after clone or pull as the working root.

Local workspace paths may remain only when clearly labeled as historical or task-local context.

Not decided

This does not authorize runtime changes, launch-path changes, packaging, dependencies, build tooling, or deployment.

---

D-v3-021 - Public review positioning accepted

Status: ACCEPTED
Date: 2026-07-05

Context

T9A found no technical blockers for external technical review, but the README did not yet show the repository's main public differentiator.

The project is both a small educational physics sandbox and a reproducible, governed multi-agent LLM development case study.

Decision

README now presents the project as an educational Newtonian N-body sandbox and a gated multi-agent LLM workflow case study.

Baseline metrics are visible in README.

The reviewer route links to recovery, source, manifest, decision, architecture, acceptance, and physics contract documents.

Runtime was not changed.

Rationale

External reviewers should understand within 60 seconds that the repository is reviewable through observed baseline verification and governance, not only through a browser demo.

Consequences

The public entrypoint now exposes baseline verification, human-in-the-loop approval, single-writer git discipline, commit packet, approval gate, and receipt concepts.

Not decided

This does not configure GitHub Pages, add screenshots, create tags, add Actions, add features, change runtime behavior, or add dependencies.

---

D-v3-022 - Public display labels clarified

Status: ACCEPTED
Date: 2026-07-06

Context

The current v0 cockpit is preparing for a future public screenshot, but the displayed body labels Inner, Second, Third, Fourth, and Outer look placeholder-like in a public README image.

Decision

Runtime-visible body display labels were changed to neutral educational labels:

* Sun
* Inner A
* Inner B
* Middle
* Outer A
* Outer B

Physics parameters and baseline behavior were not changed.

Real planet names were intentionally not used to avoid ephemeris, NASA-data, date-accurate astronomy, or real-solar-system overclaim.

Rationale

The screenshot-facing labels should be readable and public-friendly without implying real solar-system data.

Consequences

The change is display-label-only. Body ids, body count, masses, positions, velocities, visual radii, colors, timestep, gravity, softening, integrator, and baseline tolerances remain unchanged.

Not decided

Screenshot assets remain deferred. GitHub Pages, Actions, features, and additional visual polish remain not decided.

---

D-v3-023 - v3 scientific observability scope boundary accepted

Status: ACCEPTED
Date: 2026-07-06

Context

After public README positioning, the v0-review tag, and display-label clarification, the project considered whether v3 should be closed and future visual work moved to v4.

The accepted correction is that v3 should not be frozen, but should remain narrowly scoped.

Decision

v3 remains the canonical educational Newtonian N-body cockpit.

v3 remains open for invariant observability and reviewer-facing scientific overlays.

In-scope v3 candidates include:

* live energy / relative drift readout
* momentum readout
* angular momentum readout
* barycenter / center-of-mass marker
* later energy mini-graph if separately approved

Higher-risk observability candidates such as time reversal and integrator race require separate D-records and audits.

Presets, broad UI playground controls, aesthetic/fantasy modes, pseudo-GR, black holes, garlands, cinematic visual drama, and speculative effects are deferred to v4 by default.

Presets may only enter v3 through an explicit future D-record exception.

Rationale

v3's differentiator is not visual hype. It is reviewable physics: baseline, invariants, architecture boundaries, and observed validation.

Observability overlays make the accepted baseline visible in the browser and therefore strengthen v3 rather than dilute it.

Aesthetic/experimental features would blur the reference artifact and belong in v4.

Consequences

Screenshot remains deferred until the cockpit visually communicates the scientific differentiator.

GitHub Pages remains deferred until after observability planning or a separate deployment decision.

Next intended task is T10A read-only observability planning audit.

T10A must answer where invariant calculations live, whether a shared diagnostics module is needed, and who owns the drift reference snapshot.

Not decided

No live telemetry implementation is accepted yet.

No diagnostics module is accepted yet.

No barycenter marker is accepted yet.

No oscilloscope, time reversal, integrator race, presets, Pages, screenshot, Actions, or v4 repo/branch strategy is accepted yet.

---

D-v3-024 - Live invariant telemetry accepted

Status: ACCEPTED
Date: 2026-07-07

Context

D-v3-023 kept v3 open for invariant observability and reviewer-facing scientific overlays.

T10A found that invariant logic lived mostly inside src/dev/baseline.js, while browser UI did not show live invariant telemetry.

Decision

A shared pure diagnostics module was added at src/simulation/diagnostics.js.

The headless baseline now uses shared diagnostics logic.

The browser cockpit now displays read-only invariant telemetry:

* total energy
* relative energy drift since reset/reference
* total momentum magnitude
* relative angular momentum drift since reset/reference

Diagnostics are derived read-only values and do not mutate simulation bodies.

UI displays formatted diagnostics but does not compute invariant formulas.

Renderer remains independent from diagnostics.

Rationale

The v3 cockpit should communicate the accepted scientific differentiator directly in the browser: live invariant behavior, not only moving bodies.

Shared diagnostics prevents baseline/browser drift and keeps invariant formulas out of UI and renderer code.

Consequences

state.diagnostics owns reference/current/comparison diagnostic snapshots separately from simulation bodies.

Browser reset refreshes the reference snapshot.

The browser composition path updates current/comparison telemetry after fixed simulation steps.

Not decided

Screenshot, GitHub Pages, barycenter marker, oscilloscope, time reversal, integrator race, presets, and v4 work remain not decided.

---

D-v3-025 - Barycenter marker accepted

Status: ACCEPTED
Date: 2026-07-07

Context

D-v3-023 accepted barycenter / center-of-mass visualization as an in-scope v3 scientific observability candidate.

T10C-A found that barycenter should be calculated in shared diagnostics and rendered only as a read-only marker.

Decision

A minimal barycenter marker was accepted as v3 scientific observability.

Barycenter is computed in shared diagnostics.

Barycenter is included in the invariant snapshot.

Renderer draws a read-only marker from diagnostics state.

Renderer does not compute barycenter.

UI does not compute barycenter.

Simulation bodies and physics state are not mutated.

The marker visualizes center-of-mass / conservation behavior.

The marker is not a real astronomical body and not an ephemeris object.

Rationale

In an isolated Newtonian system, center-of-mass behavior is a scientific diagnostic for conservation behavior.

The marker makes this behavior visible without adding a new preset, control surface, or visual-drama feature.

Consequences

The marker remains modest and diagnostic-only.

Camera projection remains render-only.

state.diagnostics.current.barycenter is the runtime source for marker drawing.

Not decided

Screenshot, GitHub Pages, oscilloscope, time reversal, integrator race, presets, broad controls, and v4 work remain not decided.

---

Active decision summary

Accepted:

* D-v3-001 - Clean-room rebuild
* D-v3-002 - One active source set
* D-v3-003 - No legacy implementation carryover
* D-v3-004 - Physics is independent from presentation
* D-v3-005 - Headless invariant-based baseline
* D-v3-006 - Minimal Newtonian physics model
* D-v3-007 - No collision behavior without a future decision
* D-v3-008 - No black-hole, relativistic, or ephemeris claims by default
* D-v3-009 - Plain JavaScript first
* D-v3-010 - Codex is executor only
* D-v3-011 - Review uses observed evidence
* D-v3-012 - Manifest is permanent source control, not a progress tracker
* D-v3-013 - Runtime and tool metadata are sanctioned
* D-v3-014 - Stable repository root
* D-v3-015 - Publication boundary
* D-v3-016 - Browser sandbox milestone accepted
* D-v3-017 - Educational inspector refinement accepted
* D-v3-018 - Local launch path accepted
* D-v3-019 - Recovery capsule accepted
* D-v3-020 - Public recovery wording clarified
* D-v3-021 - Public review positioning accepted
* D-v3-022 - Public display labels clarified
* D-v3-023 - v3 scientific observability scope boundary accepted
* D-v3-024 - Live invariant telemetry accepted
* D-v3-025 - Barycenter marker accepted
