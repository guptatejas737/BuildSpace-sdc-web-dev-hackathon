<<<<<<< HEAD
=======
/**
 * BuildSpace — Auth Module
 * Handles login, signup, session management
 */
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
const Auth = {
    currentUser: null,
    isAuthenticated: false,

    async init() {
        try {
            const data = await API.auth.session();
            if (data.authenticated && data.user) {
                this.currentUser = data.user;
                this.isAuthenticated = true;
                this.updateUI();
            }
        } catch (e) {
            console.log('Not authenticated');
        }
    },

    updateUI() {
        const authButtons = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu');
        const sidebarUser = document.getElementById('sidebar-user');
<<<<<<< HEAD

=======
        
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
        if (this.isAuthenticated && this.currentUser) {
            authButtons.style.display = 'none';
            userMenu.style.display = 'block';
            sidebarUser.style.display = 'flex';
<<<<<<< HEAD

            document.getElementById('sidebar-username').textContent = this.currentUser.full_name;
            document.getElementById('sidebar-role').textContent = this.currentUser.role;

=======
            
            document.getElementById('sidebar-username').textContent = this.currentUser.full_name;
            document.getElementById('sidebar-role').textContent = this.currentUser.role;
            
            // Update avatars
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
            const avatarInitials = Utils.getInitials(this.currentUser.full_name);
            const avatarElements = ['sidebar-avatar', 'topbar-avatar'];
            avatarElements.forEach(id => {
                const el = document.getElementById(id);
                if (this.currentUser.avatar_url) {
                    el.innerHTML = `<img src="${this.currentUser.avatar_url}" alt="${this.currentUser.full_name}">`;
                } else {
                    el.style.background = Utils.generateAvatarColor(this.currentUser.full_name);
                    el.innerHTML = `<span style="color:white;font-weight:700;font-size:0.75rem">${avatarInitials}</span>`;
                }
            });
        } else {
            authButtons.style.display = 'flex';
            userMenu.style.display = 'none';
            sidebarUser.style.display = 'none';
        }
    },

    showModal(mode = 'login') {
        const modal = document.getElementById('auth-modal');
        const loginForm = document.getElementById('login-form');
        const signupForm = document.getElementById('signup-form');
        const title = document.getElementById('auth-modal-title');
        const subtitle = document.getElementById('auth-modal-subtitle');
<<<<<<< HEAD

        modal.style.display = 'flex';

=======
        
        modal.style.display = 'flex';
        
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
        if (mode === 'login') {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
            title.textContent = 'Welcome Back';
            subtitle.textContent = 'Log in to continue building amazing projects';
        } else {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
            title.textContent = 'Join BuildSpace';
            subtitle.textContent = 'Create your developer profile and start collaborating';
        }
    },

    hideModal() {
        document.getElementById('auth-modal').style.display = 'none';
    },

    async login(login, password) {
        try {
            const data = await API.auth.login({ login, password });
            this.currentUser = data.user;
            this.isAuthenticated = true;
            this.updateUI();
            this.hideModal();
            Toast.success(`Welcome back, ${data.user.full_name}! 🎉`);
            App.navigate('/');
            NotificationsModule.startPolling();
        } catch (error) {
            Toast.error(error.message);
        }
    },

    async register(fullName, username, email, password) {
        try {
            const data = await API.auth.register({
                full_name: fullName,
                username: username,
                email: email,
                password: password
            });
            this.currentUser = data.user;
            this.isAuthenticated = true;
            this.updateUI();
            this.hideModal();
            Toast.success(`Welcome to BuildSpace, ${fullName}! 🚀`);
            App.navigate('/profile/edit');
        } catch (error) {
            Toast.error(error.message);
        }
    },

    async logout() {
        try {
            await API.auth.logout();
        } catch (e) {}
        this.currentUser = null;
        this.isAuthenticated = false;
        this.updateUI();
        NotificationsModule.stopPolling();
        Toast.info('Logged out successfully');
        App.navigate('/');
    },

    requireAuth() {
        if (!this.isAuthenticated) {
            this.showModal('login');
            Toast.warning('Please log in to continue');
            return false;
        }
        return true;
    },

    setupEventListeners() {
<<<<<<< HEAD

=======
        // Login/signup buttons
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
        document.getElementById('login-btn').addEventListener('click', () => this.showModal('login'));
        document.getElementById('signup-btn').addEventListener('click', () => this.showModal('signup'));
        document.getElementById('auth-modal-close').addEventListener('click', () => this.hideModal());
        document.getElementById('switch-to-signup').addEventListener('click', (e) => { e.preventDefault(); this.showModal('signup'); });
        document.getElementById('switch-to-login').addEventListener('click', (e) => { e.preventDefault(); this.showModal('login'); });
<<<<<<< HEAD

        document.querySelector('#auth-modal .modal-backdrop').addEventListener('click', () => this.hideModal());

=======
        
        // Modal backdrop close
        document.querySelector('#auth-modal .modal-backdrop').addEventListener('click', () => this.hideModal());
        
        // Login form
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const login = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            this.login(login, password);
        });

<<<<<<< HEAD
=======
        // Signup form
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
        document.getElementById('signup-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = document.getElementById('signup-name').value;
            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            this.register(fullName, username, email, password);
        });

<<<<<<< HEAD
=======
        // Demo login buttons
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
        document.querySelectorAll('.demo-user-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.login(btn.dataset.login, 'password123');
            });
        });

<<<<<<< HEAD
=======
        // User dropdown
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
        document.getElementById('user-menu-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = document.getElementById('user-dropdown');
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

        document.addEventListener('click', () => {
            document.getElementById('user-dropdown').style.display = 'none';
        });

        document.getElementById('dropdown-profile').addEventListener('click', (e) => {
            e.preventDefault();
            if (this.currentUser) App.navigate(`/profile/${this.currentUser.username}`);
        });

        document.getElementById('dropdown-projects').addEventListener('click', (e) => {
            e.preventDefault();
            App.navigate('/projects');
        });

        document.getElementById('dropdown-logout').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

<<<<<<< HEAD
=======
        // Sidebar settings button
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
        document.getElementById('sidebar-settings-btn').addEventListener('click', () => {
            if (this.currentUser) App.navigate(`/profile/${this.currentUser.username}`);
        });
    }
};
