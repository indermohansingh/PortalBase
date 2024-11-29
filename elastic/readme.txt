docker run -d -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:8.10.0

docker-compose -f docker-compose.yml up -d
docker-compose -f docker-compose.yml down

generate random json data: 
    python3 random_data_gen.py

load data into elastic:
    python3 load_into_elastic.py

curl -X GET "http://localhost:9200/test_index/_search?pretty=true&size=10"
