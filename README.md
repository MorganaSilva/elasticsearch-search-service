# Elasticsearch Search Service

## Setup

```bash
git clone 
cd elasticsearch-search-service
docker-compose up -d
yarn install
yarn run seed
yarn add express
yarn dev
```

### Setup Dashboard
```bash
cd dashboard
yarn install
yarn dev
```

## Endpoints

### Buscar:
```
GET /search?q=rock&type=event&sort=popular
```

### Click analytics:
```
POST /analytics/click
Content-Type: "application/json"
Body: { "query_id": "abc", "doc_id": "e1", "rank": 1 }
```

### Seed Script:
```
GET /documents/_count
```

### Mapping & Analyzers:
```
GET /documents/_mapping?pretty
```

### Suggest:
```
Ex: GET /suggest?q=rock
```

### Synonyms:
```
Ex: GET /search?q=show&type=event
```

## Métricas:
```bash
yarn metrics
```