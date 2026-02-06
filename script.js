console.log("SMART CITY BIDDING SYSTEM LOADED");

// ================= ADMIN CONFIG =================
const ADMIN_USER = "preesuzz";
const ADMIN_PASS = "50shadesofdaa";

// ================= LOAD DATA =================
let auctions = JSON.parse(localStorage.getItem("auctions"));

if (!auctions) {
  auctions = [
    {
      id: 1,
      title: "Advertisement Rights Auction",
      desc: "Type: Highest Bid Wins",
      type: "highest",
      time: randomTime(),
      bids: [],
      ended: false
    },
    {
      id: 2,
      title: "Road Construction Tender",
      desc: "Type: Lowest Bid Wins",
      type: "lowest",
      time: randomTime(),
      bids: [],
      ended: false
    },
    {
      id: 3,
      title: "Spectrum Allocation",
      desc: "Type: Second Secret Bid Wins",
      type: "secret",
      time: randomTime(),
      bids: [],
      ended: false
    },
    {
      id: 4,
      title: "EV Charging Station Contract",
      desc: "Type: Multi-Variable (Price + Technical Points)",
      type: "multi",
      time: randomTime(),
      bids: [],
      ended: false
    }
  ];
}

localStorage.setItem("auctions", JSON.stringify(auctions));


// ================= LOGIN =================
function login() {
  const u = username.value.trim();
  const p = password.value.trim();

  if (u === ADMIN_USER && p === ADMIN_PASS) {
    location.href = "admin.html";
  } else if (u) {
    localStorage.setItem("currentUser", u);
    location.href = "user.html";
  } else {
    loginError.innerText = "Invalid Login";
  }
}


// ================= USER PANEL =================
const userPanel = document.getElementById("userPanel");
if (userPanel) renderUser();

function renderUser() {
  userPanel.innerHTML = "";

  auctions.forEach(a => {

    const multiInput =
      a.type === "multi"
        ? `<input id="points-${a.id}" type="number" placeholder="Technical Points">`
        : "";

    userPanel.innerHTML += `
      <div class="card">

        <h2>${a.title}</h2>
        <p><b>${a.desc}</b></p>

        <div class="timer" id="timer-${a.id}">
          Time Left: ${a.time}s
        </div>

        <div id="winner-${a.id}">
          <b>Current Winner:</b> —
        </div>

        <input id="price-${a.id}" type="number" placeholder="Enter Price (₹)">
        ${multiInput}

        <button id="btn-${a.id}" onclick="placeBid(${a.id})">
          Submit Bid
        </button>

      </div>
    `;

    updateWinner(a.id); // show winner immediately
  });
}


// ================= PLACE BID =================
function placeBid(id) {

  const auction = auctions.find(a => a.id === id);
  if (auction.ended) return alert("Auction Ended!");

  const user = localStorage.getItem("currentUser");

  const price = +document.getElementById(`price-${id}`).value;
  if (!price) return alert("Enter valid price");

  const points =
    auction.type === "multi"
      ? +document.getElementById(`points-${id}`).value || 0
      : 0;

  auction.bids.push({ user, price, points });

  localStorage.setItem("auctions", JSON.stringify(auctions));

  updateWinner(id);
}


// ================= WINNER LOGIC =================
function getWinner(a) {

  if (a.bids.length === 0) return null;

  if (a.type === "highest")
    return [...a.bids].sort((x,y)=>y.price-x.price)[0];

  if (a.type === "lowest")
    return [...a.bids].sort((x,y)=>x.price-y.price)[0];

  if (a.type === "secret") {
    const sorted = [...a.bids].sort((x,y)=>y.price-x.price);
    return sorted[1] || null;
  }

  if (a.type === "multi")
    return [...a.bids].sort(
      (x,y)=>(y.price+y.points)-(x.price+x.points)
    )[0];
}


// ================= UPDATE WINNER =================
function updateWinner(id) {

  const a = auctions.find(x => x.id === id);
  const w = getWinner(a);

  const winnerBox = document.getElementById(`winner-${id}`);
  if (!winnerBox) return;

  winnerBox.innerHTML =
    `<b>${a.ended ? "Final Winner" : "Current Winner"}:</b> ${
      w
        ? `${w.user} (${
            a.type === "multi"
              ? "Score: " + (w.price + w.points)
              : "₹" + w.price
          })`
        : "—"
    }`;
}


// ================= TIMER (LIVE) =================
setInterval(() => {

  auctions.forEach(a => {

    const timerEl = document.getElementById(`timer-${a.id}`);
    const btn = document.getElementById(`btn-${a.id}`);

    if (!timerEl) return;

    if (!a.ended && a.time > 0) {
      a.time--;
      timerEl.innerText = `Time Left: ${a.time}s`;
    }

    if (a.time <= 0 && !a.ended) {
      a.ended = true;
      btn.disabled = true;
      timerEl.innerText = "Auction Ended";
      updateWinner(a.id);
    }
  });

  localStorage.setItem("auctions", JSON.stringify(auctions));

}, 1000);


// ================= UTIL =================
function randomTime() {
  return Math.floor(Math.random() * 61) + 60; // 60–120s
}