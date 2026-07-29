// Checks MongoDB service state, start type, and log tail
const { execSync } = require("child_process");
const fs = require("fs");
try {
  const out = execSync('sc query MongoDB', { encoding: "utf8" });
  console.log("--- sc query ---");
  console.log(out);
} catch (e) {
  console.log("sc query error:", e.message.split("\n")[0]);
}
try {
  const out = execSync('sc qc MongoDB', { encoding: "utf8" });
  console.log("--- sc qc (config) ---");
  console.log(out);
} catch (e) {
  console.log("sc qc error:", e.message.split("\n")[0]);
}
const LOGP = "C:\\Program Files\\MongoDB\\Server\\7.0\\log\\mongod.log";
try {
  const data = fs.readFileSync(LOGP, "utf8");
  const lines = data.trim().split("\n");
  console.log("--- mongod.log last 15 lines ---");
  lines.slice(-15).forEach((l) => {
    try {
      const j = JSON.parse(l);
      console.log(j.t && j.t.$date ? j.t.$date : "", j.s || "", j.msg || "", j.attr ? JSON.stringify(j.attr).slice(0, 200) : "");
    } catch (e) {
      console.log(l.slice(0, 250));
    }
  });
} catch (e) {
  console.log("log read error:", e.message);
}
