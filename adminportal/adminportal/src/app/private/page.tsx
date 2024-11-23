import { getServerSession } from 'next-auth';
import Logout from '@/components/Logout';
import { getAuthOptions } from '@/app/api/auth/[...nextauth]/route';
import Cookies from 'js-cookie';

export default async function Private() {
  const selectedRealm = Cookies.get('selectedRealm') || "";
  const session = await getServerSession(getAuthOptions(selectedRealm));
  if (session) {
    return <div className='flex flex-col space-y-3 justify-center items-center h-screen'>
      <div>You are accessing a private page</div>
      <div>Your name is {session.user?.name}</div>
      <div>
        <Logout />
      </div>
      <br></br>
      <a href="/private/dropdb">Drop DB Here (needs SuperAdmin role. roleid of 1)</a>
      <br></br>
      <a href="/private/createdb">Create DB Here (needs SuperAdmin role. roleid of 1)</a>
      <br></br>
      <a href="/private/domainrealmmapping">Domain Realm Mapping list Here (needs TenantAdmin role. roleid of 2)</a>
      <br></br>
      <a href="/private/role">Role list Here (needs TenantAdmin role. roleid of 2)</a>
      <br></br>
      <a href="/private/tenant">Tenant list Here. must pass tenantid. (needs Manager role. roleid of 3)</a>
      <br></br>
      <a href="/private/user">User list Here. must pass tenantid. (needs CaseWorker role. roleid of 4)</a>
    </div>
  }
}
