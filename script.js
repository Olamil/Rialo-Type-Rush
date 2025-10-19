const rialoWords = [
  "Rialo","Mint","Stake","Vault","Bridge","Yield","Earn","Gasless",
  "Reward","Airdrop","Node","Protocol","Swap","Rialoverse","Power",
  "Grail","Rialonaut","RialoHub","Genesis","Mainnet","Onchain",
  "Flow","RialoFi","BridgeX","Merkle","Key","StakeX","Rise",
  "Launch","Fuel","Pulse","Chain","Layer","Block","Minted",
  "Whale","Flowkey","Boost","Edge","VaultX","Trade","SwapX",
  "Surge","Map","Rift","Aura","Light","Glow","Root","Nova","Verse"
];

const web3Words = [
  "Blockchain","DeFi","Wallet","NFT","Layer2","Staking","Bridge",
  "Validator","Consensus","Contract","Yield","Stablecoin","DAO",
  "DEX","Swap","Hash","Metaverse","Token","Airdrop","Mint","Gas",
  "Node","Liquidity","Mainnet","Onchain","ZK","Rollup","BridgeX",
  "Vault","Reward","Solidity","Rust","Launchpad","Key","Stake",
  "Pulse","Chain","Block","Minted","Whale","Boost","Edge","VaultX",
  "Trade","Surge","Map","Aura","Light","Glow","Nova","Verse"
];

const wordsContainer = document.getElementById('words-container');
const endScreen = document.getElementById('end-screen');
const buttons = document.querySelectorAll('.timer-controls button');

let words = [];
let currentIndex = 0;
let timeLeft = 0;
let timer;
let started = false;
let inputBuffer = "";

function startGame(seconds) {
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  words = shuffle([...rialoWords, ...web3Words]);
  currentIndex = 0;
  timeLeft = seconds;
  inputBuffer = "";
  started = true;
  endScreen.style.display = 'none';
  renderWords();
  document.addEventListener('keydown', handleTyping);
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function endGame() {
  clearInterval(timer);
  started = false;
  endScreen.style.display = 'block';
  document.removeEventListener('keydown', handleTyping);
}

function renderWords() {
  wordsContainer.innerHTML = "";
  words.slice(0, 20).forEach((w, idx) => {
    const span = document.createElement('span');
    span.classList.add('word');
    if (idx === 0) span.classList.add('active');
    span.textContent = w;
    wordsContainer.appendChild(span);
  });
}

function handleTyping(e) {
  if (!started) return;

  if (e.key === " ") {
    checkWord();
    e.preventDefault();
  } else if (e.key === "Backspace") {
    inputBuffer = inputBuffer.slice(0, -1);
  } else if (e.key.length === 1) {
    inputBuffer += e.key;
  }
  highlight();
}

function checkWord() {
  const currentWord = words[currentIndex];
  const wordElement = wordsContainer.children[0];
  if (inputBuffer.trim() === currentWord) {
    wordElement.classList.add('correct');
  } else {
    wordElement.classList.add('incorrect');
  }
  inputBuffer = "";
  currentIndex++;
  words.shift();
  renderWords();
}

function highlight() {
  const currentWord = wordsContainer.children[0];
  const typed = inputBuffer;
  const correctPart = words[currentIndex].slice(0, typed.length);
  if (typed === correctPart) {
    currentWord.style.opacity = 1;
  } else {
    currentWord.style.opacity = 0.7;
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
