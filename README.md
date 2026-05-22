# stream-service-file

Demo de exportación masiva de usuarios desde PostgreSQL en formato CSV y Excel usando streaming en NestJS.

## Requisitos

- [Docker](https://www.docker.com/products/docker-desktop) instalado y corriendo

## Levantar el proyecto

```bash
docker compose up --build
```

Eso descarga PostgreSQL, construye la imagen de la app y levanta ambos contenedores.

La app estará disponible en: `http://localhost:3000`

## Endpoints

### Health check
```
GET /
```

### Crear un usuario
```
POST /users
```

### Generar usuarios masivos
```
POST /users/generate
Content-Type: application/json

{
  "totalUsers": 50000,
  "batchSize": 1000
}
```

### Exportar usuarios
```
GET /export?type=csv
GET /export?type=excel
```

## Flujo de prueba rápida

```bash
# 1. Levantar el proyecto
docker compose up --build

# 2. Generar datos de prueba
curl -X POST http://localhost:3000/users/generate \
  -H "Content-Type: application/json" \
  -d '{"totalUsers": 50000, "batchSize": 1000}'

# 3. Exportar
curl -o users.csv  "http://localhost:3000/export?type=csv"
curl -o users.xlsx "http://localhost:3000/export?type=excel"
```

## Apagar

```bash
docker compose down          # apaga los contenedores
docker compose down -v       # apaga y borra los datos de PostgreSQL
```