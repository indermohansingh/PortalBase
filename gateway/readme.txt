docker build -t gateway:latest . 
docker-compose -f docker-compose.yml up -d
docker-compose -f docker-compose.yml down

Learning/Notes
==============
Re: https://apisix.apache.org/docs/apisix/installation-guide/

Run
    curl http://127.0.0.1:9180/apisix/admin/routes?api_key=edd1c9f034335f136f87ad84b625c8f1 -i
    http://127.0.0.1:9180/apisix/admin/routes?api_key=edd1c9f034335f136f87ad84b625c8f1
