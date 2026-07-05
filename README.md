# Space Model Lab v3

Space Model Lab v3 is a small browser-based 2D Newtonian gravity sandbox: a compact scientific cockpit for staged, inspectable implementation.

Status: early v0 technical milestone. Physics v0, browser sandbox, visual polish, trails, starfield, and educational inspector are accepted.

The model uses normalized educational Newtonian N-body units. It is not real ephemeris data, NASA data, date-accurate astronomy, or real solar-system scale.

Node.js is required.

There are no dependencies, devDependencies, build step, or bundler.

Recommended launch on Windows:

```bat
start-space-model-lab.bat
```

Alternative launch:

```sh
npm run preview
```

Then open:

```text
http://127.0.0.1:4173/
```

Direct `file://` launch of `index.html` is not the canonical path for this ES-module app.

Run the physics baseline with:

```sh
npm run baseline
```
