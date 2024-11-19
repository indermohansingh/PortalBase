#!/bin/sh

echo "=======setting init======="
/opt/keycloak/idm/init/setupkc.sh & 

echo "=======starting======="
/opt/keycloak/bin/kc.sh "$@"
