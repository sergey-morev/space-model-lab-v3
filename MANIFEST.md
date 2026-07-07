MANIFEST.md - Space Model Lab v3

Status: ACTIVE CANONICAL MANIFEST
Project line: Space Model Lab v3
Mode: clean-room rebuild with visual inheritance
Source marker: SML-V3-CANONICAL
Date: 2026-06-23
Revision: 2026-07-05 recovery capsule sync

---

1. Purpose

This manifest defines the active source set for Space Model Lab v3.

It is a permanent project-control document.

It is not a temporary migration checklist.

It does not define a passing implementation phase.

It defines which documents, prompts, and future implementation files belong to the active v3 source tree.

If a file is not listed here, it is not active source.

---

2. Canonical rule

Space Model Lab v3 has one active source set.

The active source set uses the SML-V3-CANONICAL marker in the current working source collection.

The marker is a source-management label only.

Canonical repository paths do not include the marker.

Example:

Current source collection name:

SML-V3-CANONICAL PROJECT_SOURCE.md - Space Model Lab v3.txt

Canonical repository path:

PROJECT_SOURCE.md

---

3. Active root documents

The following root documents are active source.

PROJECT_SOURCE.md

Current source file:

SML-V3-CANONICAL PROJECT_SOURCE.md - Space Model Lab v3.txt

Canonical repository path:

PROJECT_SOURCE.md

Purpose:

Defines the project direction, source authority, rebuild rationale, scope boundaries, and Codex operating rule.

Status:

ACTIVE

---

MANIFEST.md

Current source file:

SML-V3-CANONICAL MANIFEST.md - Space Model Lab v3.txt

Canonical repository path:

MANIFEST.md

Purpose:

Defines the active source set and prevents source drift.

Status:

ACTIVE

---

4. Active documentation files

The following documentation files are active source.

DECISION_LOG.md

Current source file:

SML-V3-CANONICAL DECISION_LOG.md - Space Model Lab v3.txt

Canonical repository path:

docs/DECISION_LOG.md

Purpose:

Records accepted v3 project decisions.

Status:

ACTIVE

---

LESSONS_INHERITED.md

Current source file:

SML-V3-CANONICAL LESSONS_INHERITED.md - Space Model Lab v3.txt

Canonical repository path:

docs/LESSONS_INHERITED.md

Purpose:

Records operational lessons that constrain v3 implementation.

Status:

ACTIVE

---

PHYSICS_CONTRACT.md

Current source file:

SML-V3-CANONICAL PHYSICS_CONTRACT.md - Space Model Lab v3.txt

Canonical repository path:

docs/PHYSICS_CONTRACT.md

Purpose:

Defines the physics model, non-goals, baseline contract, and invariant checks.

Status:

ACTIVE

---

ARCHITECTURE.md

Current source file:

SML-V3-CANONICAL ARCHITECTURE.md - Space Model Lab v3.txt

Canonical repository path:

docs/ARCHITECTURE.md

Purpose:

Defines module boundaries, dependency rules, state ownership, and architectural constraints.

Status:

ACTIVE

---

ACCEPTANCE_CRITERIA.md

Current source file:

SML-V3-CANONICAL ACCEPTANCE_CRITERIA.md - Space Model Lab v3.txt

Canonical repository path:

docs/ACCEPTANCE_CRITERIA.md

Purpose:

Defines acceptance gates for source, architecture, physics, baseline, UI, render, and Codex output.

Status:

ACTIVE

---

5. Active prompt files

The following prompt files are active source when created.

codex_scaffold.md

Current source file:

SML-V3-CANONICAL codex_scaffold.md - Space Model Lab v3.txt

Canonical repository path:

prompts/codex_scaffold.md

Purpose:

Gives Codex the first scaffold task for the clean v3 source tree.

Status:

ACTIVE

Constraint:

This prompt must create the scaffold only. It must not implement extra product features, copy old code, or broaden scope.

---

codex_physics_kernel.md

Current source file:

Not created yet.

Canonical repository path:

prompts/codex_physics_kernel.md

Purpose:

Adds the minimal physics kernel after scaffold acceptance.

Status:

DEFERRED

---

codex_render_ui.md

Current source file:

Not created yet.

Canonical repository path:

prompts/codex_render_ui.md

Purpose:

Connects render and UI after physics kernel and headless baseline are accepted.

Status:

DEFERRED

---

6. Target repository structure

The intended clean repository structure is:

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

This structure is intentionally small.

No additional files should be created unless a later accepted decision or prompt explicitly authorizes them.

Deferred future prompt paths (approved names, not yet created):

* prompts/codex_physics_kernel.md
* prompts/codex_render_ui.md

These paths join the tree only when the corresponding prompt is approved and created.

Tool metadata directories such as .git/ and .agents/ may exist in the repository root. They are tool metadata, not source files, and are not part of the canonical tree.

---

7. Required implementation files

The following implementation files are expected in the clean source tree.

Runtime metadata

* package.json - minimal Node runtime metadata for ES module execution. It must not introduce dependencies, devDependencies, build tooling, framework tooling, or test tooling.

Recovery capsule

* 00_READ_FIRST.md - repo-local recovery checkpoint and read-first milestone summary. It points to canonical docs and does not replace them.

Local launch helpers

* tools/serve-local.js - no-dependency Node built-in local HTTP server for canonical browser preview at http://127.0.0.1:4173/.
* start-space-model-lab.bat - Windows launcher that starts the Node local server and opens the canonical browser URL.

Browser entry

* index.html
* styles.css
* src/main.js

Configuration and state

* src/config.js
* src/state.js

Physics

* src/physics/vector.js
* src/physics/gravity.js
* src/physics/integrator.js

Simulation

