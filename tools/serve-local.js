import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { spawn } from "node:child_process";

const HOST = "127.0.0.1";
const PORT = 4173;
const LOCAL_URL = `http://${HOST}:${PORT}/`;
const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OPEN_BROWSER = process.argv.includes("--open");
const BLOCKED_TOP_LEVEL_PATHS = new Set([".git", ".agents", ".codex"]);

const MIME_TYPES = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".ico", "image/x-icon"],
  [".txt", "text/plain; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"]
]);

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-store"
  });
  response.end(`${message}\n`);
}

function resolveRequestPath(requestUrl) {
  const rawPath = String(requestUrl ?? "/").split(/[?#]/)[0];
  let decodedRawPath;

  try {
    decodedRawPath = decodeURIComponent(rawPath);
  } catch {
    return { statusCode: 400, message: "Bad request" };
  }

  if (decodedRawPath.split(/[\\/]+/).includes("..")) {
    return { statusCode: 403, message: "Forbidden" };
  }

  const parsedUrl = new URL(requestUrl, LOCAL_URL);
  let pathname;

  try {
    pathname = decodeURIComponent(parsedUrl.pathname);
  } catch {
    return { statusCode: 400, message: "Bad request" };
  }

  if (pathname === "/") {
    pathname = "/index.html";
  }

  const requestPath = pathname.replace(/^\/+/, "");
  const topLevelPath = requestPath.split(/[\\/]/)[0];

  if (BLOCKED_TOP_LEVEL_PATHS.has(topLevelPath)) {
    return { statusCode: 403, message: "Forbidden" };
  }

  const filePath = resolve(PROJECT_ROOT, requestPath);
  const relativePath = relative(PROJECT_ROOT, filePath);

  if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
    return { statusCode: 403, message: "Forbidden" };
  }

  return { filePath };
}

async function serveFile(request, response) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    sendText(response, 405, "Method not allowed");
    return;
  }

  const resolvedRequest = resolveRequestPath(request.url ?? "/");

  if (resolvedRequest.statusCode) {
    sendText(response, resolvedRequest.statusCode, resolvedRequest.message);
    return;
  }

  try {
    const fileStats = await stat(resolvedRequest.filePath);

    if (!fileStats.isFile()) {
      sendText(response, 404, "Not found");
      return;
    }

    const contentType = MIME_TYPES.get(extname(resolvedRequest.filePath).toLowerCase()) ?? "application/octet-stream";
    response.writeHead(200, {
      "content-type": contentType,
      "cache-control": "no-store"
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    response.end(await readFile(resolvedRequest.filePath));
  } catch (error) {
    if (error?.code === "ENOENT" || error?.code === "ENOTDIR") {
      sendText(response, 404, "Not found");
      return;
    }

    console.error("Server error:", error);
    sendText(response, 500, "Internal server error");
  }
}

function openBrowser() {
  if (process.platform !== "win32") {
    console.log("Automatic browser opening is only configured for Windows.");
    return;
  }

  const opener = spawn("cmd", ["/c", "start", "", LOCAL_URL], {
    detached: true,
    stdio: "ignore"
  });
  opener.unref();
}

const server = createServer(serveFile);

server.listen(PORT, HOST, () => {
  console.log("Space Model Lab v3 local server");
  console.log(`Local URL: ${LOCAL_URL}`);
  console.log(`Project root: ${PROJECT_ROOT}`);
  console.log("Keep this terminal open while using the app.");

  if (OPEN_BROWSER) {
    openBrowser();
  }
});

server.on("error", (error) => {
  if (error?.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use on ${HOST}.`);
    console.error("Close the other local server or choose a different launch path.");
  } else {
    console.error("Unable to start local server:", error);
  }

  process.exitCode = 1;
});
