// Waits for backend port then tests a DB-backed API endpoint
const net = require("net");
const fs = require("fs");
const http = require("http");

const LOG = "C:\\Users\\user\\Documents\\real---estate-main\\real---estate-main\\real-estate-app-main\\.vercel-tmp\\backend.log";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

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

function testLogin() {
  return new Promise((resolve) => {
    const body = JSON.stringify({ email: "healthcheck@test.com", password: "wrongpass" });
    const req = http.request(
      { host: "127.0.0.1", port: 5000, path: "/auth/login", method: "POST", headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) } },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve({ status: res.statusCode, data: data.slice(0, 200) }));
      }
    );
    req.on("error", (e) => resolve({ error: e.message }));
    req.setTimeout(15000, () => {
      req.destroy();
      resolve({ error: "timeout" });
    });
    req.end(body);
  });
}

(async () => {
  for (let i = 0; i < 15; i++) {
    if (await checkPort(5000)) break;
    await wait(2000);
  }
  console.log("Port 5000:", (await checkPort(5000)) ? "UP" : "DOWN");
  console.log("--- backend.log ---");
  try {
    console.log(fs.readFileSync(LOG, "utf8"));
  } catch (e) {
    console.log("(no log)");
  }
  const r = await testLogin();
  console.log("API /auth/login result:", JSON.stringify(r));
})();
