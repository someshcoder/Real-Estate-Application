// Starts MongoDB service and reports status/errors
const { execSync } = require("child_process");
try {
  const out = execSync(
    'powershell -NoProfile -Command "Start-Service MongoDB; Start-Sleep -Seconds 3; (Get-Service MongoDB).Status"',
    { encoding: "utf8" }
  );
  console.log("RESULT:", out.trim());
} catch (e) {
  console.log("START ERROR:");
  console.log(e.stderr ? e.stderr.toString() : e.message);
}
