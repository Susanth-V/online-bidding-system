/*******************
 ADMIN LOGIN
*******************/
function adminLogin() {
  const u = adminUser.value;
  const p = adminPass.value;

  if (u === "preesuzz" && p === "50sodaa")
    window.location = "admin.html";
  else
    alert("Wrong credentials");
}


/*******************
 OTP GENERATION
*******************/
let generatedOTP = "";

function generateOTP() {
  generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
  alert("Your OTP: " + generatedOTP); // demo purpose
}


/*******************
 USER LOGIN
*******************/
function login() {
  const name = username.value;
  const otp = otpInput.value;

  if (!name || otp !== generatedOTP) {
    alert("Invalid OTP or name");
    return;
  }

  let count = +localStorage.getItem("usersCount") || 0;
  localStorage.setItem("usersCount", count + 1);
  localStorage.setItem("currentUser", name);

  username.value = "";
  email.value = "";
  otpInput.value = "";

  window.location = "user.html";
}


/*******************
 BID LOGIC
*******************/
function submitBid(type) {

  const get = id => document.getElementById(id).value;

  let name, price, score;

  if (type === "highest") {
    name = get("hName");
    price = +get("hPrice");
  }
  else if (type === "lowest") {
    name = get("lName");
    price = +get("lPrice");
  }
  else if (type === "secret") {
    name = get("sName");
    price = +get("sPrice");
  }
  else {
    name = get("mName");
    price = +get("mPrice");
    score = +get("mPoints");
    price += score; // combine logic
  }

  let best = +localStorage.getItem("bestScore") || 0;

  if (price > best) {
    localStorage.setItem("bestScore", price);
    localStorage.setItem("currentWinner", name);
  }

  alert("Bid submitted");

  location.reload(); // refresh page
}


/*******************
 TIMERS
*******************/
function startTimer(id, seconds) {
  let t = seconds;
  const el = document.getElementById(id);

  if (!el) return;

  setInterval(() => {
    if (t > 0) {
      t--;
      el.innerText = t;
    }
  }, 1000);
}

window.onload = function () {

  // start timers
  startTimer("t1", 59);
  startTimer("t2", 69);
  startTimer("t3", 79);
  startTimer("t4", 89);

  // admin values
  if (users)
    users.innerText = localStorage.getItem("usersCount") || 0;

  if (winner)
    winner.innerText = localStorage.getItem("currentWinner") || "None";

  if (complexity)
    complexity.innerText = "O(n log n)";
};
