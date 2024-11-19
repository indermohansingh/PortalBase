#!/bin/sh

echo =======initing==========

# Setup env
KC_ADMIN_REALM=master
KC_ADMIN_USER=$KEYCLOAK_ADMIN
KC_ADMIN_PWD=$KEYCLOAK_ADMIN_PASSWORD
KC_NEW_SVC_USR=$KC_NEW_SVC_USER
KC_NEW_SVC_PWD=$KC_NEW_SVC_PAWD
KC_MAIN_APP_SUPER_USR=$KC_MAINAPP_SUPER_USR
KC_MAIN_APP_SUPER_PWD=$KC_MAINAPP_SUPER_PWD
KC_MAIN_APP_CLIENT_SECRET=$KC_MAINAPP_CLIENT_SECRET
KC_WY_MAIN_APP_CLIENT_SECRET=$KC_WY_MAINAPP_CLIENT_SECRET
KC_SERVER_URL=http://localhost:8080

# Continuously check the liveness probe
while true; do
    # Perform liveness check
    status_code=$(curl -s -o /dev/null -w "%{http_code}" $KC_SERVER_URL/)
    echo $status_code
    if [ "$status_code" -eq 200 ] || [ "$status_code" -eq 200000 ] || [ "$status_code" -eq 000200 ]; then
        # Liveness check is positive, run the task
        echo "Liveness check successful, running task..."
        # Run your task here
        # For example:
        # /path/to/your/task.sh

        echo =======Logging In==========

        # Log in
        echo "Logging In..."
        ./bin/kcadm.sh config credentials --server $KC_SERVER_URL --realm $KC_ADMIN_REALM --user $KC_ADMIN_USER --password $KC_ADMIN_PWD

        echo =======Creating Service User==========

        # Create temp user
        echo "Creating service user..."
        ./bin/kcadm.sh create users -r $KC_ADMIN_REALM -s username=$KC_NEW_SVC_USR -s enabled=true

        # make user  admin
        echo "adding roles to user..."
        ./bin/kcadm.sh add-roles --uusername $KC_NEW_SVC_USR --rolename admin -r $KC_ADMIN_REALM

        # Create credentials for new user
        echo "creating creds for user..."
        ./bin/kcadm.sh set-password --username $KC_NEW_SVC_USR --new-password $KC_NEW_SVC_PWD -r $KC_ADMIN_REALM


        echo =======Creating Realm: mainapprlm==========


        # Create realm mainapprlm
        echo "creating realm mainapprlm..."
        ./bin/kcadm.sh create realms -s realm=mainapprlm -s enabled=true
                
        #update your specific resource, in this case we're updating the attribute smtpServer with the according values
        #realm_setting=$(cat ./init/realm-setting.json)
        realm_setting_master='
        {
            "smtpServer": {
                "replyToDisplayName": "'$KC_EML_DISPL_NAME'",
                "starttls": "false",
                "auth": "",
                "port": "25",
                "host": "'$IDP_SMTP_URL'",
                "replyTo": "'$IDP_EML_ID'",
                "from": "'$IDP_EML_ID'",
                "fromDisplayName": "'$KC_EML_DISPL_NAME'",
                "ssl": "false"
            },
            "registrationAllowed": false,
            "registrationEmailAsUsername": false,
            "rememberMe": false,
            "verifyEmail": false,
            "loginWithEmailAllowed": true,
            "duplicateEmailsAllowed": false,
            "resetPasswordAllowed": true,
            "editUsernameAllowed": false,
            "bruteForceProtected": false,
            "permanentLockout": false,
            "loginTheme": "mainapptheme",
            "accountTheme": "mainapptheme",
            "adminTheme": "mainapptheme",
            "emailTheme": "mainapptheme"
        }
        '

        realm_setting='
        {
            "smtpServer": {
                "replyToDisplayName": "'$KC_EML_DISPL_NAME'",
                "starttls": "false",
                "auth": "",
                "port": "25",
                "host": "'$IDP_SMTP_URL'",
                "replyTo": "'$IDP_EML_ID'",
                "from": "'$IDP_EML_ID'",
                "fromDisplayName": "'$KC_EML_DISPL_NAME'",
                "ssl": "false"
            },
            "registrationAllowed": false,
            "registrationEmailAsUsername": false,
            "rememberMe": true,
            "verifyEmail": true,
            "loginWithEmailAllowed": true,
            "duplicateEmailsAllowed": false,
            "resetPasswordAllowed": true,
            "editUsernameAllowed": false,
            "bruteForceProtected": false,
            "permanentLockout": false,
            "loginTheme": "mainapptheme",
            "accountTheme": "mainapptheme",
            "adminTheme": "mainapptheme",
            "emailTheme": "mainapptheme"
        }
        '
        #Apply setting to master
        echo "setting master configs..."
        echo "$realm_setting_master" | ./bin/kcadm.sh update realms/master -f -

        #Apply setting to mainapprlm
        echo "setting mainapprlm configs..."
        echo "$realm_setting" | ./bin/kcadm.sh update realms/mainapprlm -f -


        echo =======Creating Client: mainappclt form Realm: mainapprlm==========

        # Create mainapprlm's portal client
        echo "creating client mainappclt ..."
        CID=$(./bin/kcadm.sh create clients -r mainapprlm -s clientId=mainappclt -s redirectUris=$KC_RED_URLS -i)

        client_settings='
        {
            "name": "",
            "description": "",
            "rootUrl": "",
            "adminUrl": "",
            "baseUrl": "",
            "alwaysDisplayInConsole": false,
            "consentRequired": false,
            "standardFlowEnabled": true,
            "implicitFlowEnabled": false,
            "directAccessGrantsEnabled": false,
            "serviceAccountsEnabled": false,
            "publicClient": false,
            "frontchannelLogout": false,
            "redirectUris": '$KC_RED_URLS',
            "secret": "'$KC_MAIN_APP_CLIENT_SECRET'"
        }
        '
        # get cleint id for mainappclt 
        echo "updating client mainappclt ..."
        CID=$(./bin/kcadm.sh get clients -r mainapprlm  | jq -r '.[] | select(.clientId == "mainappclt").id')
        # update mainappclt with above settings.
        echo "$client_settings" | ./bin/kcadm.sh update clients/$CID -r mainapprlm -f -

        # Create mainapprlm's portal roles
        echo "creating roles ..."
        ./bin/kcadm.sh create roles -r mainapprlm -s name=SuperAdmin -s description="Super Admin"


        echo =======Creating Super User for Realm: mainapprlm==========

        # Create main app super user
        echo "Creating main app super user..."
        ./bin/kcadm.sh create users -r mainapprlm -s username=$KC_MAIN_APP_SUPER_USR -s enabled=true

        # make user  admin
        echo "adding roles to user..."
        ./bin/kcadm.sh add-roles --uusername $KC_MAIN_APP_SUPER_USR --rolename SuperAdmin -r mainapprlm

        # Create credentials for new user
        echo "creating creds for user..."
        ./bin/kcadm.sh set-password --username $KC_MAIN_APP_SUPER_USR --new-password $KC_MAIN_APP_SUPER_PWD -r mainapprlm


        echo =======Creating Federated Realm: wyrlm==========

        # create federated realm for WY
        # Create realm wyrlm
        echo "creating realm wyrlm..."
        ./bin/kcadm.sh create realms -s realm=wyrlm -s enabled=true

        # set realm setting for wy
        realm_setting_wyrlm='
        {
            "smtpServer": {
                "replyToDisplayName": "'$KC_EML_DISPL_NAME'",
                "starttls": "false",
                "auth": "",
                "port": "25",
                "host": "'$IDP_SMTP_URL'",
                "replyTo": "'$IDP_EML_ID'",
                "from": "'$IDP_EML_ID'",
                "fromDisplayName": "'$KC_EML_DISPL_NAME'",
                "ssl": "false"
            },
            "registrationAllowed": false,
            "registrationEmailAsUsername": false,
            "rememberMe": true,
            "verifyEmail": true,
            "loginWithEmailAllowed": true,
            "duplicateEmailsAllowed": false,
            "resetPasswordAllowed": true,
            "editUsernameAllowed": false,
            "bruteForceProtected": false,
            "permanentLockout": false,
            "loginTheme": "mainapptheme",
            "accountTheme": "mainapptheme",
            "adminTheme": "mainapptheme",
            "emailTheme": "mainapptheme"
        }
        '

        #Apply setting to wyrlm
        echo "setting wyrlm configs..."
        echo "$realm_setting_wyrlm" | ./bin/kcadm.sh update realms/wyrlm -f -

        echo =======Creating IDP for wyrlm==========

        #Create IDP Settings
        idp_setting_wyrlm='
            {
                "alias": "WYSSO",
                "providerId": "keycloak-oidc",
                "enabled": true,
                "config": {
                    "authorizationUrl": "http://host.docker.internal:7123/realms/mainapprlm/protocol/openid-connect/auth",
                    "tokenUrl": "http://host.docker.internal:7123/realms/mainapprlm/protocol/openid-connect/token",
                    "logoutUrl": "http://host.docker.internal:7123/realms/mainapprlm/protocol/openid-connect/logout",
                    "userInfoUrl": "http://host.docker.internal:7123/realms/mainapprlm/protocol/openid-connect/userinfo",
                    "issuer": "http://host.docker.internal:7123/realms/mainapprlm",
                    "clientId": "mainappclt",
                    "clientSecret": "Mgb4X/5RaqAojphemSxN+NLOoSm/+lMLzcHEFmlbrU4wy",
                    "syncRegistrations": false
                }
            }
        '
        #Create IDP..
        echo "creating IDP for wyrlm..."
        echo "$idp_setting_wyrlm" | ./bin/kcadm.sh create identity-provider/instances -r wyrlm -f -
        echo "$idp_setting_wyrlm" | ./bin/kcadm.sh update identity-provider/instances/WYSSO -r wyrlm -f -

        echo =======Creating Browser Flow for wyrlm==========

        #get execution step id for browser flow..
        echo "get execution step id for browser flow.."
        CID=$(./bin/kcadm.sh get authentication/flows/browser/executions -r wyrlm  | jq -r '.[] | select(.providerId == "identity-provider-redirector").authenticationConfig')
        if [ "$CID" = "null" ] ; then
            #defaultProvider config doesnt exist, so create..
            CID=$(./bin/kcadm.sh get authentication/flows/browser/executions -r wyrlm  | jq -r '.[] | select(.providerId == "identity-provider-redirector").id')
            ./bin/kcadm.sh create "authentication/executions/$CID/config" -s alias=WYSSO  -s 'config."defaultProvider"=WYSSO' -r wyrlm
        else
            #defaultProvider config exists, so update..
            ./bin/kcadm.sh update "authentication/config/$CID" -s alias=WYSSO  -s 'config."defaultProvider"=WYSSO' -r wyrlm
        fi
        #make redirection mandatory..
        CID=$(./bin/kcadm.sh get authentication/flows/browser/executions -r wyrlm  | jq -r '.[] | select(.providerId == "identity-provider-redirector").id')
        echo '{"id": "'$CID'", "requirement" : "REQUIRED" }' | ./bin/kcadm.sh update authentication/flows/browser/executions  -r wyrlm -f -

        echo =======Creating first login Flow for wyrlm==========
        CID=$(./bin/kcadm.sh get authentication/flows/first%20broker%20login/executions -r wyrlm  | jq -r '.[] | select(.providerId == "idp-review-profile").id')
        echo '{"id": "'$CID'", "requirement" : "DISABLED" }' | ./bin/kcadm.sh update authentication/flows/first%20broker%20login/executions  -r wyrlm -f -


        echo =======Creating Client for wyrlm==========

        # Create wyrlm's portal client
        echo "creating client mainappclt ..."
        CID=$(./bin/kcadm.sh create clients -r wyrlm -s clientId=mainappclt -s redirectUris=$KC_RED_URLS -i)

        client_settings='
        {
            "name": "",
            "description": "",
            "rootUrl": "",
            "adminUrl": "",
            "baseUrl": "",
            "alwaysDisplayInConsole": false,
            "consentRequired": false,
            "standardFlowEnabled": true,
            "implicitFlowEnabled": false,
            "directAccessGrantsEnabled": false,
            "serviceAccountsEnabled": false,
            "publicClient": false,
            "frontchannelLogout": false,
            "redirectUris": '$KC_RED_URLS',
            "secret": "'$KC_WY_MAIN_APP_CLIENT_SECRET'"
        }
        '
        # get cleint id for mainappclt 
        echo "updating client mainappclt ..."
        CID=$(./bin/kcadm.sh get clients -r wyrlm  | jq -r '.[] | select(.clientId == "mainappclt").id')
        # update mainappclt with above settings.
        echo "$client_settings" | ./bin/kcadm.sh update clients/$CID -r wyrlm -f -

        echo "Init completed..."

        break  # Exit the loop once the task is run
    else
        # Liveness check is not yet positive, wait and retry
        echo "Liveness check not yet successful, waiting..."
        sleep 15  # Adjust the interval as needed
    fi
done


