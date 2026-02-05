// ================= CONFIG =================
const ADMIN_USER = "preesuzz";
const ADMIN_PASS = "50shadesofdaa";

// ================= DATA ===================
const auctions = [
    { id: 1, name: "Antique Vase", type: "HIGHEST", time: 120, bestBid: 0, bidder: "-" },
    { id: 2, name: "Construction Tender", type: "LOWEST", time: 150, bestBid: Infinity, bidder: "-" },
    { id: 3, name: "Laptop Auction", type: "SEALED", time: 180, bids: [] }
];

const userPanel = document.getElementById("userPanel");
const adminPanel = document.getElementById("adminPanel");
const adminLoginBox = document.getElementById("adminLogin");
const adminData = document.getElementById("adminData");

// ================= RENDER =================
function renderUser() {
    userPanel.innerHTML = "";
    auctions.forEach(a => {
        let status = "Bids hidden";
        if (a.type === "HIGHEST") status = `Highest: ₹${a.bestBid} (${a.bidder})`;
        if (a.type === "LOWEST" && a.bestBid !== Infinity) status = `Lowest: ₹${a.bestBid} (${a.bidder})`;

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${a.name}</h3>
            <div class="type">${a.type} BID</div>
            <div class="timer" id="timer-${a.id}">Time: ${a.time}s</div>

            <input id="name-${a.id}" placeholder="Your Name">
            <input id="bid-${a.id}" type="number" placeholder="Bid Amount">

            <button onclick="placeBid(${a.id})">Place Bid</button>
            <p>${status}</p>
        `;
        userPanel.appendChild(card);
    });
}

function renderAdmin() {
    adminData.innerHTML = "";
    auctions.forEach(a => {
        let info = "";
        if (a.type === "SEALED") {
            info = a.bids.map(b => `${b.name}: ₹${b.bid}`).join("<br>") || "No bids";
        } else {
            info = `Winner: ${a.bidder} | ₹${a.bestBid}`;
        }
        adminData.innerHTML += `<p><strong>${a.name}</strong><br>${info}</p><hr>`;
    });
}

// ================= BIDDING =================
function placeBid(id) {
    const a = auctions.find(x => x.id === id);
    if (a.time <= 0) return alert("Auction closed");

    const name = document.getElementById(`name-${id}`).value;
    const bid = Number(document.getElementById(`bid-${id}`).value);
    if (!name || !bid) return alert("Enter valid details");

    if (a.type === "HIGHEST" && bid > a.bestBid) {
        a.bestBid = bid; a.bidder = name; confetti();
    } 
    else if (a.type === "LOWEST" && bid < a.bestBid) {
        a.bestBid = bid; a.bidder = name; confetti();
    } 
    else if (a.type === "SEALED") {
        a.bids.push({ name, bid });
        alert("Sealed bid submitted");
    } 
    else {
        alert("Invalid bid");
    }
    renderUser();
}

// ================= TIMER ===================
setInterval(() => {
    auctions.forEach(a => {
        if (a.time > 0) {
            a.time--;
            const t = document.getElementById(`timer-${a.id}`);
            if (t) t.textContent = `Time: ${a.time}s`;
        }
    });
}, 1000);

// ================= ADMIN ===================
function showAdminLogin() {
    adminLoginBox.classList.remove("hidden");
    adminPanel.classList.add("hidden");
}

function adminLogin() {
    const u = document.getElementById("adminUser").value;
    const p = document.getElementById("adminPass").value;
    if (u === ADMIN_USER && p === ADMIN_PASS) {
        adminLoginBox.classList.add("hidden");
        adminPanel.classList.remove("hidden");
        renderAdmin();
    } else {
        document.getElementById("loginError").textContent = "Invalid credentials";
    }
}

function showUser() {
    adminLoginBox.classList.add("hidden");
    adminPanel.classList.add("hidden");
}

// ================= CONFETTI ================
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function confetti() {
    for (let i = 0; i < 120; i++) {
        ctx.fillStyle = `hsl(${Math.random()*360},100%,50%)`;
        ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height, 6, 6);
    }
    setTimeout(() => ctx.clearRect(0,0,canvas.width,canvas.height), 600);
}

// INIT
renderUser();