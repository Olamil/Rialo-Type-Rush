/* Rialo Type Rush — Phase 1
   - Typing game with Rialo/Web3 words
   - Timer, lives, score, streak
   - Local leaderboard (saved in localStorage)
   - Optional MetaMask wallet connect to tag scores
*/

// -------- config --------
const WORDS = [
  "bridge","datachain","event","trigger","wallet","decentralized","onboarding",
  "layer1","validator","mission","ecosystem","rialo","web3","transaction","hash",
  "smartcontract","quest","token","sign","integration","latency","sync","oracle"
];
const ROUND_WORD_COUNT = 20;   // words in one full run
const BASE_TIME = 4000;        // ms per word at baseline
const TIME_DECREASE = 60;      // decrease per correct streak
const POINTS = 10;
const LIVES_START = 3;
const LB_KEY = "rialo_type_rush_lb_v1";

// -------- DOM --------
const wordBox = document.getElementById("wordBox");
const input = document.getElementById("typeInput");
const timerBar = document.getElementById("timerBar");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const streakEl = document.getElementById("streak");
const message = document.getElementById("message");
const startBtn = document.getElementById("startBtn");
const skipBtn = document.getElementById("skipBtn");
const submitBtn = document.getElementById("submitBtn");
const leaderboardList = document.getElementById("leaderboardList");
const clearLbBtn = document.getElementById("clearLb");
const connectBtn = document.getElementById("connectBtn");
const addrEl = document.getElementById("addr");

// -------- state --------
let pool = [];
let current = "";
let timer = null;
let timeLeft = 0;
let roundCount = 0;
let score = 0;
let lives = LIVES_START;
let streak = 0;
let connectedAddr = null;

// -------- utils --------
const randFrom = (arr) => arr[Math.floor(Math.random()*arr.length)];
const fmtAddr = a => a ? (a.slice(0,6)+"..."+a.slice(-4)) : "";
const now = () => new Date().toLocaleString();

// -------- leaderboard --------
function loadLB(){ try { return JSON.parse(localStorage.getItem(LB_KEY) || "[]"); } catch(e){ return []; } }
function saveLB(lb){ localStorage.setItem(LB_KEY, JSON.stringify(lb)); }
function renderLB(){
  const lb = loadLB();
  if(!lb.length){ leaderboardList.innerHTML = '<div style="color:#89a6a2">No scores yet — play now.</div>'; return; }
  leaderboardList.innerHTML = lb.slice(0,10).map((r,i)=>`
    <div class="row">
      <div>${i+1}. <strong style="color:var(--accent)">${r.name||fmtAddr(r.wallet)||'anon'}</strong></div>
      <div>${r.score} pts • ${r.time}</div>
    </div>
  `).join("");
}

// -------- game actions --------
function resetRound(){
  pool = shuffleArray([...WORDS]);
  current = "";
  roundCount = 0;
  score = 0;
  lives = LIVES_START;
  streak = 0;
  updateHud();
  input.value = "";
  wordBox.textContent = "ready";
  timerBar.style.width = "100%";
  message.textContent = "Press Start to begin a fast Rialo typing run.";
  submitBtn.disabled = true;
}

function shuffleArray(a){ for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

function nextWord(){
  if(roundCount >= ROUND_WORD_COUNT || pool.length === 0){
    endGame();
    return;
  }
  current = pool.pop();
  roundCount++;
  wordBox.textContent = current;
  input.value = "";
  input.focus();
  startTimer(computeTime());
  skipBtn.disabled = false;
}

function computeTime(){
  // base time minus small amount per streak, bounded
  const t = Math.max(1200, BASE_TIME - (streak * TIME_DECREASE));
  return t;
}

function startTimer(ms){
  clearInterval(timer);
  const start = Date.now();
  timeLeft = ms;
  timerBar.style.width = "100%";
  timer = setInterval(()=>{
    const elapsed = Date.now() - start;
    const pct = Math.max(0, 1 - (elapsed / ms));
    timerBar.style.width = (pct*100) + "%";
    if(elapsed >= ms){
      clearInterval(timer);
      onWrong(true); // timeout
    }
  },60);
}

function onCorrect(){
  clearInterval(timer);
  streak++;
  score += POINTS + Math.floor(streak/3); // small streak bonus
  message.textContent = "Good! +" + (POINTS + Math.floor(streak/3)) + " pts";
  updateHud();
  if(roundCount >= ROUND_WORD_COUNT) endGame();
  else setTimeout(nextWord, 400);
}

function onWrong(timeout=false){
  clearInterval(timer);
  streak = 0;
  lives--;
  message.textContent = timeout ? "Time!" : "Wrong!";
  updateHud();
  if(lives <= 0) endGame();
  else setTimeout(nextWord, 600);
}

function updateHud(){
  scoreEl.textContent = `Score: ${score}`;
  livesEl.textContent = `Lives: ${lives}`;
  streakEl.textContent = `Streak: ${streak}`;
}

// called when run finishes or player dies
function endGame(){
  clearInterval(timer);
  input.blur();
  wordBox.textContent = "— run ended —";
  message.textContent = `Run finished — Score: ${score}. Submit to leaderboard.`;
  submitBtn.disabled = false;
  skipBtn.disabled = true;
}

// submit local score (tags with wallet if connected)
function submitScore(){
  const lb = loadLB();
  const entry = {
    wallet: connectedAddr || null,
    name: null,
    score,
    time: now()
  };
  lb.push(entry);
  lb.sort((a,b)=>b.score - a.score);
  saveLB(lb.slice(0,50));
  renderLB();
  submitBtn.disabled = true;
  message.textContent = "Score saved locally. Good job!";
}

// skip word (penalty)
function skipWord(){
  // penalty: lose points and break streak, move to next
  score = Math.max(0, score - Math.floor(POINTS/2));
  streak = 0;
  updateHud();
  message.textContent = "Skipped (-5 pts)";
  clearInterval(timer);
  setTimeout(nextWord, 300);
}

// -------- input handling --------
input.addEventListener("input", ()=>{
  const val = input.value.trim();
  if(!current) return;
  if(val.toLowerCase() === current.toLowerCase()){
    onCorrect();
  }
});

startBtn.addEventListener("click", ()=>{
  resetRound();
  pool = shuffleArray([...WORDS]).slice(0, ROUND_WORD_COUNT);
  nextWord();
  startBtn.disabled = true;
  skipBtn.disabled = false;
  submitBtn.disabled = true;
  message.textContent = "Type fast — words are Rialo & Web3 related.";
});

skipBtn.addEventListener("click", skipWord);
submitBtn.addEventListener("click", submitScore);
clearLbBtn.addEventListener("click", ()=>{
  if(!confirm("Clear local leaderboard?")) return;
  localStorage.removeItem(LB_KEY);
  renderLB();
});

// -------- wallet connect (simple MetaMask) --------
async function tryConnectWallet(){
  if(!window.ethereum){
    alert("No injected wallet found. Install MetaMask to connect.");
    return;
  }
  try{
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    connectedAddr = accounts[0];
    addrEl.textContent = fmtAddr(connectedAddr);
    addrEl.classList.remove("hidden");
    connectBtn.style.display = "none";
    message.textContent = "Wallet connected — you can tag scores with your address.";
  }catch(e){
    console.error(e);
    alert("Wallet connection failed.");
  }
}

connectBtn.addEventListener("click", tryConnectWallet);

// -------- init --------
(function init(){
  resetRound();
  renderLB();
  updateHud();
})();
