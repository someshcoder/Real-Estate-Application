// Checks system RAM and full mongod.log tail after restart marker
const os = require("os");
const fs = require("fs");
console.log("Total RAM (GB):", (os.totalmem() / 1024 / 1024 / 1024).toFixed(2));
console.log("Free RAM (GB):", (os.freemem() / 1024 / 1024 / 1024).toFixed(2));
const LOGP = "C:\\Program Files\\MongoDB\\Server\\7.0\\log\\mongod.log";
const data = fs.readFileSync(LOGP, "utf8");
const lines = data.trim().split("\n");
// find last SERVER RESTARTED marker
let idx = -1;
for (let i = lines.length - 1; i >= 0; i--) {
  if (lines[i].includes("SERVER RESTARTED")) {
    idx = i;
    break;
  }
}
console.log("--- log from last restart (" + (lines.length - idx) + " lines) ---");
lines.slice(idx).forEach((l) => {
  try {
    const j = JSON.parse(l);
    console.log(j.t && j.t.$date ? j.t.$date : "", j.s || "", j.msg || "", j.attr ? JSON.stringify(j.attr).slice(0, 300) : "");
  } catch (e) {
    console.log(l.slice(0, 300));
  }
});
