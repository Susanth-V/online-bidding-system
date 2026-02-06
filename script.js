console.log("SMART CITY BIDDING SYSTEM LOADED");

// ================= ADMIN =================
const ADMIN_USER = "preesuzz";
const ADMIN_PASS = "50sodaa";

// ================= DATA =================
let auctions = JSON.parse(localStorage.getItem("auctions"));

if (!auctions) {
  auctions = [
    { id:1, title:"Advertisement Rights Auction", type:"highest", desc:"Highest Bid", time: rand(), bids:[], ended:false },
    { id:2, title:"Road Construction Tender", type:"lowest", desc:"Lowest Bid", time: rand(), bids:[], ended:false },
    { id:3, title:"Spectrum Allocation", type:"secret", desc:"Second Secret Bid", time: rand(), bids:[], ended:false },
    { id:4, title:"EV Charging Station Contract", type:"multi", desc:"Price + Points", time: rand(), bids:[], ended:false }
  ];
  localStorage.setItem("auctions", JSON.stringify(auctions));
}

// ================= LOGIN =================
function login() {
  const u = username.value.trim();
  const p = password.value.trim();

  if (u === ADMIN_USER && p === ADMIN_PASS) {
    location.href = "admin.html";
  } else if (u) {
    localStorage.setItem("currentUser", u);
    location.href = "user.html";
  } else {
    loginError.innerText = "Invalid Login";
  }
}

// ================= USER PANEL =================
const userPanel = document.getElementById("userPanel");
if (userPanel) renderUser();

function renderUser() {
  userPanel.innerHTML = "";
  auctions.forEach(a => {
    userPanel.innerHTML += `
      <div class="card">
        <h3>${a.title}</h3>
        <p>${a.desc}</p>
        <div class="timer" id="timer-${a.id}">Time: ${a.time}s</div>
        <div id="winner-${a.id}">Winner: —</div>

        <input id="price-${a.id}" type="number" placeholder="Price">
        ${a.type==="multi"?`<input id="points-${a.id}" type="number" placeholder="Points">`:""}

        <button id="btn-${a.id}" onclick="placeBid(${a.id})">Place Bid</button>
      </div>`;
  });
}

// ================= PLACE BID =================
function placeBid(id) {
  const a = auctions.find(x=>x.id===id);
  if (a.ended) return;

  a.bids.push({
    user: localStorage.getItem("currentUser"),
    price: +document.getElementById(`price-${id}`).value,
    points: +document.getElementById(`points-${id}`)?.value || 0
  });

  save();
  updateWinner(id);
}

// ================= WINNER =================
function getWinner(a) {
  if (!a.bids.length) return null;

  if (a.type==="highest") return [...a.bids].sort((x,y)=>y.price-x.price)[0];
  if (a.type==="lowest") return [...a.bids].sort((x,y)=>x.price-y.price)[0];
  if (a.type==="secret") return [...a.bids].sort((x,y)=>y.price-x.price)[1] || null;
  if (a.type==="multi") return [...a.bids].sort((x,y)=>(y.price+y.points)-(x.price+x.points))[0];
}

function updateWinner(id){
  const a = auctions.find(x=>x.id===id);
  const w = getWinner(a);
  document.getElementById(`winner-${id}`).innerText =
    w ? `Winner: ${w.user}` : "Winner: —";
}

// ================= TIMER =================
setInterval(()=>{
  auctions.forEach(a=>{
    if(!a.ended && a.time>0){
      a.time--;
      document.getElementById(`timer-${a.id}`)?.innerText=`Time: ${a.time}s`;
      if(a.time===0){
        a.ended=true;
        document.getElementById(`btn-${a.id}`)?.setAttribute("disabled",true);
        updateWinner(a.id);
      }
    }
  });
  save();
},1000);

// ================= ADMIN =================
const adminData = document.getElementById("adminData");
if(adminData){
  let users=new Set();
  adminData.innerHTML="";
  auctions.forEach(a=>{
    a.bids.forEach(b=>users.add(b.user));
    const w=getWinner(a);
    adminData.innerHTML+=`
      <div class="card">
        <h3>${a.title}</h3>
        ${a.bids.map(b=>`${b.user} → ₹${b.price}${a.type==="multi"?` + ${b.points}`:""}`).join("<br>")}
        <hr>
        Winner: ${w?w.user:"—"}
      </div>`;
  });
  document.getElementById("userCount").innerText=users.size;
}

// ================= UTIL =================
function rand(){ return Math.floor(Math.random()*61)+120; }
function save(){ localStorage.setItem("auctions",JSON.stringify(auctions)); }