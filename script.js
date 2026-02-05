/***********************
 USER LOGIN
************************/
function userLogin() {
  const email = document.getElementById("email")?.value;
  const pass = document.getElementById("pass")?.value;

  if (!email || !pass) {
    showError("Please enter all fields");
    return;
  }

  let users = JSON.parse(localStorage.getItem("users") || "[]");

  if (!users.includes(email)) {
    users.push(email);
    localStorage.setItem("users", JSON.stringify(users));
  }

  localStorage.setItem("currentUser", email);
  window.location.href = "user-dashboard.html";
}

/***********************
 ADMIN LOGIN
************************/
function adminLogin() {
  const user = document.getElementById("user")?.value;
  const pass = document.getElementById("pass")?.value;

  if (user === "preesuzz" && pass === "50sodaa") {
    localStorage.setItem("adminLoggedIn", "true");
    window.location.href = "admin-dashboard.html";
  } else {
    showError("Invalid admin credentials");
  }
}

/***********************
 ERROR DISPLAY
************************/
function showError(msg) {
  const err = document.getElementById("error");
  if (err) {
    err.innerText = msg;
    err.style.color = "red";
  }
}

/***********************
 BID HANDLING
************************/
function submitBid(type, values) {
  let bids = JSON.parse(localStorage.getItem("bids") || "[]");

  bids.push({
    user: localStorage.getItem("currentUser"),
    type: type,
    values: values,
    time: new Da