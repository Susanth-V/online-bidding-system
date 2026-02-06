// ================= CONFIG =================
const ADMIN_USER = "preesuzz";
const ADMIN_PASS = "50shadesofdaa";

// ================= DATA ===================
let auctions = JSON.parse(localStorage.getItem("auctions")) || [
  {
    id: 1,
    name: "Antique Vase",
    bids: {
      highest: { time: 60, list: [] },
      lowest:  { time: 60, list: [] },
      secret:  { time: 60, list: [] },
      multi:   { time: 60, list: [] }
    }
  }
];

// ================= SAFE DOM LOAD =================
document.addEventListener("DOMContentLoaded", () => {

    // ---------- LOGIN PAGE ----------
    if (document.getElementById("username")) {
        window.login = function () {
            const u = username.value.trim();
            const p = password.value.trim();

            if (u === ADMIN_USER && p === ADMIN_PASS) {
                localStorage.setItem("role", "admin");
                location.href = "admin.html";
            }
            else if (u.length > 0) {
                localStorage.setItem("role", "user");
                localStorage.setItem("currentUser", u);
                location.href = "user.html";
            }
            else {
                loginError.textContent = "Invalid login";
            }
        };
    }

    // ---------- USER PANEL ----------
    const userPanel = document.getElementById("userPanel");
    if (userPanel) {
        if (localStorage.getItem("role") !== "user") {
            location.href = "index.html";
            return;
        }
        renderUser();
    }

    // ---------- ADMIN PANEL ----------
    const adminData = document.getElementById("adminData");
    if (adminData) {
        if (localStorage.getItem("role") !== "admin") {
            location.href = "index.html";
            return;
        }
        renderAdmin();
    }
});

// ================= USER PANEL =================
function renderUser() {
    userPanel.innerHTML = "";
    auctions.forEach(a => {
        userPanel.innerHTML += `
        <div class="card">
            <h3>${a.name}</h3>

            <p class="timer">Highest (<span id="ht-${a.id}">${a.bids.highest.time}</span>s)</p>
            <input id="h-${a.id}" type="number" placeholder="Highest price">

            <p class="timer">Lowest (<span id="lt-${a.id}">${a.bids.lowest.time}</span>s)</p>
            <input id="l-${a.id}" type="number" placeholder="Lowest price">

            <p class="timer">Secret (<span id="st-${a.id}">${a.bids.secret.time}</span>s)</p>
            <input id="s-${a.id}" type="number" placeholder="Secret price">

            <p class="timer">Multi (<span id="mt-${a.id}">${a.bids.multi.time}</span>s)</p>
            <input id="mp-${a.id}" type="number" placeholder="Price">
            <input id="pt-${a.id}" type="number" placeholder="Points">

            <button onclick="placeBids(${a.id})">Submit</button>
        </div>`;
    });
}

function placeBids(id) {
    const user = localStorage.getItem("currentUser");
    const a = auctions.find(x => x.id === id);

    const hb = +document.getElementById(`h-${id}`).value;
    const lb = +document.getElementById(`l-${id}`).value;
    const sb = +document.getElementById(`s-${id}`).value;
    const mp = +document.getElementById(`mp-${id}`).value;
    const pt = +document.getElementById(`pt-${id}`).value;

    if (hb && a.bids.highest.time > 0)
        a.bids.highest.list.push({ user, price: hb });

    if (lb && a.bids.lowest.time > 0)
        a.bids.lowest.list.push({ user, price: lb });

    if (sb && a.bids.secret.time > 0)
        a.bids.secret.list.push({ user, price: sb });

    if (mp && pt && a.bids.multi.time > 0)
        a.bids.multi.list.push({ user, score: mp + pt });

    localStorage.setItem("auctions", JSON.stringify(auctions));
    confetti();
}

// ================= TIMERS =================
setInterval(() => {
    auctions.forEach(a => {
        Object.values(a.bids).forEach(b => {
            if (b.time > 0) b.time--;
        });

        ["highest","lowest","secret","multi"].forEach((k,i)=>{
            const ids = ["ht","lt","st","mt"];
            const t = document.getElementById(`${ids[i]}-${a.id}`);
            if (t) t.textContent = a.bids[k].time;
        });
    });
    localStorage.setItem("auctions", JSON.stringify(auctions));
}, 1000);

// ================= ADMIN PANEL =================
function getWinners(b) {
    return {
        highest: b.highest.list.sort((a,b)=>b.price-a.price)[0],
        lowest:  b.lowest.list.sort((a,b)=>a.price-b.price)[0],
        secret:  b.secret.list.sort((a,b)=>b.price-a.price)[1],
        multi:   b.multi.list.sort((a,b)=>b.score-a.score)[0]
    };
}

function renderAdmin() {
    adminData.innerHTML = "";
    let users = new Set();

    auctions.forEach(a => {
        const w = getWinners(a.bids);

        adminData.innerHTML += `
        <div class="card">
            <h3>${a.name}</h3>
            <p><b>Highest:</b> ${w.highest?.user || "-"} | ₹${w.highest?.price || "-"}</p>
            <p><b>Lowest:</b> ${w.lowest?.user || "-"} | ₹${w.lowest?.price || "-"}</p>
            <p><b>Secret:</b> ${w.secret?.user || "-"} | ₹${w.secret?.price || "-"}</p>
            <p><b>Multi:</b> ${w.multi?.user || "-"} | Score ${w.multi?.score || "-"}</p>
        </div><hr>`;

        Object.values(a.bids).forEach(b =>
            b.list.forEach(x => users.add(x.user))
        );
    });

    totalUsers.textContent = users.size;
}

// ================= CONFETTI =================
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