$brain = "C:\Users\Mcman\.gemini\antigravity\brain\1de4505d-c9b1-461e-b4e3-49950bcf0654"
$dest = "c:\Users\Mcman\Downloads\Cafe\app\public\images\menu"

$copies = @{
  "kachori_*" = "kachori.webp"
  "samosa_*" = "samosa.webp"
  "paneer_burger_*" = "paneer-tikki-burger.webp"
  "greenfield_pizza_*" = "greenfield-pizza.webp"
  "cold_coffee_*" = "cold-coffee.webp"
  "french_fries_*" = "french-fries.webp"
  "cappuccino_*" = "cappuccino.webp"
  "mango_shake_*" = "mango-shake.webp"
}

foreach ($pattern in $copies.Keys) {
  $src = Get-ChildItem -Path $brain -Filter "$pattern.png" | Select-Object -First 1
  if ($src) {
    Copy-Item $src.FullName -Destination (Join-Path $dest $copies[$pattern]) -Force
    Write-Output "Copied: $($copies[$pattern])"
  } else {
    Write-Output "Not found: $pattern"
  }
}

Get-ChildItem $dest
