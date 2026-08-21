function Get-ImageDimensions($path) {
    try {
        $bytes = [System.IO.File]::ReadAllBytes($path)
        # PNG
        if ($bytes.Length -ge 24 -and $bytes[0] -eq 0x89 -and $bytes[1] -eq 0x50 -and $bytes[2] -eq 0x4E -and $bytes[3] -eq 0x47) {
            $w = ($bytes[16] -shl 24) + ($bytes[17] -shl 16) + ($bytes[18] -shl 8) + $bytes[19]
            $h = ($bytes[20] -shl 24) + ($bytes[21] -shl 16) + ($bytes[22] -shl 8) + $bytes[23]
            return @{ Width = $w; Height = $h; Format = "PNG" }
        }
        # JPEG
        if ($bytes.Length -ge 2 -and $bytes[0] -eq 0xFF -and $bytes[1] -eq 0xD8) {
            $i = 2
            while ($i -lt $bytes.Length - 8) {
                if ($bytes[$i] -ne 0xFF) { $i++; continue }
                $marker = $bytes[$i+1]
                if ($marker -eq 0xC0 -or $marker -eq 0xC1 -or $marker -eq 0xC2 -or $marker -eq 0xC3) {
                    $h = ($bytes[$i+5] -shl 8) + $bytes[$i+6]
                    $w = ($bytes[$i+7] -shl 8) + $bytes[$i+8]
                    return @{ Width = $w; Height = $h; Format = "JPEG" }
                }
                if ($marker -eq 0xD9 -or $marker -eq 0xDA) { break }
                $len = ($bytes[$i+2] -shl 8) + $bytes[$i+3]
                $i += 2 + $len
            }
        }
    } catch {}
    return @{ Width = 0; Height = 0; Format = "UNKNOWN" }
}

$images = Get-ChildItem -Path "public\assets" -Recurse -File -Include *.jpg, *.jpeg, *.png
$results = @()
foreach ($img in $images) {
    $dim = Get-ImageDimensions $img.FullName
    $aspect = if ($dim.Height -gt 0) { [Math]::Round($dim.Width / $dim.Height, 2) } else { 0 }
    $results += [PSCustomObject]@{
        Folder = $img.Directory.Name
        Name = $img.Name
        Width = $dim.Width
        Height = $dim.Height
        Aspect = $aspect
        SizeKB = [Math]::Round($img.Length / 1KB, 1)
        Path = $img.FullName
    }
}

$byFolder = $results | Group-Object Folder
foreach ($g in $byFolder) {
    Write-Host "`n📁 Folder: $($g.Name) ($($g.Count) images)"
    foreach ($item in $g.Group) {
        Write-Host ("  {0,-25} {1,5}x{2,-5} (Aspect: {3,4}) {4,8} KB" -f $item.Name, $item.Width, $item.Height, $item.Aspect, $item.SizeKB)
    }
}
