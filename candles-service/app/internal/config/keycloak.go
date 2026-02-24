package config

import "os"

var (
	KeycloakBaseURL     string
	KeycloakInternalURL string
	Realm   string
	Issuer  string
	JwksURL string
)

func LoadKeycloakConfig() {
	Realm = os.Getenv("KEYCLOAK_REALM")
	KeycloakBaseURL = os.Getenv("KEYCLOAK_BASE_URL")
	KeycloakInternalURL = os.Getenv("KEYCLOAK_INTERNAL_URL")

	Issuer = KeycloakBaseURL + "/realms/" + Realm
	JwksURL = KeycloakInternalURL + "/realms/" + Realm + "/protocol/openid-connect/certs"
}