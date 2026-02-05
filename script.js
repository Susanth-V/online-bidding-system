function userLogin() {
  const email = email.value;
  const pass = pass.value;

  if (!email || !pass) {
    showError("Fill all fields");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users") || "[]");
  if (!users.includes(email)) users.push(email);
  localStorage.setItem("users", JSON.stringify(users));
  localStorage.setItem("currentUser", email);
  window.location.href = "user-dashboard.html";
}

function adminLogin() {
  if (user.value === "preesuzz" && pass.value === "50sodaa") {
    window.location.href = "admin-dashboard.html";
  } else showError("Invalid credentials");
}

function showError(msg) {
  error.innerText = msg;
  error.style.color = "red";
}

function submitBid(type, values) {
  let bids = JSON.parse(localStorage.getItem("bids") || "[]");
  bids.push({
    user: localStorage.getItem("currentUser"),
    type, values,
    time: new Date().toLocaleString()
  });
  localStorage.setItem("bids", JSON.stringify(bids));
  alert("Bid submitted!");
}

function loadAdminStats() {
  users.innerText = JSON.parse(localStorage.getItem("users") || "[]").length;
  bids.innerText = JSON.parse(localStorage.getItem("bids") || "[]").length;
}

function loadCharts() {
  let data = JSON.parse(localStorage.getItem("bids") || "[]");
  let count = {highest:0, lowest:0, secret:0, multi:0};
  data.forEach(b => count[b.type]++);
  new Chart(bidChart, {
    type: "bar",
    data: {
      labels: Object.keys(count),
      datasets: [{data:Object.values(count), backgroundColor:["#0072ff","#00c6ff","#ff512f","#6a4c93"]}]
    }
  });
}

function startAuctionTimer(minutes) {
  let t = minutes * 60;
  setInterval(() => {
    let m = Math.floor(t/60), s = t%60;
    timer.innerText = `${m}:${s<10?"0"+s:s}`;
    if(t-- <= 0) timer.innerText="Auction Closed";
  },1000);
}