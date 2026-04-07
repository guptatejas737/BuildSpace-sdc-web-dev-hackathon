# BuildSpace

BuildSpace is a developer collaboration platform where students, mentors, and organizers can discover projects, find teammates, post opportunities, message each other, and grow their developer network.

## Features

- User authentication with login, signup, logout, and session checks
- Developer profiles with skills, social links, role, location, projects, and endorsements
- Project discovery with project creation, member requests, tech stacks, and project status tracking
- Opportunity board for internships, hackathons, collaborations, and open calls
- Opportunity applications with creator-side application handling
- Community feed with recent activity and dashboard statistics
- One-to-one messaging with unread message indicators
- Notification dropdown with read/unread handling
- Global search across developers, projects, and opportunities
- Responsive dark/light UI built with vanilla JavaScript and CSS

## Tech Stack

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: PHP
- Database: MySQL
- Icons: Lucide Icons CDN
- Fonts: Google Fonts

## Project Structure

```text
.
|-- index.php
|-- api/
|   |-- auth/
|   |-- feed/
|   |-- messages/
|   |-- notifications/
|   |-- opportunities/
|   |-- projects/
|   `-- users/
|-- assets/
|   |-- css/
|   |   |-- components.css
|   |   |-- main.css
|   |   `-- pages.css
|   `-- js/
|       |-- api.js
|       |-- app.js
|       |-- auth.js
|       |-- components.js
|       |-- feed.js
|       |-- messages.js
|       |-- notifications.js
|       |-- opportunities.js
|       |-- profile.js
|       `-- projects.js
`-- config/
    |-- database.php
    `-- setup.sql
```

## Database Tables

The setup script creates these core tables:

- users
- skills
- user_skills
- skill_endorsements
- projects
- project_tech_stack
- project_members
- opportunities
- opportunity_applications
- feed_activities
- messages
- notifications

## Getting Started

1. Install a PHP and MySQL stack such as XAMPP, WAMP, MAMP, Laragon, or a LAMP server.
2. Place the project folder inside your web server root, for example `htdocs/buildspace`.
3. Create the database and seed data by importing `config/setup.sql` into MySQL.
4. Update the database constants in `config/database.php` for your local or hosted database.
5. Start Apache/PHP and MySQL.
6. Open the site in your browser, for example `http://localhost/buildspace/`.

## Demo Accounts

The seed data includes demo users. The setup script notes that the password is:

```text
password123
```

Example demo emails include:

- arjun@demo.com
- priya@demo.com
- sneha@demo.com
- vikram@demo.com

## API Overview

The frontend uses `assets/js/api.js` to call PHP endpoints:

- `api/auth/login.php`
- `api/auth/register.php`
- `api/auth/logout.php`
- `api/auth/session.php`
- `api/users/profile.php`
- `api/users/search.php`
- `api/users/skills.php`
- `api/users/endorse.php`
- `api/projects/index.php`
- `api/projects/members.php`
- `api/opportunities/index.php`
- `api/opportunities/applications.php`
- `api/feed/index.php`
- `api/messages/index.php`
- `api/notifications/index.php`

## Deployment Notes

- Replace development or hosted database credentials before publishing publicly.
- Make sure your hosting environment supports PHP sessions and PDO MySQL.
- Import `config/setup.sql` before using the app on a new database.
- If deploying to a subdirectory, keep the current relative paths intact.
- Review CORS and database error output settings before using the project in production.

## License

No license has been specified yet. Add a license file before publishing if you want others to reuse or contribute to the project.
