/**
 * BuildSpace — Main Application Router & Initialization
 */
const App = {
    currentPage: '',

    async init() {
        // Initialize auth
        await Auth.init();
        Auth.setupEventListeners();

        // Theme initialization
        this.initTheme();

        // Initialize notifications
        NotificationsModule.init();

        // Setup global search
        this.setupSearch();

        // Setup mobile sidebar
        this.setupMobileSidebar();

        // Listen for hash changes
        window.addEventListener('hashchange', () => this.route());

        // Hide loading screen and show app
        const loadingScreen = document.getElementById('loading-screen');
        const app = document.getElementById('app');
        
        setTimeout(() => {
            app.style.display = 'flex';
            loadingScreen.classList.add('fade-out');
            setTimeout(() => loadingScreen.remove(), 500);
            
            // Route to current hash
            this.route();
            
            // Initialize Lucide icons
            lucide.createIcons();
        }, 800);
    },

    navigate(path) {
        window.location.hash = path;
    },

    route() {
        const hash = window.location.hash.slice(1) || '/';
        const parts = hash.split('/').filter(Boolean);
        const page = parts[0] || '';
        const param = parts[1] || null;

        // Update active nav
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            const itemPage = item.dataset.page;
            if ((!page && itemPage === 'feed') || itemPage === page) {
                item.classList.add('active');
            }
        });

        // Stop message polling when navigating away
        if (page !== 'messages') {
            MessagesPage.stopPolling();
        }

        // Reset page content animation
        const content = document.getElementById('page-content');
        content.style.animation = 'none';
        content.offsetHeight; // Trigger reflow
        content.style.animation = 'pageIn 0.4s ease';

        // Route to page
        switch (page) {
            case '':
            case 'feed':
            case 'dashboard':
                this.currentPage = 'feed';
                FeedPage.render();
                break;
            case 'projects':
                this.currentPage = 'projects';
                ProjectsPage.render(param);
                break;
            case 'opportunities':
                this.currentPage = 'opportunities';
                OpportunitiesPage.render(param);
                break;
            case 'developers':
                this.currentPage = 'developers';
                DevelopersPage.render();
                break;
            case 'profile':
                this.currentPage = 'profile';
                ProfilePage.render(param);
                break;
            case 'messages':
                this.currentPage = 'messages';
                MessagesPage.render(param);
                break;
            default:
                this.currentPage = 'feed';
                FeedPage.render();
        }

        // Close mobile sidebar
        document.getElementById('sidebar').classList.remove('open');

        // Scroll to top
        window.scrollTo(0, 0);
    },

    // Theme toggle
    initTheme() {
        const saved = localStorage.getItem('buildspace-theme');
        if (saved) {
            document.documentElement.setAttribute('data-theme', saved);
        } else {
            // Default to dark
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        this.updateThemeIcon();

        document.getElementById('theme-toggle').addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('buildspace-theme', next);
            this.updateThemeIcon();
            Toast.info(`Switched to ${next} mode`);
        });
    },

    updateThemeIcon() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        document.getElementById('theme-icon-dark').style.display = isDark ? '' : 'none';
        document.getElementById('theme-icon-light').style.display = isDark ? 'none' : '';
    },

    // Global search
    setupSearch() {
        const input = document.getElementById('search-input');
        const results = document.getElementById('search-results');
        let searchTimer;

        input.addEventListener('input', (e) => {
            clearTimeout(searchTimer);
            const query = e.target.value.trim();
            
            if (query.length < 2) {
                results.style.display = 'none';
                return;
            }

            searchTimer = setTimeout(async () => {
                try {
                    // Search users, projects, and opportunities in parallel
                    const [users, projects, opps] = await Promise.all([
                        API.users.search({ q: query, limit: 3 }),
                        API.projects.list({ q: query, limit: 3 }),
                        API.opportunities.list({ q: query, limit: 3 })
                    ]);

                    let html = '';

                    if (users.users.length > 0) {
                        html += '<div style="padding:8px 16px;font-size:0.7rem;font-weight:700;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.5px">Developers</div>';
                        html += users.users.map(u => `
                            <div class="search-result-item" onclick="App.navigate('/profile/${u.username}');document.getElementById('search-results').style.display='none';document.getElementById('search-input').value=''">
                                <div class="search-result-icon user"><i data-lucide="user"></i></div>
                                <div class="search-result-info">
                                    <div class="search-result-name">${Utils.escapeHtml(u.full_name)}</div>
                                    <div class="search-result-meta">@${u.username} • ${u.role}</div>
                                </div>
                            </div>
                        `).join('');
                    }

                    if (projects.projects.length > 0) {
                        html += '<div style="padding:8px 16px;font-size:0.7rem;font-weight:700;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.5px">Projects</div>';
                        html += projects.projects.map(p => `
                            <div class="search-result-item" onclick="App.navigate('/projects/${p.id}');document.getElementById('search-results').style.display='none';document.getElementById('search-input').value=''">
                                <div class="search-result-icon project"><i data-lucide="folder-kanban"></i></div>
                                <div class="search-result-info">
                                    <div class="search-result-name">${Utils.escapeHtml(p.title)}</div>
                                    <div class="search-result-meta">${p.status} • ${p.member_count || 0} members</div>
                                </div>
                            </div>
                        `).join('');
                    }

                    if (opps.opportunities.length > 0) {
                        html += '<div style="padding:8px 16px;font-size:0.7rem;font-weight:700;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.5px">Opportunities</div>';
                        html += opps.opportunities.map(o => `
                            <div class="search-result-item" onclick="App.navigate('/opportunities/${o.id}');document.getElementById('search-results').style.display='none';document.getElementById('search-input').value=''">
                                <div class="search-result-icon opportunity"><i data-lucide="compass"></i></div>
                                <div class="search-result-info">
                                    <div class="search-result-name">${Utils.escapeHtml(o.title)}</div>
                                    <div class="search-result-meta">${o.type} • ${o.application_count || 0} applications</div>
                                </div>
                            </div>
                        `).join('');
                    }

                    if (!html) {
                        html = '<div style="padding:20px;text-align:center;color:var(--text-tertiary);font-size:0.85rem">No results found for "' + Utils.escapeHtml(query) + '"</div>';
                    }

                    results.innerHTML = html;
                    results.style.display = 'block';
                    lucide.createIcons();
                } catch (e) {
                    results.style.display = 'none';
                }
            }, 300);
        });

        // Close search on click outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-bar')) {
                results.style.display = 'none';
            }
        });

        // Keyboard shortcut Ctrl+K / Cmd+K
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                input.focus();
            }
            if (e.key === 'Escape') {
                results.style.display = 'none';
                input.blur();
            }
        });
    },

    // Mobile sidebar
    setupMobileSidebar() {
        document.getElementById('mobile-menu-btn').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
        });

        document.getElementById('sidebar-close').addEventListener('click', () => {
            document.getElementById('sidebar').classList.remove('open');
        });

        // Close sidebar when clicking a nav item on mobile
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 1024) {
                    document.getElementById('sidebar').classList.remove('open');
                }
            });
        });
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => App.init());
