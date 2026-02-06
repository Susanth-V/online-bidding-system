console.log("JS LOADED");

// ================= LOGIN =================
function login() {
  const u = document.getElementById("username").value.trim();
  if (!u) return alert("Enter username");

  localStorage.setItem("currentUser", u);

  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (!users.includes(u)) users.push(u);
  localStorage.setItem("users", JSON.stringify(users));

  location.href = u === "admin" ? "admin.html" : "user.html";
}

// ================= AUCTION DATA =================
let auctions = JSON.parse(localStorage.getItem("auctions"));
if (!auctions) {
  auctions = [
    {
      id:1,
      title:"Advertisement Rights Auction",
      type:"highest",
      desc:"Highest Bid Wins",
      time: randTime(),
      bids:[]
    },
    {
      id:2,
      title:"Road Construction Tender",
      type:"lowest",
      desc:"Lowest Bid Wins",
      time: randTime(),
      bids:[]
    },
    {
      id:3,
      title:"Spectrum Allocation",
      type:"second",
      desc:"Second Highest Wins",
      time: randTime(),
      bids:[]
    },
    {
      id:4,
      title:"EV Charging Station Contract",
      type:"multi",
      desc:"Score = Price + Points",
      time: randTime(),
      bids:[]
    }
  ];
  localStorage.setItem("auctions", JSON.stringify(auctions));
}

// ================= USER PANEL =================
const userPanel = document.getElementById("userPanel");
if (userPanel) renderUser();

function renderUser() {
  userPanel.innerHTML = "";
  auctions.forEach(a => {
    const c = document.createElement("div");
    c.className = "card";

    c.innerHTML = `
      <h3>${a.title}</h3>
      <p>${a.desc}</p>
      <p><b>Time Left:</b> <span id="t-${a.id}">${a.time}</span>s</p>
      <p><b>Current Winner:</b> <span id="w-${a.id}">—</span></p>

      <input id="p-${a.id}" placeholder="Price">
      ${a.type==="multi" ? `<input id="pt-${a.id}" placeholder="Points">` : ""}
      <button onclick="bid(${a.id})">Submit Bid</button>
    `;
    userPanel.appendChild(c);
    updateWinner(a.id);
  });
}

// ================= BID LOGIC =================
function bid(id) {
  const a = auctions.find(x=>x.id===id);
  if (a.time <= 0) return alert("Bidding closed");

  const user = localStorage.getItem("currentUser");
  const price = Number(document.getElementById(`p-${id}`).value);
  const points = a.type==="multi"
      ? Number(document.getElementById(`pt-${id}`).value || 0)
      : 0;

  if (!price) return alert("Invalid bid");

  a.bids.push({user, price, points, score: price+points});
  save();
  updateWinner(id);
}

// ================= WINNER LOGIC =================
function updateWinner(id) {
  const a = auctions.find(x=>x.id===id);
  if (!a.bids.length) return;

  let win;
  if (a.type==="highest")
    win = a.bids.reduce((x,y)=> y.price>x.price?y:x);
  if (a.type==="lowest")
    win = a.bids.reduce((x,y)=> y.price<x.price?y:x);
  if (a.type==="second") {
    const s=[...a.bids].sort((a,b)=>b.price-a.price);
    win=s[1]||s[0];
  }
  if (a.type==="multi")
    win = a.bids.reduce((x,y)=> y.score>x.score?y:x);

  document.getElementById(`w-${id}`).innerText =
    `${win.user} (${win.price}${a.type==="multi" ? "+"+win.points : ""})`;
}

// ================= TIMER =================
setInterval(()=>{
  auctions.forEach(a=>{
    if (a.time>0) a.time--;
    const t=document.getElementById(`t-${a.id}`);
    if (t) t.innerText=a.time;
  });
  save();
},1000);

// ================= ADMIN PANEL =================
const adminPanel=document.getElementById("adminPanel");
if(adminPanel) renderAdmin();

function renderAdmin(){
  const users=JSON.parse(localStorage.getItem("users"))||[];
  document.getElementById("userCount").innerText=users.length;

  adminPanel.innerHTML="";
  auctions.forEach(a=>{
    adminPanel.innerHTML+=`
      <div class="card">
        <h3>${a.title}</h3>
        <p>Total Bids: ${a.bids.length}</p>
        <pre>${JSON.stringify(a.bids,null,2)}</pre>
      </div>`;
  });
}

// ================= UTIL =================
function save(){
  localStorage.setItem("auctions",JSON.stringify(auctions));
}
function randTime(){
  return Math.floor(Math.random()*60)+60;
}console.log("JS LOADED");

