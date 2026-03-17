$ErrorActionPreference = 'Stop'

# Creates an export folder for code review ("pro honzu") with only sources + config,
# excluding helper markdown docs and build artifacts.

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$destRoot = Join-Path $repoRoot 'pro honzu'

$includeDirs = @(
  'src',
  'config',
  'sharepoint',
  'teams',
  '.vscode'
)

$includeFiles = @(
  '.editorconfig',
  '.gitignore',
  '.yo-rc.json',
  'gulpfile.js',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'tslint.json',
  'Create-SharePointLists.ps1'
)

function Copy-TreeWithoutMarkdown {
  param(
    [Parameter(Mandatory = $true)][string] $SourceDir,
    [Parameter(Mandatory = $true)][string] $TargetDir
  )

  if (-not (Test-Path -LiteralPath $SourceDir)) {
    return
  }

  $sourceFull = (Resolve-Path -LiteralPath $SourceDir).Path
  New-Item -ItemType Directory -Force -Path $TargetDir | Out-Null

  Get-ChildItem -LiteralPath $sourceFull -Recurse -File | Where-Object { $_.Extension -ne '.md' } | ForEach-Object {
    $rel = $_.FullName.Substring($sourceFull.Length).TrimStart('\')
    $targetFile = Join-Path $TargetDir $rel
    $targetParent = Split-Path -Parent $targetFile
    New-Item -ItemType Directory -Force -Path $targetParent | Out-Null
    Copy-Item -LiteralPath $_.FullName -Destination $targetFile -Force
  }
}

if (Test-Path -LiteralPath $destRoot) {
  Remove-Item -LiteralPath $destRoot -Recurse -Force
}

New-Item -ItemType Directory -Force -Path $destRoot | Out-Null

foreach ($d in $includeDirs) {
  $src = Join-Path $repoRoot $d
  if (Test-Path -LiteralPath $src) {
    $dst = Join-Path $destRoot $d
    Copy-TreeWithoutMarkdown -SourceDir $src -TargetDir $dst
  }
}

foreach ($f in $includeFiles) {
  $src = Join-Path $repoRoot $f
  if (Test-Path -LiteralPath $src) {
    if ([IO.Path]::GetExtension($src).ToLowerInvariant() -ne '.md') {
      Copy-Item -LiteralPath $src -Destination (Join-Path $destRoot $f) -Force
    }
  }
}

# Safety net: remove any markdown files that slipped through for whatever reason.
Get-ChildItem -LiteralPath $destRoot -Recurse -File -Filter *.md -ErrorAction SilentlyContinue | Remove-Item -Force -ErrorAction SilentlyContinue

Write-Output ("OK: Export created at: {0}" -f $destRoot)

