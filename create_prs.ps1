$ErrorActionPreference = "Stop"

# Create a temporary branch with all changes
git checkout -b temp-save
git add .
git commit -m "Temp save all changes"

$batches = @(
    @{
        Name = "pr-batch-1"
        Message = "Feat: Backend Auth, Models, and Initial Config"
        Files = @(
            "backend/src/models/User.js",
            "backend/src/controllers/authController.js",
            "backend/src/routes/authRoutes.js",
            "backend/src/middlewares/rateLimiter.js",
            "backend/src/app.js",
            "backend/src/index.js",
            "backend/package.json",
            "backend/package-lock.json",
            "backend/src/scripts/seedDatabase.js",
            "backend/src/scripts/seedUser.js",
            "frontend/public/favicon.svg",
            "frontend/public/icons.svg"
        )
    },
    @{
        Name = "pr-batch-2"
        Message = "Feat: Backend Chat, Upload, and Conflict Controllers"
        Files = @(
            "backend/src/controllers/chatController.js",
            "backend/src/controllers/uploadController.js",
            "backend/src/routes/chatRoutes.js",
            "backend/src/routes/uploadRoutes.js",
            "backend/src/controllers/conflictController.js",
            "implementation_plan.md",
            "task.md",
            "walkthrough.md",
            "frontend/README.md",
            "frontend/.gitignore"
        )
    },
    @{
        Name = "pr-batch-3"
        Message = "Chore: Frontend Configuration and Setup"
        Files = @(
            "frontend/.env",
            "frontend/eslint.config.js",
            "frontend/index.html",
            "frontend/jsconfig.json",
            "frontend/package.json",
            "frontend/package-lock.json",
            "frontend/postcss.config.js",
            "frontend/tailwind.config.js",
            "frontend/vite.config.js",
            "frontend/src/main.jsx",
            "frontend/src/App.jsx",
            "frontend/src/App.css"
        )
    },
    @{
        Name = "pr-batch-4"
        Message = "Feat: Frontend State, Layouts, and Components"
        Files = @(
            "frontend/src/index.css",
            "frontend/src/store/store.js",
            "frontend/src/services/api.js",
            "frontend/src/features/auth/authSlice.js",
            "frontend/src/features/ui/uiSlice.js",
            "frontend/src/components/layout/Navbar.jsx",
            "frontend/src/components/layout/Footer.jsx",
            "frontend/src/components/layout/PageWrapper.jsx",
            "frontend/src/components/chat/ChatbotWidget.jsx",
            "frontend/src/assets/hero.png",
            "frontend/src/assets/react.svg",
            "frontend/src/assets/vite.svg"
        )
    },
    @{
        Name = "pr-batch-5"
        Message = "Feat: Frontend Application Pages"
        Files = @(
            "frontend/src/pages/LandingPage.jsx",
            "frontend/src/pages/DashboardPage.jsx",
            "frontend/src/pages/AnalyticsPage.jsx",
            "frontend/src/pages/ConflictsPage.jsx",
            "frontend/src/pages/ComparePage.jsx",
            "frontend/src/pages/KanbanPage.jsx",
            "frontend/src/pages/WorkflowPage.jsx",
            "frontend/src/pages/UploadPage.jsx",
            "frontend/src/pages/ContactPage.jsx",
            "frontend/src/pages/ProfilePage.jsx",
            "frontend/src/pages/LoginPage.jsx",
            "frontend/src/pages/RegisterPage.jsx"
        )
    }
)

foreach ($batch in $batches) {
    Write-Host "Processing $($batch.Name)..."
    git checkout main
    git pull origin main
    
    # Ignore if branch already exists locally, just recreate
    git branch -D $batch.Name 2>$null
    git checkout -b $batch.Name

    foreach ($file in $batch.Files) {
        git checkout temp-save -- $file
    }

    git add .
    git commit -m $batch.Message
    git push origin $batch.Name -f
}

Write-Host "Done pushing branches."
git checkout feature/api-routes-middlewares
