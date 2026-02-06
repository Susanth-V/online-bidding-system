// ---------- GLOBAL STORAGE ----------
let bids = JSON.parse(localStorage.getItem("bids")) || [];
let users = JSON.parse(localStorage.getItem("users")) || [];
let winners = JSON.parse(localStorage.getItem("winners")) || {};

const AUCTION_TIME = Math.floor(Math.random() * 20) + 20; // random timer
let timeLeft = AUCTION_TIME;

// ---------- TIMER ----------
if (document.getElementById("timer")) {
  const timer = setInterval(() => {
    document.getElementById("timer").innerText =
      `Time Remaining: ${timeLeft}s`;

    if (timeLeft-- <= 0) {
      clearInterval(timer);
      computeWinners();
      document.getElementById("status").innerText =
        "Bidding Closed. Winner Announced!";
    }
  }, 1000);
}

// ---------- USER BID ----------
function placeBid() {
  const auction = document.getElementById("auctionType").value;
  const price = Number(document.getElementById("price").value);
  const points = Number(document.getElementById("points").value || 0);

  if (!price) {
    alert("Price required");
    return;
  }

  const userId = "USER_" + Math.floor(Math.random() * 10000);
  users.push(userId);

  bids.push({
    userId,
    auction,
    price,
    points,
    score: price + points
  });

  localStorage.setItem("bids", JSON.stringify(bids));
  localStorage.setItem("users", JSON.stringify(users));

  document.getElementById("status").innerText = "Bid Submitted Successfully";
}

// ---------- WINNER LOGIC ----------
function computeWinners() {
  const group = {
    highest: [],
    lowest: [],
    second: [],
    multi: []
  };

  bids.forEach(b => group[b.auction].push(b));

  // Highest Bid
  winners.highest = group.highest.sort((a,b)=>b.price-a.price)[0] || null;

  // Lowest Bid
  winners.lowest = group.lowest.sort((a,b)=>a.price-b.price)[0] || null;

  // Second Secret Bid
  const sorted = group.second.sort((a,b)=>b.price-a.price);
  winners.second = sorted[1] || null;

  // Multi Variable
  winners.multi = group.multi.sort((a,b)=>b.score-a.score)[0] || null;

  localStorage.setItem("winners", JSON.stringify(winners));
}

// ---------- ADMIN PANEL ----------
if (document.getElementById("totalUsers")) {
  document.getElementById("totalUsers").innerText =
    new Set(users).size;

  document.getElementById("allBids").innerText =
    JSON.stringify(bids, null, 2);

  document.getElementById("winners").innerText =
    JSON.stringify(winners, null, 2);
}