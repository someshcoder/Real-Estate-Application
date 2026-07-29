// Locates mongod.exe and its config file
const fs = require("fs");
const path = require("path");
const roots = ["C:\\Program Files\\MongoDB\\Server", "C:\\Program Files (x86)\\MongoDB\\Server"];
for (const root of roots) {
  try {
    for (const ver of fs.readdirSync(root)) {
      const bin = path.join(root, ver, "bin");
      try {
        const files = fs.readdirSync(bin);
        console.log("FOUND:", bin);
        console.log("  files:", files.filter((f) => /mongod/.test(f)).join(", "));
        const cfg = path.join(bin, "mongod.cfg");
        if (fs.existsSync(cfg)) {
          console.log("--- mongod.cfg ---");
          console.log(fs.readFileSync(cfg, "utf8"));
        }
      } catch (e) {
        /* no bin dir */
      }
    }
  } catch (e) {
    /* root doesn't exist */
  }
}
