// Attempts to start MongoDB:
// 1) Try running mongod.exe directly with its config
// 2) If that fails (permissions), trigger an elevated (UAC) service start
const { spawn, execSync } = require("child_process");
const net = require("net");

const MONGOD = "C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.exe";
const CFG = "C:\\Program Files\\MongoDB\\Server\\7.0\\bin\\mongod.cfg";

function checkPort(port) {
  return new Promise((resolve) => {
    const s = net.createConnection({ host: "127.0.0.1", port, timeout: 1500 });
    s.on("connect", () => {
      s.destroy();
      resolve(true);
    });
    const fail = () => {
      s.destroy();
      resolve(false);
    };
    s.on("error", fail);
    s.on("timeout", fail);
  });
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  // Attempt 1: direct mongod
  console.log("Attempt 1: launching mongod.exe directly...");
  const child = spawn(MONGOD, ["--config", CFG], { detached: true, stdio: "ignore" });
  child.unref();
  await wait(6000);
  if (await checkPort(27017)) {
    console.log("SUCCESS: MongoDB is UP on 27017 (direct mongod)");
    process.exit(0);
  }
  console.log("Direct launch failed (likely Program Files permissions).");

  // Attempt 2: elevated service start via UAC prompt
  console.log("Attempt 2: requesting elevated service start (UAC prompt will appear)...");
  try {
    execSync(
      "powershell -NoProfile -Command \"Start-Process powershell -Verb RunAs -Wait -ArgumentList '-NoProfile','-Command','Start-Service MongoDB'\"",
      { encoding: "utf8", timeout: 120000 }
    );
  } catch (e) {
    console.log("Elevation attempt error:", e.message.split("\n")[0]);
  }
  await wait(4000);
  if (await checkPort(27017)) {
    console.log("SUCCESS: MongoDB is UP on 27017 (service started via UAC)");
  } else {
    console.log("FAILED: MongoDB still DOWN. User action needed.");
  }
})();
