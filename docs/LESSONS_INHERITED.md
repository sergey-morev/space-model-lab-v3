LESSONS_INHERITED.md - Space Model Lab v3

Status: ACTIVE CANONICAL LESSONS
Project line: Space Model Lab v3
Mode: clean-room rebuild with visual inheritance
Source marker: SML-V3-CANONICAL
Date: 2026-06-23

---

1. Purpose

This document records the operational lessons that constrain Space Model Lab v3.

These are not historical notes.

These are active engineering constraints.

If a lesson is written here, implementation and Codex prompts must respect it.

---

2. Core inheritance rule

v3 inherits lessons, not implementation.

Allowed inheritance:

* architectural lessons
* verification lessons
* source-control lessons
* visual direction
* known failure modes
* product intent

Forbidden inheritance:

* old code
* old module structure
* old behavior by default
* old baseline assumptions
* old debugging workflow
* old scope creep

---

3. Lesson 1 - Source authority must be singular

A project cannot remain stable if multiple files imply different source authority.

v3 must always have one active source set.

The active source set is defined by the manifest and the current SML-V3-CANONICAL source collection.

If a file is not active in the manifest, Codex must not treat it as implementation input.

There must never be two active versions of the same canonical document.

---

4. Lesson 2 - Rebuilding can be safer than refactoring

A prototype can prove that an idea is viable while also proving that its implementation should not be carried forward.

v3 uses clean-room rebuild because the desired product is still valid, but the implementation must start from clean boundaries.

This is not a rejection of the concept.

It is a correction of the engineering path.

---

5. Lesson 3 - Physics must not depend on presentation state

Physics must be independent from:

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

Physics state is world state.

Render state is presentation state.

Camera state is projection state.

UI state is interaction state.

Any dependency from physics to viewport, render, camera, DOM, CSS, or UI is a regression.

This boundary is mandatory from the first implementation.

---

6. Lesson 4 - Baseline must verify contracts, not accidental sameness

A useful baseline detects meaningful regressions.

A fragile baseline punishes harmless refactors.

The v3 baseline must not rely on bitwise position hashes as its primary oracle.

The v3 baseline must verify physics contracts:

* no NaN
* no Infinity
* repeatable report for the same initial state and same engine path
* stable body count
* stable timestep count
* bounded relative energy drift
* bounded momentum drift
* bounded angular momentum drift
* no viewport dependency
* no render dependency
* no camera dependency

Position summaries may be diagnostics.

Position hashes may be secondary smoke checks.

They are not the main acceptance criterion.

---

7. Lesson 5 - Headless verification comes before browser inspection

A simulation core must be testable without the browser.

The v3 baseline must run through Node.

Expected command:

node src/dev/baseline.js

The baseline must print PASS/FAIL and diagnostics to stdout.

Browser inspection is allowed later for visual validation.

Browser inspection is not the primary verification mechanism.

The implementation must not depend on CDP, remote browser debugging, screenshots, or "looks good on screen" as the main evidence of correctness.

---

8. Lesson 6 - Visual success is not physics success

A canvas animation can look convincing while the simulation is wrong.

v3 must separate:

* visual plausibility
* numerical behavior
* architecture boundary correctness
* source hygiene
* acceptance criteria

A visually attractive orbit is not enough.

The simulation must pass its headless physics contract.

---

9. Lesson 7 - Codex must not decide architecture

Codex is an executor.

Codex must receive narrow tasks with:

* intended working directory
* allowed files
* forbidden files
* exact scope
* acceptance criteria
* stop condition
* report requirements

Codex must not infer the next task.

Codex must not broaden scope.

Codex must not copy inactive implementation.

Codex must stop after the requested task and report what changed.

---

10. Lesson 8 - Root confirmation is mandatory

Wrong-folder work is a serious project risk.

Every Codex task must start by confirming the current working directory.

If the working directory is not the intended v3 root, Codex must stop immediately.

No file creation or modification should happen before root confirmation.

---

11. Lesson 9 - Small initial implementation protects the architecture

The first implementation must be deliberately small.

It should prove:

* clean source tree
* module boundaries
* physics independence from render
* physics independence from UI
* physics independence from camera
* headless baseline
* minimal visual loop
* minimal UI controls
* reset/play/pause/speed/zoom
* simple inspector if feasible

The first implementation must not become a feature showcase.

A small correct system is more valuable than a large impressive unstable prototype.

---

12. Lesson 10 - Do not create behavior before choosing the model

Some files imply decisions.

A collision module implies a collision model.

A black-hole module implies a physics claim.

An ephemeris module implies a precision claim.

v3 must not create modules for undecided behavior.

Forbidden without future accepted decision:

* collisions
* merge behavior
* bounce behavior
* absorption behavior
* event horizon behavior
* black-hole-specific physics
* wormholes
* relativistic physics
* real ephemerides
* eclipse prediction
* mission planning

Deferred behavior requires a decision record before implementation.

---

13. Lesson 11 - Visual identity is useful, but secondary

The product should preserve a useful visual direction:

