const udp = require("dgram");
const server = udp.createSocket("udp4");
const correctValuesServer = [];
let counterServer = 0;

const startTime = new Date().getTime();
const getTime = () => new Date().getTime() - startTime;
const getAvgCorrect = (values) =>
  values.reduce((p, c) => p + c, 0) / values.length;

const hostname = "172.22.128.1";
const port = 5000;

server.on("message", (msg, remoteInfo) => {
  const getSynchro = JSON.parse(msg.toString());

  if (getSynchro.command !== "SINC") {
    console.log(
      `client ${remoteInfo.address}:${remoteInfo.port} attempted to ` +
      `send message, but have invalid command`
    );
    return;
  }

  const setSynchro = {
    command: getSynchro.command,
    correction: getTime() - (getSynchro.currentValue ?? 0),
  };

  correctValuesServer.push(setSynchro.correction);
  server.send(
    JSON.stringify(setSynchro),
    remoteInfo.port,
    remoteInfo.address,
    (error) => {
      if (error) {
        console.error(
          `Error from client ${remoteInfo.address}:${remoteInfo.port} -- ${error.name}`,
          error.message
        );
      } else {
        console.log(
          `Received GETSYNCHRO from client ${remoteInfo.address}:${remoteInfo.port
          } counter ${counterServer++} avg ${getAvgCorrect(correctValuesServer)}`
        );
      }
    }
  );
});

server.bind(port, hostname, () => {
  console.log('server is starting')
})