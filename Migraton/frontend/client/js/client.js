// ✅ Get token from Google OAuth redirect URL and store it
const urlParams = new URLSearchParams(window.location.search);
const tokenFromURL = urlParams.get("token");
if (tokenFromURL) {
    localStorage.setItem("token", tokenFromURL);
    window.history.replaceState({}, document.title, "client-dashboard.html");
}

// ✅ Load token from localStorage
const token = localStorage.getItem("token");
if (!token) {
    alert("⚠️ You are not logged in!");
    window.location.href = "login-client.html";
}

// ✅ Decode JWT for user info
let clientData = {};
try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    clientData = payload;

    // Display profile info
    document.getElementById("profileName").textContent = payload.name || "Client";
    document.getElementById("profileEmail").textContent = payload.email || "email@example.com";
    document.getElementById("profilePhoto").src = payload.picture || "https://via.placeholder.com/40";

} catch (e) {
    console.warn("⚠️ Invalid token or decoding error");
}

// ✅ Sidebar Toggle Handler
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("main-content");
const toggleBtn = document.getElementById("sidebarToggle");

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    mainContent.classList.toggle("collapsed");
});

// ✅ Logout function
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login-client.html";
}

// ✅ Fetch PG Listings
async function fetchPGs() {
    try {
        const res = await fetch("http://localhost:5000/api/pgs/client", {
            headers: { Authorization: `Bearer ${token}` }
        });

        const data = await res.json();
        const container = document.getElementById("pgListContainer");

        let approved = 0;
        let pending = 0;

        if (!Array.isArray(data) || !data.length) {
            container.innerHTML = `<p class="text-muted">You haven’t listed any PGs yet.</p>`;
            return;
        }

        document.getElementById("totalPGs").textContent = data.length;

        data.forEach(pg => {
            if (pg.approved) approved++;
            else pending++;

            const card = document.createElement("div");
            card.className = "col-md-6 col-lg-4";
            card.innerHTML = `
                <div class="card shadow-sm">
                    <div class="card-body">
                        <h5 class="card-title">${pg.title}</h5>
                        <p class="card-text">${pg.location}</p>
                        <p><strong>Rent:</strong> ₹${pg.rent}</p>
                        <p class="text-muted small">${pg.approved ? "✅ Approved" : "⏳ Pending"}</p>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        document.getElementById("approvedPGs").textContent = approved;
        document.getElementById("pendingPGs").textContent = pending;

    } catch (err) {
        console.error("❌ Error fetching PGs:", err);
        document.getElementById("pgListContainer").innerHTML = `<p class="text-danger">Failed to load PGs</p>`;
    }
}

// ✅ Run fetch on load
fetchPGs();
