/******** ADMIN CREDENTIALS ********/
const ADMIN_USER = "preesuzz";
const ADMIN_PASS = "50sodaa";

/******** STORAGE ********/
let bids = JSON.parse(localStorage.getItem("bids")) || {
  highest: [],
  lowest: [],
  sealed: [],
  multi: []
};

/******** ADMIN LOGIN (FIXED) ********/
function adminLogin() {
  const username = document.getElementById("adminUser").value.trim();
  const password = document.getElementById("adminPass").value.trim();

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    localStorage.setItem("role", "admin");
    location.href = "admin.html";
  } else {
    alert("Invalid admin credentials");
  }
}

/******** USER OTP LOGIN ********/
function sendOTP() {
  const email = document.getElementById("userEmail").value;
  if (!email) return alert("Enter email");

  const otp = Math.floor(100000 + Math.random() * 900000);
  localStorage.setItem("otp", otp);
  alert("OTP (demo): " + otp);
}

function verifyOTP() {
  if (document.getElementById("otpInput").value === localStorage.getItem("otp")) {
    localStorage.setItem("role", "user");
    location.href = "user.html";
  } else alert("Wrong OTP");
}

/******** MESSAGE ********/
function showMsg(text, error=false) {
  const msg = document.getElementById("msg");
  msg.style.color = error ? "red" : "#00ff99";
  msg.innerText = text;
  setTimeout(() => msg.innerText = "", 3000);
}

/******** PLACE BIDS ********/
function placeBid(type, nameId, priceId) {
  const n = document.getElementById(nameId);
  const p = document.getElementById(priceId);

  if (!n.value || !p.value) return showMsg("Fill all fields", true);

  bids[type].push({ name: n.value, price: +p.value });
  localStorage.setItem("bids", JSON.stringify(bids));

  n.value = p.value = "";
  showMsg("Bid submitted successfully ✅");
}

function placeMultiBid() {
  if (!m_name.value || !m_price.value || !m_points.value)
    return showMsg("Fill all fields", true);

  bids.multi.push({
    name: m_name.value,
    price: +m_price.value,
    points: +m_points.value,
    score: +m_price.value + +m_points.value
  });

  localStorage.setItem("bids", JSON.stringify(bids));
  m_name.value = m_price.value = m_points.value = "";
  showMsg("Bid submitted successfully ✅");
}

/******** TIMERS ********/
function startTimer(id, sec) {
  const el = document.getElementById(id);
  if (!el) return;
  let t = sec;
  const i = setInterval(() => {
    el.innerText = `⏱ ${t}s`;
    if (--t < 0) {
      clearInterval(i);
      el.innerText = "Closed";
    }
  }, 1000);
}

startTimer("t_high",60);
startTimer("t_low",70);
startTimer("t_sealed",80);
startTimer("t_multi",90);

/******** ADMIN LOAD ********/
if (location.pathname.includes("admin")) {
  const winners = {
    Highest: bids.highest.sort((a,b)=>b.price-a.price)[0] || "No bids",
    Lowest: bids.lowest.sort((a,b)=>a.price-b.price)[0] || "No bids",
    Sealed: bids.sealed.length>1 ? bids.sealed.sort((a,b)=>b.price-a.price)[1] : "Insufficient bids",
    Multivariable: bids.multi.sort((a,b)=>b.score-a.score)[0] || "No bids"
  };

  const users = new Set(
    [].concat(bids.highest,bids.lowest,bids.sealed,bids.multi).map(b=>b.name)
  );

  document.getElementById("totalUsers").innerText = users.size;
  document.getElementById("winners").innerText =
    JSON.stringify(winners,null,2);
}