// Starts frontend Vite dev server detached with logging
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = "C:\\Users\\user\\Documents\\real---estate-main\\real---estate-main\\real-estate-app-main";
const CLIENT = path.join(ROOT, "client");
const LOG = path.join(ROOT, ".vercel-tmp", "frontend.log");

const out = fs.openSync(LOG, "w");
const viteBin = path.join(CLIENT, "node_modules", "vite", "bin", "vite.js");
const child = spawn(process.execPath, [viteBin], {
  cwd: CLIENT,
  detached: true,
  stdio: ["ignore", out, out],
});
child.unref();
fs.writeFileSync(path.join(ROOT, ".vercel-tmp", "frontend.pid"), String(child.pid));
console.log("Frontend spawned, PID:", child.pid);
setTimeout(() => {
  console.log("--- frontend.log after 8s ---");
  try {
    console.log(fs.readFileSync(LOG, "utf8"));
  } catch (e) {
    console.log("(no log)");
  }
  process.exit(0);
}, 8000);
