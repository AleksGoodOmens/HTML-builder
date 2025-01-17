const fs = require('fs');
const path = require('path');
const readLine = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath, {
  flags: 'a',
  encoding: 'utf8',
});

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '\n> ',
});

console.log('Hello! Type what do you want or (type "exit" for end)');
rl.prompt();

rl.on('line', (text) => {
  if (text.trim().toLowerCase() === 'exit') {
    console.log('Thanks for sharing');
    rl.close();
    return;
  }
  writeStream.write(text + '\n');
  console.log('Something else?');
  rl.prompt();
});

rl.on('SIGINT', () => {
  console.log('\nThanks for sharing');
  rl.close();
});

rl.on('close', () => {
  writeStream.end();
  process.exit(0);
});
