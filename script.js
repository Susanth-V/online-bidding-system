if(!localStorage.getItem("accounts")){
localStorage.setItem("accounts",JSON.stringify([]));
}

/* ADMIN LOGIN */

function adminLogin(){

const user=document.getElementById("adminUser").value;
const pass=document.getElementById("adminPass").value;

if(user==="preesuzz" && pass==="50sodaa"){
window.location.href="admin.html";
}else{
alert("Invalid admin login");
}

}

/* OTP GENERATION */

function generateOTP(){

const username=document.getElementById("username").value.trim();
const email=document.getElementById("email").value.trim();

if(username==="" || email===""){
alert("Enter username and email");
return;
}

const otp=Math.floor(100000+Math.random()*900000);

localStorage.setItem("generatedOTP",otp);

alert("Your OTP: "+otp);

}

/* USER LOGIN */

function login(){

const username=document.getElementById("username").value.trim();
const password=document.getElementById("password").value;
const otp=document.getElementById("otp").value;

let accounts=JSON.parse(localStorage.getItem("accounts"));

let user=accounts.find(a=>a.username===username && a.role==="user");

if(user){

if(user.password!==password){
alert("Wrong password");
return;
}

localStorage.setItem("currentUser",username);

window.location.href="user.html";

return;

}

if(otp!==localStorage.getItem("generatedOTP")){
alert("Invalid OTP");
return;
}

accounts.push({username:username,password:"",role:"user"});

localStorage.setItem("accounts",JSON.stringify(accounts));

localStorage.setItem("currentUser",username);

window.location.href="user.html";

}

/* AUCTIONEER LOGIN */

function auctioneerLogin(){

const username=document.getElementById("auctioneerUser").value;
const password=document.getElementById("auctioneerPass").value;

let accounts=JSON.parse(localStorage.getItem("accounts"));

let user=accounts.find(a=>a.username===username && a.password===password && a.role==="auctioneer");

if(!user){
alert("Invalid login");
return;
}

window.location.href="auctioneer.html";

}

/* ADMIN CREATE USER */

function createUser(){

const username=document.getElementById("newUser").value;
const password=document.getElementById("newPass").value;
const role=document.getElementById("role").value;

let accounts=JSON.parse(localStorage.getItem("accounts"));

accounts.push({username,password,role});

localStorage.setItem("accounts",JSON.stringify(accounts));

alert("Account created");

}

/* ADMIN DELETE USER */

function deleteUser(){

const username=document.getElementById("deleteUserInput").value;

let accounts=JSON.parse(localStorage.getItem("accounts"));

accounts=accounts.filter(a=>a.username!==username);

localStorage.setItem("accounts",JSON.stringify(accounts));

alert("User removed");

}

/* START AUCTION */

function startAuction(){

const type=document.getElementById("auctionType").value;
const time=document.getElementById("auctionTime").value;

localStorage.setItem("auctionType",type);
localStorage.setItem("auctionRunning","true");
localStorage.setItem("auctionTime",time);
localStorage.setItem("bidHistory",JSON.stringify([]));

}

/* PLACE BID */

function placeBid(){

if(localStorage.getItem("auctionRunning")!=="true"){
alert("Auction not started");
return;
}

let bid=Number(document.getElementById("bidAmount").value);
let user=localStorage.getItem("currentUser");

let history=JSON.parse(localStorage.getItem("bidHistory"))||[];

history.push({user,bid});

localStorage.setItem("bidHistory",JSON.stringify(history));

updateWinner();

}

/* UPDATE WINNER */

function updateWinner(){

let type=localStorage.getItem("auctionType");
let history=JSON.parse(localStorage.getItem("bidHistory"))||[];

if(history.length===0) return;

let winner;

if(type==="high"){
winner=history.reduce((a,b)=>a.bid>b.bid?a:b);
}

if(type==="low"){
winner=history.reduce((a,b)=>a.bid<b.bid?a:b);
}

if(type==="second"){

let sorted=[...history].sort((a,b)=>b.bid-a.bid);

winner=sorted[1]||sorted[0];

}

localStorage.setItem("currentWinner",winner.user);

}

function updateUserPanel(){

let w=document.getElementById("userWinner");

if(w){
w.innerText=localStorage.getItem("currentWinner")||"None";
}

}

setInterval(updateUserPanel,2000);