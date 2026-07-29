// Runs vite in foreground for 15s to capture startup output/errors
const { spawn } = require("child_process");
const path = require("path");

const ROOT = "C:\\Users\\user\\Documents\\real---estate-main\\real---estate-main\\real-estate-app-main";
const CLIENT = path.join(ROOT, "client");
const viteBin = path.join(CLIENT, "node_modules", "vite", "bin", "vite.js");

const child = spawn(process.execPath, [viteBin], { cwd: CLIENT });
child.stdout.on("data", (d) => process.stdout.write(d));
child.stderr.on("data", (d) => process.stderr.write(d));
child.on("exit", (code, sig) => console.log("\n[vite exited] code=" + code + " sig=" + sig));
child.on("error", (e) => console.log("[spawn error]", e.message));

setTimeout(() => {
  console.log("\n[15s reached, killing debug vite]");
  child.kill();
  setTimeout(() => process.exit(0), 1000);
}, 15000);
