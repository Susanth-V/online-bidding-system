/***********************
 ADMIN LOGIN LOGIC
***********************/
function adminLogin() {
  const user = document.getElementById("adminUser").value.trim();
  const pass = document.getElementById("adminPass").value.trim();

  if (user === "preesuzz" && pass === "50sodaa") {
    document.getElementById("adminUser").value = "";
    document.getElementById("adminPass").value = "";
    window.location.href = "admin.html";
  } else {
    alert("Invalid admin credentials");
  }
}

/***********************
 AUCTIONEER LOGIN
***********************/
function auctioneerLogin() {

  const user = document.getElementById("auctioneerUser").value.trim();
  const pass = document.getElementById("auctioneerPass").value.trim();

  if (user === "preesuzz" && pass === "50sodaa") {

    localStorage.setItem("auctioneer", "true");

    window.location.href = "user.html";

  } else {
    alert("Invalid auctioneer credentials");
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
 START AUCTION
***********************/
function startAuction(){

  localStorage.setItem("auctionRunning","true");
  localStorage.setItem("auctionTime",60);
  localStorage.setItem("highestBid",0);
  localStorage.setItem("currentWinner","");

  startTimer();
}

/***********************
 TIMER
***********************/
function startTimer(){

  let time=Number(localStorage.getItem("auctionTime"));

  const timer=document.getElementById("timer");
  const status=document.getElementById("auctionStatus");

  if(!timer) return;

  status.innerText="Auction Running";

  const interval=setInterval(function(){

    time--;

    timer.innerText=time+"s";

    if(time<=0){

      clearInterval(interval);

      localStorage.setItem("auctionRunning","false");

      timer.innerText="Auction Ended";
      status.innerText="Auction Finished";
    }

  },1000);
}

/***********************
 BID LOGIC
***********************/
function placeBid() {

  if(localStorage.getItem("auctionRunning")!=="true"){
    alert("Auction not running");
    return;
  }

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

  saveBidHistory(user,bid);

  bidInput.value = "";
  alert("Bid submitted successfully!");
}

/***********************
 STORE BID HISTORY
***********************/
function saveBidHistory(user,bid){

  let history = JSON.parse(localStorage.getItem("bidHistory")) || [];

  history.push({
    user:user,
    bid:bid,
    time:new Date().toLocaleTimeString()
  });

  localStorage.setItem("bidHistory",JSON.stringify(history));
}

/***********************
 LOAD BID HISTORY
***********************/
function loadBidHistory(){

  const table=document.getElementById("history");

  if(!table) return;

  const history=JSON.parse(localStorage.getItem("bidHistory")) || [];

  table.innerHTML="";

  history.forEach(function(item){

    const row=document.createElement("tr");

    row.innerHTML=
      "<td>"+item.user+"</td>"+
      "<td>"+item.bid+"</td>"+
      "<td>"+item.time+"</td>";

    table.appendChild(row);

  });
}

/***********************
 CREATE USER
***********************/
function createUser(){

  const user=document.getElementById("newUser").value;
  const pass=document.getElementById("newPass").value;
  const role=document.getElementById("role").value;

  let users=JSON.parse(localStorage.getItem("systemUsers")) || [];

  users.push({
    username:user,
    password:pass,
    role:role
  });

  localStorage.setItem("systemUsers",JSON.stringify(users));

  alert("User created");
}

/***********************
 DELETE USER
***********************/
function deleteUser(){

  const name=document.getElementById("deleteUserInput").value;

  let users=JSON.parse(localStorage.getItem("systemUsers")) || [];

  users = users.filter(function(u){
    return u.username !== name;
  });

  localStorage.setItem("systemUsers",JSON.stringify(users));

  alert("User deleted");
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

  if(localStorage.getItem("auctionRunning")==="true"){
    startTimer();
  }
};