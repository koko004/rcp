# Cursos RCP - Salvacorazones

Aplicación web para la gestión de inscripciones a cursos de RCP y desfibriladores.

## Estructura del proyecto

```
.
├── public/                    # Archivos estáticos (HTML, CSS, JS, imágenes)
│   ├── index.html            # Formulario de inscripción
│   ├── login.html            # Página de login
│   ├── admin.html           # Panel de administración
│   └── logo.png             # Logo de la federación
├── data/                     # Directorio para datos (inscripciones)
├── server.js                 # Servidor Node.js con Express
├── package.json              # Dependencias Node.js
├── Dockerfile               # Imagen Docker
├── docker-compose.yml       # Orquestación Docker
├── .env                     # Variables de entorno
└── .env.example            # Ejemplo de variables de entorno
```

## Despliegue en otro host

### Requisitos previos

- Docker instalado
- Docker Compose instalado

### Pasos para desplegar

1. **Copiar el proyecto al servidor de destino:**
   ```bash
   scp -r ./rcp usuario@servidor:/ruta/destino/
   ```

2. **Conectar al servidor:**
   ```bash
   ssh usuario@servidor
   ```

3. **Navegar al directorio del proyecto:**
   ```bash
   cd /ruta/destino/rcp
   ```

4. **Configurar variables de entorno (opcional):**
   ```bash
   cp .env.example .env
   nano .env
   ```

5. **Construir y ejecutar:**
   ```bash
   docker-compose up -d --build
   ```

### Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| PORT | Puerto de la aplicación | 6500 |
| ADMIN_USER | Usuario administrador | Federacion |
| ADMIN_PASS | Contraseña administrador | Faf12345* |

Ejemplo de `.env`:
```env
PORT=6500
ADMIN_USER=MiUsuario
ADMIN_PASS=MiContrasena123
```

### Acceder a la aplicación

- **Formulario de inscripción**: `http://IP_SERVIDOR:6500`
- **Página de login**: `http://IP_SERVIDOR:6500/login`
- **Panel de administración**: `http://IP_SERVIDOR:6500/admin`

### Comandos útiles

```bash
# Ver estado de los contenedores
docker-compose ps

# Ver logs de la aplicación
docker-compose logs -f

# Detener la aplicación
docker-compose down

# Reiniciar la aplicación
docker-compose restart

# Rebuild de la imagen
docker-compose build --no-cache
```

### Persistencia de datos

Los datos de inscripciones se almacenan en el directorio `data/` del servidor. Para hacer backup:
```bash
# Copiar datos
tar -czf inscripciones_backup.tar.gz data/

# Restaurar datos
tar -xzf inscripciones_backup.tar.gz
```

## Desarrollo local (sin Docker)

### Requisitos

- Node.js 18+
- npm

### Pasos

```bash
# Instalar dependencias
npm install

# Iniciar servidor
node server.js
```

La aplicación estará disponible en `http://localhost:3000`