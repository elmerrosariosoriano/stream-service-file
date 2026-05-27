# stream-service-file

Demo de generación masiva y exportación de usuarios usando:

- NestJS
- Apache Kafka
- Apache Pinot
- Streaming CSV / Excel

## Arquitectura

```text
NestJS → Kafka → Pinot Realtime → Export CSV / Excel
```

---

# Requisitos

- Docker Desktop

---

# Levantar infraestructura

```bash
docker compose up --build -d
```

## URLs

| Servicio | URL |
|---|---|
| API | http://localhost:3000 |
| Pinot UI | http://localhost:9000 |
| Kafka UI | http://localhost:8080 |

---

# Crear Topic Kafka

```bash
docker exec -it kafka bash -c "kafka-topics --create --topic users-topic --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1"
```

---

# Crear Schema Pinot

```bash
curl -X POST http://localhost:9000/schemas -H "Content-Type: application/json" -d @pinot/users-schema.json
```

---

# Crear Realtime Table Pinot

```bash
curl -X POST http://localhost:9000/tables -H "Content-Type: application/json" -d @pinot/users-realtime-table.json
```

---

# Ejecutar aplicación

```bash
npm install && npm run start:dev
```

---

# Endpoints

## Health Check

```http
GET /
```

---

## Generar usuarios

```http
POST /users/generate
```

```json
{
  "totalUsers": 50000,
  "batchSize": 1000
}
```

---

## Exportar CSV

```http
GET /export?type=csv
```

---

## Exportar Excel

```http
GET /export?type=excel
```

---

# Flujo rápido

## Generar usuarios

```bash
curl -X POST http://localhost:3000/users/generate -H "Content-Type: application/json" -d "{\"totalUsers\":50000,\"batchSize\":1000}"
```

## Consultar Pinot

```sql
SELECT * FROM users_REALTIME LIMIT 10
```

## Descargar CSV

```bash
curl -o users.csv "http://localhost:3000/export?type=csv"
```

## Descargar Excel

```bash
curl -o users.xlsx "http://localhost:3000/export?type=excel"
```

---

# Apagar proyecto

```bash
docker compose down
```

```bash
docker compose down -v
```