# Revisión periódica de dependencias (ejecútalo una vez al mes).
Write-Host "== Versiones desactualizadas ==" -ForegroundColor Cyan
npm outdated
Write-Host "`n== Vulnerabilidades conocidas ==" -ForegroundColor Cyan
npm audit