// ================= LOGIN =================
function login() {
  const u = document.getElementById("username").value.trim();
  if (!u) return alert("Enter username");

  localStorage.setItem("currentUser", u);

  let users = JSON.parse(localStorage.getItem("users")) || [];
  if (!users.includes(u)) users.push(u);
  localStorage.setItem("users", JSON.stringify(users));

  location.href = u === "admin" ? "admin.html" : "user.html";
}

// ================= AUCTION DATA =================
let auctions = JSON.parse(localStorage.getItem("auctions"));
if (!auctions) {
  auctions = [
    {
      id:1,
      title:"Advertisement Rights Auction",
      type:"highest",
      desc:"Highest Bid Wins",
      time: randTime(),
      bids:[]
    },
    {
      id:2,
      title:"Road Construction Tender",
      type:"lowest",
      desc:"Lowest Bid Wins",
      time: randTime(),
      bids:[]
    },
    {
      id:3,
      title:"Spectrum Allocation",
      type:"second",
      desc:"Second Highest Wins",
      time: randTime(),
      bids:[]
    },
    {
      id:4,
      title:"EV Charging Station Contract",
      type:"multi",
      desc:"Score = Price + Points",
      time: randTime(),
      bids:[]
    }
  ];
  localStorage.setItem("auctions", JSON.stringify(auctions));
}

// ================= USER PANEL =================
const userPanel = document.getElementById("userPanel");
if (userPanel) renderUser();

function renderUser() {
  userPanel.innerHTML = "";
  auctions.forEach(a => {
    const c = document.createElement("div");
    c.className = "card";

    c.innerHTML = `
      <h3>${a.title}</h3>
      <p>${a.desc}</p>
      <p><b>Time Left:</b> <span id="t-${a.id}">${a.time}</span>s</p>
      <p><b>Current Winner:</b> <span id="w-${a.id}">—</span></p>

      <input id="p-${a.id}" placeholder="Price">
      ${a.type==="multi" ? `<input id="pt-${a.id}" placeholder="Points">` : ""}
      <button onclick="bid(${a.id})">Submit Bid</button>
    `;
    userPanel.appendChild(c);
    updateWinner(a.id);
  });
}

// ================= BID LOGIC =================
function bid(id) {
  const a = auctions.find(x=>x.id===id);
  if (a.time <= 0) return alert("Bidding closed");

  const user = localStorage.getItem("currentUser");
  const price = Number(document.getElementById(`p-${id}`).value);
  const points = a.type==="multi"
      ? Number(document.getElementById(`pt-${id}`).value || 0)
      : 0;

  if (!price) return alert("Invalid bid");

  a.bids.push({user, price, points, score: price+points});
  save();
  updateWinner(id);
}

// ================= WINNER LOGIC =================
function updateWinner(id) {
  const a = auctions.find(x=>x.id===id);
  if (!a.bids.length) return;

  let win;
  if (a.type==="highest")
    win = a.bids.reduce((x,y)=> y.price>x.price?y:x);
  if (a.type==="lowest")
    win = a.bids.reduce((x,y)=> y.price<x.price?y:x);
  if (a.type==="second") {
    const s=[...a.bids].sort((a,b)=>b.price-a.price);
    win=s[1]||s[0];
  }
  if (a.type==="multi")
    win = a.bids.reduce((x,y)=> y.score>x.score?y:x);

  document.getElementById(`w-${id}`).innerText =
    `${win.user} (${win.price}${a.type==="multi" ? "+"+win.points : ""})`;
}

// ================= TIMER =================
setInterval(()=>{
  auctions.forEach(a=>{
    if (a.time>0) a.time--;
    const t=document.getElementById(`t-${a.id}`);
    if (t) t.innerText=a.time;
  });
  save();
},1000);

// ================= ADMIN PANEL =================
const adminPanel=document.getElementById("adminPanel");
if(adminPanel) renderAdmin();

function renderAdmin(){
  const users=JSON.parse(localStorage.getItem("users"))||[];
  document.getElementById("userCount").innerText=users.length;

  adminPanel.innerHTML="";
  auctions.forEach(a=>{
    adminPanel.innerHTML+=`
      <div class="card">
        <h3>${a.title}</h3>
        <p>Total Bids: ${a.bids.length}</p>
        <pre>${JSON.stringify(a.bids,null,2)}</pre>
      </div>`;
  });
}

// ================= UTIL =================
function save(){
  localStorage.setItem("auctions",JSON.stringify(auctions));
}
function randTime(){
  return Math.floor(Math.random()*60)+60;
}