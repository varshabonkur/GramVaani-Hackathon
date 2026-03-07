# GramVaani Backend - Install All Dependencies (Windows PowerShell)

Write-Host "🔧 Installing GramVaani Backend Dependencies" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "Step 1: Installing process-voice dependencies" -ForegroundColor Yellow
Set-Location lambda\process-voice
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ process-voice dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install process-voice dependencies" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "Step 2: Installing get-complaints dependencies" -ForegroundColor Yellow
Set-Location ..\get-complaints
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ get-complaints dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install get-complaints dependencies" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "Step 3: Installing get-stats dependencies" -ForegroundColor Yellow
Set-Location ..\get-stats
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ get-stats dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install get-stats dependencies" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "Step 4: Installing scripts dependencies" -ForegroundColor Yellow
Set-Location ..\..\scripts
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ scripts dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install scripts dependencies" -ForegroundColor Red
    exit 1
}
Write-Host ""

Set-Location ..

Write-Host "✅ All dependencies installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Configure AWS credentials: aws configure"
Write-Host "2. Create DynamoDB table: aws dynamodb create-table --cli-input-json file://schemas/dynamodb-schema.json"
Write-Host "3. Populate test data: cd scripts; node populate-test-data.js"
Write-Host "4. Package Lambda functions: See WINDOWS_EXECUTION_GUIDE.md"
Write-Host ""
Write-Host "Or follow the WINDOWS_EXECUTION_GUIDE.md for detailed instructions" -ForegroundColor Yellow
