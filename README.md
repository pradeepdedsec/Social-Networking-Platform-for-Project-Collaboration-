# **COLLAB-FINDER**  
### Social Networking Platform for Project Collaboration  

Collab-Finder is a platform designed to connect individuals for collaborative learning projects.  

**Tech Stack**: HTML, CSS, JavaScript, React.js, Express.js, MySQL  

## **Setup Instructions**  
Run the following commands step-by-step to set up the project:  
```bash
# Step 1: Start XAMPP and configure the database
# Open phpMyAdmin, go to the Import section, upload the 'queries.sql' file, and click Import.

# Step 2: Install Node.js (skip if already installed)
# Download and install Node.js from https://nodejs.org

# Step 3: Clone the project and open it in VS Code
git clone <repository-url>
cd <project-folder>

# Step 4: Update the environment variables
# Open the .env file and update the following:
# SERVER_EMAIL=your-email@example.com
# SERVER_PASSWORD=your-app-password

# Step 5: Install dependencies and build the frontend
npm install
cd FRONTEND
npm run build
cd ..

# Step 6: Start the application
npm run dev

# Access the application in your browser
# URL: http://localhost:5000
