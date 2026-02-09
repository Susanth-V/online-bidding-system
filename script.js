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

/******** ADMIN LOGIN ********/
function adminLogin() {
  if (adminUser.value === ADMIN_USER && adminPass.value === ADMIN_PASS) {
    localStorage.setItem("role", "admin");
    location.href = "admin.html";
  } else alert("Invalid admin credentials");
}

/******** USER OTP LOGIN ********/
function sendOTP() {
  if (!userEmail.value) return alert("Enter email");
  const otp = Math.floor(100000 + Math.random() * 900000);
  localStorage.setItem("otp", otp);
  alert("OTP (demo): " + otp);
}

function verifyOTP() {
  if (otpInput.value === localStorage.getItem("otp")) {
    localStorage.setItem("role", "user");
    location.href = "user.html";
  } else alert("Wrong OTP");
}

/******** PLACE BIDS ********/
function placeBid(type, nameId, priceId) {
  const name = document.getElementById(nameId).value;
  const price = Number(document.getElementById(priceId).value);
  if (!name || !price) return alert("Fill all fields");

  bids[type].push({ name, price });
  localStorage.setItem("bids", JSON.stringify(bids));
  alert("Bid submitted");
}

function placeMultiBid() {
  const name = m_name.value;
  const price = Number(m_price.value);
  const points = Number(m_points.value);
  if (!name || !price || !points) return alert("Fill all fields");

  bids.multi.push({ name, price, points, score: price + points });
  localStorage.setItem("bids", JSON.stringify(bids));
  alert("Bid submitted");
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

startTimer("t_high", 60);
startTimer("t_low", 70);
startTimer("t_sealed", 80);
startTimer("t_multi", 90);

/******** ADMIN LOAD ********/
if (location.pathname.includes("admin")) {
  const winners = {
    highest: bids.highest.sort((a,b)=>b.price-a.price)[0],
    lowest: bids.lowest.sort((a,b)=>a.price-b.price)[0],
    sealed: bids.sealed.sort((a,b)=>b.price-a.price)[1],
    multi: bids.multi.sort((a,b)=>b.score-a.score)[0]
  };

  totalUsers.innerText =
    new Set(
      [].concat(
        bids.highest,bids.lowest,bids.sealed,bids.multi
      ).map(b=>b.name)
    ).size;

  allBids.innerText = JSON.stringify(bids, null, 2);
  winners.innerText = JSON.stringify(winners, null, 2);
}