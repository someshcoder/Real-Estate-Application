// Checks if backend (5000) and MongoDB (27017) are reachable
const net = require("net");

function checkHost(host, port) {
  return new Promise((resolve) => {
    const s = net.createConnection({ host, port, timeout: 2000 });
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

async function check(port, name) {
  const up = (await checkHost("127.0.0.1", port)) || (await checkHost("::1", port));
  console.log(name + " (port " + port + "): " + (up ? "UP" : "DOWN"));
  return up;
}

(async () => {
  await check(27017, "MongoDB");
  await check(5000, "Backend");
  await check(5173, "Frontend 5173");
  await check(5174, "Frontend 5174");
})();
