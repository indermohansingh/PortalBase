const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());

// Manually prevent CORS by ensuring no CORS headers are set
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');  // No cross-origin access
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Referrer-Policy', 'no-referrer');
    next();
  });
  
// MySQL connection setup
const db = mysql.createConnection({
  host: 'host.docker.internal',
  port: '7118',
  user: 'inderuser',      // Your MySQL username
  password: 'inderpass',      // Your MySQL password
  database: 'inderdb'
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});

async function runQuery(query, inputs) {
  return new Promise((resolve, reject) => {
    db.query(query, inputs, (err, result) => {
      if (err) {
          console.error('Error with ', query, ' : ', err);
          resolve ({ status: "error" });
      }
      resolve ({ status: "success", result });
    });
  })
}

// CREATE DB
app.post('/createdb', async (req, res) => {
    const queries = [];
    let query = 'CREATE TABLE users ( \
        userid INT AUTO_INCREMENT PRIMARY KEY, \
        email VARCHAR(255) NOT NULL UNIQUE \
        ) \
    ';
    
    queries.push(runQuery(query, []));

    query = 'CREATE TABLE tenants ( \
        tenantid INT AUTO_INCREMENT PRIMARY KEY, \
        tenantname VARCHAR(255) NOT NULL UNIQUE \
        ) \
    ';

    queries.push(runQuery(query, []));

    query = 'CREATE TABLE roles ( \
        roleid INT AUTO_INCREMENT PRIMARY KEY, \
        rolename VARCHAR(255) NOT NULL UNIQUE \
        ) \
    ';

    queries.push(runQuery(query, []));

    query = 'CREATE TABLE tenantuserrolemapping ( \
        tenantid INT NOT NULL , \
        userid INT NOT NULL , \
        roleid INT NOT NULL , \
        PRIMARY KEY (tenantid, userid) \
        ) \
    ';

    queries.push(runQuery(query, []));

    query = 'CREATE TABLE domainrealmmapping ( \
        domain VARCHAR(255) NOT NULL PRIMARY KEY , \
        realm VARCHAR(255) NOT NULL \
        ) \
    ';

    queries.push(runQuery(query, []));

    const results = await Promise.allSettled(queries);

    res.status(201).json(results);

});
  
// CREATE user
app.post('/users', (req, res) => {
  const { email } = req.body;
  const query = 'INSERT INTO users (email) VALUES (?)';
  
  db.query(query, [email], (err, result) => {
    if (err) {
      console.error('Error inserting user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ id: result.insertId, email });
  });
});

  
// update user
app.put('/users/:id', (req, res) => {
  const { email } = req.body;
  const userId = req.params.id;
  const query = 'UPDATE users set email = ? where userid = ?';
  
  db.query(query, [email, userId], (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ id: userId, email });
  });
});

// READ all users
app.get('/users', (req, res) => {
  const query = 'SELECT * FROM users';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(results);
  });
});

// READ single user by ID
app.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT * FROM users WHERE userid = ?';
  
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error fetching user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(result[0]);
  });
});

// DELETE user
app.delete('/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'DELETE FROM users WHERE userid = ?';
  
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted' });
  });
});




