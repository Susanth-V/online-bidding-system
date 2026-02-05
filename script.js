/***********************
 USER OTP LOGIN
************************/
let generatedOTP = null;

function generateOTP() {
  const email = document.getElementById("email").value;

  if (!email) {
    showError("Enter email first");
    return;
  }

  generatedOTP = Math.floor(100000 + Math.random() * 900000);
  alert("Your OTP is: " + generatedOTP); // simulation

  localStorage.setItem("tempEmail", email);
}

function verifyOTP() {
  const otp = document.getElementById("otp").value;

  if (otp == generatedOTP) {
    const email = localStorage.getItem("tempEmail");

    let users = JSON.parse(localStorage.getItem("users") || "[]");
    if (!users.includes(email)) users.push(email);

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", email);

    window.location.href = "user-dashboard.html";
  } else {
    showError("Invalid OTP");
  }
}

/***********************
 ADMIN LOGIN
************************/
function adminLogin() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  if (user === "preesuzz" && pass === "50sodaa") {
    window.location.href = "admin-dashboard.html";
  } else {
    showError("Invalid admin credentials");
  }
}

/***********************
 ADMIN STATS
************************/
function loadAdminStats() {
  document.getElementById("users").innerText =
    JSON.parse(localStorage.getItem("users") || "[]").length;

  document.getElementById("bids").innerText =
    JSON.parse(localStorage.getItem("bids") || "[]").length;
}

/***********************
 COUNTDOWN TIMER
************************/
function startTimer() {
  let time = 300;
  const timer = document.getElementById("timer");

  setInterval(() => {
    let min = Math.floor(time / 60);
    let sec = time % 60;
    timer.innerText = `${min}:${sec < 10 ? "0" : ""}${sec}`;
    time--;
  }, 1000);
}

/***********************
 CHARTS
************************/
function loadCharts() {
  let bids = JSON.parse(localStorage.getItem("bids") || "[]");

  let counts = { highest: 0, lowest: 0, secret: 0, multi: 0 };

  bids.forEach(b => counts[b.type]++);

  new Chart(document.getElementById("bidChart"), {
    type: "bar",
    data: {
      labels: ["Highest", "Lowest", "Secret", "Multi"],
      datasets: [{
        label: "Bid Count",
        data: Object.values(counts)
      }]
    }
  });
}

/***********************
 ERROR
************************/
function showError(msg) {
  document.getElementById("error").innerText = msg;
}