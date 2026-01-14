# Script para corregir imports con versiones en componentes UI
$componentsPath = "src/components/ui"

Write-Host "Corrigiendo imports en componentes UI..."

# Obtener todos los archivos .tsx
$files = Get-ChildItem -Path $componentsPath -Filter "*.tsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Reemplazar imports de Radix UI con versiones
    $content = $content -replace '@radix-ui/react-accordion@[\d\.]+', '@radix-ui/react-accordion'
    $content = $content -replace '@radix-ui/react-alert-dialog@[\d\.]+', '@radix-ui/react-alert-dialog'
    $content = $content -replace '@radix-ui/react-aspect-ratio@[\d\.]+', '@radix-ui/react-aspect-ratio'
    $content = $content -replace '@radix-ui/react-avatar@[\d\.]+', '@radix-ui/react-avatar'
    $content = $content -replace '@radix-ui/react-checkbox@[\d\.]+', '@radix-ui/react-checkbox'
    $content = $content -replace '@radix-ui/react-collapsible@[\d\.]+', '@radix-ui/react-collapsible'
    $content = $content -replace '@radix-ui/react-context-menu@[\d\.]+', '@radix-ui/react-context-menu'
    $content = $content -replace '@radix-ui/react-dialog@[\d\.]+', '@radix-ui/react-dialog'
    $content = $content -replace '@radix-ui/react-dropdown-menu@[\d\.]+', '@radix-ui/react-dropdown-menu'
    $content = $content -replace '@radix-ui/react-hover-card@[\d\.]+', '@radix-ui/react-hover-card'
    $content = $content -replace '@radix-ui/react-label@[\d\.]+', '@radix-ui/react-label'
    $content = $content -replace '@radix-ui/react-menubar@[\d\.]+', '@radix-ui/react-menubar'
    $content = $content -replace '@radix-ui/react-navigation-menu@[\d\.]+', '@radix-ui/react-navigation-menu'
    $content = $content -replace '@radix-ui/react-popover@[\d\.]+', '@radix-ui/react-popover'
    $content = $content -replace '@radix-ui/react-progress@[\d\.]+', '@radix-ui/react-progress'
    $content = $content -replace '@radix-ui/react-radio-group@[\d\.]+', '@radix-ui/react-radio-group'
    $content = $content -replace '@radix-ui/react-scroll-area@[\d\.]+', '@radix-ui/react-scroll-area'
    $content = $content -replace '@radix-ui/react-select@[\d\.]+', '@radix-ui/react-select'
    $content = $content -replace '@radix-ui/react-separator@[\d\.]+', '@radix-ui/react-separator'
    $content = $content -replace '@radix-ui/react-slider@[\d\.]+', '@radix-ui/react-slider'
    $content = $content -replace '@radix-ui/react-slot@[\d\.]+', '@radix-ui/react-slot'
    $content = $content -replace '@radix-ui/react-switch@[\d\.]+', '@radix-ui/react-switch'
    $content = $content -replace '@radix-ui/react-tabs@[\d\.]+', '@radix-ui/react-tabs'
    $content = $content -replace '@radix-ui/react-toggle@[\d\.]+', '@radix-ui/react-toggle'
    $content = $content -replace '@radix-ui/react-toggle-group@[\d\.]+', '@radix-ui/react-toggle-group'
    $content = $content -replace '@radix-ui/react-tooltip@[\d\.]+', '@radix-ui/react-tooltip'
    
    # Reemplazar imports de lucide-react con versión
    $content = $content -replace 'lucide-react@[\d\.]+', 'lucide-react'
    
    # Solo escribir si hubo cambios
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Corregido: $($file.Name)"
    }
}

Write-Host "Proceso completado!"
