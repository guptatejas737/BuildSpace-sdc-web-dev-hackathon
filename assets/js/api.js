/**
 * BuildSpace — API Client
 * Centralized API communication layer
 */
const API = {
    baseUrl: '',

    async request(url, options = {}) {
        const defaultOptions = {
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin'
        };
        
        const config = { ...defaultOptions, ...options };
        if (options.body && typeof options.body === 'object') {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(this.baseUrl + url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`);
            }
            
            return data;
        } catch (error) {
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Network error. Please check your connection.');
            }
            throw error;
        }
    },

    get(url) { return this.request(url); },
    post(url, body) { return this.request(url, { method: 'POST', body }); },
    put(url, body) { return this.request(url, { method: 'PUT', body }); },
    delete(url) { return this.request(url, { method: 'DELETE' }); },

    // Auth
    auth: {
        login: (data) => API.post('api/auth/login.php', data),
        register: (data) => API.post('api/auth/register.php', data),
        logout: () => API.get('api/auth/logout.php'),
        session: () => API.get('api/auth/session.php'),
    },

    // Users
    users: {
        profile: (idOrUsername) => API.get(`api/users/profile.php?${isNaN(idOrUsername) ? 'username' : 'id'}=${idOrUsername}`),
        myProfile: () => API.get('api/users/profile.php'),
        updateProfile: (data) => API.put('api/users/profile.php', data),
        search: (params) => API.get(`api/users/search.php?${new URLSearchParams(params)}`),
        skills: (userId) => API.get(`api/users/skills.php?user_id=${userId}`),
        allSkills: (category) => API.get(`api/users/skills.php${category ? `?category=${category}` : ''}`),
        addSkill: (data) => API.post('api/users/skills.php', data),
        removeSkill: (skillId) => API.delete(`api/users/skills.php?skill_id=${skillId}`),
        endorse: (data) => API.post('api/users/endorse.php', data),
        unendorse: (userId, skillId) => API.delete(`api/users/endorse.php?user_id=${userId}&skill_id=${skillId}`),
    },

    // Projects
    projects: {
        list: (params = {}) => API.get(`api/projects/index.php?${new URLSearchParams(params)}`),
        get: (id) => API.get(`api/projects/index.php?id=${id}`),
        create: (data) => API.post('api/projects/index.php', data),
        update: (data) => API.put('api/projects/index.php', data),
        delete: (id) => API.delete(`api/projects/index.php?id=${id}`),
        join: (projectId) => API.post('api/projects/members.php', { project_id: projectId }),
        handleMember: (data) => API.put('api/projects/members.php', data),
        leave: (projectId) => API.delete(`api/projects/members.php?project_id=${projectId}`),
    },

    // Opportunities
    opportunities: {
        list: (params = {}) => API.get(`api/opportunities/index.php?${new URLSearchParams(params)}`),
        get: (id) => API.get(`api/opportunities/index.php?id=${id}`),
        create: (data) => API.post('api/opportunities/index.php', data),
        update: (data) => API.put('api/opportunities/index.php', data),
        delete: (id) => API.delete(`api/opportunities/index.php?id=${id}`),
        apply: (data) => API.post('api/opportunities/applications.php', data),
        handleApplication: (data) => API.put('api/opportunities/applications.php', data),
    },

    // Feed
    feed: {
        get: (params = {}) => API.get(`api/feed/index.php?${new URLSearchParams(params)}`),
    },

    // Messages
    messages: {
        conversations: () => API.get('api/messages/index.php'),
        getMessages: (userId) => API.get(`api/messages/index.php?user_id=${userId}`),
        send: (data) => API.post('api/messages/index.php', data),
    },

    // Notifications
    notifications: {
        get: (params = {}) => API.get(`api/notifications/index.php?${new URLSearchParams(params)}`),
        markRead: (id) => API.put('api/notifications/index.php', id ? { id } : {}),
    },
};

// Toast notification system
const Toast = {
    show(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'alert-circle',
            warning: 'alert-triangle',
            info: 'info'
        };
        
        toast.innerHTML = `
            <div class="toast-icon"><i data-lucide="${icons[type]}"></i></div>
            <span class="toast-message">${message}</span>
            <div class="toast-progress"></div>
        `;
        
        container.appendChild(toast);
        lucide.createIcons({ nodes: [toast] });
        
        setTimeout(() => {
            toast.classList.add('toast-out');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    success: (msg) => Toast.show(msg, 'success'),
    error: (msg) => Toast.show(msg, 'error'),
    warning: (msg) => Toast.show(msg, 'warning'),
    info: (msg) => Toast.show(msg, 'info'),
};

// Utility functions
const Utils = {
    timeAgo(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 60) return 'just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },

    formatDate(dateStr) {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    },

    daysUntil(dateStr) {
        if (!dateStr) return null;
        const diff = new Date(dateStr) - new Date();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    },

    truncate(str, len = 100) {
        if (!str) return '';
        return str.length > len ? str.substring(0, len) + '...' : str;
    },

    debounce(func, delay = 300) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    },

    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    getInitials(name) {
        return (name || 'U').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    },

    generateAvatarColor(name) {
        let hash = 0;
        for (let i = 0; i < (name || '').length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = hash % 360;
        return `hsl(${hue}, 60%, 50%)`;
    }
};
