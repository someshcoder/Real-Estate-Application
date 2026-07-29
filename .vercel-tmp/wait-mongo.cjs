// Waits up to 60s for MongoDB port 27017 to come up
const net = require("net");
function checkHost(host, port) {
  return new Promise((resolve) => {
    const s = net.createConnection({ host, port, timeout: 1500 });
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
  for (let i = 0; i < 20; i++) {
    if ((await checkHost("127.0.0.1", 27017)) || (await checkHost("::1", 27017))) {
      console.log("SUCCESS: MongoDB is UP on 27017");
      process.exit(0);
    }
    await wait(3000);
  }
  console.log("TIMEOUT: MongoDB still DOWN after 60s");
})();