* src/simulation/presets.js
* src/simulation/reset.js
* src/simulation/step.js
* src/simulation/diagnostics.js

Render

* src/render/camera.js
* src/render/renderer.js

UI

* src/ui/controls.js

Development verification

* src/dev/baseline.js

---

8. Forbidden implementation files without future decision

The following files or modules must not be created unless a future accepted decision explicitly authorizes them.

* src/physics/collisions.js
* black-hole modules
* event-horizon modules
* wormhole modules
* real-ephemeris modules
* eclipse-prediction modules
* mission-planning modules
* 3D renderer modules
* Web Worker modules
* framework bootstrap files
* TypeScript configuration
* build-system configuration
* screenshot-baseline modules
* browser-automation baseline modules

Reason:

These imply future behavior, tooling, or scope that is not part of the active v3 foundation.

---

9. Active source constraints

All active v3 work must obey these constraints.

Source authority

Implementation follows active v3 source files only.

No inactive notes, old drafts, or abandoned prompts may define implementation behavior.

Clean implementation

Code must be implemented cleanly from the v3 source documents.

No legacy implementation carryover.

Physics boundary

Physics must not depend on:

* canvas
* viewport
* browser window
* devicePixelRatio
* camera zoom
* render scale
* CSS
* UI controls
* DOM

Baseline boundary

The baseline must run headlessly through Node.

Expected command:

node src/dev/baseline.js

The baseline must not import:

* renderer
* UI
* main browser loop
* DOM-only modules

Scope boundary

Do not add behavior because it seems obvious.

Do not add modules for undecided future behavior.

Do not create placeholder modules that invite premature implementation.

---

10. Current source collection rule

At the source-collection level, active files use the SML-V3-CANONICAL marker.

Current active source collection should contain only files that begin with SML-V3-CANONICAL.

If a file does not begin with SML-V3-CANONICAL, it is not active source in the current collection.

If an older marker remains beside a SML-V3-CANONICAL replacement, the older marked file must be removed.

This is a source-hygiene rule.

It is not a repository path rule.

---

11. File replacement rule

When replacing a source file:

1. create the new SML-V3-CANONICAL file
2. copy the full replacement content into it
3. verify the new file exists
4. remove the older marked version
5. keep only one active version of that canonical file

There must never be two active versions of the same canonical document.

---

12. Prompt rule

Codex prompts must be narrow.

Every Codex prompt must include:

* exact intended working directory
* root confirmation requirement
* stop-if-wrong-root instruction
* allowed files
* forbidden files
* explicit scope
* acceptance checks
* report requirements
* stop condition

Codex must not receive broad autonomous instructions.

Codex must not decide architecture.

Codex must not expand scope.

---

13. Review rule

Review must rely on observed facts.

Accepted evidence:

* file tree
* file content
* import boundaries
* baseline output
* explicit PASS/FAIL report
* visible browser behavior after source and baseline checks

Weak evidence:

* "looks good"
* "should work"
* "probably fine"
* "implemented"
* "tested" without showing what was tested

Use precise status labels:

* ACCEPTED
* ACCEPTED WITH LIMITATIONS
* REJECTED
* DEFERRED
* NOT CHECKED

---

14. Manifest maintenance

This manifest should change only when:

* a new canonical document is added
* a canonical document is removed
* a new prompt type is approved
* the target source tree changes
* a forbidden file becomes approved by explicit decision
* project source authority changes

Do not update this manifest for routine implementation details.

Do not turn this manifest into a progress log.

---

15. Current milestone state

Current accepted milestone:

* Task 7B - Release Capsule / Recovery Checkpoint

Original local Codex workspace used during v0 import:

* C:\Users\infor\Documents\Codex\2026-07-01\new-chat

This path is historical import context, not a universal project root.

The portable canonical project root is the checked-out GitHub repository root after clone or pull.

Current runtime posture:

* plain JavaScript modules
* no framework
* no dependencies
* no devDependencies
* no build system
* no TypeScript
* no browser automation baseline
* no new physics beyond accepted Newtonian v0
* current runtime preset uses generic educational bodies: Sun, Inner A, Inner B, Middle, Outer A, Outer B
* no-dependency Node local launcher accepted
* repo-local recovery capsule accepted

Current accepted browser preview path:

* start-space-model-lab.bat is the canonical Windows launch path
* tools/serve-local.js is the canonical Node local server
* http://127.0.0.1:4173/ is the accepted preview URL
* npm run preview is an alternate script path when npm is available
* direct file:// index.html is not the canonical acceptance path
* .exe packaging is not accepted in this milestone

Current accepted visual presentation:

* darker cockpit-style browser sandbox
* deterministic renderer-owned starfield
* renderer-owned bounded trails
* reset clears renderer presentation trails
* visual caches are not source files and are not stored in simulation state

Current accepted inspector posture:

* normalized-units disclaimer is visible in the inspector
* selected-body diagnostics are read-only UI display
* derived speed and distance diagnostics are not stored in bodies or state
* no approximate orbital period is accepted in the current inspector

---

16. Manifest decision

The active v3 source set is:

* 00_READ_FIRST.md as repo-local recovery checkpoint
* PROJECT_SOURCE.md
* MANIFEST.md
* docs/DECISION_LOG.md
* docs/LESSONS_INHERITED.md
* docs/PHYSICS_CONTRACT.md
* docs/ARCHITECTURE.md
* docs/ACCEPTANCE_CRITERIA.md
* prompts/codex_scaffold.md
* future approved prompts when created
* package.json as minimal Node runtime metadata
* tools/serve-local.js as the no-dependency local HTTP server
* start-space-model-lab.bat as the Windows launch helper
* implementation files under the approved repository structure

This manifest intentionally contains no archive list, no migration checklist, and no phase-specific completion target.
