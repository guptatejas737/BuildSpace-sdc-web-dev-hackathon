<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="BuildSpace - Where developers connect, collaborate, and build amazing projects together. Find teammates, discover opportunities, and grow your network.">
    <meta name="keywords" content="developer, collaboration, hackathon, projects, teamwork, coding, student developers">
    <meta name="author" content="BuildSpace">
    <title>BuildSpace — Developer Collaboration Platform</title>
<<<<<<< HEAD

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">

    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

=======
    
    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    
    <!-- Styles -->
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
    <link rel="stylesheet" href="assets/css/main.css">
    <link rel="stylesheet" href="assets/css/components.css">
    <link rel="stylesheet" href="assets/css/pages.css">
</head>
<body>
<<<<<<< HEAD

=======
    <!-- Loading Screen -->
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
    <div id="loading-screen" class="loading-screen">
        <div class="loading-content">
            <div class="loading-logo">
                <div class="loading-icon">
                    <i data-lucide="rocket" class="loading-rocket"></i>
                </div>
                <h1 class="loading-title">Build<span>Space</span></h1>
            </div>
            <div class="loading-bar">
                <div class="loading-bar-fill"></div>
            </div>
        </div>
    </div>

<<<<<<< HEAD
    <div id="toast-container" class="toast-container"></div>

    <div id="app" class="app" style="display:none;">

=======
    <!-- Toast Container -->
    <div id="toast-container" class="toast-container"></div>

    <!-- App Shell -->
    <div id="app" class="app" style="display:none;">
        <!-- Sidebar Navigation -->
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
        <nav id="sidebar" class="sidebar">
            <div class="sidebar-header">
                <a href="#/" class="logo" id="nav-logo">
                    <div class="logo-icon">
                        <i data-lucide="rocket"></i>
                    </div>
                    <span class="logo-text">Build<span>Space</span></span>
                </a>
                <button id="sidebar-close" class="sidebar-close btn-icon">
                    <i data-lucide="x"></i>
                </button>
            </div>
<<<<<<< HEAD

=======
            
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
            <div class="sidebar-menu">
                <a href="#/" class="nav-item active" data-page="feed" id="nav-feed">
                    <i data-lucide="layout-dashboard"></i>
                    <span>Dashboard</span>
                </a>
                <a href="#/projects" class="nav-item" data-page="projects" id="nav-projects">
                    <i data-lucide="folder-kanban"></i>
                    <span>Projects</span>
                </a>
                <a href="#/opportunities" class="nav-item" data-page="opportunities" id="nav-opportunities">
                    <i data-lucide="compass"></i>
                    <span>Opportunities</span>
                </a>
                <a href="#/developers" class="nav-item" data-page="developers" id="nav-developers">
                    <i data-lucide="users"></i>
                    <span>Developers</span>
                </a>
                <a href="#/messages" class="nav-item" data-page="messages" id="nav-messages">
                    <i data-lucide="message-circle"></i>
                    <span>Messages</span>
                    <span id="msg-badge" class="nav-badge" style="display:none;">0</span>
                </a>
            </div>
<<<<<<< HEAD

=======
            
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
            <div class="sidebar-footer">
                <div id="sidebar-user" class="sidebar-user" style="display:none;">
                    <div class="sidebar-user-avatar" id="sidebar-avatar">
                        <i data-lucide="user"></i>
                    </div>
                    <div class="sidebar-user-info">
                        <span class="sidebar-user-name" id="sidebar-username">User</span>
                        <span class="sidebar-user-role" id="sidebar-role">student</span>
                    </div>
                    <button id="sidebar-settings-btn" class="btn-icon" title="Settings">
                        <i data-lucide="settings"></i>
                    </button>
                </div>
            </div>
        </nav>

<<<<<<< HEAD
        <main class="main-content">

=======
        <!-- Main Content Area -->
        <main class="main-content">
            <!-- Top Bar -->
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
            <header class="topbar">
                <div class="topbar-left">
                    <button id="mobile-menu-btn" class="btn-icon mobile-only">
                        <i data-lucide="menu"></i>
                    </button>
                    <div class="search-bar" id="global-search">
                        <i data-lucide="search" class="search-icon"></i>
                        <input type="text" id="search-input" placeholder="Search developers, projects, opportunities..." autocomplete="off">
                        <kbd class="search-kbd">⌘K</kbd>
                        <div id="search-results" class="search-results" style="display:none;"></div>
                    </div>
                </div>
                <div class="topbar-right">
                    <button id="theme-toggle" class="btn-icon" title="Toggle theme">
                        <i data-lucide="moon" id="theme-icon-dark"></i>
                        <i data-lucide="sun" id="theme-icon-light" style="display:none;"></i>
                    </button>
                    <button id="notif-btn" class="btn-icon notif-btn" title="Notifications">
                        <i data-lucide="bell"></i>
                        <span id="notif-badge" class="notif-badge" style="display:none;">0</span>
                    </button>
                    <div id="auth-buttons" class="auth-buttons">
                        <button id="login-btn" class="btn btn-ghost">Log In</button>
                        <button id="signup-btn" class="btn btn-primary">Sign Up</button>
                    </div>
                    <div id="user-menu" class="user-menu" style="display:none;">
                        <button id="user-menu-btn" class="user-menu-btn">
                            <div class="user-avatar-small" id="topbar-avatar">
                                <i data-lucide="user"></i>
                            </div>
                            <i data-lucide="chevron-down" class="user-menu-chevron"></i>
                        </button>
                        <div id="user-dropdown" class="user-dropdown" style="display:none;">
                            <a href="#" id="dropdown-profile" class="dropdown-item">
                                <i data-lucide="user"></i>
                                <span>My Profile</span>
                            </a>
                            <a href="#" id="dropdown-projects" class="dropdown-item">
                                <i data-lucide="folder-kanban"></i>
                                <span>My Projects</span>
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="#" id="dropdown-logout" class="dropdown-item dropdown-item-danger">
                                <i data-lucide="log-out"></i>
                                <span>Log Out</span>
                            </a>
                        </div>
                    </div>
                </div>
            </header>

