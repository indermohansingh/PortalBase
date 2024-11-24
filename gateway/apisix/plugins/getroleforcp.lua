local core = require("apisix.core")
local jwt = require("resty.jwt")

-- Define schema (no properties required)
local schema = {
  type = "object",
  properties = {},
  required = {}
}

-- Function to extract tenantid from the URL
local function get_tenantid_from_url()
    local tenantid = ngx.var.arg_tenantid
    tenantid = tonumber(tenantid)
    if not tenantid then
        tenantid = -1  -- Set to "-1" if tenantid is not found in the URL
    end
    return tenantid
end

-- Plugin logic for handling request
local function handle_request()
    local tenantid = get_tenantid_from_url()
    local headers = ngx.req.get_headers()
    local auth_header = headers["Authorization"]
    local token = ""
    if auth_header then
        -- Remove "Bearer " prefix if the header is present
        token = auth_header:gsub("Bearer ", "")
        core.log.debug("Token extracted: ", token)
    else
        -- Handle the case where Authorization header is missing
        core.log.debug("Authorization header is missing")
    end
    
    -- Decode the JWT token
    local decoded = jwt:verify("your-jwt-secret", token)

    if decoded and decoded.payload and decoded.payload.cprolesbytenant then
        core.log.debug("Info: tenantid ", tenantid, "; ;role: ", tostring(decoded.payload.cprolesbytenant))
        -- Loop through the cprolesbytenant in the JWT payload
        for _, role in ipairs(decoded.payload.cprolesbytenant) do
            core.log.debug("trying matching: tenantid ", tenantid, " with tenant ", role.tenantid, " and role ", role.roleid)
            if role.tenantid == tenantid then
                -- If tenantid matches, store the roleid in ngx.ctx for further use
                ngx.ctx.role = role.roleid
                core.log.debug("Role found for tenantid ", tenantid, ": ", role.roleid)
                return
            end
        end
    else 
        core.log.debug("Info: tenantid ", tenantid, "; ;role: cprolesbytenant not found")
    end

    -- If no matching role is found, log and handle accordingly
    core.log.warn("No role found for tenantid ", tenantid)
end

-- Plugin init function
local function init_worker()
    -- Any worker initialization logic can be added here if needed
end

-- Return schema and handlers
return {
    schema = schema,
    init_worker = init_worker,
    access = handle_request,
    version = 0.1,
    priority = 1000,  -- Define the execution priority of this plugin
    name = plugin_name,
}
