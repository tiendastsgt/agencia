#!/bin/bash
# Script para configurar Git automáticamente según el directorio del proyecto
# Uso: ./setup-git-config.sh

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Configurador de Git para Proyectos Múltiples${NC}"
echo "=================================================="

# Función para detectar el tipo de proyecto
detect_project_type() {
    local current_dir=$(pwd)
    local project_name=$(basename "$current_dir")
    
    echo -e "${YELLOW}📁 Directorio actual: $current_dir${NC}"
    echo -e "${YELLOW}📦 Proyecto: $project_name${NC}"
    
    # Detectar tipo de proyecto basado en el nombre o estructura
    if [[ "$project_name" == *"agencia"* ]] || [[ "$project_name" == *"Agencia"* ]]; then
        echo "agencia"
    elif [[ "$project_name" == *"cliente"* ]] || [[ "$project_name" == *"Cliente"* ]]; then
        echo "cliente"
    elif [[ "$project_name" == *"personal"* ]] || [[ "$project_name" == *"Personal"* ]]; then
        echo "personal"
    else
        echo "default"
    fi
}

# Función para configurar Git según el tipo de proyecto
setup_git_config() {
    local project_type=$1
    
    case $project_type in
        "agencia")
            echo -e "${GREEN}🏢 Configurando para proyecto de Agencia${NC}"
            git config user.name "Agencia Marketing"
            git config user.email "agencia@marketing.com"
            git config remote.origin.url "git@github-agencia:agencia/proyecto.git" 2>/dev/null || true
            ;;
        "cliente")
            echo -e "${GREEN}👤 Configurando para proyecto de Cliente${NC}"
            git config user.name "Cliente Proyecto"
            git config user.email "cliente@proyecto.com"
            git config remote.origin.url "git@github-cliente:cliente/proyecto.git" 2>/dev/null || true
            ;;
        "personal")
            echo -e "${GREEN}🏠 Configurando para proyecto Personal${NC}"
            git config user.name "Tu Nombre Personal"
            git config user.email "tu.email@personal.com"
            git config remote.origin.url "git@github.com:personal/proyecto.git" 2>/dev/null || true
            ;;
        *)
            echo -e "${GREEN}⚙️ Configurando configuración por defecto${NC}"
            git config user.name "Tu Nombre"
            git config user.email "tu.email@ejemplo.com"
            git config remote.origin.url "git@github.com:usuario/proyecto.git" 2>/dev/null || true
            ;;
    esac
}

# Función para mostrar configuración actual
show_current_config() {
    echo -e "${BLUE}📋 Configuración actual de Git:${NC}"
    echo "Usuario: $(git config user.name)"
    echo "Email: $(git config user.email)"
    echo "Remote URL: $(git config remote.origin.url 2>/dev/null || echo 'No configurado')"
    echo ""
}

# Función para crear archivo .gitconfig local
create_local_gitconfig() {
    local project_type=$1
    local project_name=$(basename "$(pwd)")
    
    cat > .gitconfig << EOF
[user]
    name = $(git config user.name)
    email = $(git config user.email)
[core]
    autocrlf = true
[push]
    default = simple
[pull]
    rebase = false
EOF
    
    echo -e "${GREEN}✅ Archivo .gitconfig local creado${NC}"
}

# Función principal
main() {
    # Verificar si estamos en un repositorio Git
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        echo -e "${RED}❌ Error: No estás en un repositorio Git${NC}"
        echo "Ejecuta 'git init' primero para inicializar el repositorio"
        exit 1
    fi
    
    # Mostrar configuración actual
    show_current_config
    
    # Detectar tipo de proyecto
    project_type=$(detect_project_type)
    echo -e "${BLUE}🎯 Tipo de proyecto detectado: $project_type${NC}"
    
    # Configurar Git
    setup_git_config "$project_type"
    
    # Crear archivo de configuración local
    create_local_gitconfig "$project_type"
    
    # Mostrar configuración final
    echo -e "${GREEN}🎉 Configuración completada!${NC}"
    show_current_config
    
    # Mostrar comandos útiles
    echo -e "${BLUE}📚 Comandos útiles:${NC}"
    echo "• Ver configuración: git config --list --local"
    echo "• Cambiar usuario: git config user.name 'Nuevo Nombre'"
    echo "• Cambiar email: git config user.email 'nuevo@email.com'"
    echo "• Ver remotes: git remote -v"
    echo "• Agregar remote: git remote add origin git@github-agencia:usuario/repo.git"
}

# Ejecutar función principal
main "$@"