<<<<<<< HEAD
            <div id="page-content" class="page-content">

=======
            <!-- Page Content -->
            <div id="page-content" class="page-content">
                <!-- Dynamic content loaded here -->
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
            </div>
        </main>
    </div>

<<<<<<< HEAD
=======
    <!-- Auth Modal -->
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
    <div id="auth-modal" class="modal" style="display:none;">
        <div class="modal-backdrop"></div>
        <div class="modal-content auth-modal-content">
            <button class="modal-close" id="auth-modal-close">
                <i data-lucide="x"></i>
            </button>
            <div class="auth-modal-header">
                <div class="auth-logo">
                    <i data-lucide="rocket"></i>
                </div>
                <h2 id="auth-modal-title">Welcome to BuildSpace</h2>
                <p id="auth-modal-subtitle">Connect, collaborate, and build amazing projects</p>
            </div>
<<<<<<< HEAD

=======
            
            <!-- Login Form -->
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
            <form id="login-form" class="auth-form">
                <div class="form-group">
                    <label for="login-email">Email or Username</label>
                    <div class="input-wrapper">
                        <i data-lucide="mail"></i>
                        <input type="text" id="login-email" placeholder="Enter email or username" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="login-password">Password</label>
                    <div class="input-wrapper">
                        <i data-lucide="lock"></i>
                        <input type="password" id="login-password" placeholder="Enter password" required>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary btn-full" id="login-submit">
                    <span>Log In</span>
                    <i data-lucide="arrow-right"></i>
                </button>
                <p class="auth-switch">
                    Don't have an account? <a href="#" id="switch-to-signup">Sign up</a>
                </p>
                <div class="demo-accounts">
                    <p class="demo-label">Quick Demo Login:</p>
                    <div class="demo-users">
                        <button type="button" class="demo-user-btn" data-login="arjun@demo.com">Arjun</button>
                        <button type="button" class="demo-user-btn" data-login="priya@demo.com">Priya</button>
                        <button type="button" class="demo-user-btn" data-login="sneha@demo.com">Sneha</button>
                        <button type="button" class="demo-user-btn" data-login="vikram@demo.com">Vikram</button>
                    </div>
                </div>
            </form>
<<<<<<< HEAD

=======
            
            <!-- Signup Form -->
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
            <form id="signup-form" class="auth-form" style="display:none;">
                <div class="form-row">
                    <div class="form-group">
                        <label for="signup-name">Full Name</label>
                        <div class="input-wrapper">
                            <i data-lucide="user"></i>
                            <input type="text" id="signup-name" placeholder="Your full name" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="signup-username">Username</label>
                        <div class="input-wrapper">
                            <i data-lucide="at-sign"></i>
                            <input type="text" id="signup-username" placeholder="Choose a username" required>
                        </div>
                    </div>
                </div>
                <div class="form-group">
                    <label for="signup-email">Email</label>
                    <div class="input-wrapper">
                        <i data-lucide="mail"></i>
                        <input type="email" id="signup-email" placeholder="your@email.com" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="signup-password">Password</label>
                    <div class="input-wrapper">
                        <i data-lucide="lock"></i>
                        <input type="password" id="signup-password" placeholder="Min. 6 characters" required minlength="6">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary btn-full" id="signup-submit">
                    <span>Create Account</span>
                    <i data-lucide="arrow-right"></i>
                </button>
                <p class="auth-switch">
                    Already have an account? <a href="#" id="switch-to-login">Log in</a>
                </p>
            </form>
        </div>
    </div>

<<<<<<< HEAD
=======
    <!-- Notification Dropdown -->
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
    <div id="notif-dropdown" class="notif-dropdown" style="display:none;">
        <div class="notif-header">
            <h3>Notifications</h3>
            <button id="notif-mark-all" class="btn btn-ghost btn-sm">Mark all read</button>
        </div>
        <div id="notif-list" class="notif-list">
            <div class="notif-empty">
                <i data-lucide="bell-off"></i>
                <p>No notifications yet</p>
            </div>
        </div>
    </div>

<<<<<<< HEAD
=======
    <!-- Scripts -->
>>>>>>> 404a8f27d37ca0f45112a3f672a1e9a0345c5b73
    <script src="assets/js/api.js"></script>
    <script src="assets/js/auth.js"></script>
    <script src="assets/js/components.js"></script>
    <script src="assets/js/feed.js"></script>
    <script src="assets/js/projects.js"></script>
    <script src="assets/js/opportunities.js"></script>
    <script src="assets/js/profile.js"></script>
    <script src="assets/js/messages.js"></script>
    <script src="assets/js/notifications.js"></script>
    <script src="assets/js/app.js"></script>
</body>
</html>
