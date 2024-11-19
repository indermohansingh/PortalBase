ports
    portal
        within docker: 3000
        outside world: 7111
    adminportal
        within docker: 3000
        outside world: 7121
    gateway/apisix
        within docker: 
            9180, 9080, 9091, 9443, 9092, (apisix ports)
            7117, 7122, 7125 (one each for portal, admin portal, server)
        outside world: 
            7112, 7113, 7114, 7115, 7116, 
            7117, 7122, 7125
    db/mysql
        within docker: 3306
        outside world: 7118
    idm/kc
        within docker: 8080
        outside world: 7119
    idmwy/kc
        within docker: 8080
        outside world: 7123
    smtp
        within docker: 25
        outside world: 7120
    server
        within docker: 3001
        outside world: 7124

