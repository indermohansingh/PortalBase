docker build -t db:latest .

docker-compose -f docker-compose.yml up -d
docker-compose -f docker-compose.yml down

Client:
=======
docker run -it mysql /bin/sh
mysql -u root -pinderroot -h host.docker.internal -P 7118
