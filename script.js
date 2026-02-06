console.log("JS LOADED");

// ================= CONFIG =================
const ADMIN_USER = "preesuzz";
const ADMIN_PASS = "50shadesofdaa";

// ================= AUCTION DATA =================
let auctions = JSON.parse(localStorage.getItem("auctions"));

if (!auctions) {
  auctions = [
    {
      id: 1,
      title: "Advertisement Rights Auction",
      type: "highest",
      desc: "Highest Bid → Winner: Highest Price",
      time: 60,
      bids: [],
      ended: false
    },
    {
      id: 2,
      title: "Road Construction Tender",
      type: "lowest",
      desc: "Lowest Bid → Winner: Lowest Price",
      time: 60,
      bids: [],
      ended: false
    },
    {
      id: 3,
      title: "Spectrum Allocation",
      type: "secret",
      desc: "Second Secret Bid → Winner: Second Highest",
      time: 60,
      bids: [],
      ended: false
    },
    {
      id: 4,
      title: "EV Charging Station Contract",
      type: "multi",
      desc: "Multi-Variable → Score = Price + Points",
      time: 60,
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
if (userPanel) renderUser();

function renderUser() {
  userPanel.innerHTML = "";

  auctions.forEach(a => {
    let inputs = "";

    if (a.type !== "multi") {
      inputs = `<input type="number" id="price-${a.id}" placeholder="Enter Price (₹)">`;
    } else {
      inputs = `
        <input type="number" id="price-${a.id}" placeholder="Enter Price (₹)">
        <input type="number" id="points-${a.id}" placeholder="Enter Technical Points">
      `;
    }

    userPanel.innerHTML += `
      <div class="card">
        <h3>${a.title}</h3>
        <p>${a.desc}</p>

        <div class="timer" id="timer-${a.id}">Time: ${a.time}s</div>
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
  const price = +document.getElementById(`price-${id}`)?.value || 0;
  const points = +document.getElementById(`points-${id}`)?.value || 0;

  auction.bids.push({ user, price, points });
  localStorage.setItem("auctions", JSON.stringify(auctions));

  updateWinner(id);
}

// ================= WINNER LOGIC =================
function updateWinner(id) {
  const auction = auctions.find(a => a.id === id);
  let winner = "—";

  if (auction.type === "highest") {
    const w = auction.bids.sort((a,b)=>b.price-a.price)[0];
    if (w) winner = `${w.user} (₹${w.price})`;
  }

  if (auction.type === "lowest") {
    const w = auction.bids.sort((a,b)=>a.price-b.price)[0];
    if (w) winner = `${w.user} (₹${w.price})`;
  }

  if (auction.type === "secret") {
    const sorted = auction.bids.sort((a,b)=>b.price-a.price);
    if (sorted[1]) winner = `${sorted[1].user} (₹${sorted[1].price})`;
  }

  if (auction.type === "multi") {
    const w = auction.bids.sort(
      (a,b)=>(b.price+b.points)-(a.price+a.points)
    )[0];
    if (w) winner = `${w.user} (Score: ${w.price + w.points})`;
  }

  document.getElementById(`winner-${id}`).innerHTML =
    `<b>${auction.ended ? "Final Winner" : "Current Winner"}:</b> ${winner}`;
}

// ================= TIMER =================
setInterval(() => {
  auctions.forEach(a => {
    if (!a.ended && a.time > 0) {
      a.time--;
      document.getElementById(`timer-${a.id}`).innerText = `Time: ${a.time}s`;

      if (a.time === 0) {
        a.ended = true;
        document.getElementById(`btn-${a.id}`).disabled = true;
        updateWinner(a.id);
      }
    }
  });

  localStorage.setItem("auctions", JSON.stringify(auctions));
}, 1000);