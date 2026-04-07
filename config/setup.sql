-- BuildSpace Database Setup
-- Run this file to create the database and all tables

CREATE DATABASE IF NOT EXISTS buildspace CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE buildspace;

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    bio TEXT DEFAULT NULL,
    avatar_url VARCHAR(500) DEFAULT NULL,
    github_url VARCHAR(255) DEFAULT NULL,
    linkedin_url VARCHAR(255) DEFAULT NULL,
    portfolio_url VARCHAR(255) DEFAULT NULL,
    location VARCHAR(100) DEFAULT NULL,
    role ENUM('student', 'mentor', 'organizer') DEFAULT 'student',
    is_online TINYINT(1) DEFAULT 0,
    last_seen DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_role (role)
) ENGINE=InnoDB;

-- ============================================================
-- SKILLS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    category ENUM('frontend', 'backend', 'devops', 'design', 'data', 'mobile', 'other') NOT NULL,
    icon VARCHAR(50) DEFAULT NULL,
    INDEX idx_category (category)
) ENGINE=InnoDB;

-- ============================================================
-- USER_SKILLS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS user_skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    proficiency ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner',
    UNIQUE KEY unique_user_skill (user_id, skill_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- SKILL ENDORSEMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS skill_endorsements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    endorser_id INT NOT NULL,
    endorsed_user_id INT NOT NULL,
    skill_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_endorsement (endorser_id, endorsed_user_id, skill_id),
    FOREIGN KEY (endorser_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (endorsed_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- PROJECTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(300) DEFAULT NULL,
    status ENUM('planning', 'active', 'completed', 'archived') DEFAULT 'planning',
    repo_url VARCHAR(255) DEFAULT NULL,
    demo_url VARCHAR(255) DEFAULT NULL,
    image_url VARCHAR(500) DEFAULT NULL,
    max_members INT DEFAULT 5,
    is_open TINYINT(1) DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_creator (creator_id)
) ENGINE=InnoDB;

-- ============================================================
-- PROJECT TECH STACK TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS project_tech_stack (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    skill_id INT NOT NULL,
    UNIQUE KEY unique_project_skill (project_id, skill_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- PROJECT MEMBERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS project_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('owner', 'admin', 'member') DEFAULT 'member',
    status ENUM('pending', 'active', 'left', 'removed') DEFAULT 'pending',
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_project_member (project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status)
) ENGINE=InnoDB;

-- ============================================================
-- OPPORTUNITIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS opportunities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    creator_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    type ENUM('teammate', 'hiring', 'hackathon', 'opensource', 'mentorship') NOT NULL,
    status ENUM('open', 'closed') DEFAULT 'open',
    skills_required TEXT DEFAULT NULL,
    location VARCHAR(100) DEFAULT NULL,
    is_remote TINYINT(1) DEFAULT 1,
    deadline DATETIME DEFAULT NULL,
    max_applicants INT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_type (type),
    INDEX idx_status (status),
    INDEX idx_deadline (deadline)
) ENGINE=InnoDB;

-- ============================================================
-- OPPORTUNITY APPLICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS opportunity_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    opportunity_id INT NOT NULL,
    user_id INT NOT NULL,
    message TEXT DEFAULT NULL,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_application (opportunity_id, user_id),
    FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
-- FEED ACTIVITIES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS feed_activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('project_created', 'member_joined', 'opportunity_posted', 'skill_added', 'profile_updated', 'project_completed', 'endorsement_given') NOT NULL,
    reference_id INT DEFAULT NULL,
    reference_type VARCHAR(50) DEFAULT NULL,
    metadata JSON DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_created (created_at),
    INDEX idx_type (type)
) ENGINE=InnoDB;

-- ============================================================
-- MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_conversation (sender_id, receiver_id),
    INDEX idx_unread (receiver_id, is_read)
) ENGINE=InnoDB;

-- ============================================================
-- NOTIFICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT DEFAULT NULL,
    reference_id INT DEFAULT NULL,
    reference_type VARCHAR(50) DEFAULT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_unread (user_id, is_read),
    INDEX idx_created (created_at)
) ENGINE=InnoDB;

