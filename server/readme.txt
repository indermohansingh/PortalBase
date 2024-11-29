docker build -t server:latest .

docker-compose -f docker-compose.yml up -d
docker-compose -f docker-compose.yml down

curl -X POST http://localhost:3001/getesdsl -H "Content-Type: application/json" -d '{"englishquery":"Find all documents where the home is in MI"}'

Update Mapping
    PUT /new_index
    {
    "mappings": {
        ...
    }
    }

    POST /_reindex
    {
    "source": {
        "index": "..."
    },
    "dest": {
        "index": "..."
    }
    }

    DELETE /...
