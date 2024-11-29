from elasticsearch import Elasticsearch, helpers
import json

# Connect to Elasticsearch
es = Elasticsearch("http://localhost:9200")  # Replace with your Elasticsearch URL if needed

# Load data from the JSON file
with open("complex_data.json", "r") as f:
    data = json.load(f)

# Prepare data for bulk loading
actions = [
    {
        "_index": "test_index",  # Replace with your desired index name
        "_id": user["id"],  # Use "id" field as the document ID
        "_source": user
    }
    for user in data
]

# Bulk load data into Elasticsearch
helpers.bulk(es, actions)

print("Data loaded successfully!")
