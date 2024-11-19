import { getServerSession } from 'next-auth';
import Logout from '@/components/Logout';
import { getAuthOptions } from '@/app/api/auth/[...nextauth]/route';
import Cookies from 'js-cookie';

export default async function Private() {
  const selectedRealm = Cookies.get('selectedRealm') || "mainapprlm";
  const session = await getServerSession(getAuthOptions(selectedRealm));
  if (session) {
    return <div className='flex flex-col space-y-3 justify-center items-center h-screen'>
      <div>You are accessing a private page</div>
      <div>Your name is {session.user?.name}</div>
      <div>
        <Logout />
      </div>
      <br></br>
      <a href="/private/createdb">Create DB Here</a>
      <br></br>
      <a href="/private/user">User list Here</a>
      <br></br>
      <a href="/private/tenant">Tenant list Here</a>
      <br></br>
      <a href="/private/role">Role list Here</a>
      <br></br>
      <a href="/private/domainrealmmapping">Domain Realm Mapping list Here</a>
    </div>
  }
}
