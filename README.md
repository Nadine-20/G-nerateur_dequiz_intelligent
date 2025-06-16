      First-Time Git Setup
```bash    
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"


       ### Installation
```bash
git clone https://github.com/your-org/G-n-rateur-des-Quiz-Intelligent-Groupe-A-.git
cd G-n-rateur-des-Quiz-Intelligent-Groupe-A-
npm install

Creating Your Branch
git checkout -b components/yourname-component
# Example:
# git checkout -b components/ayoub-progress-chart

🚦 Workflow Rules
Never commit directly to main

Sync daily:

bash
git checkout main
git pull
git checkout your-branch
git merge main
Test before pushing:

bash
npm run dev
