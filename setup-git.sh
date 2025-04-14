#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Task Manager - Git Setup Script${NC}"
echo "This script will help you initialize Git and push your code to GitHub."
echo

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install Git first."
    exit 1
fi

# Check if .git directory exists
if [ -d ".git" ]; then
    echo "Git repository is already initialized."
else
    echo "Initializing Git repository..."
    git init
    echo -e "${GREEN}Git repository initialized.${NC}"
fi

# Ask for GitHub username
echo
echo "Please enter your GitHub username:"
read github_username

# Ask for repository name
echo "Please enter your repository name (default: task-manager):"
read repo_name
repo_name=${repo_name:-task-manager}

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "Creating .gitignore file..."
    cat > .gitignore << EOL
# Dependencies
node_modules/
npm-debug.log
yarn-debug.log
yarn-error.log
package-lock.json
yarn.lock

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Build files
/dist
/build
/out

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# OS files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# MongoDB data directory
/data/db
EOL
    echo -e "${GREEN}.gitignore file created.${NC}"
fi

# Update package.json repository URL
echo "Updating package.json repository URL..."
sed -i "s|https://github.com/your-username/task-manager.git|https://github.com/$github_username/$repo_name.git|g" package.json
echo -e "${GREEN}package.json updated.${NC}"

# Update README.md repository URL
echo "Updating README.md repository URL..."
sed -i "s|https://github.com/your-username/task-manager.git|https://github.com/$github_username/$repo_name.git|g" README.md
echo -e "${GREEN}README.md updated.${NC}"

# Add files to Git
echo
echo "Adding files to Git..."
git add .
echo -e "${GREEN}Files added to Git.${NC}"

# Commit changes
echo
echo "Committing changes..."
git commit -m "Initial commit"
echo -e "${GREEN}Changes committed.${NC}"

# Add remote repository
echo
echo "Would you like to add the remote repository now? (y/n)"
read add_remote

if [ "$add_remote" = "y" ] || [ "$add_remote" = "Y" ]; then
    echo "Adding remote repository..."
    git remote add origin "https://github.com/$github_username/$repo_name.git"
    echo -e "${GREEN}Remote repository added.${NC}"
    
    echo
    echo "Would you like to push to GitHub now? (y/n)"
    read push_now
    
    if [ "$push_now" = "y" ] || [ "$push_now" = "Y" ]; then
        echo "Pushing to GitHub..."
        git push -u origin main || git push -u origin master
        echo -e "${GREEN}Code pushed to GitHub.${NC}"
    else
        echo
        echo -e "${YELLOW}To push your code to GitHub later, run:${NC}"
        echo "git push -u origin main"
        echo "or"
        echo "git push -u origin master"
    fi
else
    echo
    echo -e "${YELLOW}To add the remote repository later, run:${NC}"
    echo "git remote add origin https://github.com/$github_username/$repo_name.git"
    echo
    echo -e "${YELLOW}Then push your code with:${NC}"
    echo "git push -u origin main"
    echo "or"
    echo "git push -u origin master"
fi

echo
echo -e "${GREEN}Git setup complete!${NC}"
echo "Your Task Manager project is now ready to be pushed to GitHub."
echo
