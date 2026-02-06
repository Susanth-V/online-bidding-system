/* ================= ADMIN LOGIN ================= */
const ADMIN_USER = "preesuzz";
const ADMIN_PASS = "50sodaa";

function adminLogin() {
  const u = document.getElementById("adminUser").value;
  const p = document.getElementById("adminPass").value;

  if (u === ADMIN_USER && p === ADMIN_PASS) {
    localStorage.setItem("isAdmin", "true");
    window.location = "admin.html";
  } else {
    alert("Invalid Admin Credentials");
  }
}

/* ================= PAGE PROTECTION ================= */
if (location.pathname.includes("admin")) {
  if (localStorage.getItem("isAdmin") !== "true") {
    alert("Unauthorized Access");
    window.location = "index.html";
  }
}

/* ================= USER OTP LOGIN ================= */
let OTP;

function sendOTP() {
  OTP = Math.floor(100000 + Math.random() * 900000);
  document.getElementById("msg").innerText = "OTP: " + OTP;
}

function verifyOTP() {
  if (document.getElementById("otp").value == OTP) {
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push(document.getElementById("email").value);
    localStorage.setItem("users", JSON.stringify(users));
    window.location = "user.html";
  } else {
    alert("Invalid OTP");
  }
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
  let user = u4.value;
  let score = Number(p4.value) + Number(pt4.value);
  if (!bids.multi) bids.multi = [];
  bids.multi.push({ user, score });
  localStorage.setItem("bids", JSON.stringify(bids));
}

/* ================= TIMERS ================= */
function timer(id, seconds, type) {
  let t = seconds;
  let el = document.getElementById(id);
  let x = setInterval(() => {
    el.innerText = "Time: " + t + "s";
    if (t-- <= 0) {
      clearInterval(x);
      declareWinner(type);
    }
  }, 1000);
}

function declareWinner(type) {
  let arr = bids[type];
  if (!arr) return;

  if (type === "highest") winners[type] = arr.sort((a, b) => b.price - a.price)[0];
  if (type === "lowest") winners[type] = arr.sort((a, b) => a.price - b.price)[0];
  if (type === "second") winners[type] = arr.sort((a, b) => b.price - a.price)[1];
  if (type === "multi") winners[type] = arr.sort((a, b) => b.score - a.score)[0];

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
  document.getElementById("users").innerText =
    JSON.parse(localStorage.getItem("users") || "[]").length;

  document.getElementById("bids").innerText =
    JSON.stringify(JSON.parse(localStorage.getItem("bids")), null, 2);

  document.getElementById("winners").innerText =
    JSON.stringify(JSON.parse(localStorage.getItem("winners")), null, 2);
}