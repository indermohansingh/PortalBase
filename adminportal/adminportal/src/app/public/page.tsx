import { getServerSession } from 'next-auth';
import { getAuthOptions } from '../api/auth/[...nextauth]/route';
import Logout from '@/components/Logout';
import Login from '@/components/Login';
import Cookies from 'js-cookie';

export default async function Public() {
  const selectedRealm = Cookies.get('selectedRealm') || "";
  const session = await getServerSession(getAuthOptions(selectedRealm));
  if (session) {
    return <div className='flex flex-col space-y-3 justify-center items-center h-screen'>
      <div>You are accessing a public page</div>
      <div>Your name is {session.user?.name}</div>
      <div>
        <Logout />
      </div>
    </div>
  }
  return (
    <div className='flex flex-col space-y-3 justify-center items-center h-screen'>
      <div>You are accessing a public page</div>
      <div>
        <Login />
      </div>
    </div>
  )
}
