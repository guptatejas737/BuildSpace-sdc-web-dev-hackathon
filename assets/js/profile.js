const ProfilePage = {
    async render(username) {
        const content = document.getElementById('page-content');
        content.innerHTML = Components.loadingSkeletons(2);

        try {
            let user;
            if (username === 'edit' && Auth.isAuthenticated) {
                return this.renderEditProfile();
            } else if (username) {
                user = await API.users.profile(username);
            } else if (Auth.isAuthenticated) {
                user = await API.users.profile(Auth.currentUser.id);
            } else {
                Auth.showModal('login');
                return;
            }

            const isOwnProfile = Auth.currentUser && Auth.currentUser.id == user.id;
            const endorsedSkills = user.endorsed_skills || [];

            content.innerHTML = `
                <div class="profile-header">
                    <div class="profile-cover"></div>
                    <div class="profile-info">
                        <div class="profile-avatar-wrapper">
                            <div class="profile-avatar">
                                ${Components.avatar(user, 100)}
                            </div>
                        </div>
                        <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:16px">
                            <div>
                                <h1 class="profile-name">
                                    ${Utils.escapeHtml(user.full_name)}
                                    <span class="badge badge-purple" style="font-size:0.75rem">${user.role}</span>
                                </h1>
                                <p class="profile-username">@${Utils.escapeHtml(user.username)}</p>
                                ${user.bio ? `<p class="profile-bio">${Utils.escapeHtml(user.bio)}</p>` : ''}
                                <div class="profile-meta">
                                    ${user.location ? `<span class="profile-meta-item"><i data-lucide="map-pin"></i> ${Utils.escapeHtml(user.location)}</span>` : ''}
                                    <span class="profile-meta-item"><i data-lucide="calendar"></i> Joined ${Utils.formatDate(user.created_at)}</span>
                                    ${user.github_url ? `<span class="profile-meta-item"><i data-lucide="github"></i> <a href="${user.github_url}" target="_blank">GitHub</a></span>` : ''}
                                    ${user.linkedin_url ? `<span class="profile-meta-item"><i data-lucide="linkedin"></i> <a href="${user.linkedin_url}" target="_blank">LinkedIn</a></span>` : ''}
                                    ${user.portfolio_url ? `<span class="profile-meta-item"><i data-lucide="globe"></i> <a href="${user.portfolio_url}" target="_blank">Portfolio</a></span>` : ''}
                                </div>
                            </div>
                            <div class="profile-actions">
                                ${isOwnProfile ? `
                                    <button class="btn btn-primary" onclick="App.navigate('/profile/edit')"><i data-lucide="edit"></i> Edit Profile</button>
                                    <button class="btn btn-secondary" onclick="ProfilePage.shareProfile('${user.username}')"><i data-lucide="share-2"></i> Share</button>
                                ` : Auth.isAuthenticated ? `
                                    <button class="btn btn-primary" onclick="App.navigate('/messages/${user.id}')"><i data-lucide="message-circle"></i> Message</button>
                                    <button class="btn btn-secondary" onclick="ProfilePage.shareProfile('${user.username}')"><i data-lucide="share-2"></i> Share</button>
                                ` : `
                                    <button class="btn btn-secondary" onclick="ProfilePage.shareProfile('${user.username}')"><i data-lucide="share-2"></i> Share</button>
                                `}
                            </div>
                        </div>
                        <div class="profile-stats">
                            <div class="profile-stat">
                                <div class="profile-stat-value">${user.project_count || 0}</div>
                                <div class="profile-stat-label">Projects</div>
                            </div>
                            <div class="profile-stat">
                                <div class="profile-stat-value">${(user.skills || []).length}</div>
                                <div class="profile-stat-label">Skills</div>
                            </div>
                            <div class="profile-stat">
                                <div class="profile-stat-value">${user.endorsement_count || 0}</div>
                                <div class="profile-stat-label">Endorsements</div>
                            </div>
                            <div class="profile-stat">
                                <div class="profile-stat-value">${user.opportunity_count || 0}</div>
                                <div class="profile-stat-label">Opportunities</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="profile-grid">
                    <div>
                        <div class="card" style="margin-bottom:20px">
                            <h3 class="card-title" style="margin-bottom:16px">
                                <i data-lucide="award" style="width:20px;height:20px;color:var(--purple-500)"></i>
                                Skills & Expertise
                                ${isOwnProfile ? `<button class="btn btn-ghost btn-sm" style="margin-left:auto" onclick="ProfilePage.showAddSkillModal()"><i data-lucide="plus"></i> Add</button>` : ''}
                            </h3>
                            ${(user.skills || []).length > 0 ? user.skills.map(skill => `
                                <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border-color)">
                                    <div style="flex:1">
                                        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
                                            <span class="skill-tag ${skill.category}" style="margin:0">${Utils.escapeHtml(skill.name)}</span>
                                            <span style="font-size:0.75rem;color:var(--text-tertiary);text-transform:capitalize">${skill.proficiency}</span>
                                        </div>
                                        <div class="proficiency-bar">
                                            <div class="proficiency-fill ${skill.proficiency}"></div>
                                        </div>
                                    </div>
                                    <div style="display:flex;align-items:center;gap:6px">
                                        ${!isOwnProfile && Auth.isAuthenticated ? `
                                            <button class="endorse-btn ${endorsedSkills.includes(skill.id) ? 'endorsed' : ''}"
                                                onclick="ProfilePage.toggleEndorse(${user.id}, ${skill.id}, this)"
                                                title="${endorsedSkills.includes(skill.id) ? 'Remove endorsement' : 'Endorse this skill'}">
                                                <i data-lucide="thumbs-up"></i>
                                                <span>${skill.endorsement_count || 0}</span>
                                            </button>
                                        ` : `
                                            <span style="font-size:0.75rem;color:var(--text-tertiary)">⭐ ${skill.endorsement_count || 0}</span>
                                        `}
                                        ${isOwnProfile ? `
                                            <button class="btn-icon" style="width:28px;height:28px" onclick="ProfilePage.removeSkill(${skill.id})" title="Remove skill">
                                                <i data-lucide="x" style="width:14px;height:14px"></i>
                                            </button>
                                        ` : ''}
                                    </div>
                                </div>
                            `).join('') : '<p style="color:var(--text-tertiary)">No skills added yet</p>'}
                        </div>
                    </div>

                    <div>
                        <div class="card">
                            <h3 class="card-title" style="margin-bottom:16px">
                                <i data-lucide="folder-kanban" style="width:20px;height:20px;color:var(--blue-500)"></i>
                                Projects
                            </h3>
                            ${(user.projects || []).length > 0 ? user.projects.map(p => `
                                <div class="member-item" style="cursor:pointer" onclick="App.navigate('/projects/${p.id}')">
                                    <div style="width:40px;height:40px;border-radius:var(--radius-md);background:rgba(59,130,246,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                                        <i data-lucide="folder" style="width:18px;height:18px;color:var(--blue-500)"></i>
                                    </div>
                                    <div class="member-info">
                                        <div class="member-name">${Utils.escapeHtml(p.title)}</div>
                                        <div class="member-role-text">${p.member_role} • ${p.status}</div>
                                    </div>
                                    ${Components.statusBadge(p.status)}
                                </div>
                            `).join('') : '<p style="color:var(--text-tertiary)">No projects yet</p>'}
                        </div>
                    </div>
                </div>
            `;
            lucide.createIcons();
        } catch (error) {
            content.innerHTML = Components.emptyState('user-x', 'Profile not found', error.message,
                '<button class="btn btn-primary" onclick="App.navigate(\'/\')">Go Home</button>');
            lucide.createIcons();
        }
    },

    async renderEditProfile() {
        if (!Auth.requireAuth()) return;
        const content = document.getElementById('page-content');

        try {
            const user = await API.users.profile(Auth.currentUser.id);

            content.innerHTML = `
                <button class="btn btn-ghost" onclick="App.navigate('/profile/${user.username}')" style="margin-bottom:16px"><i data-lucide="arrow-left"></i> Back to Profile</button>

                <div class="card" style="max-width:700px;margin:0 auto;padding:32px">
                    <h2 style="font-size:1.4rem;font-weight:800;margin-bottom:24px;display:flex;align-items:center;gap:10px">
                        <i data-lucide="edit" style="color:var(--purple-500)"></i> Edit Profile
                    </h2>

                    <form id="edit-profile-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Full Name</label>
                                <input class="input-plain" id="ep-name" value="${Utils.escapeHtml(user.full_name)}" required>
                            </div>
                            <div class="form-group">
                                <label>Role</label>
                                <select class="input-plain" id="ep-role">
                                    <option value="student" ${user.role==='student'?'selected':''}>Student</option>
                                    <option value="mentor" ${user.role==='mentor'?'selected':''}>Mentor</option>
                                    <option value="organizer" ${user.role==='organizer'?'selected':''}>Organizer</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Bio</label>
                            <textarea class="mega-input" id="ep-bio" placeholder="Tell the community about yourself...">${Utils.escapeHtml(user.bio || '')}</textarea>
                        </div>

                        <div class="form-group">
                            <label>Location</label>
                            <input class="input-plain" id="ep-location" value="${Utils.escapeHtml(user.location || '')}" placeholder="e.g., Mumbai, India">
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>GitHub URL</label>
                                <input class="input-plain" id="ep-github" value="${Utils.escapeHtml(user.github_url || '')}" placeholder="https://github.com/username">
                            </div>
                            <div class="form-group">
                                <label>LinkedIn URL</label>
                                <input class="input-plain" id="ep-linkedin" value="${Utils.escapeHtml(user.linkedin_url || '')}" placeholder="https://linkedin.com/in/username">
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Portfolio URL</label>
                            <input class="input-plain" id="ep-portfolio" value="${Utils.escapeHtml(user.portfolio_url || '')}" placeholder="https://yourwebsite.com">
                        </div>

                        <button type="submit" class="btn btn-primary btn-full" style="margin-top:8px">
                            <i data-lucide="check"></i> Save Changes
                        </button>
                    </form>
                </div>
            `;
            lucide.createIcons();

            document.getElementById('edit-profile-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    const updated = await API.users.updateProfile({
                        full_name: document.getElementById('ep-name').value,
                        role: document.getElementById('ep-role').value,
                        bio: document.getElementById('ep-bio').value,
                        location: document.getElementById('ep-location').value,
                        github_url: document.getElementById('ep-github').value,
                        linkedin_url: document.getElementById('ep-linkedin').value,
                        portfolio_url: document.getElementById('ep-portfolio').value,
                    });
                    Auth.currentUser = updated;
                    Auth.updateUI();
                    Toast.success('Profile updated! ✨');
                    App.navigate(`/profile/${updated.username}`);
                } catch (error) { Toast.error(error.message); }
            });
        } catch (error) {
            content.innerHTML = Components.emptyState('alert-circle', 'Error', error.message);
            lucide.createIcons();
        }
    },

    async toggleEndorse(userId, skillId, btn) {
        if (!Auth.requireAuth()) return;
        try {
            if (btn.classList.contains('endorsed')) {
                await API.users.unendorse(userId, skillId);
                btn.classList.remove('endorsed');
                const countEl = btn.querySelector('span');
                countEl.textContent = Math.max(0, parseInt(countEl.textContent) - 1);
                Toast.info('Endorsement removed');
            } else {
                const result = await API.users.endorse({ user_id: userId, skill_id: skillId });
                btn.classList.add('endorsed');
                const countEl = btn.querySelector('span');
                countEl.textContent = result.endorsement_count;
                Toast.success('Skill endorsed! ⭐');
            }
        } catch (error) { Toast.error(error.message); }
    },

    async showAddSkillModal() {
        if (!Auth.requireAuth()) return;

        let skills = [];
        try { skills = await API.users.allSkills(); } catch(e) {}

        const categories = [...new Set(skills.map(s => s.category))];

        const modalHtml = Components.modal('add-skill-modal', '<i data-lucide="award"></i> Add Skill', `
            <div class="form-group">
                <label>Category</label>
                <div class="chip-select" id="skill-cat-filter">
                    <button type="button" class="chip-option selected" onclick="ProfilePage.filterSkillCategory('all', this)">All</button>
                    ${categories.map(c => `<button type="button" class="chip-option" onclick="ProfilePage.filterSkillCategory('${c}', this)">${c}</button>`).join('')}
                </div>
            </div>
            <div class="form-group">
                <label>Select Skill</label>
                <div id="skill-options" style="max-height:200px;overflow-y:auto;display:flex;flex-wrap:wrap;gap:6px">
                    ${skills.map(s => `<button type="button" class="chip-option" data-id="${s.id}" data-cat="${s.category}" onclick="ProfilePage.selectSkill(this)">${s.name}</button>`).join('')}
                </div>
            </div>
            <div class="form-group">
                <label>Proficiency</label>
                <div class="chip-select" id="skill-proficiency">
                    <button type="button" class="chip-option" data-val="beginner" onclick="ProfilePage.selectProficiency(this)">Beginner</button>
                    <button type="button" class="chip-option selected" data-val="intermediate" onclick="ProfilePage.selectProficiency(this)">Intermediate</button>
                    <button type="button" class="chip-option" data-val="advanced" onclick="ProfilePage.selectProficiency(this)">Advanced</button>
                    <button type="button" class="chip-option" data-val="expert" onclick="ProfilePage.selectProficiency(this)">Expert</button>
                </div>
            </div>
            <button class="btn btn-primary btn-full" onclick="ProfilePage.addSelectedSkill()"><i data-lucide="plus"></i> Add Skill</button>
        `);

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        lucide.createIcons();
    },

    _selectedSkillId: null,

    filterSkillCategory(cat, btn) {
        document.querySelectorAll('#skill-cat-filter .chip-option').forEach(c => c.classList.remove('selected'));
        btn.classList.add('selected');
        document.querySelectorAll('#skill-options .chip-option').forEach(el => {
            el.style.display = (cat === 'all' || el.dataset.cat === cat) ? '' : 'none';
        });
    },

    selectSkill(el) {
        document.querySelectorAll('#skill-options .chip-option').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
        this._selectedSkillId = parseInt(el.dataset.id);
    },

    selectProficiency(el) {
        document.querySelectorAll('#skill-proficiency .chip-option').forEach(c => c.classList.remove('selected'));
        el.classList.add('selected');
    },

    async addSelectedSkill() {
        if (!this._selectedSkillId) { Toast.warning('Please select a skill'); return; }
        const proficiency = document.querySelector('#skill-proficiency .selected')?.dataset.val || 'intermediate';

        try {
            await API.users.addSkill({ skill_id: this._selectedSkillId, proficiency });
            document.getElementById('add-skill-modal').remove();
            Toast.success('Skill added! 🎯');
            this._selectedSkillId = null;
            App.navigate(`/profile/${Auth.currentUser.username}`);
        } catch (error) { Toast.error(error.message); }
    },

    async removeSkill(skillId) {
        if (!confirm('Remove this skill?')) return;
        try {
            await API.users.removeSkill(skillId);
            Toast.info('Skill removed');
            App.navigate(`/profile/${Auth.currentUser.username}`);
        } catch (error) { Toast.error(error.message); }
    },

    shareProfile(username) {
        const url = `${window.location.origin}${window.location.pathname}#/profile/${username}`;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                Toast.success('Profile link copied to clipboard! 📋');
            });
        } else {
            prompt('Copy this link:', url);
        }
    }
};

