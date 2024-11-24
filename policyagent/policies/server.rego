package apisixauthz

import input.request
import input.cprole

# Input structure: assumes input data has the endpoint and user's role
default allow = false

allow {
    startswith(request.path, "/createdb")
    input.method == "POST"
    cprole1 := getrole
    cprole1 == 1
}


allow {
    startswith(request.path, "/dropdb")
    input.method == "POST"
    cprole1 := getrole
    cprole1 == 1
}

allow {
    startswith(request.path, "/domainrealmmapping")
    cprole1 := getrole
    cprole1 == 2
}

allow {
    startswith(request.path, "/roles")
    cprole1 := getrole
    cprole1 == 2
}

allow {
    startswith(request.path, "/tenants")
    cprole1 := getrole
    cprole1 == 3
}

allow {
    startswith(request.path, "/users")
    cprole1 := getrole
    cprole1 == 4
}

# OPA will return 'allow' or 'deny' in the 'result' field.
result = true {
    allow
}

result = false {
    not allow
}

# Helper function to decode the JWT token
getrole := role {
    authtoken := input.request.headers.authorization
	startswith(authtoken, "Bearer ")
	authtoken2 := substring(authtoken, count("Bearer "), -1)

    # Decode the JWT token (you may need to adapt this depending on your OPA version)
    token := io.jwt.decode(authtoken2)
    rolearray := token[1].cprolesbytenant
    print("cleapath rolearray: ", rolearray)

    tenantid := input.request.query.tenantid

    obj := rolearray[_]
    obj.tenantid == to_number(tenantid)
    role := obj.roleid
    print("cleapath roleeid: ", role)
}
