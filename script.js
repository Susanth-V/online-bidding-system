/***********************
 ADMIN LOGIN
***********************/
function adminLogin(){
const user=document.getElementById("adminUser").value.trim();
const pass=document.getElementById("adminPass").value.trim();

if(user==="preesuzz" && pass==="50sodaa"){
localStorage.setItem("isAdmin","true");
window.location.href="admin.html";
}else{
alert("Invalid admin credentials");
}
}

/***********************
 AUCTIONEER LOGIN
***********************/
function auctioneerLogin(){
const user=document.getElementById("auctioneerUser").value.trim();
const pass=document.getElementById("auctioneerPass").value.trim();

if(user==="preesuzz" && pass==="50sodaa"){
localStorage.setItem("isAuctioneer","true");
window.location.href="auctioneer.html";
}else{
alert("Invalid auctioneer credentials");
}
}

/***********************
 OTP
***********************/
function generateOTP(){
const otp=Math.floor(100000 + Math.random()*900000);
localStorage.setItem("generatedOTP",otp);
alert("Your OTP is: "+otp);
}

/***********************
 USER LOGIN
***********************/
function login(){
const username=document.getElementById("username").value.trim();
const enteredOTP=document.getElementById("otp").value;
const storedOTP=localStorage.getItem("generatedOTP");

if(!username){
alert("Enter username");
return;
}

if(enteredOTP!==storedOTP){
alert("Invalid OTP");
return;
}

localStorage.setItem("currentUser",username);
localStorage.setItem("isUser","true");

let users=Number(localStorage.getItem("usersCount"))||0;
localStorage.setItem("usersCount",users+1);

window.location.href="user.html";
}

/***********************
 START AUCTION
***********************/
function startAuctioneerAuction(){
const type=document.getElementById("auctionType").value;
const time=Number(document.getElementById("auctionTime").value);

if(!time){
alert("Enter auction time");
return;
}

localStorage.setItem("auctionType",type);
localStorage.setItem("auctionRunning","true");
localStorage.setItem("auctionTime",time);
localStorage.setItem("bidHistory",JSON.stringify([]));

startTimer();
}

/***********************
 TIMER
***********************/
function startTimer(){
let time=Number(localStorage.getItem("auctionTime"));
const timer=document.getElementById("timer");

const interval=setInterval(()=>{
time--;
if(timer) timer.innerText=time+"s";

if(time<=0){
clearInterval(interval);
localStorage.setItem("auctionRunning","false");
calculateWinner();
if(timer) timer.innerText="Ended";
}
},1000);
}

/***********************
 BID
***********************/
function placeBid(){
if(localStorage.getItem("auctionRunning")!=="true"){
alert("Auction not started");
return;
}

const bid=Number(document.getElementById("bidAmount").value);
const user=localStorage.getItem("currentUser");

let history=JSON.parse(localStorage.getItem("bidHistory"))||[];
history.push({user,bid});

localStorage.setItem("bidHistory",JSON.stringify(history));

updateWinnerLive();
}

/***********************
 WINNER
***********************/
function updateWinnerLive(){
const type=localStorage.getItem("auctionType");
const history=JSON.parse(localStorage.getItem("bidHistory"))||[];

if(history.length===0) return;

let winner;

if(type==="high") winner=history.reduce((a,b)=>a.bid>b.bid?a:b);
else if(type==="low") winner=history.reduce((a,b)=>a.bid<b.bid?a:b);
else{
const sorted=[...history].sort((a,b)=>b.bid-a.bid);
winner=sorted[1]||sorted[0];
}

localStorage.setItem("currentWinner",winner.user);
}

function calculateWinner(){
updateWinnerLive();
}

/***********************
 LOAD HISTORY
***********************/
function loadAuctionHistory(){
const table=document.getElementById("auctionHistory")||document.getElementById("history");
if(!table) return;

const history=JSON.parse(localStorage.getItem("bidHistory"))||[];

table.innerHTML="<tr><th>User</th><th>Bid</th></tr>";

history.forEach(b=>{
const row=document.createElement("tr");
row.innerHTML="<td>"+b.user+"</td><td>"+b.bid+"</td>";
table.appendChild(row);
});
}

/***********************
 USER PANEL UPDATE
***********************/
function updateUserPanel(){

const winner=document.getElementById("userWinner");
const type=document.getElementById("userAuctionType");
const status=document.getElementById("auctionStatus");

if(winner) winner.innerText=localStorage.getItem("currentWinner")||"None";
if(type) type.innerText=localStorage.getItem("auctionType")||"-";

if(status){
status.innerText = localStorage.getItem("auctionRunning")==="true"
? "Running"
: "Not Started";
}

loadAuctionHistory();
}

setInterval(updateUserPanel,2000);

/***********************
 ADMIN LOAD
***********************/
window.onload=function(){
const users=document.getElementById("users");
const winner=document.getElementById("winner");
const complexity=document.getElementById("complexity");

if(users) users.innerText=localStorage.getItem("usersCount")||0;
if(winner) winner.innerText=localStorage.getItem("currentWinner")||"None";
if(complexity) complexity.innerText="O(n)";
}