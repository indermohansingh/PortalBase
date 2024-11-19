import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/app/api/auth/[...nextauth]/route';
import axios from 'axios';
import Cookies from 'js-cookie';

const apiUrl = `${process.env.NEXT_PUBLIC_BACEND_SERVER_URL}/createdb` ;

export default async function Private() {
  const selectedRealm = Cookies.get('selectedRealm') || "mainapprlm";
  const session = await getServerSession(getAuthOptions(selectedRealm));
  if (session) {
    const result = await axios.post(apiUrl,null,{
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
      }
    }
  );
    return <div className='flex flex-col space-y-3 justify-center items-center h-screen'>
        <div>
        <h1>DB Created</h1>
        <br></br>
        {JSON.stringify(result.data)}
        </div>
    </div>
  }
}
