// ADMIN CREDENTIALS
const ADMIN_EMAIL = "admin@auction.com";
const ADMIN_OTP = "999999";

let bids = [];

// LOGIN FUNCTION
function login() {
  const email = document.getElementById("email").value;
  const otp = document.getElementById("otp").value;

  document.getElementById("loginBox").style.display = "none";

  // ✅ ADMIN CHECK FIRST
  if (email === ADMIN_EMAIL && otp === ADMIN_OTP) {
    document.getElementById("adminPanel").style.display = "block";
  } else {
    document.getElementById("userPanel").style.display = "block";
    loadUserBids(email);
  }
}

// LOAD USER BIDS UI
function loadUserBids(username) {
  const container = document.getElementById("bidContainer");

  container.innerHTML = `
    <div class="bidCard">
      <h3>Highest Bid</h3>
      <input type="number" id="highBid">
      <span id="timer1"></span>
      <button onclick="submitBid('${username}','Highest','highBid')">Submit</button>
    </div>

    <div class="bidCard">
      <h3>Lowest Bid</h3>
      <input type="number" id="lowBid">
      <span id="timer2"></span>
      <button onclick="submitBid('${username}','Lowest','lowBid')">Submit</button>
    </div>

    <div class="bidCard">
      <h3>Secret Bid</h3>
      <input type="number" id="secretBid">
      <span id="timer3"></span>
      <button onclick="submitBid('${username}','Secret','secretBid')">Submit</button>
    </div>

    <div class="bidCard">
      <h3>Multi-variable Bid (Price + Points)</h3>
      <input type="number" id="multiPrice" placeholder="Price">
      <input type="number" id="multiPoints" placeholder="Points">
      <span id="timer4"></span>
      <button onclick="submitMultiBid('${username}')">Submit</button>
    </div>
  `;

  startTimer("timer1", 30);
  startTimer("timer2", 30);
  startTimer("timer3", 30);
  startTimer("timer4", 30);
}

// TIMER
function startTimer(id, seconds) {
  let time = seconds;
  const el = document.getElementById(id);

  const interval = setInterval(() => {
    el.innerText = ` ⏳ ${time}s`;
    time--;
    if (time < 0) {
      clearInterval(interval);
      el.innerText = " Closed";
    }
  }, 1000);
}

// SUBMIT BID
function submitBid(user, type, inputId) {
  const value = document.getElementById(inputId).value;
  bids.push({ user, type, value: Number(value) });
  alert(type + " bid submitted");
}

// MULTI BID
function submitMultiBid(user) {
  const price = Number(document.getElementById("multiPrice").value);
  const points = Number(document.getElementById("multiPoints").value);
  bids.push({ user, type: "Multi", value: price + points });
  alert("Multi bid submitted");
}

// ADMIN – WINNER
function calculateWinner() {
  if (bids.length === 0) return;

  let winner = bids.reduce((a, b) => b.value > a.value ? b : a);

  document.getElementById("winnerBox").innerHTML = `
    <h3>Winner</h3>
    <p>User: ${winner.user}</p>
    <p>Winning Value: ${winner.value}</p>
  `;
}