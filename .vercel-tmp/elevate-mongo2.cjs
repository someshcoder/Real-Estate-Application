// Elevated MongoDB service start with error logging to a file we can read
const { execSync } = require("child_process");
const fs = require("fs");
const net = require("net");

const LOG = "C:\\Users\\user\\Documents\\real---estate-main\\real---estate-main\\real-estate-app-main\\.vercel-tmp\\mongo-elevated.log";

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
  try {
    fs.unlinkSync(LOG);
  } catch (e) { /* no old log */ }
  const innerCmd =
    "try { Start-Service MongoDB -ErrorAction Stop; 'SERVICE STARTED OK' | Out-File -FilePath '" +
    LOG +
    "' } catch { $_ | Out-String | Out-File -FilePath '" +
    LOG +
    "'; Get-Service MongoDB | Out-String | Out-File -FilePath '" +
    LOG +
    "' -Append }";
  const b64 = Buffer.from(innerCmd, "utf16le").toString("base64");
  console.log("UAC prompt should appear now — please click YES...");
  try {
    execSync(
      "powershell -NoProfile -Command \"Start-Process powershell -Verb RunAs -Wait -ArgumentList '-NoProfile','-EncodedCommand','" +
        b64 +
        "'\"",
      { encoding: "utf8", timeout: 120000 }
    );
  } catch (e) {
    console.log("Elevation error:", e.message.split("\n")[0]);
  }
  await wait(3000);
  try {
    console.log("--- ELEVATED LOG ---");
    console.log(fs.readFileSync(LOG, "utf8"));
  } catch (e) {
    console.log("(no log written — UAC likely denied)");
  }
  for (let i = 0; i < 5; i++) {
    if (await checkPort(27017)) {
      console.log("SUCCESS: MongoDB is UP on 27017");
      process.exit(0);
    }
    await wait(2000);
  }
  console.log("MongoDB still DOWN.");
})();
