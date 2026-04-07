const NotificationsModule = {
    pollTimer: null,
    isDropdownOpen: false,

    init() {

        document.getElementById('notif-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('.notif-dropdown') && !e.target.closest('.notif-btn')) {
                this.closeDropdown();
            }
        });

        document.getElementById('notif-mark-all').addEventListener('click', async () => {
            try {
                await API.notifications.markRead();
                this.poll();
                Toast.info('All notifications marked as read');
            } catch (e) {}
        });

        if (Auth.isAuthenticated) {
            this.startPolling();
        }
    },

    async toggleDropdown() {
        const dropdown = document.getElementById('notif-dropdown');
        if (this.isDropdownOpen) {
            this.closeDropdown();
        } else {
            dropdown.style.display = 'flex';
            this.isDropdownOpen = true;
            await this.loadNotifications();
        }
    },

    closeDropdown() {
        document.getElementById('notif-dropdown').style.display = 'none';
        this.isDropdownOpen = false;
    },

    async loadNotifications() {
        if (!Auth.isAuthenticated) return;
        const list = document.getElementById('notif-list');

        try {
            const data = await API.notifications.get({ limit: 15 });

            if (data.notifications.length === 0) {
                list.innerHTML = `
                    <div class="notif-empty">
                        <i data-lucide="bell-off"></i>
                        <p>No notifications yet</p>
                    </div>
                `;
            } else {
                list.innerHTML = data.notifications.map(n => {
                    const iconMap = {
                        'application_received': '📩',
                        'application_accepted': '🎉',
                        'application_rejected': '📋',
                        'member_request': '👋',
                        'request_accepted': '🎉',
                        'request_rejected': '❌',
                        'endorsement': '⭐',
                        'message': '💬'
                    };
                    const icon = iconMap[n.type] || '🔔';

                    return `
                        <div class="notif-item ${n.is_read ? '' : 'unread'}" onclick="NotificationsModule.handleClick(${n.id}, '${n.reference_type}', ${n.reference_id})" style="position:relative">
                            <div class="notif-icon">${icon}</div>
                            <div class="notif-info">
                                <div class="notif-title">${Utils.escapeHtml(n.title)}</div>
                                ${n.message ? `<div class="notif-message">${Utils.escapeHtml(n.message)}</div>` : ''}
                                <div class="notif-time">${Utils.timeAgo(n.created_at)}</div>
                            </div>
                        </div>
                    `;
                }).join('');
            }

            lucide.createIcons();
        } catch (e) {
            list.innerHTML = '<div class="notif-empty"><p>Failed to load</p></div>';
        }
    },

    async handleClick(notifId, refType, refId) {

        try { await API.notifications.markRead(notifId); } catch(e) {}

        this.closeDropdown();

        if (refType === 'project') {
            App.navigate(`/projects/${refId}`);
        } else if (refType === 'opportunity') {
            App.navigate(`/opportunities/${refId}`);
        } else if (refType === 'user') {
            App.navigate(`/messages/${refId}`);
        }

        this.poll();
    },

    async poll() {
        if (!Auth.isAuthenticated) return;
        try {
            const data = await API.notifications.get({ limit: 1 });

            const badge = document.getElementById('notif-badge');
            if (data.unread_count > 0) {
                badge.style.display = 'flex';
                badge.textContent = data.unread_count > 99 ? '99+' : data.unread_count;
            } else {
                badge.style.display = 'none';
            }

            const msgBadge = document.getElementById('msg-badge');
            if (data.unread_messages > 0) {
                msgBadge.style.display = 'inline-flex';
                msgBadge.textContent = data.unread_messages;
            } else {
                msgBadge.style.display = 'none';
            }
        } catch (e) {}
    },

    startPolling() {
        this.poll();
        this.pollTimer = setInterval(() => this.poll(), 15000);
    },

    stopPolling() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }

        document.getElementById('notif-badge').style.display = 'none';
        document.getElementById('msg-badge').style.display = 'none';
    }
};
