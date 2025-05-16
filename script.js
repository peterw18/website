let allRepos = [];
let reposPerPage = 3;
let displayIndex = 0;
const grid = document.getElementById("repo-grid");
const loadMoreBtn = document.getElementById("load-more");
let username = "peterw18";


function renderRepos() {
    const nextRepos = allRepos.slice(displayIndex, displayIndex + reposPerPage);
    nextRepos.forEach(repo => {
    const card = document.createElement("a");
    card.className = "card";
    card.href = repo.html_url;
    card.target = "_blank";

    // Image fallback: social preview first, then fallback to avatar
    const socialImage = `https://opengraph.githubassets.com/1/${username}/${repo.name}`;
    const fallbackImage = repo.owner.avatar_url;

    card.innerHTML = `
        <img src="${socialImage}" alt="Preview of ${repo.name}" 
            onerror="this.onerror=null; this.src='${fallbackImage}'" />
        <div class="card-content">
        <h2>${repo.name}</h2>
        <p>${repo.description || "No description provided."}</p>
        <div class="updated">🕒 Updated: ${new Date(repo.updated_at).toLocaleDateString()}</div>
        </div>
    `;
    grid.appendChild(card);
    });

    displayIndex += reposPerPage;

    if (displayIndex >= allRepos.length) {
        loadMoreBtn.style.display = "none";
    }
}

fetch(`https://api.github.com/users/${username}/repos`)
    .then(res => res.json())
    .then(repos => {
        allRepos = repos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        renderRepos();
    })
    .catch(err => {
    grid.innerHTML = "<p>Error loading repositories.</p>";
    console.error(err);
    });

loadMoreBtn.addEventListener("click", renderRepos);