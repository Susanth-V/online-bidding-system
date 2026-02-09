/*****************
 ADMIN LOGIN
*****************/
function adminLogin() {
  if (adminUser.value === "preesuzz" && adminPass.value === "50sodaa")
    window.location = "admin.html";
  else
    alert("Invalid admin credentials");
}


/*****************
 OTP
*****************/
let generatedOTP = "";

function generateOTP() {
  generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
  alert("Your OTP: " + generatedOTP);
}


/*****************
 USER LOGIN
*****************/
function login() {
  if (otpInput.value !== generatedOTP) {
    alert("Wrong OTP");
    return;
  }

  let count = +localStorage.getItem("usersCount") || 0;
  localStorage.setItem("usersCount", count + 1);

  localStorage.setItem("currentUser", username.value);

  window.location = "user.html";
}


/*****************
 SUBMIT BID
*****************/
function submitBid(type) {

  const get = id => document.getElementById(id).value;

  let name = "";
  let score = 0;

  if (type === "highest") {
    name = get("hName");
    score = +get("hPrice");
  }
  else if (type === "lowest") {
    name = get("lName");
    score = 100000 - +get("lPrice"); // lowest wins
  }
  else if (type === "secret") {
    name = get("sName");
    score = +get("sPrice");
  }
  else {
    name = get("mName");
    score = +get("mPrice") + +get("mPoints");
  }

  const bestKey = "best_" + type;
  const winKey = "winner_" + type;

  let best = +localStorage.getItem(bestKey) || 0;

  if (score > best) {
    localStorage.setItem(bestKey, score);
    localStorage.setItem(winKey, name);
  }

  alert("Bid submitted!");
  location.reload();
}


/*****************
 TIMERS
*****************/
function startTimer(id, seconds) {
  let t = seconds;
  const el = document.getElementById(id);
  if (!el) return;

  setInterval(() => {
    if (t > 0) el.innerText = --t;
  }, 1000);
}


/*****************
 LOAD PAGE
*****************/
window.onload = function () {

  startTimer("t1", 59);
  startTimer("t2", 69);
  startTimer("t3", 79);
  startTimer("t4", 89);

  const types = ["highest","lowest","secret","multi"];

  types.forEach(t => {
    const el = document.getElementById("w_" + t);
    if (el) el.innerText = localStorage.getItem("winner_" + t) || "None";

    const adminEl = document.getElementById("winner_" + t);
    if (adminEl) adminEl.innerText = localStorage.getItem("winner_" + t) || "None";
  });

  if (users)
    users.innerText = localStorage.getItem("usersCount") || 0;
};
