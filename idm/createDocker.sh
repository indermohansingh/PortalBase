cd keycloak-themes
sh ./package-all.sh
cd ..
docker build -t idm:latest .