// CREATE tenants
app.post('/tenants', (req, res) => {
const { tenantname } = req.body;
const query = 'INSERT INTO tenants (tenantname) VALUES (?)';

db.query(query, [tenantname], (err, result) => {
  if (err) {
    console.error('Error inserting tenants:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
  res.status(201).json({ id: result.insertId, tenantname });
});
});


// update tenants
app.put('/tenants/:id', (req, res) => {
const { tenantname } = req.body;
const tenantid = req.params.id;
const query = 'UPDATE tenants set tenantname = ? where tenantid = ?';

db.query(query, [tenantname, tenantid], (err, result) => {
  if (err) {
    console.error('Error updating tenants:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
  res.status(201).json({ id: tenantid, tenantname });
});
});

// READ all tenants
app.get('/tenants', (req, res) => {
const query = 'SELECT * FROM tenants';

db.query(query, (err, results) => {
  if (err) {
    console.error('Error fetching tenants:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
  res.status(200).json(results);
});
});

// READ single user by ID
app.get('/tenants/:id', (req, res) => {
const tenantid = req.params.id;
const query = 'SELECT * FROM tenants WHERE tenantid = ?';

db.query(query, [tenantid], (err, result) => {
  if (err) {
    console.error('Error fetching tenants:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
  if (result.length === 0) {
    return res.status(404).json({ error: 'tenants not found' });
  }
  res.status(200).json(result[0]);
});
});

// DELETE tenants
app.delete('/tenants/:id', (req, res) => {
const tenantid = req.params.id;
const query = 'DELETE FROM tenants WHERE tenantid = ?';

db.query(query, [tenantid], (err, result) => {
  if (err) {
    console.error('Error deleting tenant:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
  if (result.affectedRows === 0) {
    return res.status(404).json({ error: 'tenant not found' });
  }
  res.status(200).json({ message: 'tenant deleted' });
});
});





// CREATE roles
app.post('/roles', (req, res) => {
  const { rolename } = req.body;
  const query = 'INSERT INTO roles (rolename) VALUES (?)';
  
  db.query(query, [rolename], (err, result) => {
    if (err) {
      console.error('Error inserting roles:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ id: result.insertId, rolename });
  });
  });
  
  
  // update roles
  app.put('/roles/:id', (req, res) => {
  const { rolename } = req.body;
  const roleid = req.params.id;
  const query = 'UPDATE roles set rolename = ? where roleid = ?';
  
  db.query(query, [rolename, roleid], (err, result) => {
    if (err) {
      console.error('Error updating roles:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ id: roleid, rolename });
  });
  });
  
  // READ all roles
  app.get('/roles', (req, res) => {
  const query = 'SELECT * FROM roles';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching roles:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(results);
  });
  });
  
  // READ single user by ID
  app.get('/roles/:id', (req, res) => {
  const roleid = req.params.id;
  const query = 'SELECT * FROM roles WHERE roleid = ?';
  
  db.query(query, [roleid], (err, result) => {
    if (err) {
      console.error('Error fetching roles:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'roles not found' });
    }
    res.status(200).json(result[0]);
  });
  });
  
  // DELETE roles
  app.delete('/roles/:id', (req, res) => {
  const roleid = req.params.id;
  const query = 'DELETE FROM roles WHERE roleid = ?';
  
  db.query(query, [roleid], (err, result) => {
    if (err) {
      console.error('Error deleting role:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'tenant not found' });
    }
    res.status(200).json({ message: 'role deleted' });
  });
  });
  




// CREATE domainrealmmapping
app.post('/domainrealmmapping', (req, res) => {
  const { domain, realm } = req.body;
  const query = 'INSERT INTO domainrealmmapping (domain, realm) VALUES (?, ?)';
  
  db.query(query, [domain, realm], (err, result) => {
    if (err) {
      console.error('Error inserting domainrealmmapping:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ domain, realm });
  });
  });
  
  
  // update domainrealmmapping
  app.put('/domainrealmmapping/:domain', (req, res) => {
  const { realm } = req.body;
  const domain = req.params.domain;
  const query = 'UPDATE domainrealmmapping set realm = ? where domain = ?';
  db.query(query, [realm, domain], (err, result) => {
    if (err) {
      console.error('Error updating domainrealmmapping:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(201).json({ domain , realm });
  });
  });
  
  // READ all domainrealmmapping
  app.get('/domainrealmmapping', (req, res) => {
  const query = 'SELECT * FROM domainrealmmapping';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching domainrealmmapping:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.status(200).json(results);
  });
  });
  
  // READ single user by ID
  app.get('/domainrealmmapping/:domain', (req, res) => {
  const domain = req.params.domain;
  const query = 'SELECT * FROM domainrealmmapping WHERE domain = ?';
  
  db.query(query, [domain], (err, result) => {
    if (err) {
      console.error('Error fetching domainrealmmapping:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: 'domainrealmmapping not found' });
    }
    res.status(200).json(result[0]);
  });
  });
  
  // DELETE domainrealmmapping
  app.delete('/domainrealmmapping/:domain', (req, res) => {
  const domain = req.params.domain;
  const query = 'DELETE FROM domainrealmmapping WHERE domain = ?';
  console.log(query +  domain)

  db.query(query, [domain], (err, result) => {
    if (err) {
      console.error('Error deleting domainrealmmapping:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'domain not found' });
    }
    res.status(200).json({ message: 'domain deleted' });
  });
  });
  


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});