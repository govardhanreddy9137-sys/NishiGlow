$ErrorActionPreference = 'Stop'

$taskName = 'NishiGlow Development Server'
$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$runnerPath = Join-Path $PSScriptRoot 'run-dev.ps1'
$powerShellPath = Join-Path $PSHOME 'powershell.exe'
$account = [Security.Principal.WindowsIdentity]::GetCurrent().Name

$action = New-ScheduledTaskAction `
  -Execute $powerShellPath `
  -Argument "-NoProfile -ExecutionPolicy Bypass -File `"$runnerPath`"" `
  -WorkingDirectory $projectRoot
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $account
$principal = New-ScheduledTaskPrincipal `
  -UserId $account `
  -LogonType Interactive `
  -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet `
  -MultipleInstances IgnoreNew `
  -ExecutionTimeLimit ([TimeSpan]::Zero) `
  -AllowStartIfOnBatteries `
  -DontStopIfGoingOnBatteries `
  -RestartCount 3 `
  -RestartInterval (New-TimeSpan -Minutes 1) `
  -StartWhenAvailable

Register-ScheduledTask `
  -TaskName $taskName `
  -Action $action `
  -Trigger $trigger `
  -Principal $principal `
  -Settings $settings `
  -Description 'Starts the NishiGlow local website and API at Windows sign-in.' `
  -Force | Out-Null

Start-ScheduledTask -TaskName $taskName
Write-Output "Installed and started '$taskName'. It will start again at Windows sign-in."
