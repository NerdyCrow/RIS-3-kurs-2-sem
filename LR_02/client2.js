const { socket, initCA, enterCA, leaveCA, closeCA } = require("./api.js");
const { writeFileLines, readFileLines } = require("./api_dfs.js");

let ca = { status: "NO_INIT" };

socket.on("message", (msg, rinfo) => {
  ca.status = JSON.parse(msg.toString()).status;
});

let resource = "file2.txt";

ca = initCA("192.168.96.1", resource);

enterCA(ca)
  .then(() => {
    writeFileLines(resource, 10);
    readFileLines(resource, 10);
  })
  .then(() => leaveCA(ca))
  .then(() => closeCA(ca));
