docker build  -t policyagent:latest . 

docker-compose -f docker-compose.yml up -d
docker-compose -f docker-compose.yml down

