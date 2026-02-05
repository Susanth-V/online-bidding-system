// ===== ADMIN CREDENTIALS =====
const ADMIN_USER = "preesuzz";
const ADMIN_PASS = "50shadesofdaa";

// ===== OTP SIMULATION =====
let generatedOTP;

function sendOTP() {
    generatedOTP = Math.floor(100000 + Math.random() * 900000);
    alert("Demo OTP: " + generatedOTP);
}

function verifyOTP() {
    if (document.getElementById("otp").value == generatedOTP) {
        saveUser();
        loadAuctions();
        alert("Login successful");
    } else alert("Invalid OTP");
}

// ===== USER STORAGE =====
function saveUser() {
    let users = JSON.parse(localStorage.getItem("users") || "[]");
    users.push({ email: document.getElementById("email").value });
    localStorage.setItem("users", JSON.stringify(users));
}

// ===== AUCTIONS =====
const auctions = [
    { type: "Highest Bid", best: 0 },
    { type: "Lowest Bid", best: Infinity },
    { type: "Secret Bid", bids: [] },
    { type: "Multi Variable", bestScore: 0 }
];

function loadAuctions() {
    const div = document.getElementById("auctions");
    auctions.forEach((a,i)=>{
        div.innerHTML += `<p>${a.type}</p>
        <input placeholder="Bid">
        <button onclick="placeBid(${i})">Bid</button><hr>`;
    });
}

function placeBid(i) {
    let bids = JSON.parse(localStorage.getItem("bids") || "[]");
    bids.push({ auction:i });
    localStorage.setItem("bids", JSON.stringify(bids));
    alert("Bid placed");
}

// ===== ADMIN =====
function adminLogin() {
    if (
        adminUser.value === ADMIN_USER &&
        adminPass.value === ADMIN_PASS
    ) {
        adminPanel.classList.remove("hidden");
        document.getElementById("userCount").innerText =
            "Users: " + JSON.parse(localStorage.getItem("users")||"[]").length;
        document.getElementById("bidCount").innerText =
            "Bids: " + JSON.parse(localStorage.getItem("bids")||"[]").length;
    } else alert("Invalid admin credentials");
}