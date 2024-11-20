import { getServerSession } from 'next-auth'
import { getAuthOptions } from './api/auth/[...nextauth]/route'
import Login from '../components/Login'
import Logout from '../components/Logout'
import Cookies from 'js-cookie';

async function ShowLoginOrLogout() {
  const selectedRealm = Cookies.get('selectedRealm') || "";
  const session = await getServerSession(getAuthOptions(selectedRealm));
  if (session) {
    return <div>
      <div>Your name is {session.user?.name}</div>
      <br></br>
      <div><Logout /> </div>
    </div>
  }
  return (
    <div>
      <Login />
    </div>
  )
}

export default async function Home() {
  return (
    <div>
      <div> Welcome to Admin Portal </div>
        <br></br>
        <div><ShowLoginOrLogout /> </div>
        <br></br>
        <a href="/private">Secured Pages Here</a>
      </div>
  )
}
