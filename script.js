/***********************
 ADMIN LOGIN
***********************/
function adminLogin() {

const user=document.getElementById("adminUser").value.trim();
const pass=document.getElementById("adminPass").value.trim();

if(user==="preesuzz" && pass==="50sodaa"){
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
window.location.href="auctioneer.html";
}else{
alert("Invalid auctioneer credentials");
}

}

/***********************
 USER LOGIN
***********************/
function login(){

const username=document.getElementById("username").value.trim();

if(!username){
alert("Enter username");
return;
}

let users=Number(localStorage.getItem("usersCount"))||0;

localStorage.setItem("usersCount",users+1);
localStorage.setItem("currentUser",username);
localStorage.setItem("algorithmComplexity","O(n)");

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
localStorage.setItem("auctionTime",time);
localStorage.setItem("auctionRunning","true");
localStorage.setItem("bidHistory",JSON.stringify([]));

startTimer();

}

/***********************
 TIMER
***********************/
function startTimer(){

let time=Number(localStorage.getItem("auctionTime"));
const timer=document.getElementById("timer");

if(!timer) return;

const interval=setInterval(()=>{

time--;

timer.innerText=time+"s";

if(time<=0){

clearInterval(interval);
localStorage.setItem("auctionRunning","false");

calculateWinner();

timer.innerText="Auction Ended";

}

},1000);

}

/***********************
 BID LOGIC
***********************/
function placeBid(){

if(localStorage.getItem("auctionRunning")!=="true"){
alert("Auction not running");
return;
}

const bidInput=document.getElementById("bidAmount");
const bid=Number(bidInput.value);
const user=localStorage.getItem("currentUser");

if(!bid || !user){
alert("Invalid bid");
return;
}

saveBidHistory(user,bid);

bidInput.value="";
alert("Bid placed");

}

/***********************
 SAVE HISTORY
***********************/
function saveBidHistory(user,bid){

let history=JSON.parse(localStorage.getItem("bidHistory"))||[];

history.push({user,bid});

localStorage.setItem("bidHistory",JSON.stringify(history));

}

/***********************
 LOAD HISTORY
***********************/
function loadAuctionHistory(){

const table=document.getElementById("auctionHistory");

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
 USER VIEW HISTORY
***********************/
function loadUserHistory(){

const table=document.getElementById("userHistory");

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
 CALCULATE WINNER
***********************/
function calculateWinner(){

const type=localStorage.getItem("auctionType");
const history=JSON.parse(localStorage.getItem("bidHistory"))||[];

if(history.length===0) return;

let winner;

if(type==="high"){
winner=history.reduce((a,b)=>a.bid>b.bid?a:b).user;
}

else if(type==="low"){
winner=history.reduce((a,b)=>a.bid<b.bid?a:b).user;
}

else if(type==="second"){
const sorted=[...history].sort((a,b)=>b.bid-a.bid);
winner=sorted.length>1?sorted[1].user:sorted[0].user;
}

else{
winner=history.reduce((a,b)=>a.bid>b.bid?a:b).user;
}

localStorage.setItem("currentWinner",winner);

}

/***********************
 REMOVE USER
***********************/
function auctioneerRemoveUser(){

const name=document.getElementById("removeUser").value;

let users=JSON.parse(localStorage.getItem("systemUsers"))||[];

users=users.filter(u=>u.username!==name);

localStorage.setItem("systemUsers",JSON.stringify(users));

alert("User removed");

}

/***********************
 UPDATE USER PANEL
***********************/
function updateUserPanel(){

const type=document.getElementById("userAuctionType");
const winner=document.getElementById("userWinner");

if(type) type.innerText=localStorage.getItem("auctionType")||"None";
if(winner) winner.innerText=localStorage.getItem("currentWinner")||"None";

loadUserHistory();

}

setInterval(updateUserPanel,2000);