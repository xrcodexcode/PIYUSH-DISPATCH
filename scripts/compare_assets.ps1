$folders = Get-ChildItem -Path "public\assets" -Directory

Write-Host "=========================================="
Write-Host "CROSS-FOLDER IMAGE INVENTORY & COMPARISON"
Write-Host "=========================================="

foreach ($f in $folders) {
    $files = Get-ChildItem -Path $f.FullName -File
    Write-Host "`n📁 $($f.Name): $($files.Count) files"
    foreach ($file in $files) {
        $hash = (Get-FileHash -Path $file.FullName -Algorithm MD5).Hash.Substring(0, 8)
        $sizeKB = [Math]::Round($file.Length / 1KB, 1)
        Write-Host ("  {0,-28} Size: {1,7} KB | Hash: {2}" -f $file.Name, $sizeKB, $hash)
    }
}
