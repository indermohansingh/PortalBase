package apisix.authz

default allow = false

allow {
    input.method == "GET"
    input.user == "admin"
}
