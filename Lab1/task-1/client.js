const dgram = require("dgram");
const Process = require("process");

const client = dgram.createSocket("udp4");

const hostname = "127.0.0.1";
const port = 5000;
const interval = (Process.argv[2] ?? 1) * 1000;
let correctValues = [];
let counter = 0;
console.log(`Time interval ${interval}`);

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

client.on("message", async (msg, _) => {
  const setSynchro = JSON.parse(msg.toString());
  if (setSynchro.command !== "SINC") {
    console.log(
      `client attempted to sync with server, but received wrong command on response`
    );
    return;
  }
  if (counter === 10) {
    console.log(`Max correct: ${Math.max.apply(null, correctValues)}`);
    console.log(`Min correct: ${Math.min.apply(null, correctValues)}`);

    console.log(
      `Avg correct: ${correctValues.reduce((p, c) => p + c, 0) / correctValues.length
      }`
    );
    await sleep(100000000);
  }

  correctValues.push(Number.parseInt(setSynchro.correction));

  console.log(`Received SET SYNCHRO from server`, setSynchro);
  if (counter == 0) {

    getSynchro.currentValue += setSynchro.correction + interval;

  }
  else {

    getSynchro.currentValue += setSynchro.correction;
  }
  console.log(`Clock client: ${getSynchro.currentValue}`);
  counter++;
  await sleep(interval);
  sendMessage(getSynchro);
});

sendMessage(getSynchro);