-- ============================================================
-- SEED DATA: SKILLS
-- ============================================================
INSERT INTO skills (name, category, icon) VALUES
-- Frontend
('JavaScript', 'frontend', 'code'),
('TypeScript', 'frontend', 'code'),
('React', 'frontend', 'component'),
('Vue.js', 'frontend', 'component'),
('Angular', 'frontend', 'component'),
('Next.js', 'frontend', 'layout'),
('HTML/CSS', 'frontend', 'palette'),
('Tailwind CSS', 'frontend', 'paintbrush'),
('Svelte', 'frontend', 'component'),
-- Backend
('Node.js', 'backend', 'server'),
('Python', 'backend', 'code'),
('Java', 'backend', 'coffee'),
('PHP', 'backend', 'code'),
('Go', 'backend', 'terminal'),
('Rust', 'backend', 'shield'),
('Ruby', 'backend', 'gem'),
('C++', 'backend', 'cpu'),
('Express.js', 'backend', 'server'),
('Django', 'backend', 'layout'),
('Flask', 'backend', 'flask-conical'),
('Spring Boot', 'backend', 'leaf'),
-- DevOps
('Docker', 'devops', 'container'),
('Kubernetes', 'devops', 'network'),
('AWS', 'devops', 'cloud'),
('GCP', 'devops', 'cloud'),
('Azure', 'devops', 'cloud'),
('CI/CD', 'devops', 'git-branch'),
('Linux', 'devops', 'terminal'),
('Terraform', 'devops', 'blocks'),
-- Design
('Figma', 'design', 'figma'),
('UI/UX Design', 'design', 'palette'),
('Adobe XD', 'design', 'pen-tool'),
('Photoshop', 'design', 'image'),
-- Data
('SQL', 'data', 'database'),
('MongoDB', 'data', 'database'),
('PostgreSQL', 'data', 'database'),
('Redis', 'data', 'database'),
('Machine Learning', 'data', 'brain'),
('TensorFlow', 'data', 'brain'),
('Data Science', 'data', 'bar-chart'),
-- Mobile
('React Native', 'mobile', 'smartphone'),
('Flutter', 'mobile', 'smartphone'),
('Swift', 'mobile', 'apple'),
('Kotlin', 'mobile', 'smartphone'),
('Android', 'mobile', 'smartphone'),
('iOS', 'mobile', 'smartphone'),
-- Other
('Git', 'other', 'git-branch'),
('REST APIs', 'other', 'globe'),
('GraphQL', 'other', 'share-2'),
('WebSockets', 'other', 'wifi'),
('Blockchain', 'other', 'link'),
('Cybersecurity', 'other', 'shield');

