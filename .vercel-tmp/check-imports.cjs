// Checks all relative imports in client/src for case-mismatches (Linux build killers)
const fs = require("fs");
const path = require("path");
const root = "client/src";
const files = [];
(function walk(d) {
  fs.readdirSync(d).forEach((f) => {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) {
      if (f !== "node_modules") walk(p);
    } else files.push(p);
  });
})(root);
const errs = [];
files
  .filter((f) => /\.(jsx?|js)$/.test(f))
  .forEach((f) => {
    const src = fs.readFileSync(f, "utf8");
    const re = /from\s+['"](\.[^'"]+)['"]/g;
    let m;
    while ((m = re.exec(src))) {
      const imp = m[1];
      const base = path.resolve(path.dirname(f), imp);
      const cands = [
        base,
        base + ".js",
        base + ".jsx",
        base + ".json",
        path.join(base, "index.js"),
        path.join(base, "index.jsx"),
      ];
      let found = null;
      for (const c of cands) {
        try {
          const dir = path.dirname(c);
          const name = path.basename(c);
          const real = fs.readdirSync(dir);
          if (real.includes(name)) {
            found = "exact";
            break;
          }
          const ci = real.find((r) => r.toLowerCase() === name.toLowerCase());
          if (ci) {
            found = "CASE-MISMATCH: imported '" + imp + "' -> actual file: '" + ci + "'";
            break;
          }
        } catch (e) {
          /* dir doesn't exist for this candidate */
        }
      }
      if (!found) errs.push(f + ": UNRESOLVED " + imp);
      else if (found !== "exact") errs.push(f + ": " + found);
    }
  });
console.log(errs.length ? errs.join("\n") : "ALL IMPORTS OK");
