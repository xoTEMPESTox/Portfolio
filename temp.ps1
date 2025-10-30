Get-Content src/main.js | Select-Object @{Name='LineNumber';Expression={(global:ln=1)+-1}}, @{Name='Text';Expression={}}