-- ============================================================
-- SEED DATA: DEMO USERS (password is 'password123' for all)
-- ============================================================
INSERT INTO users (username, email, password_hash, full_name, bio, github_url, linkedin_url, location, role) VALUES
('arjun_dev', 'arjun@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Arjun Sharma', 'Full-stack developer passionate about building scalable web applications. Love React and Node.js. Always up for a hackathon! 🚀', 'https://github.com/arjundev', 'https://linkedin.com/in/arjundev', 'Mumbai, India', 'student'),
('priya_codes', 'priya@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Priya Patel', 'ML enthusiast & backend wizard. Building intelligent systems one API at a time. Open source contributor 💻', 'https://github.com/priyacodes', 'https://linkedin.com/in/priyacodes', 'Bangalore, India', 'student'),
('rahul_builds', 'rahul@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Rahul Verma', 'DevOps engineer in the making. Docker, K8s, and cloud infrastructure. Helping teams ship faster ☁️', 'https://github.com/rahulbuilds', 'https://linkedin.com/in/rahulbuilds', 'Delhi, India', 'student'),
('sneha_ui', 'sneha@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sneha Gupta', 'UI/UX designer turned frontend developer. Crafting beautiful, accessible interfaces. Figma + React = ❤️', 'https://github.com/snehaui', 'https://linkedin.com/in/snehaui', 'Pune, India', 'student'),
('vikram_ai', 'vikram@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Vikram Singh', 'AI/ML researcher and Python enthusiast. Working on NLP and computer vision projects. Let''s collaborate! 🤖', 'https://github.com/vikramai', 'https://linkedin.com/in/vikramai', 'Hyderabad, India', 'student'),
('ananya_flutter', 'ananya@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ananya Krishnan', 'Mobile app developer specializing in Flutter & React Native. Building cross-platform magic 📱', 'https://github.com/ananyaflutter', 'https://linkedin.com/in/ananyaflutter', 'Chennai, India', 'student'),
('prof_kumar', 'kumar@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Prof. Rajesh Kumar', 'CS Professor with 15+ years experience. Mentoring the next generation of developers. Specializing in distributed systems.', 'https://github.com/profkumar', 'https://linkedin.com/in/profkumar', 'IIT Delhi', 'mentor'),
('hackathon_org', 'org@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'DevFest Organizers', 'We organize hackathons, coding competitions, and tech meetups across India. Join our next event! 🎉', NULL, 'https://linkedin.com/company/devfest', 'Pan India', 'organizer');

-- ============================================================
-- SEED DATA: USER SKILLS
-- ============================================================
INSERT INTO user_skills (user_id, skill_id, proficiency) VALUES
-- Arjun (full-stack)
(1, 1, 'expert'), (1, 3, 'advanced'), (1, 10, 'advanced'), (1, 6, 'intermediate'), (1, 7, 'expert'), (1, 47, 'advanced'), (1, 48, 'advanced'),
-- Priya (ML + backend)
(2, 11, 'expert'), (2, 39, 'advanced'), (2, 40, 'intermediate'), (2, 19, 'advanced'), (2, 34, 'advanced'), (2, 36, 'intermediate'), (2, 47, 'advanced'),
-- Rahul (DevOps)
(3, 22, 'expert'), (3, 23, 'advanced'), (3, 24, 'advanced'), (3, 28, 'advanced'), (3, 11, 'intermediate'), (3, 14, 'intermediate'), (3, 47, 'expert'),
-- Sneha (Design + Frontend)
(4, 30, 'expert'), (4, 31, 'expert'), (4, 7, 'expert'), (4, 3, 'advanced'), (4, 1, 'advanced'), (4, 8, 'advanced'),
-- Vikram (AI/ML)
(5, 11, 'expert'), (5, 39, 'expert'), (5, 40, 'advanced'), (5, 41, 'advanced'), (5, 34, 'advanced'), (5, 49, 'intermediate'),
-- Ananya (Mobile)
(6, 43, 'expert'), (6, 42, 'advanced'), (6, 45, 'advanced'), (6, 1, 'advanced'), (6, 3, 'intermediate'), (6, 47, 'advanced');

-- ============================================================
-- SEED DATA: SKILL ENDORSEMENTS
-- ============================================================
INSERT INTO skill_endorsements (endorser_id, endorsed_user_id, skill_id) VALUES
(2, 1, 1), (3, 1, 3), (4, 1, 7), (5, 1, 10),
(1, 2, 11), (3, 2, 39), (5, 2, 19),
(1, 3, 22), (2, 3, 24), (5, 3, 47),
(1, 4, 30), (2, 4, 7), (6, 4, 3),
(2, 5, 39), (3, 5, 11), (1, 5, 40),
(1, 6, 43), (4, 6, 42), (5, 6, 45);

-- ============================================================
-- SEED DATA: PROJECTS
-- ============================================================
INSERT INTO projects (creator_id, title, description, short_description, status, repo_url, max_members, is_open) VALUES
(1, 'EcoTrack - Carbon Footprint Tracker', 'A comprehensive web application that helps individuals and organizations track, analyze, and reduce their carbon footprint. Features include daily activity logging, AI-powered suggestions for reducing emissions, community challenges, and detailed analytics dashboards. Built with React, Node.js, and PostgreSQL.', 'Track and reduce your carbon footprint with AI-powered insights and community challenges.', 'active', 'https://github.com/arjundev/ecotrack', 5, 1),
(2, 'MedAssist - AI Health Companion', 'An intelligent health assistant that uses machine learning to provide preliminary health assessments based on symptoms. Includes a medication reminder system, health journal, and integration with wearable devices. Built with Python/Flask backend and React frontend. Uses TensorFlow for the ML model.', 'AI-powered health companion for symptom analysis and medication management.', 'planning', 'https://github.com/priyacodes/medassist', 4, 1),
(4, 'DesignHub - Collaborative Design Platform', 'A real-time collaborative design tool for teams. Features include shared canvases, component libraries, design system management, and version control for designs. Think Figma meets GitHub for design assets. Built with Canvas API, WebSockets, and Vue.js.', 'Real-time collaborative design tool with version control for design assets.', 'active', 'https://github.com/snehaui/designhub', 6, 1),
(5, 'SmartFarm - Agricultural AI', 'Using computer vision and IoT sensors to help farmers optimize crop yields. Features include disease detection from plant images, weather-based irrigation recommendations, and market price predictions. Built with Python, TensorFlow, and React Native for the mobile app.', 'AI-powered agricultural platform for crop optimization and disease detection.', 'active', 'https://github.com/vikramai/smartfarm', 5, 1),
(6, 'CampusConnect - University Social App', 'A mobile-first social platform for university students. Features include event discovery, study group formation, lost & found, anonymous confessions, and campus marketplace. Built with Flutter and Firebase.', 'University social platform for events, study groups, and campus life.', 'completed', 'https://github.com/ananyaflutter/campusconnect', 4, 0),
(1, 'CodeReview Bot', 'An automated code review tool that uses GPT APIs to analyze pull requests and provide intelligent feedback. Supports multiple languages and can be integrated as a GitHub Action. Catches bugs, suggests improvements, and enforces coding standards automatically.', 'Automated AI-powered code review bot for GitHub pull requests.', 'planning', 'https://github.com/arjundev/codereview-bot', 3, 1);

-- ============================================================
-- SEED DATA: PROJECT TECH STACKS
-- ============================================================
INSERT INTO project_tech_stack (project_id, skill_id) VALUES
-- EcoTrack
(1, 3), (1, 10), (1, 36), (1, 1), (1, 7),
-- MedAssist
(2, 11), (2, 20), (2, 3), (2, 40), (2, 36),
-- DesignHub
(3, 4), (3, 1), (3, 50), (3, 7), (3, 10),
-- SmartFarm
(4, 11), (4, 40), (4, 42), (4, 3), (4, 39),
-- CampusConnect
(5, 43), (5, 1), (5, 30),
-- CodeReview Bot
(6, 11), (6, 1), (6, 10), (6, 48);

-- ============================================================
-- SEED DATA: PROJECT MEMBERS
-- ============================================================
INSERT INTO project_members (project_id, user_id, role, status) VALUES
-- EcoTrack
(1, 1, 'owner', 'active'), (1, 4, 'member', 'active'), (1, 3, 'member', 'active'),
-- MedAssist
(2, 2, 'owner', 'active'), (2, 5, 'member', 'active'),
-- DesignHub
(3, 4, 'owner', 'active'), (3, 1, 'member', 'active'), (3, 6, 'member', 'active'),
-- SmartFarm
(4, 5, 'owner', 'active'), (4, 2, 'member', 'active'), (4, 3, 'member', 'pending'),
-- CampusConnect
(5, 6, 'owner', 'active'), (5, 4, 'member', 'active'),
-- CodeReview Bot
(6, 1, 'owner', 'active');

-- ============================================================
-- SEED DATA: OPPORTUNITIES
-- ============================================================
INSERT INTO opportunities (creator_id, title, description, type, status, skills_required, location, is_remote, deadline) VALUES
(1, 'Frontend Developer for EcoTrack', 'Looking for a passionate frontend developer to help build the analytics dashboard for EcoTrack. Must be proficient in React and data visualization (D3.js or Chart.js). This is a great opportunity to work on a project that makes a real environmental impact!', 'teammate', 'open', 'React, JavaScript, D3.js', 'Remote', 1, DATE_ADD(NOW(), INTERVAL 14 DAY)),
(7, 'Summer Research Internship - Distributed Systems', 'Join our research lab for a summer internship focused on distributed systems and cloud computing. Work on cutting-edge problems in consensus algorithms and fault tolerance. Stipend provided. Open to 3rd and 4th year CS students.', 'hiring', 'open', 'Python, Go, Distributed Systems', 'IIT Delhi', 0, DATE_ADD(NOW(), INTERVAL 30 DAY)),
(8, 'HackIndia 2026 - Team Formation', 'Looking for team members for HackIndia 2026, one of India''s largest hackathons! We need: 1 Frontend Dev, 1 Backend Dev, 1 ML Engineer. Prize pool of ₹10 lakhs. Let''s build something amazing together! 🏆', 'hackathon', 'open', 'Any web/mobile/ML skills', 'Bangalore, India', 0, DATE_ADD(NOW(), INTERVAL 7 DAY)),
(2, 'Open Source Contributors for MedAssist', 'MedAssist is looking for open source contributors! We need help with: - Building the medication reminder API - Improving the ML symptom checker model - Writing unit tests - Creating documentation. All contributions welcome, from beginners to experts!', 'opensource', 'open', 'Python, Flask, TensorFlow, React', 'Remote', 1, NULL),
(7, 'Mentorship: Getting Started with System Design', 'Offering free mentorship sessions on system design fundamentals. Topics include: load balancing, caching, database sharding, microservices architecture. Sessions will be 1-on-1, 1 hour per week for 8 weeks. Limited to 5 mentees.', 'mentorship', 'open', 'Basic programming knowledge', 'Online', 1, DATE_ADD(NOW(), INTERVAL 21 DAY)),
(5, 'ML Engineer for SmartFarm', 'We need an ML engineer to help build the crop disease detection model. Experience with computer vision (OpenCV, TensorFlow) is required. This is a socially impactful project!', 'teammate', 'open', 'Python, TensorFlow, Computer Vision', 'Remote', 1, DATE_ADD(NOW(), INTERVAL 10 DAY)),
(4, 'UI/UX Designer for DesignHub', 'Seeking a talented UI/UX designer to help design the collaborative canvas interface for DesignHub. Must have strong Figma skills and understanding of design systems. Bonus if you know Canvas API.', 'teammate', 'open', 'Figma, UI/UX Design, JavaScript', 'Remote', 1, DATE_ADD(NOW(), INTERVAL 20 DAY)),
(8, 'Campus Ambassador Program', 'Become a DevFest Campus Ambassador! Help organize coding events, hackathons, and tech talks at your college. Perks include: exclusive swag, networking with industry leaders, certificate of recognition, and potential internship referrals.', 'hiring', 'open', 'Communication, Event Management', 'Pan India', 0, DATE_ADD(NOW(), INTERVAL 45 DAY));

-- ============================================================
-- SEED DATA: OPPORTUNITY APPLICATIONS
-- ============================================================
INSERT INTO opportunity_applications (opportunity_id, user_id, message, status) VALUES
(1, 4, 'Hi! I''m a frontend developer with strong React and CSS skills. I''d love to help build the analytics dashboard. I have experience with Chart.js and Recharts.', 'accepted'),
(3, 1, 'I''m a full-stack dev and I''d love to participate in HackIndia! I can handle the frontend/backend work.', 'pending'),
(3, 2, 'ML engineer here! I can handle the AI/ML component of our hackathon project. Let''s win this! 🚀', 'pending'),
(4, 3, 'I''d like to contribute to the DevOps side - setting up CI/CD pipelines and Docker containers for MedAssist.', 'accepted'),
(5, 1, 'I''m very interested in learning system design. Currently building scalable apps and want to deepen my knowledge.', 'accepted'),
(6, 2, 'I have extensive experience with TensorFlow and computer vision. Would love to help with the disease detection model!', 'pending');

-- ============================================================
-- SEED DATA: FEED ACTIVITIES
-- ============================================================
INSERT INTO feed_activities (user_id, type, reference_id, reference_type, metadata, created_at) VALUES
(1, 'project_created', 1, 'project', '{"title": "EcoTrack - Carbon Footprint Tracker"}', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 'project_created', 2, 'project', '{"title": "MedAssist - AI Health Companion"}', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(4, 'member_joined', 1, 'project', '{"project_title": "EcoTrack", "user_name": "Sneha Gupta"}', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(4, 'project_created', 3, 'project', '{"title": "DesignHub - Collaborative Design Platform"}', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(5, 'project_created', 4, 'project', '{"title": "SmartFarm - Agricultural AI"}', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(1, 'opportunity_posted', 1, 'opportunity', '{"title": "Frontend Developer for EcoTrack"}', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(8, 'opportunity_posted', 3, 'opportunity', '{"title": "HackIndia 2026 - Team Formation"}', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(3, 'member_joined', 1, 'project', '{"project_title": "EcoTrack", "user_name": "Rahul Verma"}', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(5, 'member_joined', 2, 'project', '{"project_title": "MedAssist", "user_name": "Vikram Singh"}', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, 'opportunity_posted', 4, 'opportunity', '{"title": "Open Source Contributors for MedAssist"}', DATE_SUB(NOW(), INTERVAL 12 HOUR)),
(7, 'opportunity_posted', 5, 'opportunity', '{"title": "Mentorship: System Design"}', DATE_SUB(NOW(), INTERVAL 6 HOUR)),
(6, 'project_completed', 5, 'project', '{"title": "CampusConnect - University Social App"}', DATE_SUB(NOW(), INTERVAL 3 HOUR)),
(1, 'skill_added', 6, 'skill', '{"skill_name": "Next.js", "proficiency": "intermediate"}', DATE_SUB(NOW(), INTERVAL 1 HOUR));

-- ============================================================
-- SEED DATA: MESSAGES
-- ============================================================
INSERT INTO messages (sender_id, receiver_id, content, is_read, created_at) VALUES
(1, 4, 'Hey Sneha! Thanks for joining EcoTrack. Can you start working on the dashboard UI?', 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(4, 1, 'Sure Arjun! I''ll start with the wireframes in Figma and share them by tomorrow.', 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(1, 4, 'Perfect! Let me know if you need the API docs.', 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(4, 1, 'Will do! I''ve already started looking at the repo. The component structure looks great 👍', 0, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, 5, 'Welcome to MedAssist, Vikram! Your ML expertise will be super valuable.', 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(5, 2, 'Thanks Priya! I''ve been looking at the symptom dataset. I think we can improve accuracy with BERT embeddings.', 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(2, 5, 'That''s a great idea! Let''s discuss the architecture tomorrow?', 0, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(8, 1, 'Hi Arjun! We loved your application for HackIndia. Are you still interested?', 0, DATE_SUB(NOW(), INTERVAL 12 HOUR));

-- ============================================================
-- SEED DATA: NOTIFICATIONS
-- ============================================================
INSERT INTO notifications (user_id, type, title, message, reference_id, reference_type, is_read, created_at) VALUES
(1, 'application_received', 'New Application', 'Sneha Gupta applied to your opportunity "Frontend Developer for EcoTrack"', 1, 'opportunity', 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(4, 'application_accepted', 'Application Accepted! 🎉', 'Your application for "Frontend Developer for EcoTrack" has been accepted!', 1, 'opportunity', 1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(1, 'endorsement', 'Skill Endorsed', 'Priya Patel endorsed your JavaScript skill', 1, 'user', 1, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1, 'member_request', 'Join Request', 'Rahul Verma wants to join EcoTrack', 1, 'project', 0, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 'message', 'New Message', 'You have a new message from DevFest Organizers', 8, 'user', 0, DATE_SUB(NOW(), INTERVAL 12 HOUR)),
(2, 'application_received', 'New Application', 'Rahul Verma applied to "Open Source Contributors for MedAssist"', 4, 'opportunity', 0, DATE_SUB(NOW(), INTERVAL 10 HOUR)),
(5, 'application_received', 'New Application', 'Priya Patel applied to "ML Engineer for SmartFarm"', 6, 'opportunity', 0, DATE_SUB(NOW(), INTERVAL 8 HOUR));
