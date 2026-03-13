if(!localStorage.getItem("accounts")){
localStorage.setItem("accounts", JSON.stringify([]));
}

function adminLogin(){

const user=document.getElementById("adminUser").value;
const pass=document.getElementById("adminPass").value;

if(user==="preesuzz" && pass==="50sodaa"){
window.location.href="admin.html";
}else{
alert("Invalid admin login");
}

}

function generateOTP(){

const username=document.getElementById("username").value.trim();
const email=document.getElementById("email").value.trim();

if(username==="" || email===""){
alert("Enter username and email first");
return;
}

const otp=Math.floor(100000+Math.random()*900000);

localStorage.setItem("generatedOTP",otp);

alert("OTP: "+otp);

}

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

function auctioneerLogin(){

const username=document.getElementById("auctioneerUser").value;
const password=document.getElementById("auctioneerPass").value;

let accounts=JSON.parse(localStorage.getItem("accounts"));

let user=accounts.find(a=>a.username===username && a.password===password && a.role==="auctioneer");

if(!user){
alert("Invalid auctioneer login");
return;
}

window.location.href="auctioneer.html";

}

function createUser(){

const username=document.getElementById("newUser").value;
const password=document.getElementById("newPass").value;
const role=document.getElementById("role").value;

let accounts=JSON.parse(localStorage.getItem("accounts"));

accounts.push({username,password,role});

localStorage.setItem("accounts",JSON.stringify(accounts));

alert("Account created");

}

function deleteUser(){

const username=document.getElementById("deleteUserInput").value;

let accounts=JSON.parse(localStorage.getItem("accounts"));

accounts=accounts.filter(a=>a.username!==username);

localStorage.setItem("accounts",JSON.stringify(accounts));

alert("User removed");

}

function startAuction(){

const type=document.getElementById("auctionType").value;
const time=document.getElementById("auctionTime").value;

localStorage.setItem("auctionRunning","true");
localStorage.setItem("auctionType",type);
localStorage.setItem("auctionTime",time);
localStorage.setItem("bidHistory",JSON.stringify([]));

startTimer();

}

function startTimer(){

let time=Number(localStorage.getItem("auctionTime"));

let timer=setInterval(()=>{

time--;

if(time<=0){

clearInterval(timer);

localStorage.setItem("auctionRunning","false");

calculateWinner();

}

},1000);

}

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

winner=sorted[1] || sorted[0];

}

localStorage.setItem("currentWinner",winner.user);

}

function calculateWinner(){

updateWinner();

}

function updateUserPanel(){

const winner=document.getElementById("userWinner");

if(winner){
winner.innerText=localStorage.getItem("currentWinner") || "None";
}

}

setInterval(updateUserPanel,2000);