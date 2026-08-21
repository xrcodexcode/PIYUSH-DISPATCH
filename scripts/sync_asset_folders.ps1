$syncPairs = @(
    @{ Src = "public\assets\issue-1"; Dst = "public\assets\daily-node-1" },
    @{ Src = "public\assets\issue-2"; Dst = "public\assets\daily-node-2" },
    @{ Src = "public\assets\issue-3"; Dst = "public\assets\daily-node-3" },
    @{ Src = "public\assets\issue-4"; Dst = "public\assets\daily-node-4" },
    @{ Src = "public\assets\issue-5"; Dst = "public\assets\daily-node-5" },
    @{ Src = "public\assets\issue-6"; Dst = "public\assets\daily-node-6" },
    @{ Src = "public\assets\daily-node-7"; Dst = "public\assets\issue-7" },
    @{ Src = "public\assets\daily-node-8"; Dst = "public\assets\issue-8" },
    @{ Src = "public\assets\daily-node-10"; Dst = "public\assets\issue-10" },
    @{ Src = "public\assets\daily-node-11"; Dst = "public\assets\daily-node-9" },
    @{ Src = "public\assets\daily-node-11"; Dst = "public\assets\issue-9" },
    @{ Src = "public\assets\daily-node-11"; Dst = "public\assets\issue-11" }
)

Write-Host "=========================================="
Write-Host "SYNCHRONIZING & MIRRORING ASSET FOLDERS"
Write-Host "=========================================="

foreach ($pair in $syncPairs) {
    if (Test-Path $pair.Src) {
        if (-not (Test-Path $pair.Dst)) {
            New-Item -ItemType Directory -Path $pair.Dst -Force | Out-Null
            Write-Host "Created directory: $($pair.Dst)"
        }
        $srcFiles = Get-ChildItem -Path $pair.Src -File
        foreach ($f in $srcFiles) {
            $dstFile = Join-Path $pair.Dst $f.Name
            if ((-not (Test-Path $dstFile)) -or ((Get-Item $dstFile).Length -ne $f.Length)) {
                Copy-Item -Path $f.FullName -Destination $dstFile -Force
                Write-Host "  Copied $($f.Name) from $($pair.Src) to $($pair.Dst)"
            }
        }
    }
}

Write-Host "Folder synchronization complete."
