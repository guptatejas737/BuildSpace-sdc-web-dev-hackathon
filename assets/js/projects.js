<<<<<<< HEAD
=======
/**
 * BuildSpace — Projects Page
 */
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
const ProjectsPage = {
    currentPage: 1,
    currentFilter: '',

    async render(projectId = null) {
        if (projectId) {
            return this.renderDetail(projectId);
        }
<<<<<<< HEAD

        const content = document.getElementById('page-content');
        content.innerHTML = '<div class="grid-3">' + Components.loadingSkeletons(6) + '</div>';

=======
        
        const content = document.getElementById('page-content');
        content.innerHTML = '<div class="grid-3">' + Components.loadingSkeletons(6) + '</div>';
        
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
        try {
            const params = { page: this.currentPage, limit: 12 };
            if (this.currentFilter) params.status = this.currentFilter;

            const data = await API.projects.list(params);
<<<<<<< HEAD

=======
            
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
            content.innerHTML = `
                <div class="page-header">
                    <h1 class="page-title"><span class="page-title-gradient">Projects</span></h1>
                    <p class="page-description">Discover amazing projects built by our community. Join a team or start your own.</p>
                </div>
<<<<<<< HEAD

=======
                
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
                <div class="filter-bar">
                    <button class="filter-chip ${!this.currentFilter ? 'active' : ''}" onclick="ProjectsPage.filter('')">All</button>
                    <button class="filter-chip ${this.currentFilter === 'planning' ? 'active' : ''}" onclick="ProjectsPage.filter('planning')">📋 Planning</button>
                    <button class="filter-chip ${this.currentFilter === 'active' ? 'active' : ''}" onclick="ProjectsPage.filter('active')">🟢 Active</button>
                    <button class="filter-chip ${this.currentFilter === 'completed' ? 'active' : ''}" onclick="ProjectsPage.filter('completed')">✅ Completed</button>
                    ${Auth.isAuthenticated ? `<button class="btn btn-primary btn-sm" style="margin-left:auto" onclick="ProjectsPage.showCreateModal()"><i data-lucide="plus"></i> New Project</button>` : ''}
                </div>
<<<<<<< HEAD

                ${data.projects.length > 0 ?
                    `<div class="grid-3" id="projects-grid">${data.projects.map(p => Components.projectCard(p)).join('')}</div>
                    ${Components.pagination(data.page, data.pages, 'ProjectsPage.goToPage')}`
                    : Components.emptyState('folder-kanban', 'No projects yet', 'Be the first to create a project!',
=======
                
                ${data.projects.length > 0 ? 
                    `<div class="grid-3" id="projects-grid">${data.projects.map(p => Components.projectCard(p)).join('')}</div>
                    ${Components.pagination(data.page, data.pages, 'ProjectsPage.goToPage')}` 
                    : Components.emptyState('folder-kanban', 'No projects yet', 'Be the first to create a project!', 
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
                        Auth.isAuthenticated ? '<button class="btn btn-primary" onclick="ProjectsPage.showCreateModal()">Create Project</button>' : '')
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
<<<<<<< HEAD

=======
        
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
        try {
            const project = await API.projects.get(id);
            const isOwner = Auth.currentUser && Auth.currentUser.id == project.creator_id;
            const membership = project.current_user_membership;
            const activeMembers = (project.members || []).filter(m => m.status === 'active');
            const pendingMembers = (project.members || []).filter(m => m.status === 'pending');
<<<<<<< HEAD

            content.innerHTML = `
                <button class="btn btn-ghost" onclick="App.navigate('/projects')" style="margin-bottom:16px"><i data-lucide="arrow-left"></i> Back to Projects</button>

=======
            
            content.innerHTML = `
                <button class="btn btn-ghost" onclick="App.navigate('/projects')" style="margin-bottom:16px"><i data-lucide="arrow-left"></i> Back to Projects</button>
                
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
                <div class="profile-header" style="margin-bottom:24px">
                    <div class="profile-cover" style="height:140px"></div>
                    <div class="profile-info" style="margin-top:-30px">
                        <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:16px">
                            <div>
                                <h1 class="profile-name" style="font-size:1.6rem">${Utils.escapeHtml(project.title)} ${Components.statusBadge(project.status)}</h1>
                                <div class="profile-meta" style="margin-bottom:12px">
                                    <span class="profile-meta-item"><i data-lucide="user"></i> <a href="#/profile/${project.creator_username}">${Utils.escapeHtml(project.creator_name)}</a></span>
                                    <span class="profile-meta-item"><i data-lucide="calendar"></i> Created ${Utils.formatDate(project.created_at)}</span>
                                    <span class="profile-meta-item"><i data-lucide="users"></i> ${activeMembers.length}/${project.max_members} members</span>
                                    ${project.repo_url ? `<span class="profile-meta-item"><i data-lucide="github"></i> <a href="${project.repo_url}" target="_blank">Repository</a></span>` : ''}
                                </div>
                            </div>
                            <div class="profile-actions">
                                ${!Auth.isAuthenticated ? '<button class="btn btn-primary" onclick="Auth.showModal(\'login\')">Log in to Join</button>' :
                                  isOwner ? `<button class="btn btn-secondary" onclick="ProjectsPage.showEditModal(${id})"><i data-lucide="edit"></i> Edit</button>` :
                                  !membership ? `<button class="btn btn-primary" onclick="ProjectsPage.joinProject(${id})"><i data-lucide="user-plus"></i> Request to Join</button>` :
                                  membership.status === 'pending' ? '<button class="btn btn-secondary" disabled>⏳ Request Pending</button>' :
<<<<<<< HEAD
                                  membership.status === 'active' ? `<button class="btn btn-danger btn-sm" onclick="ProjectsPage.leaveProject(${id})"><i data-lucide="log-out"></i> Leave</button>` :
=======
                                  membership.status === 'active' ? `<button class="btn btn-danger btn-sm" onclick="ProjectsPage.leaveProject(${id})"><i data-lucide="log-out"></i> Leave</button>` : 
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
                                  `<button class="btn btn-primary" onclick="ProjectsPage.joinProject(${id})"><i data-lucide="user-plus"></i> Request to Join</button>`
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div class="profile-grid">
                    <div>
                        <div class="card" style="margin-bottom:20px">
                            <h3 class="card-title" style="margin-bottom:12px">About</h3>
                            <div class="card-body" style="white-space:pre-wrap">${Utils.escapeHtml(project.description)}</div>
                        </div>
<<<<<<< HEAD

=======
                        
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
                        <div class="card">
                            <h3 class="card-title" style="margin-bottom:12px">Tech Stack</h3>
                            <div class="skills-list">
                                ${(project.tech_stack || []).map(s => Components.skillTag(s)).join('')}
                                ${!project.tech_stack?.length ? '<p style="color:var(--text-tertiary)">No tech stack specified</p>' : ''}
                            </div>
                        </div>
                    </div>
<<<<<<< HEAD

=======
                    
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
                    <div>
                        <div class="card" style="margin-bottom:20px">
                            <h3 class="card-title" style="margin-bottom:16px">Team (${activeMembers.length}/${project.max_members})</h3>
                            ${activeMembers.map(m => `
                                <div class="member-item" style="cursor:pointer" onclick="App.navigate('/profile/${m.username}')">
                                    <div class="member-avatar">${Components.avatar(m, 40)}</div>
                                    <div class="member-info">
                                        <div class="member-name">${Utils.escapeHtml(m.full_name)}</div>
                                        <div class="member-role-text">${m.role}</div>
                                    </div>
                                    ${isOwner && m.role !== 'owner' ? `<button class="btn btn-ghost btn-sm" onclick="event.stopPropagation();ProjectsPage.removeMember(${id},${m.user_id})">Remove</button>` : ''}
                                </div>
                            `).join('')}
                        </div>
<<<<<<< HEAD

=======
                        
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
                        ${isOwner && pendingMembers.length > 0 ? `
                            <div class="card">
                                <h3 class="card-title" style="margin-bottom:16px">Pending Requests (${pendingMembers.length})</h3>
                                ${pendingMembers.map(m => `
                                    <div class="member-item">
                                        <div class="member-avatar">${Components.avatar(m, 40)}</div>
                                        <div class="member-info">
                                            <div class="member-name">${Utils.escapeHtml(m.full_name)}</div>
                                        </div>
                                        <button class="btn btn-success btn-sm" onclick="ProjectsPage.handleMember(${id},${m.user_id},'accept')">Accept</button>
                                        <button class="btn btn-danger btn-sm" onclick="ProjectsPage.handleMember(${id},${m.user_id},'reject')">Reject</button>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            lucide.createIcons();
        } catch (error) {
            content.innerHTML = Components.emptyState('alert-circle', 'Project not found', error.message, '<button class="btn btn-primary" onclick="App.navigate(\'/projects\')">Back to Projects</button>');
            lucide.createIcons();
        }
    },

    filter(status) {
        this.currentFilter = status;
        this.currentPage = 1;
        this.render();
    },

    goToPage(page) {
        this.currentPage = page;
        this.render();
        window.scrollTo(0, 0);
    },

    async joinProject(projectId) {
        if (!Auth.requireAuth()) return;
        try {
            await API.projects.join(projectId);
            Toast.success('Join request sent! 🎉');
            this.renderDetail(projectId);
        } catch (error) { Toast.error(error.message); }
    },

    async leaveProject(projectId) {
        if (!confirm('Are you sure you want to leave this project?')) return;
        try {
            await API.projects.leave(projectId);
            Toast.info('You left the project');
            this.renderDetail(projectId);
        } catch (error) { Toast.error(error.message); }
    },

    async handleMember(projectId, userId, action) {
        try {
            await API.projects.handleMember({ project_id: projectId, user_id: userId, action });
            Toast.success(`Member ${action}ed`);
            this.renderDetail(projectId);
        } catch (error) { Toast.error(error.message); }
    },

    async removeMember(projectId, userId) {
        if (!confirm('Remove this member?')) return;
        try {
            await API.delete(`/api/projects/members.php?project_id=${projectId}&user_id=${userId}`);
            Toast.info('Member removed');
            this.renderDetail(projectId);
        } catch (error) { Toast.error(error.message); }
    },

    async showCreateModal() {
        if (!Auth.requireAuth()) return;
<<<<<<< HEAD

        let skills = [];
        try { skills = await API.users.allSkills(); } catch(e) {}

=======
        
        let skills = [];
        try { skills = await API.users.allSkills(); } catch(e) {}
        
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
        const modalHtml = Components.modal('create-project-modal', '<i data-lucide="folder-plus"></i> Create New Project', `
            <form id="create-project-form">
                <div class="form-group">
                    <label>Project Title *</label>
                    <input class="input-plain" id="cp-title" placeholder="Enter project title" required>
                </div>
                <div class="form-group">
                    <label>Short Description</label>
                    <input class="input-plain" id="cp-short-desc" placeholder="Brief one-line description" maxlength="300">
                </div>
                <div class="form-group">
                    <label>Full Description *</label>
                    <textarea class="mega-input" id="cp-description" placeholder="Detailed project description, goals, and vision..." required></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Repo URL</label>
                        <input class="input-plain" id="cp-repo" placeholder="https://github.com/...">
                    </div>
                    <div class="form-group">
                        <label>Max Members</label>
                        <input class="input-plain" id="cp-max" type="number" value="5" min="1" max="20">
                    </div>
                </div>
                <div class="form-group">
                    <label>Tech Stack</label>
                    <div class="chip-select" id="cp-tech-stack">
                        ${skills.map(s => `<button type="button" class="chip-option" data-id="${s.id}" onclick="this.classList.toggle('selected')">${s.name}</button>`).join('')}
                    </div>
                </div>
                <button type="submit" class="btn btn-primary btn-full" style="margin-top:16px"><i data-lucide="rocket"></i> Create Project</button>
            </form>
        `);
<<<<<<< HEAD

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        lucide.createIcons();

        document.getElementById('create-project-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const techStack = [...document.querySelectorAll('#cp-tech-stack .selected')].map(el => parseInt(el.dataset.id));

=======
        
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        lucide.createIcons();
        
        document.getElementById('create-project-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const techStack = [...document.querySelectorAll('#cp-tech-stack .selected')].map(el => parseInt(el.dataset.id));
            
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
            try {
                const result = await API.projects.create({
                    title: document.getElementById('cp-title').value,
                    short_description: document.getElementById('cp-short-desc').value,
                    description: document.getElementById('cp-description').value,
                    repo_url: document.getElementById('cp-repo').value,
                    max_members: parseInt(document.getElementById('cp-max').value),
                    tech_stack: techStack
                });
<<<<<<< HEAD

=======
                
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
                document.getElementById('create-project-modal').remove();
                Toast.success('Project created! 🚀');
                App.navigate(`/projects/${result.id}`);
            } catch (error) { Toast.error(error.message); }
        });
    },

    async showEditModal(id) {
        try {
            const project = await API.projects.get(id);
            let skills = [];
            try { skills = await API.users.allSkills(); } catch(e) {}
            const techIds = (project.tech_stack || []).map(s => s.id);
<<<<<<< HEAD

=======
            
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
            const modalHtml = Components.modal('edit-project-modal', '<i data-lucide="edit"></i> Edit Project', `
                <form id="edit-project-form">
                    <div class="form-group">
                        <label>Title</label>
                        <input class="input-plain" id="ep-title" value="${Utils.escapeHtml(project.title)}" required>
                    </div>
                    <div class="form-group">
                        <label>Short Description</label>
                        <input class="input-plain" id="ep-short-desc" value="${Utils.escapeHtml(project.short_description || '')}">
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea class="mega-input" id="ep-description" required>${Utils.escapeHtml(project.description)}</textarea>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Status</label>
                            <select class="input-plain" id="ep-status">
                                <option value="planning" ${project.status==='planning'?'selected':''}>Planning</option>
                                <option value="active" ${project.status==='active'?'selected':''}>Active</option>
                                <option value="completed" ${project.status==='completed'?'selected':''}>Completed</option>
                                <option value="archived" ${project.status==='archived'?'selected':''}>Archived</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Max Members</label>
                            <input class="input-plain" id="ep-max" type="number" value="${project.max_members}" min="1">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Open for new members?</label>
                        <div style="display:flex;gap:8px;margin-top:4px">
                            <button type="button" class="chip-option ${project.is_open ? 'selected' : ''}" id="ep-open-yes" onclick="this.classList.add('selected');document.getElementById('ep-open-no').classList.remove('selected')">Yes</button>
                            <button type="button" class="chip-option ${!project.is_open ? 'selected' : ''}" id="ep-open-no" onclick="this.classList.add('selected');document.getElementById('ep-open-yes').classList.remove('selected')">No</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Tech Stack</label>
                        <div class="chip-select" id="ep-tech-stack">
                            ${skills.map(s => `<button type="button" class="chip-option ${techIds.includes(s.id)?'selected':''}" data-id="${s.id}" onclick="this.classList.toggle('selected')">${s.name}</button>`).join('')}
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary btn-full" style="margin-top:16px">Save Changes</button>
                </form>
            `);
<<<<<<< HEAD

            document.body.insertAdjacentHTML('beforeend', modalHtml);
            lucide.createIcons();

            document.getElementById('edit-project-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const techStack = [...document.querySelectorAll('#ep-tech-stack .selected')].map(el => parseInt(el.dataset.id));

=======
            
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            lucide.createIcons();
            
            document.getElementById('edit-project-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const techStack = [...document.querySelectorAll('#ep-tech-stack .selected')].map(el => parseInt(el.dataset.id));
                
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
                try {
                    await API.projects.update({
                        id: id,
                        title: document.getElementById('ep-title').value,
                        short_description: document.getElementById('ep-short-desc').value,
                        description: document.getElementById('ep-description').value,
                        status: document.getElementById('ep-status').value,
                        max_members: parseInt(document.getElementById('ep-max').value),
                        is_open: document.getElementById('ep-open-yes').classList.contains('selected') ? 1 : 0,
                        tech_stack: techStack
                    });
                    document.getElementById('edit-project-modal').remove();
                    Toast.success('Project updated! ✨');
                    this.renderDetail(id);
                } catch (error) { Toast.error(error.message); }
            });
        } catch (error) { Toast.error(error.message); }
    }
};
