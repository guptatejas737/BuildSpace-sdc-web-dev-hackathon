<<<<<<< HEAD
=======
/**
 * BuildSpace — Dashboard / Feed Page
 */
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
const FeedPage = {
    async render() {
        const content = document.getElementById('page-content');
        content.innerHTML = '<div class="grid-3">' + Components.loadingSkeletons(6) + '</div>';

        try {
            const feedData = await API.feed.get({ limit: 15 });
            const stats = feedData.stats;

            let welcomeHtml = '';
            if (Auth.isAuthenticated) {
                welcomeHtml = `
                    <div class="welcome-banner">
                        <h1 class="welcome-title">Welcome back, ${Utils.escapeHtml(Auth.currentUser.full_name)} 👋</h1>
                        <p class="welcome-subtitle">Ready to build something amazing today? Check out the latest projects and opportunities.</p>
                        <div class="welcome-actions">
                            <button class="btn btn-primary" onclick="ProjectsPage.showCreateModal()"><i data-lucide="plus"></i> New Project</button>
                            <button class="btn btn-secondary" onclick="OpportunitiesPage.showCreateModal()"><i data-lucide="compass"></i> Post Opportunity</button>
                        </div>
                    </div>
                `;
            } else {
                welcomeHtml = `
                    <div class="welcome-banner">
                        <h1 class="welcome-title">Build Together, <span class="page-title-gradient">Grow Together</span> 🚀</h1>
                        <p class="welcome-subtitle">BuildSpace is where student developers connect, collaborate on projects, and discover opportunities. Join our community!</p>
                        <div class="welcome-actions">
                            <button class="btn btn-primary btn-lg" onclick="Auth.showModal('signup')"><i data-lucide="rocket"></i> Get Started</button>
                            <button class="btn btn-secondary btn-lg" onclick="App.navigate('/projects')"><i data-lucide="folder-kanban"></i> Browse Projects</button>
                        </div>
                    </div>
                `;
            }

            content.innerHTML = `
                ${welcomeHtml}
                <div class="stats-row">
                    <div class="stat-card">
                        <div class="stat-card-icon" style="background:rgba(139,92,246,0.12);color:var(--purple-500)"><i data-lucide="users"></i></div>
                        <div class="stat-card-value">${stats.total_users}</div>
                        <div class="stat-card-label">Developers</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon" style="background:rgba(59,130,246,0.12);color:var(--blue-500)"><i data-lucide="folder-kanban"></i></div>
                        <div class="stat-card-value">${stats.total_projects}</div>
                        <div class="stat-card-label">Projects</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon" style="background:rgba(16,185,129,0.12);color:var(--green-500)"><i data-lucide="rocket"></i></div>
                        <div class="stat-card-value">${stats.active_projects}</div>
                        <div class="stat-card-label">Active Projects</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon" style="background:rgba(249,115,22,0.12);color:var(--orange-500)"><i data-lucide="compass"></i></div>
                        <div class="stat-card-value">${stats.open_opportunities}</div>
                        <div class="stat-card-label">Opportunities</div>
                    </div>
                </div>

                <div class="dashboard-grid">
                    <div class="dashboard-main">
                        <div class="feed-section">
                            <div class="section-header">
                                <h2 class="section-title"><i data-lucide="activity"></i> Activity Feed</h2>
                            </div>
                            <div class="feed-card">
                                <div class="feed-card-body" id="feed-activities">
                                    ${this.renderActivities(feedData.activities)}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="dashboard-sidebar">
                        ${await this.renderTrendingSkills()}
                        ${this.renderQuickActions()}
                    </div>
                </div>
            `;
            lucide.createIcons();
        } catch (error) {
            content.innerHTML = Components.emptyState('alert-circle', 'Failed to load', error.message, '<button class="btn btn-primary" onclick="FeedPage.render()">Retry</button>');
            lucide.createIcons();
        }
    },

    renderActivities(activities) {
        if (!activities || !activities.length) {
            return '<div class="empty-state"><p>No activities yet. Be the first to create a project!</p></div>';
        }

        const activityIcons = {
            project_created: 'folder-plus',
            member_joined: 'user-plus',
            opportunity_posted: 'compass',
            skill_added: 'award',
            profile_updated: 'user-check',
            project_completed: 'check-circle',
            endorsement_given: 'star'
        };

        return activities.map(a => {
            const icon = activityIcons[a.type] || 'activity';
            const meta = a.metadata || {};
            let text = '';

            switch (a.type) {
                case 'project_created':
                    text = `<strong>${Utils.escapeHtml(a.full_name)}</strong> created a new project <a href="#/projects/${a.reference_id}">${Utils.escapeHtml(meta.title || '')}</a>`;
                    break;
                case 'member_joined':
                    text = `<strong>${Utils.escapeHtml(meta.user_name || a.full_name)}</strong> joined <a href="#/projects/${a.reference_id}">${Utils.escapeHtml(meta.project_title || 'a project')}</a>`;
                    break;
                case 'opportunity_posted':
                    text = `<strong>${Utils.escapeHtml(a.full_name)}</strong> posted an opportunity: <a href="#/opportunities/${a.reference_id}">${Utils.escapeHtml(meta.title || '')}</a>`;
                    break;
                case 'skill_added':
                    text = `<strong>${Utils.escapeHtml(a.full_name)}</strong> added <strong>${Utils.escapeHtml(meta.skill_name || '')}</strong> (${meta.proficiency || ''}) to their profile`;
                    break;
                case 'profile_updated':
                    text = `<strong>${Utils.escapeHtml(meta.user_name || a.full_name)}</strong> ${meta.action || 'updated their profile'}`;
                    break;
                case 'project_completed':
                    text = `🎉 <strong>${Utils.escapeHtml(a.full_name)}</strong> completed <a href="#/projects/${a.reference_id}">${Utils.escapeHtml(meta.title || 'a project')}</a>`;
                    break;
                case 'endorsement_given':
                    text = `<strong>${Utils.escapeHtml(meta.endorser || a.full_name)}</strong> endorsed a skill: <strong>${Utils.escapeHtml(meta.skill || '')}</strong>`;
                    break;
                default:
                    text = `<strong>${Utils.escapeHtml(a.full_name)}</strong> performed an action`;
            }

            return `
                <div class="activity-item">
                    <div class="activity-avatar ${a.type}">
                        ${a.avatar_url ? `<img src="${a.avatar_url}" alt="">` : `<i data-lucide="${icon}"></i>`}
                    </div>
                    <div class="activity-content">
                        <div class="activity-text">${text}</div>
                        <div class="activity-time">${Utils.timeAgo(a.created_at)}</div>
                    </div>
                </div>
            `;
        }).join('');
    },

    async renderTrendingSkills() {
        try {
            const skills = await API.users.allSkills();
            const topSkills = skills.slice(0, 6);
            let items = topSkills.map((s, i) => `
                <div class="trending-item">
                    <div class="trending-rank ${i < 3 ? 'top' : ''}">${i + 1}</div>
                    <div class="trending-info">
                        <div class="trending-name">${Utils.escapeHtml(s.name)}</div>
                        <div class="trending-meta">${s.category}</div>
                    </div>
                </div>
            `).join('');

            return `
                <div class="feed-card">
                    <div class="feed-card-header">
                        <span class="feed-card-title"><i data-lucide="trending-up"></i> Popular Skills</span>
                    </div>
                    <div class="feed-card-body">${items}</div>
                </div>
            `;
        } catch (e) { return ''; }
    },

    renderQuickActions() {
        const actions = [
            { icon: 'folder-plus', text: 'Create a Project', color: 'rgba(139,92,246,0.12)', iconColor: 'var(--purple-500)', action: "ProjectsPage.showCreateModal()" },
            { icon: 'compass', text: 'Post Opportunity', color: 'rgba(59,130,246,0.12)', iconColor: 'var(--blue-500)', action: "OpportunitiesPage.showCreateModal()" },
            { icon: 'users', text: 'Find Developers', color: 'rgba(16,185,129,0.12)', iconColor: 'var(--green-500)', action: "App.navigate('/developers')" },
            { icon: 'message-circle', text: 'Messages', color: 'rgba(249,115,22,0.12)', iconColor: 'var(--orange-500)', action: "App.navigate('/messages')" },
        ];

        let items = actions.map(a => `
            <div class="quick-action" onclick="${a.action}">
                <div class="quick-action-icon" style="background:${a.color};color:${a.iconColor}"><i data-lucide="${a.icon}"></i></div>
                <span class="quick-action-text">${a.text}</span>
                <span class="quick-action-arrow"><i data-lucide="chevron-right"></i></span>
            </div>
        `).join('');

        return `
            <div class="feed-card">
                <div class="feed-card-header">
                    <span class="feed-card-title"><i data-lucide="zap"></i> Quick Actions</span>
                </div>
                <div class="feed-card-body">${items}</div>
            </div>
        `;
    }
};
