const rialoWords = [
  "Rialo", "Mint", "Stake", "Vault", "Bridge", "Yield", "Earn", "Gasless", 
  "Reward", "Airdrop", "Node", "Protocol", "Swap", "Rialoverse", "Power",
  "Grail", "Rialonaut", "RialoHub", "Genesis", "Mainnet", "Onchain", 
  "Flow", "RialoFi", "BridgeX", "Merkle", "Key", "StakeX", "Rise", 
  "Launch", "Fuel", "Pulse", "Chain", "Layer", "Block", "Minted", 
  "Whale", "Flowkey", "Boost", "Edge", "VaultX", "Trade", "SwapX",
  "Surge", "Map", "Rift", "Aura", "Light", "Glow", "Root", "Nova", "Verse"
];

const web3Words = [
  "Blockchain", "DeFi", "Wallet", "NFT", "Layer2", "Staking", "Bridge",
  "Validator", "Consensus", "Contract", "Yield", "Stablecoin", "DAO",
  "DEX", "Swap", "Hash", "Metaverse", "Token", "Airdrop", "Mint", "Gas",
  "Node", "Liquidity", "Mainnet", "Onchain", "ZK", "Rollup", "BridgeX",
  "Vault", "Reward", "Solidity", "Rust", "Launchpad", "Key", "Stake",
  "Pulse", "Chain", "Block", "Minted", "Whale", "Boost", "Edge", "VaultX",
  "Trade", "Surge", "Map", "Aura", "Light", "Glow", "Nova", "Verse"
];

let words = [];
let currentWord = "";
let score = 0;
let time = 0;
let timerInterval;

const wordBox = document.getElementById("word-box");
const inputBox = document.getElementById("input-box");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const endScreen = document.getElementById("end-screen");
const finalScore = document.getElementById("final-score");

function startGame(selectedTime) {
  score = 0;
  time = selectedTime;
  words = shuffle([...rialoWords, ...web3Words]);
  inputBox.value = "";
  inputBox.disabled = false;
  endScreen.style.display = "none";
  inputBox.focus();
  scoreDisplay.textContent = score;
  timerDisplay.textContent = `${time}s`;
  nextWord();

  timerInterval = setInterval(() => {
    time--;
    timerDisplay.textContent = `${time}s`;
    if (time <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

function nextWord() {
  if (words.length === 0) words = shuffle([...rialoWords, ...web3Words]);
  currentWord = words.pop();
  wordBox.textContent = currentWord;
}

inputBox.addEventListener("input", () => {
  if (inputBox.value.trim() === currentWord) {
    score++;
    scoreDisplay.textContent = score;
    inputBox.value = "";
    nextWord();
  }
});

function endGame() {
  inputBox.disabled = true;
  endScreen.style.display = "block";
  finalScore.textContent = score;
}

function resetGame() {
  clearInterval(timerInterval);
  score = 0;
  timerDisplay.textContent = "0s";
  scoreDisplay.textContent = "0";
  inputBox.value = "";
  inputBox.disabled = true;
  wordBox.textContent = "";
  endScreen.style.display = "none";
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
