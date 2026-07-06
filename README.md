# Space Model Lab v3

Space Model Lab v3 is both:

* an educational browser-based 2D Newtonian N-body sandbox
* a controlled multi-agent LLM development case study with reproducible baseline verification

Status: early v0 technical milestone. Physics v0, browser sandbox, visual polish, trails, starfield, local launcher, and educational inspector are accepted.

Current public docs-ready base before this README pass:

```text
c979f48b4b528a1dc81f7ee032cd891575024181
```

## Why This Is Reviewable

The project is small on purpose.

The value is not only the canvas demo. The repository is structured so reviewers can inspect the physics boundary, run a headless invariant baseline, and read the decision trail behind accepted changes.

Changes are governed through decision logs, human-in-the-loop approval, single-writer git discipline, commit packets, approval gates, and receipts with observed validation results.

The public review path is based on observed baseline verification, not trust in screenshots or claims.

## Run Locally

Node.js is required.

There are no dependencies, devDependencies, build step, or bundler.

Cross-platform local server:

```sh
node tools/serve-local.js
```

Windows launcher:

```bat
start-space-model-lab.bat
```

Alternative npm script:

```sh
npm run preview
```

Then open:

```text
http://127.0.0.1:4173/
```

Direct `file://` launch of `index.html` is not the canonical path for this ES-module app.

## Verify The Baseline

```sh
node src/dev/baseline.js
```

Accepted baseline metrics:

```text
final status: PASS
relative energy drift: 4.290851857533e-11
momentum drift: 7.808913380318e-20
relative angular momentum drift: 3.213114654476e-15
```

This baseline checks invariant behavior for the normalized educational N-body system. It is the main public proof that the project is not only a visual canvas demo.

The model uses normalized educational Newtonian N-body units. It is not real ephemeris data, NASA data, date-accurate astronomy, or real solar-system scale.

## How This Project Is Built

This repository was built through a gated multi-agent LLM workflow.

Roles are separated: architecture/review, PM/audit, and execution. The human PI approves commits explicitly. Before a commit, the execution agent reports a COMMIT PACKET with scope, changed files, validation, risk, diff stat, and proposed message. Accepted work returns a receipt with commit hash and validation results.

This discipline is observed in the repository through source documents, decision logs, commit history, and baseline output.

## For Reviewers

Suggested route:

1. Run the app locally.
2. Run the baseline.
3. Inspect the governance and architecture docs.

Read first:

* [00_READ_FIRST.md](00_READ_FIRST.md)
* [PROJECT_SOURCE.md](PROJECT_SOURCE.md)
* [MANIFEST.md](MANIFEST.md)
* [docs/DECISION_LOG.md](docs/DECISION_LOG.md)
* [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
* [docs/ACCEPTANCE_CRITERIA.md](docs/ACCEPTANCE_CRITERIA.md)
* [docs/PHYSICS_CONTRACT.md](docs/PHYSICS_CONTRACT.md)

Reviewer questions:

* Can you reproduce the baseline metrics?
* Are physics, simulation, render, and UI boundaries clear?
* Is the governance useful, or is it becoming process theater?
* Is this README sufficient to understand the project in 60 seconds?
* What should be the next public step: screenshot, GitHub Pages, tag, or feature?

## Static Hosting Note

The T9A static readiness audit found the project structurally compatible with future static hosting because paths are relative and JavaScript imports are case-clean.

GitHub Pages is not configured yet. No deployment decision is made by this README change.
