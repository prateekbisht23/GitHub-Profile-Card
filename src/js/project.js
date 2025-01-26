document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(window.location.search);
    const username = params.get('username');

    if (!username) {
        showToast('No username provided', 'error');
        window.location.href = '../../index.html';
        return;
    }

    // Elements
    const card = document.getElementById('card');
    const image = document.getElementById('image');
    const userName = document.getElementById('userName');
    const githubLink = document.getElementById('githubLink');
    const bio = document.getElementById('bio');
    const location = document.getElementById('location').querySelector('span');
    const company = document.getElementById('company').querySelector('span');
    const created = document.getElementById('created').querySelector('span');
    const followers = document.getElementById('followers').querySelector('.stat-value');
    const following = document.getElementById('following').querySelector('.stat-value');
    const repos = document.getElementById('repos').querySelector('.stat-value');
    const reposList = document.getElementById('reposList');
    const totalStars = document.getElementById('totalStars');
    const topLanguage = document.getElementById('topLanguage');
    const flipBtn = document.getElementById('flipBtn');
    const flipBackBtn = document.getElementById('flipBackBtn');

    // Animation for stats
    function animateValue(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                clearInterval(timer);
                element.textContent = end;
            } else {
                element.textContent = Math.round(current);
            }
        }, 16);
    }

    // Toast notification
    function showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast show ${type}`;
        setTimeout(() => toast.className = 'toast', 3000);
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    }

    // Flip card event listeners
    flipBtn.addEventListener('click', () => {
        card.classList.add('flipped');
        fetchRepositories();
    });

    flipBackBtn.addEventListener('click', () => {
        card.classList.remove('flipped');
    });

    // Fetch GitHub profile
    fetch(`https://api.github.com/users/${username}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('User not found');
            }
            return response.json();
        })
        .then(data => {
            // Update profile elements
            image.src = data.avatar_url;
            userName.textContent = data.login;
            githubLink.href = data.html_url;
            bio.textContent = data.bio || 'No bio available';
            location.textContent = data.location || 'Not specified';
            company.textContent = data.company || 'Not specified';
            created.textContent = formatDate(data.created_at);

            // Animate stats
            animateValue(followers, 0, data.followers, 1000);
            animateValue(following, 0, data.following, 1000);
            animateValue(repos, 0, data.public_repos, 1000);

            showToast('Profile loaded successfully!', 'success');
        })
        .catch(error => {
            showToast(error.message, 'error');
            setTimeout(() => window.location.href = '../../index.html', 2000);
        });

    // Fetch repositories
    function fetchRepositories() {
        if (reposList.children.length > 0) return; // Don't fetch if already loaded

        reposList.innerHTML = '<div class="loading">Loading repositories...</div>';

        fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=5`)
            .then(response => response.json())
            .then(repos => {
                reposList.innerHTML = '';
                let totalStarsCount = 0;
                const languages = {};

                repos.sort((a, b) => b.stargazers_count - a.stargazers_count)
                    .slice(0, 5)
                    .forEach(repo => {
                        totalStarsCount += repo.stargazers_count;
                        if (repo.language) {
                            languages[repo.language] = (languages[repo.language] || 0) + 1;
                        }

                        const repoCard = document.createElement('div');
                        repoCard.className = 'repo-card';
                        repoCard.innerHTML = `
                            <h4>
                                <a href="${repo.html_url}" target="_blank" style="color: inherit; text-decoration: none;">
                                    <i class="fas fa-book"></i> ${repo.name}
                                </a>
                            </h4>
                            <p>${repo.description || 'No description available'}</p>
                            <div class="repo-stats">
                                <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                                <span><i class="fas fa-code-fork"></i> ${repo.forks_count}</span>
                                ${repo.language ? `<span><i class="fas fa-code"></i> ${repo.language}</span>` : ''}
                                <span><i class="fas fa-eye"></i> ${repo.watchers_count}</span>
                            </div>
                        `;
                        reposList.appendChild(repoCard);
                    });

                // Update summary stats
                totalStars.innerHTML = `<i class="fas fa-star"></i> Total Stars: ${totalStarsCount}`;
                const topLang = Object.entries(languages).sort((a, b) => b[1] - a[1])[0];
                topLanguage.innerHTML = `<i class="fas fa-code"></i> Top Language: ${topLang ? topLang[0] : 'None'}`;

                showToast('Repositories loaded successfully!', 'success');
            })
            .catch(error => {
                reposList.innerHTML = '<div class="error">Failed to load repositories</div>';
                showToast('Failed to load repositories', 'error');
            });
    }
});
