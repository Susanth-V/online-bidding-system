console.log("SMART CITY BIDDING SYSTEM LOADED");

// ================= ADMIN CONFIG =================
const ADMIN_USER = "preesuzz";
const ADMIN_PASS = "50shadesofdaa";

// ================= INITIAL DATA =================
let auctions = JSON.parse(localStorage.getItem("auctions"));

if (!auctions) {
  auctions = [
    {
      id: 1,
      title: "Advertisement Rights Auction",
      desc: "Highest Bid → Winner: Highest Price",
      type: "highest",
      time: randomTime(),
      bids: [],
      ended: false
    },
    {
      id: 2,
      title: "Road Construction Tender",
      desc: "Lowest Bid → Winner: Lowest Price",
      type: "lowest",
      time: randomTime(),
      bids: [],
      ended: false
    },
    {
      id: 3,
      title: "Spectrum Allocation",
      desc: "Second Secret Bid → Winner: Second Highest",
      type: "secret",
      time: randomTime(),
      bids: [],
      ended: false
    },
    {
      id: 4,
      title: "EV Charging Station Contract",
      desc: "Score = Price + Technical Points",
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
    userPanel.innerHTML += `
      <div class="card">
        <h3>${a.title}</h3>
        <p>${a.desc}</p>

        <div class="timer" id="timer-${a.id}">Time Left: ${a.time}s</div>
        <div id="winner-${a.id}"><b>Current Winner:</b> —</div>

        <input id="price-${a.id}" type="number" placeholder="Price (₹)">
        ${a.type === "multi"
          ? `<input id="points-${a.id}" type="number" placeholder="Technical Points">`
          : ""
        }

        <button id="btn-${a.id}" onclick="placeBid(${a.id})">Submit Bid</button>
      </div>
    `;
  });
}

// ================= PLACE BID =================
function placeBid(id) {
  const auction = auctions.find(a => a.id === id);
  if (auction.ended) return;

  const user = localStorage.getItem("currentUser");
  const price = +document.getElementById(`price-${id}`).value || 0;
  const points = +document.getElementById(`points-${id}`)?.value || 0;

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
    const s = [...a.bids].sort((x,y)=>y.price-x.price);
    return s[1] || null;
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

  document.getElementById(`winner-${id}`).innerHTML =
    `<b>${a.ended ? "Final Winner" : "Current Winner"}:</b> ${
      w ? w.user + " (" +
      (a.type === "multi"
        ? "Score: " + (w.price + w.points)
        : "₹" + w.price) + ")"
      : "—"
    }`;
}

// ================= TIMER =================
setInterval(() => {
  auctions.forEach(a => {
    if (!a.ended && a.time > 0) {
      a.time--;
      document.getElementById(`timer-${a.id}`).innerText =
        `Time Left: ${a.time}s`;

      if (a.time === 0) {
        a.ended = true;
        document.getElementById(`btn-${a.id}`).disabled = true;
        updateWinner(a.id);
      }
    }
  });
  localStorage.setItem("auctions", JSON.stringify(auctions));
}, 1000);

// ================= ADMIN PANEL =================
const adminData = document.getElementById("adminData");
if (adminData) renderAdmin();

function renderAdmin() {
  let users = new Set();
  adminData.innerHTML = "";

  auctions.forEach(a => {
    a.bids.forEach(b => users.add(b.user));
    const w = getWinner(a);

    adminData.innerHTML += `
      <div class="card">
        <h3>${a.title}</h3>

        <p><b>All Bids:</b></p>
        ${a.bids.map(b =>
          `${b.user} → ₹${b.price}` +
          (a.type === "multi" ? ` + ${b.points}` : "")
        ).join("<br>") || "No bids"}

        <hr>
        <p><b>Winner:</b> ${
          w ? w.user + " (" +
          (a.type === "multi"
            ? "Score: " + (w.price + w.points)
            : "₹" + w.price) + ")"
          : "—"
        }</p>
      </div>
    `;
  });

  document.getElementById("userCount").innerText = users.size;
}

// ================= UTIL =================
function randomTime() {
  return Math.floor(Math.random() * 61) + 60; // 60–120 sec
}