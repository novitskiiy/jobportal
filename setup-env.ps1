# JobPortal Environment Setup Script for Windows
Write-Host "🔐 JobPortal Environment Setup" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check if .env file exists
if (Test-Path ".env") {
    Write-Host "⚠️  .env file already exists!" -ForegroundColor Yellow
    $response = Read-Host "Do you want to overwrite it? (y/N)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "❌ Setup cancelled." -ForegroundColor Red
        exit 1
    }
}

# Copy example file
if (Test-Path "env.example") {
    Copy-Item "env.example" ".env"
    Write-Host "✅ Created .env file from env.example" -ForegroundColor Green
} else {
    Write-Host "❌ env.example file not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📝 Please edit the .env file with your actual values:" -ForegroundColor Cyan
Write-Host "   - API keys for AI services" -ForegroundColor White
Write-Host "   - Email credentials" -ForegroundColor White
Write-Host "   - Database connection string" -ForegroundColor White
Write-Host "   - JWT secret" -ForegroundColor White
Write-Host ""
Write-Host "🔗 See ENVIRONMENT_SETUP.md for detailed instructions" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Environment setup completed!" -ForegroundColor Green
Write-Host "   Don't forget to restart your application after editing .env" -ForegroundColor Yellow
