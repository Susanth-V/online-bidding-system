console.log("JS LOADED");

// ================= CONFIG =================
const ADMIN_USER = "preesuzz";
const ADMIN_PASS = "50shadesofdaa";

// ================= DATA INIT (SAFE) =================
let auctions = JSON.parse(localStorage.getItem("auctions"));

if (!auctions) {
  auctions = [
    { id: 1, name: "Antique Vase", time: 120, bids: [] },
    { id: 2, name: "Construction Tender", time: 150, bids: [] }
  ];
} else {
  auctions.forEach(a => {
    if (a.time === undefined) a.time = 120;
    if (!a.bids) a.bids = [];
  });
}

localStorage.setItem("auctions", JSON.stringify(auctions));

// ================= LOGIN =================
function login() {
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();

  if (u === ADMIN_USER && p === ADMIN_PASS) {
    localStorage.setItem("role", "admin");
    location.href = "admin.html";
  } 
  else if (u !== "") {
    localStorage.setItem("currentUser", u);
    localStorage.setItem("role", "user");
    location.href = "user.html";
  } 
  else {
    document.getElementById("loginError").innerText = "Invalid login";
  }
}

// ================= USER PANEL =================
const userPanel = document.getElementById("userPanel");
if (userPanel) renderUser();

function renderUser() {
  userPanel.innerHTML = "";

  auctions.forEach(a => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${a.name}</h3>
      <div class="timer" id="t-${a.id}">Time: ${a.time}s</div>

      <input type="number" placeholder="Quantity" id="q-${a.id}">
      <input type="number" placeholder="Price per unit" id="p-${a.id}">

      <button onclick="placeBid(${a.id})">Submit Bid</button>
    `;

    userPanel.appendChild(card);
  });
}

// ================= PLACE BID =================
function placeBid(id) {
  const qty = Number(document.getElementById(`q-${id}`).value);
  const price = Number(document.getElementById(`p-${id}`).value);
  const user = localStorage.getItem("currentUser");

  if (!qty || !price) {
    alert("Enter valid bid values");
    return;
  }

  const auction = auctions.find(a => a.id === id);
  auction.bids.push({
    user,
    qty,
    price,
    total: qty * price
  });

  localStorage.setItem("auctions", JSON.stringify(auctions));
  alert("Bid placed successfully");
}

// ================= TIMER =================
setInterval(() => {
  auctions.forEach(a => {
    if (a.time > 0) a.time--;
    const t = document.getElementById(`t-${a.id}`);
    if (t) t.innerText = `Time: ${a.time}s`;
  });

  localStorage.setItem("auctions", JSON.stringify(auctions));
}, 1000);

// ================= ADMIN PANEL =================
const adminData = document.getElementById("adminData");
if (adminData) renderAdmin();

function renderAdmin() {
  adminData.innerHTML = "";

  auctions.forEach(a => {
    let winner = null;

    if (a.bids.length > 0) {
      winner = a.bids.reduce((max, b) => b.total > max.total ? b : max);
    }

    adminData.innerHTML += `
      <div class="card">
        <h3>${a.name}</h3>

        ${a.bids.map(b =>
          `<p>${b.user} → ₹${b.total}</p>`
        ).join("")}

        <hr>
        <strong>
          Winner:
          ${winner ? winner.user + " (₹" + winner.total + ")" : "No bids yet"}
        </strong>
      </div>
    `;
  });
}