/***********************
 ADMIN LOGIN LOGIC
***********************/
function adminLogin() {
  const user = document.getElementById("adminUser").value.trim();
  const pass = document.getElementById("adminPass").value.trim();

  if (user === "preesuzz" && pass === "50sodaa") {
    // clear admin inputs
    document.getElementById("adminUser").value = "";
    document.getElementById("adminPass").value = "";

    window.location.href = "admin.html";
  } else {
    alert("Invalid admin credentials");
  }
}

/***********************
 USER LOGIN LOGIC
***********************/
function login() {
  const username = document.getElementById("username").value.trim();

  if (!username) {
    alert("Enter username");
    return;
  }

  let users = Number(localStorage.getItem("usersCount")) || 0;
  localStorage.setItem("usersCount", users + 1);

  localStorage.setItem("currentUser", username);
  localStorage.setItem("algorithmComplexity", "O(n)");

  document.getElementById("username").value = "";
  document.getElementById("email").value = "";
  document.getElementById("otp").value = "";

  window.location.href = "user.html";
}

/***********************
 BID LOGIC
***********************/
function placeBid() {
  const bidInput = document.getElementById("bidAmount");
  const bid = Number(bidInput.value);
  const user = localStorage.getItem("currentUser");

  if (!bid || !user) {
    alert("Invalid bid");
    return;
  }

  let highestBid = Number(localStorage.getItem("highestBid")) || 0;

  if (bid > highestBid) {
    localStorage.setItem("highestBid", bid);
    localStorage.setItem("currentWinner", user);
  }

  bidInput.value = "";
  alert("Bid submitted successfully!");
}

/***********************
 ADMIN DASHBOARD LOAD
***********************/
window.onload = function () {
  const users = document.getElementById("users");
  const winner = document.getElementById("winner");
  const complexity = document.getElementById("complexity");

  if (users) users.innerText = localStorage.getItem("usersCount") || 0;
  if (winner) winner.innerText = localStorage.getItem("currentWinner") || "None";
  if (complexity)
    complexity.innerText =
      localStorage.getItem("algorithmComplexity") || "O(n)";
};