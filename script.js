// ================= CONFIG =================
const ADMIN_USER = "preesuzz";
const ADMIN_PASS = "50sodaa";

// ================= DATA ===================
let auctions = JSON.parse(localStorage.getItem("auctions")) || [
    { id: 1, name: "Antique Vase", time: 120, bids: [] },
    { id: 2, name: "Construction Tender", time: 150, bids: [] }
];

// ================= LOGIN ==================
function login() {
    const u = username.value;
    const p = password.value;

    if (u === ADMIN_USER && p === ADMIN_PASS) {
        location.href = "admin.html";
    } else if (u) {
        localStorage.setItem("currentUser", u);
        location.href = "user.html";
    } else {
        loginError.textContent = "Invalid login";
    }
}

// ================= USER PANEL =============
const userPanel = document.getElementById("userPanel");
if (userPanel) renderUser();

function renderUser() {
    userPanel.innerHTML = "";
    auctions.forEach(a => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <h3>${a.name}</h3>
            <div class="timer" id="t-${a.id}">Time: ${a.time}s</div>

            <input placeholder="Quantity" type="number" id="q-${a.id}">
            <input placeholder="Price per unit" type="number" id="p-${a.id}">
            <button onclick="placeBid(${a.id})">Submit Bid</button>
        `;
        userPanel.appendChild(card);
    });
}

function placeBid(id) {
    const qty = +document.getElementById(`q-${id}`).value;
    const price = +document.getElementById(`p-${id}`).value;
    const user = localStorage.getItem("currentUser");

    if (!qty || !price) return alert("Invalid bid");

    const auction = auctions.find(a => a.id === id);
    auction.bids.push({
        user,
        qty,
        price,
        total: qty * price
    });

    localStorage.setItem("auctions", JSON.stringify(auctions));
    confetti();
}

// ================= TIMER ==================
setInterval(() => {
    auctions.forEach(a => {
        if (a.time > 0) a.time--;
        const t = document.getElementById(`t-${a.id}`);
        if (t) t.textContent = `Time: ${a.time}s`;
    });
    localStorage.setItem("auctions", JSON.stringify(auctions));
}, 1000);

// ================= ADMIN PANEL ============
const adminData = document.getElementById("adminData");
if (adminData) renderAdmin();

function renderAdmin() {
    let users = new Set();
    let chartLabels = [];
    let chartData = [];

    adminData.innerHTML = "";
    auctions.forEach(a => {
        a.bids.forEach(b => {
            users.add(b.user);
            chartLabels.push(b.user);
            chartData.push(b.total);
        });

        adminData.innerHTML += `
            <p><strong>${a.name}</strong><br>
            ${a.bids.map(b => `${b.user}: ₹${b.total}`).join("<br>")}</p><hr>
        `;
    });

    totalUsers.textContent = users.size;
    drawChart(chartLabels, chartData);
}

// ================= CHART ==================
function drawChart(labels, data) {
    new Chart(bidChart, {
        type: "bar",
        data: {
            labels,
            datasets: [{
                label: "Bid Amount",
                data
            }]
        }
    });
}

// ================= CONFETTI ===============
const canvas = document.getElementById("confetti");
if (canvas) {
    const ctx = canvas.getContext("2d");
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    function confetti() {
        for (let i = 0; i < 120; i++) {
            ctx.fillStyle = `hsl(${Math.random()*360},100%,50%)`;
            ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height, 6, 6);
        }
        setTimeout(() => ctx.clearRect(0,0,canvas.width,canvas.height), 600);
    }
}