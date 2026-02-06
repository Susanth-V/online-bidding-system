/* ================= ADMIN LOGIN ================= */
const ADMIN_USER = "preesuzz";
const ADMIN_PASS = "50sodaa";

function adminLogin() {
  if (
    adminUser.value === ADMIN_USER &&
    adminPass.value === ADMIN_PASS
  ) {
    localStorage.setItem("isAdmin", "true");
    window.location = "admin.html";
  } else alert("Invalid Admin Credentials");
}

/* ================= USER OTP LOGIN ================= */
let OTP;

function sendOTP() {
  OTP = Math.floor(100000 + Math.random() * 900000);
  msg.innerText = "OTP: " + OTP;
}

function verifyOTP() {
  if (otp.value == OTP) {
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push(email.value);
    localStorage.setItem("users", JSON.stringify(users));
    window.location = "user.html";
  } else alert("Invalid OTP");
}

/* ================= STORAGE ================= */
let bids = JSON.parse(localStorage.getItem("bids") || "{}");
let winners = {};

/* ================= BIDDING ================= */
function bid(type, u, p) {
  let user = document.getElementById(u).value;
  let price = Number(document.getElementById(p).value);
  if (!bids[type]) bids[type] = [];
  bids[type].push({ user, price });
  localStorage.setItem("bids", JSON.stringify(bids));
}

function bidMulti() {
  let score = Number(p4.value) + Number(pt4.value);
  if (!bids.multi) bids.multi = [];
  bids.multi.push({ user: u4.value, score });
  localStorage.setItem("bids", JSON.stringify(bids));
}

/* ================= TIMERS ================= */
function timer(id, sec, type) {
  let t = sec;
  let el = document.getElementById(id);
  let x = setInterval(() => {
    el.innerText = "Time: " + t;
    if (t-- <= 0) {
      clearInterval(x);
      declareWinner(type);
    }
  }, 1000);
}

function declareWinner(type) {
  let a = bids[type];
  if (!a || a.length === 0) return;

  if (type === "highest") winners[type] = a.sort((x,y)=>y.price-x.price)[0];
  if (type === "lowest") winners[type] = a.sort((x,y)=>x.price-y.price)[0];
  if (type === "second" && a.length>1) winners[type] = a.sort((x,y)=>y.price-x.price)[1];
  if (type === "multi") winners[type] = a.sort((x,y)=>y.score-x.score)[0];

  localStorage.setItem("winners", JSON.stringify(winners));
}

/* ================= INIT ================= */
if (location.pathname.includes("user")) {
  timer("t1", 120, "highest");
  timer("t2", 150, "lowest");
  timer("t3", 180, "second");
  timer("t4", 160, "multi");
}

if (location.pathname.includes("admin")) {
  if (localStorage.getItem("isAdmin") !== "true") {
    alert("Unauthorized");
    location.href = "index.html";
  }

  let users = JSON.parse(localStorage.getItem("users") || "[]");
  users.innerText = users.length;

  let b = JSON.parse(localStorage.getItem("bids") || "{}");
  let out = "";
  for (let k in b) {
    out += `\n${k.toUpperCase()}:\n`;
    b[k].forEach((x,i)=>out+=`${i+1}. ${x.user} → ${x.price ?? x.score}\n`);
  }
  bids.innerText = out || "No bids yet";

  let w = JSON.parse(localStorage.getItem("winners") || "{}");
  let win = "";
  for (let k in w)
    win += `${k.toUpperCase()} → ${w[k].user} (${w[k].price ?? w[k].score})\n`;
  winners.innerText = win || "Waiting for timers to finish";
}