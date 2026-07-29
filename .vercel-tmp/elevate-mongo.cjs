// Elevated MongoDB service start (shows UAC prompt - user must click Yes)
const { execSync } = require("child_process");
const net = require("net");

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
  console.log("UAC prompt should appear now — please click YES...");
  try {
    execSync(
      "powershell -NoProfile -Command \"Start-Process powershell -Verb RunAs -Wait -ArgumentList '-NoProfile','-Command','Start-Service MongoDB'\"",
      { encoding: "utf8", timeout: 120000 }
    );
  } catch (e) {
    console.log("Elevation error:", e.message.split("\n")[0]);
  }
  for (let i = 0; i < 10; i++) {
    await wait(2000);
    if (await checkPort(27017)) {
      console.log("SUCCESS: MongoDB is UP on 27017");
      process.exit(0);
    }
  }
  console.log("FAILED: MongoDB still DOWN.");
})();
