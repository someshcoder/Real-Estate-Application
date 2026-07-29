// Restarts backend: kills old PID, spawns fresh, verifies DB via API call
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const http = require("http");

const ROOT = "C:\\Users\\user\\Documents\\real---estate-main\\real---estate-main\\real-estate-app-main";
const BACKEND = path.join(ROOT, "real-estate-backend");
const LOG = path.join(ROOT, ".vercel-tmp", "backend.log");
const PIDF = path.join(ROOT, ".vercel-tmp", "backend.pid");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  // Kill old backend we started earlier
  try {
    const oldPid = parseInt(fs.readFileSync(PIDF, "utf8").trim(), 10);
    process.kill(oldPid);
    console.log("Old backend (PID " + oldPid + ") killed");
    await wait(1500);
  } catch (e) {
    console.log("Old backend kill:", e.message);
  }

  // Start fresh
  const out = fs.openSync(LOG, "w");
  const child = spawn(process.execPath, ["server.js"], {
    cwd: BACKEND,
    detached: true,
    stdio: ["ignore", out, out],
  });
  child.unref();
  fs.writeFileSync(PIDF, String(child.pid));
  console.log("New backend spawned, PID:", child.pid);
  await wait(6000);
  console.log("--- backend.log ---");
  try {
    console.log(fs.readFileSync(LOG, "utf8"));
  } catch (e) {
    console.log("(no log)");
  }

  // Verify a DB-backed endpoint (login with wrong creds => expect a JSON response, not a 500 DB error)
  const body = JSON.stringify({ email: "healthcheck@test.com", password: "wrongpass" });
  const req = http.request(
    { host: "127.0.0.1", port: 5000, path: "/auth/login", method: "POST", headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) } },
    (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => {
        console.log("API /auth/login status:", res.statusCode);
        console.log("API response:", data.slice(0, 200));
        process.exit(0);
      });
    }
  );
  req.on("error", (e) => {
    console.log("API error:", e.message);
    process.exit(1);
  });
  req.end(body);
})();
