docker build -t idmwy:latest . 

docker-compose -f docker-compose.yml up -d
docker-compose -f docker-compose.yml down


    localhost:9080/admin/master/console/ => for admin login
    Created realm and user within realm
    http://localhost:9080/realms/MarTechOne/account/ => for my realm user login
    logged in to realm and created client (app)
    Re: https://www.keycloak.org/getting-started/getting-started-docker

https://www.keycloak.org/server/all-config
