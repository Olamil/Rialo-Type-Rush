const wordEl = document.getElementById('word');
const inputEl = document.getElementById('input');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const endScreen = document.getElementById('end-screen');
const finalScore = document.getElementById('final-score');
const timeBtns = document.querySelectorAll('.time-btn');

let words = [
  // Rialo words (50)
  "Rialo","Bridge","Events","Smart","Flows","Node","Onchain","Trigger","Automation","Ecosystem",
  "Rialoverse","Mission","Logs","Board","Web3","Dashboard","AI","Oracles","Chain","Task",
  "Earn","Rewards","Game","RialoMap","Bot","Portal","Module","Level","Progress","Route",
  "Automate","BridgeNode","Flow","Quest","Zap","TriggerNode","Signals","Connect","Wallet","MissionLog",
  "Leaderboard","RialoBot","Execution","RialoTrigger","Action","RialoChain","RialoZone","AIFlow","BridgeFlow","ZapNode",
  
  // Web3 words (50)
  "Blockchain","Wallet","DeFi","NFT","DAO","Token","Crypto","Web3","Metaverse","SmartContract",
  "Layer1","Layer2","Bridge","Gas","Validator","Staking","DEX","Onchain","Airdrop","Mining",
  "Hash","WalletConnect","Liquidity","DEX","RPC","Node","Address","PrivateKey","Security","Governance",
  "Interoperability","Transaction","Protocol","Vault","Aggregator","Lending","Borrow","StakingPool","Rewards","DApp",
  "Bridge","Crosschain","APY","Yield","BridgeProtocol","StakingNode","GovernanceToken","ZK","Rollup","Interchain"
];

let time = 0;
let score = 0;
let timer;
let gameRunning = false;

function randomWord() {
  return words[Math.floor(Math.random() * words.length)];
}

function startGame(selectedTime) {
  time = selectedTime;
  score = 0;
  gameRunning = true;
  startBtn.classList.add('hidden');
  endScreen.classList.add('hidden');
  inputEl.value = '';
  inputEl.focus();
  scoreEl.textContent = score;
  timeEl.textContent = time;
  wordEl.textContent = randomWord();

  timer = setInterval(() => {
    time--;
    timeEl.textContent = time;
    if (time === 0) endGame();
  }, 1000);
}

function checkInput() {
  if (inputEl.value.trim() === wordEl.textContent) {
    score++;
    scoreEl.textContent = score;
    inputEl.value = '';
    wordEl.textContent = randomWord();
  }
}

function endGame() {
  clearInterval(timer);
  gameRunning = false;
  finalScore.textContent = score;
  endScreen.classList.remove('hidden');
  startBtn.classList.remove('hidden');
}

inputEl.addEventListener('input', checkInput);

timeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const selected = parseInt(btn.getAttribute('data-time'));
    startGame(selected);
  });
});

restartBtn.addEventListener('click', () => {
  endScreen.classList.add('hidden');
  startBtn.classList.remove('hidden');
});

startBtn.addEventListener('click', () => {
  inputEl.focus();
});
