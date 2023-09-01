const process = require("process");
const dgram = require("dgram");
const client = dgram.createSocket("udp4");

const hostname = "172.22.128.1";
const port = 5000;
let correctValues = [];
let counter = 0;
let OsTimes = [];

const sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));
const sendMessage = (message) =>
  client.send(JSON.stringify(message), port, hostname, (error) => {
    if (error) {
      console.error(`${error.name}, ${error.message}`);
      client.close();
    }
  });

const getSynchro = {
  command: "SINC",
  currentValue: 0,
};
const interval = (process.argv[2] ?? 1) * 1000;

client.on("message", async (msg, _) => {
  const setSynchro = JSON.parse(msg.toString());
  if (setSynchro.command !== "SINC") {
    console.log(
      `client attempted to sync with server, but received wrong command on response`
    );
    return;
  }

  if (counter === 3) {
    console.log(
      `Avg OSTIME: ${OsTimes.reduce((p, c) => p + c, 0) / OsTimes.length}`
    );
    console.log(
      `Avg correct: ${correctValues.reduce((p, c) => p + c, 0) / correctValues.length
      }`
    );
    await sleep(100000000);
  }

  counter++;
  console.log(`Received SETSYNCHRO from server`, setSynchro);
  getSynchro.currentValue =
    getSynchro.currentValue + setSynchro.correction + interval;
  console.log(`Clock client: ${getSynchro.currentValue}`);

  correctValues.push(Number.parseInt(setSynchro.correction));
  OsTimes.push(new Date().getTime() - setSynchro.realTime);
  console.log("Push: ", new Date().getTime() - setSynchro.realTime);

  await sleep(interval);
  sendMessage(getSynchro);
});
console.log(`Time interval ${interval}`);
sendMessage(getSynchro);
