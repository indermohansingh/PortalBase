const axios = require('axios');

// Configuration (same as before)
const clientId = 'admin-cli';

async function getAdminAccessToken(adminUsername, adminPassword, keycloakUrl) {
  const response = await axios.post(
    `${keycloakUrl}/realms/master/protocol/openid-connect/token`,
    new URLSearchParams({
      client_id: clientId,
      grant_type: 'password',
      username: adminUsername,
      password: adminPassword,
    }).toString(),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  return response.data.access_token;
}

async function findUserByUsername(accessToken, username, realm, keycloakUrl) {
  try {
    const response = await axios.get(
      `${keycloakUrl}/admin/realms/${realm}/users`,
      {
        params: { username }, // Search by username
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    // Check if a user was found and return the full user object
    if (response.data.length > 0) {
      return response.data[0]; // The API returns an array; take the first match
    } else {
      console.log('User not found');
      return null;
    }
  } catch (error) {
    console.error('Error finding user:', error.response?.data || error.message);
    throw error;
  }
}

async function updateUser(accessToken, userId, userData, realm, keycloakUrl) {
  await axios.put(
    `${keycloakUrl}/admin/realms/${realm}/users/${userId}`,
    userData,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  console.log('User updated successfully');
}

async function createUser(accessToken, userData, realm, keycloakUrl) {
  await axios.post(
    `${keycloakUrl}/admin/realms/${realm}/users`,
    userData,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  console.log('User created successfully');
}

module.exports.createOrUpdateUserInKC = async function (tenantid, email, roleid, for_role_use_tenant_1=false) {
         //for_role_use_tenant_1 is used to create user in WY KC but user with role is also needed in CP KC and in CP KC, role has to match WY ten.
  try {
    const realm = tenantid==1?'mainrlm':'mainapprlm';
    const adminUsername = tenantid==1?'adminwy':'admin'; 
    const adminPassword = tenantid==1?'adminwy':'admin'; 
    const keycloakUrl = tenantid==1?'http://host.docker.internal:7123':'http://host.docker.internal:7119';

    const token = await getAdminAccessToken(adminUsername, adminPassword, keycloakUrl);
    const username = email;
    const cprole = {tenantid: for_role_use_tenant_1 ? 1 : tenantid, roleid}
    const userData = {
      username,
      email: email,
      firstName: '',
      lastName: '',
      enabled: true,
      credentials: [
        {
          type: 'password',
          value: 'password123',
          temporary: false,
        },
      ],
      attributes: {
        cprolesbytenant: JSON.stringify ([cprole]), // Custom attribute
      },
    };

    const existingUser = await findUserByUsername(token, username, realm, keycloakUrl);

    if (existingUser) {
      console.log('User exists, updating...');
      //merge the cprole to existing values in existingUser.attributes.cprolesbytenant
      if (existingUser.attributes) {
        const existingAttributes = existingUser.attributes ;
        if (existingAttributes.cprolesbytenant) {
          //cprolesbytenant exists . if one of the role is for same tenantid, then replace it. else add a new element to array
          let roleArray = [];
          try { roleArray = JSON.parse (existingAttributes.cprolesbytenant) || []} catch {}
          const index = roleArray.findIndex(item => item.tenantid === cprole.tenantid);
          if (index !== -1) {
            // Replace the existing object if tenantid matches
            roleArray[index] = cprole;
          } else {
            // Add the new object if tenantid doesn't exist
            roleArray.push(cprole);
          }
          //update in the userdata
          userData.attributes.cprolesbytenant = JSON.stringify (roleArray)
        } else {
          //cprolesbytenant attribute doesnt exist. will add it as part of userdata
          existingAttributes.cprolesbytenant = JSON.stringify ([cprole])
          userData.attributes = existingAttributes
        }
      } else {
        //attribute doesnt exist. will add it as part of userdata. nothing needed here
      }

      await updateUser(token, existingUser.id, userData, realm, keycloakUrl);
    } else {
      console.log('User does not exist, creating...');
      await createUser(token, userData, realm, keycloakUrl);
    }

    //for wy users.. add them to CP KC as well
    if (tenantid==1) await this.createOrUpdateUserInKC(2, email, roleid, true)

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};
