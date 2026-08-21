$ErrorActionPreference = "Continue"

$issues = Get-ChildItem -Path "content\issues" -Filter "*.mdx"
Write-Host "=========================================="
Write-Host "Found $($issues.Count) MDX issues"
Write-Host "=========================================="

$allRefs = @()

foreach ($f in $issues) {
    $c = [System.IO.File]::ReadAllText($f.FullName)
    Write-Host "`n>>> ISSUE: $($f.Name)"
    
    # Frontmatter cover image
    if ($c -match "coverImage:\s*['""]?(.*?)['""]?\s*`r?`n") {
        $cover = $matches[1].Trim()
        Write-Host "  [COVER] $cover"
        $allRefs += [PSCustomObject]@{ Issue = $f.Name; Type = "cover"; Alt = "cover"; Path = $cover }
    }
    if ($c -match "heroImage:\s*['""]?(.*?)['""]?\s*`r?`n") {
        $hero = $matches[1].Trim()
        Write-Host "  [HERO] $hero"
        $allRefs += [PSCustomObject]@{ Issue = $f.Name; Type = "hero"; Alt = "hero"; Path = $hero }
    }

    # Inline markdown images
    $rx = [regex]'!\[(.*?)\]\((.*?)\)'
    $mColl = $rx.Matches($c)
    foreach ($m in $mColl) {
        $alt = $m.Groups[1].Value
        $path = $m.Groups[2].Value.Trim()
        Write-Host "  [INLINE] Alt: '$alt' -> $path"
        $allRefs += [PSCustomObject]@{ Issue = $f.Name; Type = "inline"; Alt = $alt; Path = $path }
    }
}

Write-Host "`n=========================================="
Write-Host "TOTAL REFERENCED IMAGES: $($allRefs.Count)"
Write-Host "=========================================="

# Check disk existence and sizes
$uniquePaths = $allRefs | Select-Object -ExpandProperty Path -Unique
Write-Host "`nUNIQUE IMAGE PATHS ($($uniquePaths.Count)):"

foreach ($p in $uniquePaths) {
    $cleanPath = $p.TrimStart('/').Replace('/', '\')
    $fullDiskPath = Join-Path "public" $cleanPath
    $exists = Test-Path $fullDiskPath
    if ($exists) {
        $item = Get-Item $fullDiskPath
        $sizeKB = [Math]::Round($item.Length / 1KB, 2)
        Write-Host "  [OK] $p ($sizeKB KB) -> $fullDiskPath"
    } else {
        Write-Host "  [MISSING] $p -> $fullDiskPath"
    }
}

# Also list all asset directories and file counts
Write-Host "`n=========================================="
Write-Host "PUBLIC/ASSETS DIRECTORY AUDIT:"
Write-Host "=========================================="
$dirs = Get-ChildItem -Path "public\assets" -Directory
foreach ($d in $dirs) {
    $files = Get-ChildItem -Path $d.FullName -File
    Write-Host "Folder '$($d.Name)': $($files.Count) files"
    foreach ($f in $files) {
        $sizeKB = [Math]::Round($f.Length / 1KB, 2)
        Write-Host "   - $($f.Name) ($sizeKB KB)"
    }
}
