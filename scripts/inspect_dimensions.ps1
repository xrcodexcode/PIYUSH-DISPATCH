Add-Type -AssemblyName System.Drawing

$assetsDir = "public\assets"
$images = Get-ChildItem -Path $assetsDir -Recurse -File -Include *.jpg, *.jpeg, *.png, *.webp

$results = @()

foreach ($img in $images) {
    try {
        $bmp = [System.Drawing.Image]::FromFile($img.FullName)
        $w = $bmp.Width
        $h = $bmp.Height
        $aspect = [Math]::Round($w / $h, 2)
        $bmp.Dispose()
        $results += [PSCustomObject]@{
            Folder = $img.Directory.Name
            Name = $img.Name
            RelPath = $img.FullName.Substring((Get-Location).Path.Length + 1).Replace('\', '/')
            Width = $w
            Height = $h
            Aspect = $aspect
            SizeKB = [Math]::Round($img.Length / 1KB, 1)
        }
    } catch {
        $results += [PSCustomObject]@{
            Folder = $img.Directory.Name
            Name = $img.Name
            RelPath = $img.FullName.Substring((Get-Location).Path.Length + 1).Replace('\', '/')
            Width = 0
            Height = 0
            Aspect = 0
            SizeKB = [Math]::Round($img.Length / 1KB, 1)
        }
    }
}

Write-Host "=================================================="
Write-Host "IMAGE RESOLUTIONS AND DIMENSIONS AUDIT ($($results.Count) images)"
Write-Host "=================================================="

$byFolder = $results | Group-Object Folder
foreach ($g in $byFolder) {
    Write-Host "`n📁 Folder: $($g.Name) ($($g.Count) images)"
    foreach ($item in $g.Group) {
        Write-Host ("  {0,-25} {1,5}x{2,-5} (Aspect: {3,4}) {4,8} KB" -f $item.Name, $item.Width, $item.Height, $item.Aspect, $item.SizeKB)
    }
}
