const OpportunitiesPage = {
    currentPage: 1,
    currentFilter: '',

    async render(oppId = null) {
        if (oppId) return this.renderDetail(oppId);

        const content = document.getElementById('page-content');
        content.innerHTML = '<div class="grid-3">' + Components.loadingSkeletons(6) + '</div>';

        try {
            const params = { page: this.currentPage, limit: 12 };
            if (this.currentFilter) params.type = this.currentFilter;

            const data = await API.opportunities.list(params);

            content.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title"><span class="page-title-gradient">Opportunities</span></h1>
                    <p class="page-description">Discover hackathons, find teammates, explore mentorship, and open-source contributions.</p>
                </div>

                <div class="filter-bar">
                    <button class="filter-chip ${!this.currentFilter ? 'active' : ''}" onclick="OpportunitiesPage.filter('')">All</button>
                    <button class="filter-chip ${this.currentFilter === 'teammate' ? 'active' : ''}" onclick="OpportunitiesPage.filter('teammate')">👥 Teammates</button>
                    <button class="filter-chip ${this.currentFilter === 'hiring' ? 'active' : ''}" onclick="OpportunitiesPage.filter('hiring')">💼 Hiring</button>
                    <button class="filter-chip ${this.currentFilter === 'hackathon' ? 'active' : ''}" onclick="OpportunitiesPage.filter('hackathon')">🏆 Hackathons</button>
                    <button class="filter-chip ${this.currentFilter === 'opensource' ? 'active' : ''}" onclick="OpportunitiesPage.filter('opensource')">🌐 Open Source</button>
                    <button class="filter-chip ${this.currentFilter === 'mentorship' ? 'active' : ''}" onclick="OpportunitiesPage.filter('mentorship')">🎓 Mentorship</button>
                    ${Auth.isAuthenticated ? `<button class="btn btn-primary btn-sm" style="margin-left:auto" onclick="OpportunitiesPage.showCreateModal()"><i data-lucide="plus"></i> Post</button>` : ''}
                </div>

                ${data.opportunities.length > 0 ?
                    `<div class="grid-2" id="opps-grid">${data.opportunities.map(o => Components.opportunityCard(o)).join('')}</div>
                    ${Components.pagination(data.page, data.pages, 'OpportunitiesPage.goToPage')}`
                    : Components.emptyState('compass', 'No opportunities', 'No opportunities match your filter.',
                        Auth.isAuthenticated ? '<button class="btn btn-primary" onclick="OpportunitiesPage.showCreateModal()">Post Opportunity</button>' : '')
                }
            `;
            lucide.createIcons();
        } catch (error) {
            content.innerHTML = Components.emptyState('alert-circle', 'Error', error.message);
            lucide.createIcons();
        }
    },

    async renderDetail(id) {
        const content = document.getElementById('page-content');
        content.innerHTML = Components.loadingSkeletons(1);

        try {
            const opp = await API.opportunities.get(id);
            const isCreator = Auth.currentUser && Auth.currentUser.id == opp.creator_id;

            content.innerHTML = `
                <button class="btn btn-ghost" onclick="App.navigate('/opportunities')" style="margin-bottom:16px"><i data-lucide="arrow-left"></i> Back</button>

                <div class="card" style="margin-bottom:24px;padding:32px">
                    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:20px">
                        <div>
                            <div style="margin-bottom:10px">${Components.typeBadge(opp.type)} ${Components.statusBadge(opp.status)}</div>
                            <h1 style="font-size:1.8rem;font-weight:800;margin-bottom:8px">${Utils.escapeHtml(opp.title)}</h1>
                            <div class="profile-meta">
                                <span class="profile-meta-item"><i data-lucide="user"></i> <a href="#/profile/${opp.creator_username}">${Utils.escapeHtml(opp.creator_name)}</a></span>
                                <span class="profile-meta-item"><i data-lucide="calendar"></i> ${Utils.formatDate(opp.created_at)}</span>
                                ${opp.location ? `<span class="profile-meta-item"><i data-lucide="map-pin"></i> ${Utils.escapeHtml(opp.location)}</span>` : ''}
                                ${opp.is_remote ? '<span class="profile-meta-item"><i data-lucide="wifi"></i> Remote</span>' : ''}
                                <span class="profile-meta-item"><i data-lucide="send"></i> ${opp.application_count || 0} applications</span>
                                ${opp.deadline ? `<span class="profile-meta-item">${Components.deadlineBadge(opp.deadline)}</span>` : ''}
                            </div>
                        </div>
                        <div class="profile-actions">
                            ${isCreator ? `
                                <button class="btn btn-secondary" onclick="OpportunitiesPage.toggleStatus(${id},'${opp.status === 'open' ? 'closed' : 'open'}')">
                                    <i data-lucide="${opp.status === 'open' ? 'x-circle' : 'check-circle'}"></i> ${opp.status === 'open' ? 'Close' : 'Reopen'}
                                </button>` :
                              !Auth.isAuthenticated ? '<button class="btn btn-primary" onclick="Auth.showModal(\'login\')">Log in to Apply</button>' :
                              opp.current_user_application ?
                                (opp.current_user_application.status === 'pending' ? '<button class="btn btn-secondary" disabled>⏳ Application Pending</button>' :
                                 opp.current_user_application.status === 'accepted' ? '<span class="badge badge-green">✅ Accepted</span>' :
                                 '<span class="badge badge-red">Application not selected</span>') :
                              opp.status === 'open' ? `<button class="btn btn-primary" onclick="OpportunitiesPage.showApplyModal(${id})"><i data-lucide="send"></i> Apply Now</button>` :
                              '<button class="btn btn-secondary" disabled>Closed</button>'
                            }
                        </div>
                    </div>

                    <div style="margin-bottom:20px">
                        <h3 style="font-size:0.85rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Description</h3>
                        <div style="color:var(--text-secondary);line-height:1.7;white-space:pre-wrap">${Utils.escapeHtml(opp.description)}</div>
                    </div>

                    ${opp.skills_required ? `
                        <div>
                            <h3 style="font-size:0.85rem;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px">Skills Required</h3>
                            <div class="skills-list">
                                ${opp.skills_required.split(',').map(s => `<span class="skill-tag">${s.trim()}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>

                ${isCreator && opp.applications ? `
                    <div class="card">
                        <h3 class="card-title" style="margin-bottom:16px">Applications (${opp.applications.length})</h3>
                        ${opp.applications.length === 0 ? '<p style="color:var(--text-tertiary)">No applications yet</p>' :
                            opp.applications.map(app => `
                                <div class="member-item">
                                    <div class="member-avatar">${Components.avatar(app, 40)}</div>
                                    <div class="member-info">
                                        <div class="member-name" style="cursor:pointer" onclick="App.navigate('/profile/${app.username}')">${Utils.escapeHtml(app.full_name)}</div>
                                        <div class="member-role-text">${Utils.escapeHtml(app.message || 'No message')}</div>
                                        <div style="font-size:0.75rem;color:var(--text-tertiary);margin-top:2px">${Utils.timeAgo(app.created_at)} • Status: ${app.status}</div>
                                    </div>
                                    ${app.status === 'pending' ? `
                                        <button class="btn btn-success btn-sm" onclick="OpportunitiesPage.handleApp(${app.id},'accept')">Accept</button>
                                        <button class="btn btn-danger btn-sm" onclick="OpportunitiesPage.handleApp(${app.id},'reject')">Reject</button>
                                    ` : `<span class="badge badge-${app.status === 'accepted' ? 'green' : 'red'}">${app.status}</span>`}
                                </div>
                            `).join('')}
                    </div>
                ` : ''}
            `;
            lucide.createIcons();
        } catch (error) {
            content.innerHTML = Components.emptyState('alert-circle', 'Not found', error.message);
            lucide.createIcons();
        }
    },

    filter(type) {
        this.currentFilter = type;
        this.currentPage = 1;
        this.render();
    },

    goToPage(page) {
        this.currentPage = page;
        this.render();
        window.scrollTo(0, 0);
    },

    async toggleStatus(id, newStatus) {
        try {
            await API.opportunities.update({ id, status: newStatus });
            Toast.success(`Opportunity ${newStatus}`);
            this.renderDetail(id);
        } catch (error) { Toast.error(error.message); }
    },

    async handleApp(appId, action) {
        try {
            await API.opportunities.handleApplication({ application_id: appId, action });
            Toast.success(`Application ${action}ed`);

            const hash = window.location.hash;
            const match = hash.match(/#\/opportunities\/(\d+)/);
            if (match) this.renderDetail(match[1]);
        } catch (error) { Toast.error(error.message); }
    },

    showApplyModal(oppId) {
        if (!Auth.requireAuth()) return;
        const modalHtml = Components.modal('apply-modal', '<i data-lucide="send"></i> Apply to Opportunity', `
            <form id="apply-form">
                <div class="form-group">
                    <label>Message (optional)</label>
                    <textarea class="mega-input" id="apply-msg" placeholder="Tell them why you're a great fit, your relevant experience, and what you'd bring to the team..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary btn-full"><i data-lucide="send"></i> Submit Application</button>
            </form>
        `);

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        lucide.createIcons();

        document.getElementById('apply-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
                await API.opportunities.apply({
                    opportunity_id: oppId,
                    message: document.getElementById('apply-msg').value
                });
                document.getElementById('apply-modal').remove();
                Toast.success('Application submitted! 🎉');
                this.renderDetail(oppId);
            } catch (error) { Toast.error(error.message); }
        });
    },

    async showCreateModal() {
        if (!Auth.requireAuth()) return;

        const modalHtml = Components.modal('create-opp-modal', '<i data-lucide="compass"></i> Post Opportunity', `
            <form id="create-opp-form">
                <div class="form-group">
                    <label>Title *</label>
                    <input class="input-plain" id="co-title" placeholder="e.g., Looking for React developer" required>
                </div>
                <div class="form-group">
                    <label>Type *</label>
                    <div class="chip-select" id="co-type">
                        <button type="button" class="chip-option" data-val="teammate" onclick="OpportunitiesPage.selectType(this)">👥 Teammate</button>
                        <button type="button" class="chip-option" data-val="hiring" onclick="OpportunitiesPage.selectType(this)">💼 Hiring</button>
                        <button type="button" class="chip-option" data-val="hackathon" onclick="OpportunitiesPage.selectType(this)">🏆 Hackathon</button>
                        <button type="button" class="chip-option" data-val="opensource" onclick="OpportunitiesPage.selectType(this)">🌐 Open Source</button>
                        <button type="button" class="chip-option" data-val="mentorship" onclick="OpportunitiesPage.selectType(this)">🎓 Mentorship</button>
                    </div>
                </div>
                <div class="form-group">
                    <label>Description *</label>
                    <textarea class="mega-input" id="co-desc" placeholder="What are you looking for? What will the person be doing?" required></textarea>
                </div>
                <div class="form-group">
                    <label>Required Skills</label>
                    <input class="input-plain" id="co-skills" placeholder="e.g., React, Python, Machine Learning">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Location</label>
                        <input class="input-plain" id="co-location" placeholder="e.g., Remote, Bangalore">
                    </div>
                    <div class="form-group">
                        <label>Deadline</label>
                        <input class="input-plain" id="co-deadline" type="date">
                    </div>
                </div>
                <div class="form-group">
                    <label style="display:flex;align-items:center;gap:8px">
                        <input type="checkbox" id="co-remote" checked> Remote friendly
                    </label>
                </div>
                <button type="submit" class="btn btn-primary btn-full" style="margin-top:8px"><i data-lucide="send"></i> Post Opportunity</button>
            </form>
        `);

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        lucide.createIcons();

        document.getElementById('create-opp-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const selectedType = document.querySelector('#co-type .selected');
            if (!selectedType) { Toast.warning('Please select an opportunity type'); return; }

            try {
                const result = await API.opportunities.create({
                    title: document.getElementById('co-title').value,
                    description: document.getElementById('co-desc').value,
                    type: selectedType.dataset.val,
                    skills_required: document.getElementById('co-skills').value,
                    location: document.getElementById('co-location').value,
                    deadline: document.getElementById('co-deadline').value || null,
                    is_remote: document.getElementById('co-remote').checked ? 1 : 0
                });
                document.getElementById('create-opp-modal').remove();
                Toast.success('Opportunity posted! 📣');
                App.navigate(`/opportunities/${result.id}`);
            } catch (error) { Toast.error(error.message); }
        });
    },

    selectType(el) {
        document.querySelectorAll('#co-type .chip-option').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
    }
};
