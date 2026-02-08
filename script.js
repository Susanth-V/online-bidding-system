const ADMIN_USER = "preesuzz";
const ADMIN_PASS = "50sodaa";

let bids = JSON.parse(localStorage.getItem("bids") || "{}");
let users = JSON.parse(localStorage.getItem("users") || "[]");

// ---------- LOGIN ----------
function login() {
  const u = user.value;
  const p = pass.value;

  if (u === ADMIN_USER && p === ADMIN_PASS) {
    location.href = "admin.html";
  } else {
    users.push(u);
    localStorage.setItem("users", JSON.stringify(users));
    location.href = "user.html";
  }
}

// ---------- USER BIDS ----------
function placeBid(type) {
  if (!bids[type]) bids[type] = [];

  const name = document.getElementById(type[0] + "Name").value;
  const price = Number(document.getElementById(type[0] + "Price").value);

  bids[type].push({ name, price });
  localStorage.setItem("bids", JSON.stringify(bids));
  alert("Bid Placed");
}

function placeMulti() {
  if (!bids.multi) bids.multi = [];
  const name = mName.value;
  const score = Number(mPrice.value) + Number(mPoints.value);
  bids.multi.push({ name, score });
  localStorage.setItem("bids", JSON.stringify(bids));
  alert("Bid Placed");
}

// ---------- ADMIN PANEL ----------
if (location.pathname.includes("admin")) {
  document.getElementById("users").innerText = users.length;

  let result = "";
  for (let k in bids) {
    let winner;
    if (k === "lowest")
      winner = bids[k].sort((a,b)=>a.price-b.price)[0];
    else if (k === "multi")
      winner = bids[k].sort((a,b)=>b.score-a.score)[0];
    else
      winner = bids[k].sort((a,b)=>b.price-a.price)[0];

    if (winner)
      result += `${k.toUpperCase()} → ${winner.name}\n`;
  }
  document.getElementById("winners").innerText = result;
}