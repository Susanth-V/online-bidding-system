console.log("SMART CITY BIDDING SYSTEM LOADED");

// ================= CONFIG =================
const ADMIN_USER = "preesuzz";
const ADMIN_PASS = "50shadesofdaa";

// ================= INIT DATA =================
let auctions = JSON.parse(localStorage.getItem("auctions"));

if (!auctions) {
  auctions = [
    {
      id: 1,
      title: "Advertisement Rights Auction",
      type: "highest",
      desc: "Highest Bid → Winner: Highest Price",
      time: Math.floor(Math.random() * 61) + 60,
      bids: [],
      ended: false
    },
    {
      id: 2,
      title: "Road Construction Tender",
      type: "lowest",
      desc: "Lowest Bid → Winner: Lowest Price",
      time: Math.floor(Math.random() * 61) + 60,
      bids: [],
      ended: false
    },
    {
      id: 3,
      title: "Spectrum Allocation",
      type: "secret",
      desc: "Second Secret Bid → Winner: Second Highest",
      time: Math.floor(Math.random() * 61) + 60,
      bids: [],
      ended: false
    },
    {
      id: 4,
      title: "EV Charging Station Contract",
      type: "multi",
      desc: "Score = Price + Technical Points",
      time: Math.floor(Math.random() * 61) + 60,
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
    loginError.innerText = "Invalid login";
  }
}

// ================= USER PANEL =================
const userPanel = document.getElementById("userPanel");
if (userPanel) renderUserPanel();

function renderUserPanel() {
  userPanel.innerHTML = "";

  auctions.forEach(a => {
    let inputs = a.type === "multi"
      ? `
        <input type="number" id="price-${a.id}" placeholder="Price (₹)">
        <input type="number" id="points-${a.id}" placeholder="Technical Points">
      `
      : `<input type="number" id="price-${a.id}" placeholder="Price (₹)">`;

    userPanel.innerHTML += `
      <div class="card">
        <h3>${a.title}</h3>
        <p>${a.desc}</p>

        <div class="timer" id="timer-${a.id}">Time Left: ${a.time}s</div>
        <div id="winner-${a.id}"><b>Current Winner:</b> —</div>

        ${inputs}

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

// ================= WINNER CALCULATION =================
function getWinner(a) {
  if (a.bids.length === 0) return null;

  if (a.type === "highest")
    return a.bids.sort((x,y)=>y.price-x.price)[0];

  if (a.type === "lowest")
    return a.bids.sort((x,y)=>x.price-y.price)[0];

  if (a.type === "secret") {
    const sorted = a.bids.sort((x,y)=>y.price-x.price);
    return sorted[1] || null;
  }

  if (a.type === "multi")
    return a.bids.sort(
      (x,y)=>(y.price+y.points)-(x.price+x.points)
    )[0];
}

// ================= UPDATE WINNER =================
function updateWinner(id) {
  const auction = auctions.find(a => a.id === id);
  const w = getWinner(auction);

  document.getElementById(`winner-${id}`).innerHTML =
    `<b>${auction.ended ? "Final Winner" : "Current Winner"}:</b> ${
      w ? w.user + " (" +
      (auction.type === "multi"
        ? "Score: " + (w.price + w.points)
        : "₹" + w.price) + ")" : "—"
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
if (adminData) renderAdminPanel();

function renderAdminPanel() {
  adminData.innerHTML = "";
  let users = new Set();

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
        ).join("<br>") || "No bids yet"}

        <hr>
        <p><b>Winner:</b> ${
          w ? w.user + " (" +
          (a.type === "multi"
            ? "Score: " + (w.price + w.points)
            : "₹" + w.price) + ")" : "—"
        }</p>
      </div>
    `;
  });

  document.getElementById("userCount").innerText = users.size;
}