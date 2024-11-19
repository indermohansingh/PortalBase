FROM openjdk:23-jdk AS jarbuilder
WORKDIR /opt/keycloak

RUN microdnf update -y && microdnf install -y findutils
RUN microdnf update -y && microdnf install -y curl

# Run a command to detect architecture
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then \
        PACKAGE_URL="https://github.com/jqlang/jq/releases/download/jq-1.7.1/jq-linux-amd64"; \
    elif [ "$ARCH" = "aarch64" ]; then \
        PACKAGE_URL="https://github.com/jqlang/jq/releases/download/jq-1.7.1/jq-linux-arm64"; \
    else \
        echo "Unsupported architecture: $ARCH"; \
        exit 1; \
    fi && \
    echo "Downloading package from: $PACKAGE_URL" && \
    curl -Lo /opt/keycloak/jq $PACKAGE_URL

# Run a command to detect architecture
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "x86_64" ]; then \
        PACKAGE_URL="https://github.com/moparisthebest/static-curl/releases/download/v8.5.0/curl-amd64"; \
    elif [ "$ARCH" = "aarch64" ]; then \
        PACKAGE_URL="https://github.com/moparisthebest/static-curl/releases/download/v8.5.0/curl-aarch64"; \
    else \
        echo "Unsupported architecture: $ARCH"; \
        exit 1; \
    fi && \
    echo "Downloading package from: $PACKAGE_URL" && \
    curl -Lo /opt/keycloak/curl $PACKAGE_URL

COPY ./keycloak-themes /opt/keycloak/keycloak-themes

WORKDIR /opt/keycloak/keycloak-themes
RUN sh ./package-all.sh

FROM quay.io/keycloak/keycloak:23.0.6 as builder
WORKDIR /opt/keycloak
# NOTE: If you are using a version of Keycloak prior to 23 you must use 
# the retrocompat-*.jar. Look inside your target directory there is two jars file
# one *.jar and the other retrocompat-*.jar

COPY --from=jarbuilder /opt/keycloak/keycloak-themes/deployments/*.jar /opt/keycloak/providers/
COPY --from=jarbuilder --chown=keycloak:root /opt/keycloak/jq /usr/bin/jq
COPY --from=jarbuilder --chown=keycloak:root /opt/keycloak/curl /usr/bin/curl

COPY --chown=keycloak:root kc_custom.sh /opt/keycloak/bin/

COPY --chown=keycloak:root ./init /opt/keycloak/idm/init

RUN chmod +x /opt/keycloak/idm/init/setupkc.sh
RUN chmod +x /usr/bin/jq
RUN chmod +x /usr/bin/curl
RUN chmod +x /opt/keycloak/bin/kc_custom.sh

#COPY lumo/lumo.jar /opt/keycloak/providers/
RUN /opt/keycloak/bin/kc.sh build

ENTRYPOINT ["/opt/keycloak/bin/kc_custom.sh"]