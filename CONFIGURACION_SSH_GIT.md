# 🔧 Configuración SSH y Git para Múltiples Proyectos

## 📋 Descripción
Este sistema permite que cada proyecto dentro de la carpeta `proyectos` tenga su propia configuración de Git y SSH, usando diferentes identidades según el tipo de proyecto.

## 🗂️ Estructura de Archivos Creados

```
~/.ssh/
├── config                    # Configuración SSH principal
├── id_rsa                    # Clave SSH por defecto
├── id_rsa_agencia           # Clave SSH para proyectos de agencia
├── id_rsa_cliente           # Clave SSH para proyectos de cliente
└── id_rsa_personal          # Clave SSH para proyectos personales

~/
├── .gitconfig               # Configuración Git global con condicionales
├── .gitconfig-agencia       # Config específico para agencia
├── .gitconfig-cliente       # Config específico para cliente
└── .gitconfig-personal      # Config específico para personal

proyectos/
└── agencia_V1/
    ├── setup-git-config.sh     # Script Bash para configuración
    └── setup-git-config.ps1    # Script PowerShell para Windows
```

## 🚀 Configuración Inicial

### 1. Generar Claves SSH
```bash
# Clave por defecto
ssh-keygen -t rsa -b 4096 -C "tu.email@ejemplo.com" -f ~/.ssh/id_rsa

# Clave para agencia
ssh-keygen -t rsa -b 4096 -C "agencia@marketing.com" -f ~/.ssh/id_rsa_agencia

# Clave para cliente
ssh-keygen -t rsa -b 4096 -C "cliente@proyecto.com" -f ~/.ssh/id_rsa_cliente

# Clave para personal
ssh-keygen -t rsa -b 4096 -C "personal@email.com" -f ~/.ssh/id_rsa_personal
```

### 2. Agregar Claves a SSH Agent
```bash
# Iniciar SSH agent
eval "$(ssh-agent -s)"

# Agregar todas las claves
ssh-add ~/.ssh/id_rsa
ssh-add ~/.ssh/id_rsa_agencia
ssh-add ~/.ssh/id_rsa_cliente
ssh-add ~/.ssh/id_rsa_personal
```

### 3. Agregar Claves Públicas a GitHub/GitLab
```bash
# Copiar claves públicas
cat ~/.ssh/id_rsa.pub
cat ~/.ssh/id_rsa_agencia.pub
cat ~/.ssh/id_rsa_cliente.pub
cat ~/.ssh/id_rsa_personal.pub
```

## 📁 Organización de Proyectos

### Estructura Recomendada
```
C:/proyectos/
├── agencia_V1/              # Proyecto de agencia
├── agencia_V2/              # Otro proyecto de agencia
├── cliente_empresa_A/       # Proyecto de cliente
├── cliente_empresa_B/       # Otro proyecto de cliente
├── personal_portfolio/      # Proyecto personal
└── personal_blog/           # Otro proyecto personal
```

### Configuración Automática
El sistema detecta automáticamente el tipo de proyecto basado en el nombre:
- `*agencia*` → Configuración de agencia
- `*cliente*` → Configuración de cliente  
- `*personal*` → Configuración personal
- Otros → Configuración por defecto

## 🛠️ Uso

### Configuración Automática
```bash
# En cualquier proyecto dentro de proyectos/
cd C:/proyectos/agencia_V1
./setup-git-config.ps1

# O en PowerShell
.\setup-git-config.ps1
```

### Configuración Manual
```bash
# Para proyecto de agencia
git config user.name "Agencia Marketing"
git config user.email "agencia@marketing.com"
git remote add origin git@github-agencia:agencia/repo.git

# Para proyecto de cliente
git config user.name "Cliente Proyecto"
git config user.email "cliente@proyecto.com"
git remote add origin git@github-cliente:cliente/repo.git
```

## 🔍 Verificación

### Verificar Configuración SSH
```bash
# Probar conexión SSH
ssh -T git@github.com
ssh -T git@github-agencia
ssh -T git@github-cliente
```

### Verificar Configuración Git
```bash
# Ver configuración actual
git config --list --local

# Ver configuración global
git config --list --global

# Ver configuración específica
git config user.name
git config user.email
```

## 🎯 Ventajas del Sistema

1. **Separación de Identidades**: Cada tipo de proyecto usa su propia identidad
2. **Configuración Automática**: Detecta automáticamente el tipo de proyecto
3. **Flexibilidad**: Fácil agregar nuevos tipos de proyecto
4. **Seguridad**: Diferentes claves SSH para diferentes propósitos
5. **Mantenimiento**: Configuración centralizada y fácil de actualizar

## 🔧 Personalización

### Agregar Nuevo Tipo de Proyecto
1. Crear nueva clave SSH: `ssh-keygen -t rsa -b 4096 -C "nuevo@email.com" -f ~/.ssh/id_rsa_nuevo`
2. Agregar configuración SSH en `~/.ssh/config`
3. Crear archivo de configuración Git: `~/.gitconfig-nuevo`
4. Agregar condicional en `~/.gitconfig`

### Modificar Configuraciones
- Editar archivos `~/.gitconfig-*` para cambiar usuarios/emails
- Editar `~/.ssh/config` para cambiar hosts o claves
- Ejecutar scripts de configuración para aplicar cambios

## 🚨 Troubleshooting

### Problemas Comunes
1. **SSH no funciona**: Verificar que las claves estén en SSH agent
2. **Configuración no se aplica**: Verificar rutas en `~/.gitconfig`
3. **Permisos SSH**: Verificar permisos de archivos SSH (600)

### Comandos de Diagnóstico
```bash
# Verificar SSH agent
ssh-add -l

# Verificar configuración SSH
ssh -F ~/.ssh/config -T git@github-agencia

# Verificar configuración Git
git config --show-origin --get-regexp user
```
