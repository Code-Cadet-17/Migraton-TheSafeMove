// File: HoodWise/frontend/js/script.js

document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.querySelector("form[role='search']");
    const searchInput = searchForm?.querySelector("input");

    if (searchForm) {
        searchForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query !== "") {
                alert(`🔍 You searched for: ${query}`);
            } else {
                alert("Please enter a locality to search.");
            }
        });
    }

    const currentPage = location.pathname.split("/").pop();
    setActiveNav(currentPage);

    if (currentPage === "explore.html") {
        fetchPGs();
    } else if (currentPage === "details.html") {
        fetchPGDetails();
    }
});

// Highlight nav links
function setActiveNav(pageName) {
    const links = document.querySelectorAll(".nav-link");
    links.forEach((link) => {
        const href = link.getAttribute("href");
        if (href === pageName) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

// Filter Buttons on Explore Page
document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        const cards = document.querySelectorAll('.locality-card');

        cards.forEach((card) => {
            const tags = card.getAttribute('data-tags') || "";
            card.style.display = tags.includes(filter) ? 'block' : 'none';
        });

        document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('btn-primary'));
        btn.classList.add('btn-primary');
    });
});

// Fetch PGs for explore.html
async function fetchPGs() {
    try {
        const res = await fetch('http://localhost:5000/api/pgs');
        const data = await res.json();

        const container = document.getElementById('pg-card-container');
        container.innerHTML = '';

        data.forEach(pg => {
            const card = document.createElement('div');
            card.className = 'col-md-4 mb-4 locality-card';
            card.setAttribute('data-tags', 'student metro budget');

            card.innerHTML = `
                <div class="card h-100 shadow-sm">
                    <img src="https://picsum.photos/seed/${pg.title.replace(/\s+/g, '-')}/600/350" class="card-img-top" alt="${pg.title}">
                    <div class="card-body">
                        <h5 class="card-title">${pg.title}</h5>
                        <p class="card-text">${pg.location}</p>
                        <p class="card-text"><strong>Rent:</strong> ₹${pg.rent}</p>
                        <a href="details.html?id=${pg._id}" class="btn btn-outline-primary btn-sm">View Details</a>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

    } catch (err) {
        console.error('Failed to load PGs:', err);
        const container = document.getElementById('pg-card-container');
        container.innerHTML = '<p class="text-danger">⚠️ Failed to load PGs.</p>';
    }
}

// Fetch single PG by ID for details.html
async function fetchPGDetails() {
    const params = new URLSearchParams(window.location.search);
    const pgId = params.get("id");
    const container = document.getElementById("pg-details");
    if (!pgId || !container) {
        window.location.href = "explore.html"; // 🔁 Go back to explore
        return;
    }

    try {
        const res = await fetch(`http://localhost:5000/api/pgs/${pgId}`);
        if (!res.ok) throw new Error("PG not found");
        const pg = await res.json();

        container.innerHTML = `
            <div class="card shadow p-4">
                <h2>${pg.title}</h2>
                <p><strong>Location:</strong> ${pg.location}</p>
                <p><strong>Rent:</strong> ₹${pg.rent}</p>
                <p><strong>Amenities:</strong> ${pg.amenities.join(', ')}</p>
                <img src="https://picsum.photos/seed/${pg.title.replace(/\s+/g, '-')}/800/400" class="img-fluid my-3" alt="${pg.title}" />
                <a href="explore.html" class="btn btn-secondary mt-3">⬅ Back to Explore</a>
            </div>
        `;
    } catch (err) {
        console.error('Error loading PG details:', err);
        container.innerHTML = `<p class="text-danger">⚠️ Failed to load PG details.</p>`;
    }
}
