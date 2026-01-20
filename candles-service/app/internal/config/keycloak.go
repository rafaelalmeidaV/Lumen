package config

const (
	KeycloakBaseURL = "http://localhost:8080"
	Realm           = "Lumen"
	Issuer          = KeycloakBaseURL + "/realms/" + Realm
	JwksURL         = KeycloakBaseURL + "/realms/" + Realm + "/protocol/openid-connect/certs"
)
