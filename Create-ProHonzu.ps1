$ErrorActionPreference = 'Stop'

# Creates a clean export folder for code review ("pro honzu") from the current
# source of truth in the main project. It keeps source, config, lockfiles and
# the static mockup, while excluding generated build artifacts.

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$destRoot = Join-Path $repoRoot 'pro honzu'
$exportInfoFile = Join-Path $destRoot 'README.txt'
$reviewPackageFile = Join-Path $destRoot 'aures-elite-mentoring.sppkg'
$builtPackageFile = Join-Path $repoRoot 'sharepoint\solution\aures-elite-mentoring.sppkg'
$exportGitIgnoreFile = Join-Path $destRoot '.gitignore'

$includeDirs = @(
  'src',
  'config',
  'sharepoint',
  'teams'
)

$includeFiles = @(
  '.editorconfig',
  '.eslintrc.js',
  '.gitignore',
  '.yo-rc.json',
  'Create-ProHonzu.ps1',
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'webpack.config.js',
  'webpack.dev.config.js'
)

$excludedPathPatterns = @(
  '(^|\\)node_modules(\\|$)',
  '(^|\\)dist(\\|$)',
  '(^|\\)lib(\\|$)',
  '(^|\\)lib-commonjs(\\|$)',
  '(^|\\)lib-dts(\\|$)',
  '(^|\\)lib-esm(\\|$)',
  '(^|\\)release(\\|$)',
  '(^|\\)temp(\\|$)',
  '(^|\\)coverage(\\|$)',
  '(^|\\)jest-output(\\|$)',
  '(^|\\)sharepoint\\solution\\debug(\\|$)',
  '\.log$'
)

function Test-IsExcludedRelativePath {
  param(
    [Parameter(Mandatory = $true)][string] $RelativePath
  )

  $normalized = $RelativePath -replace '/', '\'

  foreach ($pattern in $excludedPathPatterns) {
    if ($normalized -match $pattern) {
      return $true
    }
  }

  return $false
}

function Copy-TreeForReview {
  param(
    [Parameter(Mandatory = $true)][string] $SourceDir,
    [Parameter(Mandatory = $true)][string] $TargetDir
  )

  if (-not (Test-Path -LiteralPath $SourceDir)) {
    return
  }

  $sourceFull = (Resolve-Path -LiteralPath $SourceDir).Path
  New-Item -ItemType Directory -Force -Path $TargetDir | Out-Null

  Get-ChildItem -LiteralPath $sourceFull -Recurse -File | ForEach-Object {
    $rel = $_.FullName.Substring($sourceFull.Length).TrimStart('\')

    if ($_.Extension -eq '.md') {
      return
    }

    if (Test-IsExcludedRelativePath -RelativePath $rel) {
      return
    }

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

foreach ($dir in $includeDirs) {
  $src = Join-Path $repoRoot $dir

  if (Test-Path -LiteralPath $src) {
    $dst = Join-Path $destRoot $dir
    Copy-TreeForReview -SourceDir $src -TargetDir $dst
  }
}

foreach ($file in $includeFiles) {
  $src = Join-Path $repoRoot $file

  if (-not (Test-Path -LiteralPath $src)) {
    continue
  }

  if ([IO.Path]::GetExtension($src).ToLowerInvariant() -eq '.md') {
    continue
  }

  if (Test-IsExcludedRelativePath -RelativePath $file) {
    continue
  }

  $targetFile = Join-Path $destRoot $file
  $targetParent = Split-Path -Parent $targetFile

  if ($targetParent) {
    New-Item -ItemType Directory -Force -Path $targetParent | Out-Null
  }

  Copy-Item -LiteralPath $src -Destination $targetFile -Force
}

if (Test-Path -LiteralPath $builtPackageFile) {
  Copy-Item -LiteralPath $builtPackageFile -Destination $reviewPackageFile -Force
}

if (Test-Path -LiteralPath $exportGitIgnoreFile) {
  $gitIgnoreContent = Get-Content -LiteralPath $exportGitIgnoreFile -Raw

  if ($gitIgnoreContent -notmatch '(?m)^!aures-elite-mentoring\.sppkg$') {
    $normalizedGitIgnore = $gitIgnoreContent.TrimEnd("`r", "`n")
    $updatedGitIgnore = $normalizedGitIgnore + "`r`n!aures-elite-mentoring.sppkg`r`n"
    Set-Content -LiteralPath $exportGitIgnoreFile -Value $updatedGitIgnore -Encoding UTF8
  }
}

@"
Aures Elite Mentoring - handoff export
=====================================

Tato slozka je generovany export z hlavniho projektu v rootu repozitare.
Neni to druhy aktivni projekt ani samostatny source of truth.

Plati:
- Source of truth je root repozitare.
- SPFx je sjednocene na verzi 1.22.x (aktualne 1.22.2).
- Build runtime je Node.js 22.x.
- Security baseline pro hlavni projekt vyzaduje npm audit bez nalezenych vulnerabilities.

Export vytvoren skriptem:
- Create-ProHonzu.ps1

Pokud je k dispozici production build, export obsahuje i hotovy balik:
- aures-elite-mentoring.sppkg
"@ | Set-Content -LiteralPath $exportInfoFile -Encoding UTF8

Write-Output ("OK: Review export created at: {0}" -f $destRoot)