const DevelopersPage = {
    currentPage: 1,
    searchQuery: '',
    roleFilter: '',

    async render() {
        const content = document.getElementById('page-content');
        content.innerHTML = '<div class="grid-4">' + Components.loadingSkeletons(8) + '</div>';

        try {
            const params = { page: this.currentPage, limit: 16 };
            if (this.searchQuery) params.q = this.searchQuery;
            if (this.roleFilter) params.role = this.roleFilter;

            const data = await API.users.search(params);

            content.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title"><span class="page-title-gradient">Developers</span></h1>
                    <p class="page-description">Connect with talented developers in our community.</p>
                </div>

                <div class="filter-bar">
                    <div class="search-bar" style="max-width:300px;flex:1">
                        <i data-lucide="search" class="search-icon"></i>
                        <input type="text" id="dev-search" placeholder="Search developers..." value="${Utils.escapeHtml(this.searchQuery)}" style="padding-right:14px">
                    </div>
                    <button class="filter-chip ${!this.roleFilter ? 'active' : ''}" onclick="DevelopersPage.filterRole('')">All</button>
                    <button class="filter-chip ${this.roleFilter === 'student' ? 'active' : ''}" onclick="DevelopersPage.filterRole('student')">🎓 Students</button>
                    <button class="filter-chip ${this.roleFilter === 'mentor' ? 'active' : ''}" onclick="DevelopersPage.filterRole('mentor')">👨‍🏫 Mentors</button>
                    <button class="filter-chip ${this.roleFilter === 'organizer' ? 'active' : ''}" onclick="DevelopersPage.filterRole('organizer')">🎯 Organizers</button>
                </div>

                ${data.users.length > 0 ?
                    `<div class="grid-4">${data.users.map(u => Components.developerCard(u)).join('')}</div>
                    ${Components.pagination(data.page, data.pages, 'DevelopersPage.goToPage')}`
                    : Components.emptyState('users', 'No developers found', 'Try a different search or filter.')
                }
            `;
            lucide.createIcons();

            const searchInput = document.getElementById('dev-search');
            if (searchInput) {
                searchInput.addEventListener('input', Utils.debounce((e) => {
                    this.searchQuery = e.target.value;
                    this.currentPage = 1;
                    this.render();
                }, 400));
            }
        } catch (error) {
            content.innerHTML = Components.emptyState('alert-circle', 'Error', error.message);
            lucide.createIcons();
        }
    },

    filterRole(role) {
        this.roleFilter = role;
        this.currentPage = 1;
        this.render();
    },

    goToPage(page) {
        this.currentPage = page;
        this.render();
        window.scrollTo(0, 0);
    }
};
