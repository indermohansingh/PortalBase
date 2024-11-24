package apisixauthz

import input.request
import input.cprole

# Input structure: assumes input data has the endpoint and user's role
default allow = false

allow {
    startswith(request.path, "/createdb")
    input.method == "POST"
    input.role == 1
}


allow {
    startswith(request.path, "/dropdb")
    input.method == "POST"
    input.role == 1
}

allow {
    print("cleapath in domainrealmmapping1")
    print("cleapath Input received: ",input)
    print("cleapath Input Authorization received: ", input.request.headers.authorization)
    auth_header = input.request.headers.authorization
    print("cleapath Input auth_header received: ", auth_header)
    cprole1 := getrole
    print("cleapath in domainrealmmapping4")

    startswith(request.path, "/domainrealmmapping")
    request.method == "GET"
}

allow {
    print("cleapath in domainrealmmapping2")
    print("cleapath Input received: ", input)
    print("cleapath Input Authorization received: ", input.request.headers.authorization)
    auth_header = input.request.headers.authorization
    print("cleapath Input auth_header received: ", auth_header)
    cprole1 := getrole
    print("cleapath in domainrealmmapping3")

    startswith(request.path, "/domainrealmmapping")
    request.method == "OPTIONS"
}

allow {
    startswith(request.path, "/roles")
    input.role == 2
}

allow {
    startswith(request.path, "/tenants")
    input.role == 3
}

allow {
    startswith(request.path, "/users")
    input.role == 4
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
    print("cleapath Decoded JWT token here 1: ", input)
    print("cleapath Decoded JWT token here 2: ", input.request)
    print("cleapath Decoded JWT token here 3: ", input.request.headers)
    print("cleapath Decoded JWT token here 4: ", input.request.headers.authorization)
    v := input.request.headers.authorization
    print("cleapath Decoded JWT token here 2: ")
	startswith(v, "Bearer ")
    print("cleapath Decoded JWT token here 3: ")
	t := substring(v, count("Bearer "), -1)
    print("cleapath Decoded JWT token here 4: ")

    auth_header := input.request.headers.authorization
    # Ensure the token starts with "Bearer " and extract the actual token part
    print("cleapath Decoded JWT token here: ")
    auth_header != null
    parts = split(auth_header, " ")
    print("cleapath Decoded JWT token here2: ")
    count(parts) == 2  # Ensure the header has the format "Bearer <token>"
    print("cleapath Decoded JWT token here3: ")
    token_string = parts[1]

    # Decode the JWT token (you may need to adapt this depending on your OPA version)
    token := io.jwt.decode(token_string)
    print("cleapath Decoded JWT token: ", token)
    role := token
}