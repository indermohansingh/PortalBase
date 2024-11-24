import { getServerSession } from 'next-auth';
import ShowLoginOrLogout from '@/components/ShowLoginOrLogout';
import { getAuthOptions } from '@/app/api/auth/[...nextauth]/route';
import Cookies from 'js-cookie';

export default async function Private() {
  const selectedRealm = Cookies.get('selectedRealm') || "";
  const session = await getServerSession(getAuthOptions(selectedRealm));
  if (true || session) {
    return <div >
      <div>You are accessing a private page</div>
      <div>
        <ShowLoginOrLogout />
      </div>
      <br></br>
      <a href="/private/dropdb">Drop DB Here (needs SuperAdmin role, which is roleid of 1)</a>
      <br></br>
      <a href="/private/createdb">Create DB Here (needs SuperAdmin role, which is roleid of 1)</a>
      <br></br>
      Domain Realm Mapping list Here. Needs TenantAdmin role, which is roleid of 2. passing <a className="text-blue-500 hover:underline" href="/private/domainrealmmapping?tenantid=1">  tenantid of 1 </a> or  <a className="text-blue-500 hover:underline" href="/private/domainrealmmapping?tenantid=2">  tenantid of 2 </a>
      <br></br>
      Role list Here. Needs TenantAdmin role, which is roleid of 2. passing <a className="text-blue-500 hover:underline" href="/private/role?tenantid=1">  tenantid of 1 </a> or  <a className="text-blue-500 hover:underline" href="/private/role?tenantid=2">  tenantid of 2 </a>
      <br></br>
      Tenant Here. Needs Manager role, which is roleid of 3. passing <a className="text-blue-500 hover:underline" href="/private/tenant?tenantid=1">  tenantid of 1 </a> or  <a className="text-blue-500 hover:underline" href="/private/tenant?tenantid=2">  tenantid of 2 </a>
      <br></br>
      User Here. Needs CaseWorker role, which is roleid of 4. passing <a className="text-blue-500 hover:underline" href="/private/user?tenantid=1">  tenantid of 1 </a> or  <a className="text-blue-500 hover:underline" href="/private/user?tenantid=2">  tenantid of 2 </a>
    </div>
  }
}
