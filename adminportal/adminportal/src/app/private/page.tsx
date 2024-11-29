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
      Drop DB Here. Needs SuperAdmin role, which is roleid of 1. passing <a className="text-blue-500 hover:underline" href="/private/dropdb?tenantid=-1">  tenantid of -1 </a> or  <a className="text-blue-500 hover:underline" href="/private/dropdb?tenantid=1">  tenantid of WY(1) </a>
      <br></br>
      Create DB Here. Needs SuperAdmin role, which is roleid of 1. passing <a className="text-blue-500 hover:underline" href="/private/createdb?tenantid=-1">  tenantid of -1 </a> or  <a className="text-blue-500 hover:underline" href="/private/createdb?tenantid=1">  tenantid of WY(1) </a>
      <br></br>
      Domain Realm Mapping list Here. Needs TenantAdmin role, which is roleid of 2. passing <a className="text-blue-500 hover:underline" href="/private/domainrealmmapping?tenantid=1">  tenantid of WY(1) </a> or  <a className="text-blue-500 hover:underline" href="/private/domainrealmmapping?tenantid=2">  tenantid of MO(2) </a>
      <br></br>
      Role list Here. Needs TenantAdmin role, which is roleid of 2. passing <a className="text-blue-500 hover:underline" href="/private/role?tenantid=1">  tenantid of WY(1) </a> or  <a className="text-blue-500 hover:underline" href="/private/role?tenantid=2">  tenantid of MO(2) </a>
      <br></br>
      Tenant Here. Needs Manager role, which is roleid of 3. passing <a className="text-blue-500 hover:underline" href="/private/tenant?tenantid=1">  tenantid of WY(1) </a> or  <a className="text-blue-500 hover:underline" href="/private/tenant?tenantid=2">  tenantid of MO(2) </a>
      <br></br>
      User Here. Needs CaseWorker role, which is roleid of 4. passing <a className="text-blue-500 hover:underline" href="/private/user?tenantid=1">  tenantid of WY(1) </a> or  <a className="text-blue-500 hover:underline" href="/private/user?tenantid=2">  tenantid of MO(2) </a>
      <br></br>
      Elastic DSL related sample <a className="text-blue-500 hover:underline" href="/private/elastic"> here</a>
    </div>
  }
}
