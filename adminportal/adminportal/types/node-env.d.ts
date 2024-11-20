declare namespace NodeJS {
  export interface ProcessEnv {
    NEXTAUTH_URL: string
    NEXTAUTH_SECRET: string
    KEYCLOAK_CLIENT_ID_MAINAPPRLM: string
    KEYCLOAK_CLIENT_SECRET_MAINAPPRLM: string
    KEYCLOAK_ISSUER: string
    NEXT_PUBLIC_BACEND_SERVER_URL: string
  }
}