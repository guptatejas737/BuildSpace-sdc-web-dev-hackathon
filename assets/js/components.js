/**
 * BuildSpace — Reusable UI Components
 */
const Components = {
    
    skillTag(skill, small = false) {
        const cls = small ? 'skill-tag' : `skill-tag ${skill.category || ''}`;
        return `<span class="${cls}" title="${skill.proficiency || ''}">${Utils.escapeHtml(skill.name)}</span>`;
    },

    skillTags(skills, max = 5) {
        if (!skills || !skills.length) return '';
        const shown = skills.slice(0, max);
        const extra = skills.length - max;
        let html = shown.map(s => this.skillTag(s)).join('');
        if (extra > 0) html += `<span class="skill-tag">+${extra}</span>`;
        return html;
    },

    statusBadge(status) {
        return `<span class="status-badge status-${status}">${status}</span>`;
    },

    typeBadge(type) {
        const labels = { teammate: '👥 Teammate', hiring: '💼 Hiring', hackathon: '🏆 Hackathon', opensource: '🌐 Open Source', mentorship: '🎓 Mentorship' };
        return `<span class="type-badge type-${type}">${labels[type] || type}</span>`;
    },

    avatar(user, size = 40) {
        if (user && user.avatar_url) {
            return `<img src="${user.avatar_url}" alt="${user.full_name}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;">`;
        }
        const initials = Utils.getInitials(user?.full_name || 'U');
        const color = Utils.generateAvatarColor(user?.full_name || 'U');
        return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${color};display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:${size * 0.35}px;flex-shrink:0">${initials}</div>`;
    },

    avatarStack(users, max = 4) {
        if (!users || !users.length) return '';
        let html = '<div class="avatar-stack">';
        const shown = users.slice(0, max);
        shown.forEach(u => {
            if (u.avatar_url) {
                html += `<div class="avatar"><img src="${u.avatar_url}" alt="${u.full_name}"></div>`;
            } else {
                const initials = Utils.getInitials(u.full_name);
                const color = Utils.generateAvatarColor(u.full_name);
                html += `<div class="avatar" style="background:${color}"><span style="color:white;font-size:0.6rem;font-weight:700">${initials}</span></div>`;
            }
        });
        if (users.length > max) {
            html += `<div class="avatar avatar-more">+${users.length - max}</div>`;
        }
        html += '</div>';
        return html;
    },

    deadlineBadge(deadline) {
        if (!deadline) return '';
        const days = Utils.daysUntil(deadline);
        if (days === null) return '';
        let cls = 'normal', text = '';
        if (days < 0) { cls = 'urgent'; text = 'Expired'; }
        else if (days === 0) { cls = 'urgent'; text = 'Today'; }
        else if (days <= 3) { cls = 'urgent'; text = `${days}d left`; }
        else if (days <= 7) { cls = 'soon'; text = `${days}d left`; }
        else { cls = 'normal'; text = `${days}d left`; }
        return `<span class="deadline-badge ${cls}"><i data-lucide="clock"></i> ${text}</span>`;
    },

    projectCard(project) {
        return `
            <div class="project-card" onclick="App.navigate('/projects/${project.id}')">
                <div class="project-card-header">
                    <h3 class="project-card-title">${Utils.escapeHtml(project.title)}</h3>
                    ${this.statusBadge(project.status)}
                </div>
                <p class="project-card-desc">${Utils.escapeHtml(project.short_description || project.description)}</p>
                <div class="project-card-tech skills-list">
                    ${this.skillTags(project.tech_stack, 4)}
                </div>
                <div class="project-card-footer">
                    <div class="project-creator">
                        ${this.avatar({full_name: project.creator_name, avatar_url: project.creator_avatar}, 24)}
                        <span class="project-creator-name">${Utils.escapeHtml(project.creator_name)}</span>
                    </div>
                    <div class="project-meta">
                        <span class="project-meta-item"><i data-lucide="users"></i> ${project.member_count || 0}/${project.max_members}</span>
                    </div>
                </div>
            </div>
        `;
    },

    opportunityCard(opp) {
        return `
            <div class="opportunity-card" onclick="App.navigate('/opportunities/${opp.id}')">
                <div class="opportunity-card-header">
                    <h3 class="opportunity-card-title">${Utils.escapeHtml(opp.title)}</h3>
                    ${this.typeBadge(opp.type)}
                </div>
                <p class="opportunity-card-desc">${Utils.escapeHtml(opp.description)}</p>
                <div class="opportunity-card-meta">
                    <span class="opportunity-card-meta-item"><i data-lucide="user"></i> ${Utils.escapeHtml(opp.creator_name)}</span>
                    ${opp.location ? `<span class="opportunity-card-meta-item"><i data-lucide="map-pin"></i> ${Utils.escapeHtml(opp.location)}</span>` : ''}
                    ${opp.is_remote ? '<span class="opportunity-card-meta-item"><i data-lucide="wifi"></i> Remote</span>' : ''}
                </div>
                <div class="opportunity-card-footer">
                    <span class="opportunity-card-meta-item"><i data-lucide="send"></i> ${opp.application_count || 0} applied</span>
                    ${this.deadlineBadge(opp.deadline)}
                </div>
            </div>
        `;
    },

    developerCard(user) {
        return `
            <div class="developer-card" onclick="App.navigate('/profile/${user.username}')">
                <div class="developer-card-avatar">
                    ${this.avatar(user, 72)}
                </div>
                <h3 class="developer-card-name">${Utils.escapeHtml(user.full_name)}</h3>
                <span class="developer-card-role">${user.role}</span>
                ${user.location ? `<div class="developer-card-location"><i data-lucide="map-pin"></i> ${Utils.escapeHtml(user.location)}</div>` : ''}
                ${user.bio ? `<p class="developer-card-bio">${Utils.escapeHtml(user.bio)}</p>` : ''}
                <div class="developer-card-skills skills-list">
                    ${this.skillTags(user.skills, 3)}
                </div>
            </div>
        `;
    },

    pagination(currentPage, totalPages, onPageChange) {
        if (totalPages <= 1) return '';
        let html = '<div class="pagination">';
        html += `<button class="pagination-btn" ${currentPage <= 1 ? 'disabled' : ''} onclick="${onPageChange}(${currentPage - 1})"><i data-lucide="chevron-left"></i></button>`;
        for (let i = 1; i <= Math.min(totalPages, 7); i++) {
            html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="${onPageChange}(${i})">${i}</button>`;
        }
        html += `<button class="pagination-btn" ${currentPage >= totalPages ? 'disabled' : ''} onclick="${onPageChange}(${currentPage + 1})"><i data-lucide="chevron-right"></i></button>`;
        html += '</div>';
        return html;
    },

    emptyState(icon, title, message, actionHtml = '') {
        return `
            <div class="empty-state">
                <div class="empty-state-icon"><i data-lucide="${icon}"></i></div>
                <h3>${title}</h3>
                <p>${message}</p>
                ${actionHtml}
            </div>
        `;
    },

    loadingSkeletons(count = 3) {
        let html = '';
        for (let i = 0; i < count; i++) {
            html += `
                <div class="card">
                    <div class="skeleton skeleton-title"></div>
                    <div class="skeleton skeleton-text"></div>
                    <div class="skeleton skeleton-text sm"></div>
                </div>
            `;
        }
        return html;
    },

    modal(id, title, bodyHtml, footerHtml = '', large = false) {
        return `
            <div id="${id}" class="modal" style="display:flex;">
                <div class="modal-backdrop" onclick="document.getElementById('${id}').style.display='none'"></div>
                <div class="modal-content ${large ? 'modal-content-lg' : ''} create-modal-content">
                    <button class="modal-close" onclick="document.getElementById('${id}').style.display='none'">
                        <i data-lucide="x"></i>
                    </button>
                    <h2 class="create-modal-title">${title}</h2>
                    ${bodyHtml}
                    ${footerHtml ? `<div class="detail-footer">${footerHtml}</div>` : ''}
                </div>
            </div>
        `;
    }
};
