// Finds MongoDB service status via PowerShell
const { execSync } = require("child_process");
try {
  const out = execSync(
    'powershell -NoProfile -Command "Get-Service *mongo* | Select-Object Name,Status,DisplayName | ConvertTo-Json"',
    { encoding: "utf8" }
  );
  console.log("SERVICES:", out.trim() || "(none found)");
} catch (e) {
  console.log("SERVICE CHECK ERROR:", e.message);
}
try {
  const out2 = execSync(
    'powershell -NoProfile -Command "Get-Process mongod -ErrorAction SilentlyContinue | Select-Object Id,ProcessName | ConvertTo-Json"',
    { encoding: "utf8" }
  );
  console.log("MONGOD PROCESS:", out2.trim() || "(not running)");
} catch (e) {
  console.log("PROCESS CHECK ERROR:", e.message);
}
