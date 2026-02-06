// ================= CONFIG =================
const ADMIN_USER = "preesuzz";
const ADMIN_PASS = "50shadesofdaa";

// ================= DATA =================
let auctions = JSON.parse(localStorage.getItem("auctions")) || [
  { id: 1, name: "Advertisement Rights (Highest Bid)", type: "highest", time: 120, bids: [] },
  { id: 2, name: "Road Construction Tender (Lowest Bid)", type: "lowest", time: 120, bids: [] },
  { id: 3, name: "Spectrum Allocation (Second Secret Bid)", type: "secret", time: 120, bids: [] },
  { id: 4, name: "EV Charging Station (Multi-variable)", type: "multi", time: 120, bids: [] }
];

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
if (userPanel) renderUser();

function renderUser() {
  userPanel.innerHTML = "";

  auctions.forEach(a => {
    let inputs = "";

    if (a.type !== "multi") {
      inputs = `<input id="price-${a.id}" type="number" placeholder="Price">`;
    } else {
      inputs = `
        <input id="price-${a.id}" type="number" placeholder="Price">
        <input id="points-${a.id}" type="number" placeholder="Points">
      `;
    }

    userPanel.innerHTML += `
      <div class="card">
        <h3>${a.name}</h3>
        <div class="timer">Time: ${a.time}s</div>
        ${inputs}
        <button onclick="placeBid(${a.id})">Submit Bid</button>
      </div>
    `;
  });
}

function placeBid(id) {
  const user = localStorage.getItem("currentUser");
  const auction = auctions.find(a => a.id === id);

  const price = +document.getElementById(`price-${id}`).value || 0;
  const pointsEl = document.getElementById(`points-${id}`);
  const points = pointsEl ? +pointsEl.value || 0 : 0;

  auction.bids.push({ user, price, points });
  localStorage.setItem("auctions", JSON.stringify(auctions));

  alert("Bid submitted");
}

// ================= ADMIN PANEL =================
const adminData = document.getElementById("adminData");
if (adminData) renderAdmin();

function renderAdmin() {
  let users = new Set();
  adminData.innerHTML = "";

  auctions.forEach(a => {
    a.bids.forEach(b => users.add(b.user));

    let winner = "—";

    if (a.type === "highest") {
      const w = a.bids.sort((x,y)=>y.price-x.price)[0];
      if (w) winner = `${w.user} (₹${w.price})`;
    }

    if (a.type === "lowest") {
      const w = a.bids.sort((x,y)=>x.price-y.price)[0];
      if (w) winner = `${w.user} (₹${w.price})`;
    }

    if (a.type === "secret") {
      const sorted = a.bids.sort((x,y)=>y.price-x.price);
      if (sorted[1]) winner = `${sorted[1].user} (₹${sorted[1].price})`;
    }

    if (a.type === "multi") {
      const w = a.bids.sort((x,y)=>(y.price+y.points)-(x.price+x.points))[0];
      if (w) winner = `${w.user} (Score: ${w.price+w.points})`;
    }

    adminData.innerHTML += `
      <div class="card">
        <h3>${a.name}</h3>
        <p><b>All Bids:</b></p>
        ${a.bids.map(b => `${b.user} → ₹${b.price}${a.type==="multi" ? " + "+b.points : ""}`).join("<br>")}
        <hr>
        <p><b>Winner:</b> ${winner}</p>
      </div>
    `;
  });

  document.getElementById("userCount").innerText = users.size;
}