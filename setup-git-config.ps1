# Script de PowerShell para configurar Git automáticamente según el directorio del proyecto
# Uso: .\setup-git-config.ps1

Write-Host "Configurador de Git para Proyectos Multiples" -ForegroundColor Blue
Write-Host "==================================================" -ForegroundColor Blue

# Función para detectar el tipo de proyecto
function Get-ProjectType {
    $currentDir = Get-Location
    $projectName = Split-Path $currentDir -Leaf
    
    Write-Host "Directorio actual: $currentDir" -ForegroundColor Yellow
    Write-Host "Proyecto: $projectName" -ForegroundColor Yellow
    
    # Detectar tipo de proyecto basado en el nombre
    if ($projectName -like "*agencia*" -or $projectName -like "*Agencia*") {
        return "agencia"
    }
    elseif ($projectName -like "*cliente*" -or $projectName -like "*Cliente*") {
        return "cliente"
    }
    elseif ($projectName -like "*personal*" -or $projectName -like "*Personal*") {
        return "personal"
    }
    else {
        return "default"
    }
}

# Función para configurar Git según el tipo de proyecto
function Set-GitConfig {
    param($ProjectType)
    
    switch ($ProjectType) {
        "agencia" {
            Write-Host "Configurando para proyecto de Agencia" -ForegroundColor Green
            git config user.name "Agencia Marketing"
            git config user.email "agencia@marketing.com"
        }
        "cliente" {
            Write-Host "Configurando para proyecto de Cliente" -ForegroundColor Green
            git config user.name "Cliente Proyecto"
            git config user.email "cliente@proyecto.com"
        }
        "personal" {
            Write-Host "Configurando para proyecto Personal" -ForegroundColor Green
            git config user.name "Tu Nombre Personal"
            git config user.email "tu.email@personal.com"
        }
        default {
            Write-Host "Configurando configuracion por defecto" -ForegroundColor Green
            git config user.name "Tu Nombre"
            git config user.email "tu.email@ejemplo.com"
        }
    }
}

# Función para mostrar configuración actual
function Show-CurrentConfig {
    Write-Host "Configuracion actual de Git:" -ForegroundColor Blue
    Write-Host "Usuario: $(git config user.name)"
    Write-Host "Email: $(git config user.email)"
    Write-Host ""
}

# Función principal
function Main {
    # Verificar si estamos en un repositorio Git
    try {
        git rev-parse --git-dir | Out-Null
    } catch {
        Write-Host "Error: No estas en un repositorio Git" -ForegroundColor Red
        Write-Host "Ejecuta 'git init' primero para inicializar el repositorio" -ForegroundColor Red
        exit 1
    }
    
    # Mostrar configuración actual
    Show-CurrentConfig
    
    # Detectar tipo de proyecto
    $projectType = Get-ProjectType
    Write-Host "Tipo de proyecto detectado: $projectType" -ForegroundColor Blue
    
    # Configurar Git
    Set-GitConfig $projectType
    
    # Mostrar configuración final
    Write-Host "Configuracion completada!" -ForegroundColor Green
    Show-CurrentConfig
    
    # Mostrar comandos útiles
    Write-Host "Comandos utiles:" -ForegroundColor Blue
    Write-Host "• Ver configuracion: git config --list --local"
    Write-Host "• Cambiar usuario: git config user.name 'Nuevo Nombre'"
    Write-Host "• Cambiar email: git config user.email 'nuevo@email.com'"
    Write-Host "• Ver remotes: git remote -v"
}

# Ejecutar función principal
Main