* dark scientific cockpit
* glowing orbital bodies
* readable trails if simple
* readable panels
* inspectable system
* educational simulation feel
* compact lab-like interface

But visual inheritance does not authorize behavioral or architectural inheritance.

Visual polish must not outrank architecture, physics boundaries, and baseline verification.

---

14. Lesson 12 - Documentation must constrain implementation

Docs are useful only if they change what Codex and humans are allowed to do.

v3 docs should be:

* short enough to be read
* strict enough to constrain scope
* specific enough to prevent ambiguity
* operational enough to become prompts and acceptance checks

Do not create decorative documentation.

Every source document should define at least one of:

* authority
* boundary
* contract
* decision
* acceptance gate
* prompt constraint

If a document does none of these, it should not exist.

---

15. Lesson 13 - No one-shot AI rewrite

Large AI-generated rewrites are unsafe for this project.

Preferred workflow:

1. define source authority
2. define acceptance criteria
3. create scaffold
4. review tree
5. add physics kernel
6. run headless baseline
7. connect render
8. connect UI
9. verify again
10. polish only after the core is accepted

Each task must be small.

Each task must stop.

Each task must produce a report.

---

16. Lesson 14 - "Working" must be defined before work starts

A vague instruction like "make it work" is not acceptable.

Before implementation starts, "working" must mean:

* files created in the right root
* forbidden files not created
* inactive implementation not copied
* modules import cleanly
* headless baseline exists
* browser entry point loads
* physics does not import render/UI/camera/browser modules
* render/UI does not mutate physics directly
* acceptance criteria are checkable

If acceptance is not defined, implementation should not start.

---

17. Lesson 15 - Keep the system inspectable

v3 should remain small enough that a human can inspect:

* source tree
* simulation state
* physics step
* baseline output
* render loop
* UI bindings

The project should not hide behavior behind unnecessary frameworks, build systems, or abstractions in the early implementation.

Simple files are preferred until complexity is justified.

---

18. Lesson 16 - Review observed facts, not claims

A completion claim is not evidence.

Useful evidence:

* file tree
* file content
* import graph
* command output
* baseline report
* visible browser behavior after source and baseline checks

Weak evidence:

* "implemented"
* "tested"
* "looks fine"
* "should work"
* "probably okay"

Review must use precise statuses:

* ACCEPTED
* ACCEPTED WITH LIMITATIONS
* REJECTED
* DEFERRED
* NOT CHECKED

---

19. Lesson 17 - Visual polish requires regression audit

Visual polish can accidentally contaminate architecture even when physics baseline still passes.

After render/UI visual work, v3 must run a read-only regression audit that checks:

* headless baseline PASS
* syntax checks for browser modules
* renderer, UI, main, camera import boundaries
* absence of body mass, position, velocity, or acceleration mutation from presentation code
* manual browser QA through local HTTP
* visible console errors

Renderer-owned caches are allowed only if they are:

* presentation-only
* bounded in memory
* resettable
* absent from simulation bodies
* absent from state.simulation
* absent from the physics baseline path

Baseline PASS is necessary for visual tasks, but it is not sufficient.

Visual tasks also require browser evidence:

* bodies visible
* controls work
* selection works
* inspector updates
* visual caches reset correctly

Direct file:// loading can show static HTML while ES modules fail in Chrome.

Use a local HTTP server as the canonical browser preview path.

---

20. Lesson 18 - UI diagnostics need boundary checks

Baseline PASS is not enough for UI-derived diagnostics.

After inspector work, v3 must inspect UI mutation boundaries:

* UI must not import physics modules
* UI must not change physics constants
* UI must not assign to body mass, position, velocity, acceleration, visualRadius, or color
* derived diagnostics must not be stored into body or state
* selected body must remain driven by state.ui.selectedBodyId

Normalized diagnostics must be explicitly labeled.

Users must not be led to confuse normalized educational distance, speed, or mass with real astronomy.

Approximate orbital period should not be added unless a later task explicitly scopes the assumptions and wording.

Documentation must match runtime preset names.

The accepted runtime preset uses Sun, Inner, Second, Third, Fourth, and Outer, not real planet-name bodies.

---

21. Practical rule for v3

When uncertain, choose the option that preserves:

* source clarity
* physics/render separation
* headless verification
* smaller scope
* fewer files
* fewer implicit behaviors
* easier human review

Do not choose the option that merely looks more impressive.

---

21. Summary

v3 inherits these hard lessons:

* one active source set
* clean-room rebuild
* no implementation carryover
* physics independent from viewport/render/UI/camera
* headless invariant-based baseline
* Codex as executor only
* root confirmation before edits
* small initial implementation
* no undecided behavior modules
* visual inheritance only
* no browser-debug dependency as primary verification
* no one-shot AI rewrite
* acceptance before implementation
* observed evidence over completion claims
* visual polish requires read-only regression audit
* renderer-owned caches must be bounded, resettable, and absent from simulation state
* local HTTP is the reliable browser preview path

These lessons are active constraints for v3.
