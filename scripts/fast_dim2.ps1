function Get-JpegSize($path) {
    try {
        $stream = [System.IO.File]::OpenRead($path)
        $reader = New-Object System.IO.BinaryReader($stream)
        
        $b1 = $reader.ReadByte()
        $b2 = $reader.ReadByte()
        if ($b1 -ne 0xFF -or $b2 -ne 0xD8) {
            $stream.Dispose()
            return @{ W=0; H=0 }
        }
        
        while ($stream.Position -lt $stream.Length) {
            $marker = $reader.ReadByte()
            while ($marker -ne 0xFF -and $stream.Position -lt $stream.Length) {
                $marker = $reader.ReadByte()
            }
            if ($stream.Position -ge $stream.Length) { break }
            
            $markerType = $reader.ReadByte()
            while ($markerType -eq 0xFF -and $stream.Position -lt $stream.Length) {
                $markerType = $reader.ReadByte()
            }
            
            # SOF0..SOF3, SOF5..SOF7, SOF9..SOF11, SOF13..SOF15
            if (($markerType -ge 0xC0 -and $markerType -le 0xC3) -or
                ($markerType -ge 0xC5 -and $markerType -le 0xC7) -or
                ($markerType -ge 0xC9 -and $markerType -le 0xCB) -or
                ($markerType -ge 0xCD -and $markerType -le 0xCF)) {
                $len = ($reader.ReadByte() -shl 8) + $reader.ReadByte()
                $precision = $reader.ReadByte()
                $h = ($reader.ReadByte() -shl 8) + $reader.ReadByte()
                $w = ($reader.ReadByte() -shl 8) + $reader.ReadByte()
                $stream.Dispose()
                return @{ W=$w; H=$h }
            } elseif ($markerType -eq 0xD9 -or $markerType -eq 0xDA) {
                # SOS or EOI
                break
            } else {
                # Skip marker segment
                $len = ($reader.ReadByte() -shl 8) + $reader.ReadByte()
                if ($len -ge 2) {
                    $reader.BaseStream.Seek($len - 2, [System.IO.SeekOrigin]::Current) | Out-Null
                }
            }
        }
        $stream.Dispose()
    } catch {}
    return @{ W=0; H=0 }
}

$images = Get-ChildItem -Path "public\assets" -Recurse -File -Include *.jpg, *.jpeg
$results = @()
foreach ($img in $images) {
    $dim = Get-JpegSize $img.FullName
    $aspect = if ($dim.H -gt 0) { [Math]::Round($dim.W / $dim.H, 2) } else { 0 }
    $results += [PSCustomObject]@{
        Folder = $img.Directory.Name
        Name = $img.Name
        W = $dim.W
        H = $dim.H
        Aspect = $aspect
        SizeKB = [Math]::Round($img.Length / 1KB, 1)
        Path = $img.FullName
    }
}

$byFolder = $results | Group-Object Folder
foreach ($g in $byFolder) {
    Write-Host "`n📁 Folder: $($g.Name) ($($g.Count) images)"
    foreach ($item in $g.Group) {
        Write-Host ("  {0,-28} {1,5}x{2,-5} (Aspect: {3,4}) {4,8} KB" -f $item.Name, $item.W, $item.H, $item.Aspect, $item.SizeKB)
    }
}
