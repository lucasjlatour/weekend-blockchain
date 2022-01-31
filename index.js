/* eslint-disable strict */
const Blockchain = require('./models/blockchain');
const Block = require('./models/block');
const TARGET_DIFFICULTY = BigInt('0x0' + 'F'.repeat(63));
const SHA256 = require('crypto-js/SHA256');
const fs = require('fs');
const x64Core = require('crypto-js/x64-core');
const { BlockList } = require('net');

const db = {
  blockchain: new Blockchain()
};


function getState() {
  fs.readFile('./state.json', 'utf8', (err, data) => {
    if (err) throw err;
    console.log(data);
  });
}

function commitState(str) {
  fs.writeFile('./state.json', str, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
}

function mine() {
  const block = new Block();

  while(BigInt("0x" + block.hash()) >= TARGET_DIFFICULTY) {
    block.nonce++;
  }

  db.blockchain.addBlock(block);
  let newState  = JSON.stringify(db);
  commitState(newState);
  getState();
  console.log(`Just mined ${db.blockchain.blockHeight()} with a hash of ${block.hash()} and nonce ${block.nonce}`);
  setTimeout(mine, 5000);
}

mine();

