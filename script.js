const rialoWords = [
  "Rialo","Bridge","Event","Action","Node","Relay","Trigger","Flow","Message","Data",
  "Layer","Connector","Stream","Link","BridgeNet","Sync","Pulse","Command","Echo","Signal",
  "Speed","Token","Orbit","Transit","Network","EventHub","Meta","Block","Route","Port",
  "EventKey","StreamLink","Pathway","Flash","Core","PulseNet","Switch","Connect","Anchor","Zero",
  "Beacon","RialoX","Loop","Portal","Edge","RouteX","Netlink","Chain","RelayNode","Snap"
];

const web3Words = [
  "Wallet","Smart","Contract","DeFi","NFT","DAO","Gas","Onchain","EVM","Bridge",
  "ZK","Layer2","Dapp","Stablecoin","Token","Yield","Swap","Ledger","Stake","Miner",
  "Node","RPC","Explorer","Vault","Rollup","WalletConnect","Hash","Signer","Transaction",
  "Mempool","Account","Decentralized","Network","Permissionless","Liquidity","Keypair","Seed","Airdrop","Faucet",
  "Mainnet","Testnet","Validator","Slashing","Gasless","BridgeRoute","ABI","Web3","OPCode","Gwei"
];

const words = [...rialoWords, ...web3Words];

let currentWord = "";
let score = 0;
let timeLeft = 0;
let timer = null;

const wordEl = document.getElementById("word");
const inputEl = document.getElementById("input");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

function setTime(seconds) {
  timeLeft = seconds;
  timeEl.textContent = `Time: ${timeLeft}`;
}

function getRandomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function displayNewWord() {
  currentWord = getRandomWord();
  wordEl.textContent = currentWord;
}

function startGame() {
  if (timeLeft === 0) setTime(30);
  score = 0;
  scoreEl.textContent = `Score: ${score}`;
  inputEl.value = "";
  inputEl.disabled = false;
  inputEl.focus();
  startBtn.style.display = "none";
  restartBtn.style.display = "none";
  displayNewWord();

  timer = setInterval(() => {
    timeLeft--;
    timeEl.textContent = `Time: ${timeLeft}`;
    if (timeLeft <= 0) endGame();
  }, 1000);

  inputEl.addEventListener("input", checkInput);
}

function checkInput() {
  if (inputEl.value.trim() === currentWord) {
    score++;
    scoreEl.textContent = `Score: ${score}`;
    inputEl.value = "";
    displayNewWord();
  }
}

function endGame() {
  clearInterval(timer);
  inputEl.disabled = true;
  wordEl.textContent = "Time's up!";
  restartBtn.style.display = "inline-block";
}

function restartGame() {
  inputEl.disabled = false;
  setTime(30);
  startGame();
}
