// Starts backend server detached with logging
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = "C:\\Users\\user\\Documents\\real---estate-main\\real---estate-main\\real-estate-app-main";
const BACKEND = path.join(ROOT, "real-estate-backend");
const LOG = path.join(ROOT, ".vercel-tmp", "backend.log");

const out = fs.openSync(LOG, "w");
const child = spawn(process.execPath, ["server.js"], {
  cwd: BACKEND,
  detached: true,
  stdio: ["ignore", out, out],
});
child.unref();
fs.writeFileSync(path.join(ROOT, ".vercel-tmp", "backend.pid"), String(child.pid));
console.log("Backend spawned, PID:", child.pid);
setTimeout(() => {
  console.log("--- backend.log after 5s ---");
  try {
    console.log(fs.readFileSync(LOG, "utf8"));
  } catch (e) {
    console.log("(no log)");
  }
  process.exit(0);
}, 5000);
