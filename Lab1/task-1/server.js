let udp = require("dgram");
let server = udp.createSocket("udp4");
let correctValues = [];
let counter = 0;

var startTime = new Date().getTime();
const getTime = () => new Date().getTime() - startTime;
const getAvgCorrect = () => {
  return correctValues.reduce((p, c) => p + c, 0) / correctValues.length;
};


const hostname = "127.0.0.1";
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

  correctValues.push(setSynchro.correction);
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
          } counter ${counter++} avg ${getAvgCorrect()}`
        );
      }
    }
  );
});


server.bind(port, hostname, () => {
  console.log("UDP-Server started on -- " + hostname + ":" + port);
});
