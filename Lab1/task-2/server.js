const udp = require("dgram");
const server = udp.createSocket("udp4");
const { NtpTimeSync } = require("ntp-time-sync");
const timeSync = NtpTimeSync.getInstance({
  servers: ["ntp0.ntp-servers.net"],
});

const startTime = new Date().getTime();

const getTimeNtp = async () => {
  return await timeSync.getTime();
};

const hostname = "192.168.45.165";
const port = 5000;

server.on("message", async (msg, remoteInfo) => {
  const getSynchro = JSON.parse(msg.toString());
  if (getSynchro.command !== "SINC") {
    console.log(
      `client ${remoteInfo.address}:${remoteInfo.port} attempted to ` +
      `send message, but have invalid command`
    );
    return;
  }
  console.log(
    `Received GETSYNCHRO from client ${remoteInfo.address}:${remoteInfo.port}`
  );

  let realTime = await getTimeNtp();
  const setSynchro = {
    command: getSynchro.command,
    correction:
      realTime.offset -
      (getSynchro.currentValue ?? 0) +
      realTime.now.getTime() -
      startTime,
    realTime: realTime.now.getTime(),
  };

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
      }
    }
  );
});

server.bind(port, hostname, () => {
  console.log("UDP-Server started on -- " + hostname + ":" + port);
});
