# Compila el frontend apuntando a la API en AWS y lo publica en S3 + CloudFront.
# Uso: .\deploy.ps1 -ApiUrl https://xxxx.execute-api.us-east-2.amazonaws.com
param(
  [Parameter(Mandatory = $true)][string]$ApiUrl,
  [string]$StackName = 'reservas-tours-web'
)

function Get-Output($key) {
  aws cloudformation describe-stacks --stack-name $StackName `
    --query "Stacks[0].Outputs[?OutputKey=='$key'].OutputValue" --output text
}

$bucket = Get-Output 'BucketName'
$distributionId = Get-Output 'DistributionId'
$siteUrl = Get-Output 'SiteUrl'
if (-not $bucket -or $bucket -eq 'None') { throw "No encontré el stack $StackName. Despliégalo primero con infra/template.yaml." }

# 1. Compilar con la URL de la API de AWS.
$env:VITE_API_URL = "$($ApiUrl.TrimEnd('/'))/api"
npm run build
if ($LASTEXITCODE -ne 0) { throw 'Falló el build.' }
Remove-Item Env:VITE_API_URL

# 2. Subir: los archivos con hash en el nombre se cachean un año; index.html nunca, para ver siempre la última versión.
aws s3 sync dist/assets "s3://$bucket/assets" --delete --cache-control 'public, max-age=31536000, immutable'
aws s3 sync dist "s3://$bucket" --delete --exclude 'assets/*' --cache-control 'no-cache'
if ($LASTEXITCODE -ne 0) { throw 'Falló la subida a S3.' }

# 3. Avisar a CloudFront que hay una versión nueva.
aws cloudfront create-invalidation --distribution-id $distributionId --paths '/index.html' '/' | Out-Null

Write-Host "Publicado en $siteUrl" -ForegroundColor Green
