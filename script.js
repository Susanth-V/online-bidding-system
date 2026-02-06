console.log("JS LOADED");

// ================= CONFIG =================
const ADMIN_USER = "preesuzz";
const ADMIN_PASS = "50shadesofdaa";

// ================= DATA INIT =================
let auctions = JSON.parse(localStorage.getItem("auctions"));

if (!auctions) {
  auctions = [
    { id: 1, name: "Antique Vase", time: 120, bids: [] },
    { id: 2, name: "Construction Tender", time: 150, bids: [] }
  ];
}

auctions.forEach(a => {
  if (!a.bids) a.bids = [];
  if (a.time === undefined) a.time = 120;
});

localStorage.setItem("auctions", JSON.stringify(auctions));

// ================= LOGIN =================
function login() {
  const u = username.value.trim();
  const p = password.value.trim();

  if (u === ADMIN_USER && p === ADMIN_PASS) {
    localStorage.setItem("role", "admin");
    location.href = "admin.html";
  } else if (u) {
    localStorage.setItem("currentUser", u);
    localStorage.setItem("role", "user");
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
    userPanel.innerHTML += `
      <div class="card">
        <h3>${a.name}</h3>
        <div class="timer" id="t-${a.id}">Time: ${a.time}s</div>

        <input id="hb-${a.id}" type="number" placeholder="Highest Bid (₹)">
        <input id="lb-${a.id}" type="number" placeholder="Lowest Bid (₹)">
        <input id="sb-${a.id}" type="number" placeholder="Secret Bid (₹)">
        <input id="mbp-${a.id}" type="number" placeholder="Multi Price (₹)">
        <input id="mbpt-${a.id}" type="number" placeholder="Points">

        <button onclick="placeBid(${a.id})">Submit Bids</button>
      </div>
    `;
  });
}

function placeBid(id) {
  const user = localStorage.getItem("currentUser");
  const auction = auctions.find(a => a.id === id);

  const bid = {
    user,
    highest: +document.getElementById(`hb-${id}`).value || null,
    lowest: +document.getElementById(`lb-${id}`).value || null,
    secret: +document.getElementById(`sb-${id}`).value || null,
    multi: {
      price: +document.getElementById(`mbp-${id}`).value || null,
      points: +document.getElementById(`mbpt-${id}`).value || null
    }
  };

  auction.bids.push(bid);
  localStorage.setItem("auctions", JSON.stringify(auctions));
  alert("Bids submitted");
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
  let users = new Set();
  adminData.innerHTML = "";

  auctions.forEach(a => {
    a.bids.forEach(b => users.add(b.user));

    const highest = a.bids.filter(b=>b.highest!=null).sort((a,b)=>b.highest-a.highest)[0];
    const lowest = a.bids.filter(b=>b.lowest!=null).sort((a,b)=>a.lowest-b.lowest)[0];
    const secretSorted = a.bids.filter(b=>b.secret!=null).sort((a,b)=>b.secret-a.secret);
    const secondSecret = secretSorted[1];
    const multi = a.bids.filter(b=>b.multi.price!=null)
      .sort((a,b)=> (b.multi.price+b.multi.points)-(a.multi.price+a.multi.points))[0];

    adminData.innerHTML += `
      <div class="card">
        <h3>${a.name}</h3>
        <p>Highest: ${highest ? highest.user+" ₹"+highest.highest : "—"}</p>
        <p>Lowest: ${lowest ? lowest.user+" ₹"+lowest.lowest : "—"}</p>
        <p>Second Secret: ${secondSecret ? secondSecret.user+" ₹"+secondSecret.secret : "—"}</p>
        <p>Multi-variable: ${multi ? multi.user+" ("+(multi.multi.price+multi.multi.points)+")" : "—"}</p>
      </div>
    `;
  });

  document.getElementById("userCount").innerText = users.size;
}