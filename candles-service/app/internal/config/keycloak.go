package config

const (
	KeycloakBaseURL     = "http://auth.local"
	KeycloakInternalURL = "http://auth-service-auth-chart.auth-service:8080"

	Realm   = "Lumen"
	Issuer  = KeycloakBaseURL + "/realms/" + Realm
	JwksURL = KeycloakInternalURL + "/realms/" + Realm + "/protocol/openid-connect/certs"
)
