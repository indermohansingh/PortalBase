import { getAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import Login from "@/components/Login";
import { getServerSession } from "next-auth";
import { redirect, useParams } from "next/navigation";
import Cookies from 'js-cookie';

const signinErrors: Record<string | "default", string> = {
  default: "Unable to sign in.",
  signin: "Try signing in with a different account.",
  oauthsignin: "Try signing in with a different account.",
  oauthcallbackerror: "Try signing in with a different account.",
  oauthcreateaccount: "Try signing in with a different account.",
  emailcreateaccount: "Try signing in with a different account.",
  callback: "Try signing in with a different account.",
  oauthaccountnotlinked:
    "To confirm your identity, sign in with the same account you used originally.",
  sessionrequired: "Please sign in to access this page.",
}

interface SignInPageProp {
  params: object
  searchParams: {
    callbackUrl: string
    error: string
  }
}

export default async function Signin({ searchParams: { callbackUrl, error } }: SignInPageProp) {
  const selectedRealm = Cookies.get('selectedRealm') || "mainapprlm";
  const session = await getServerSession(getAuthOptions(selectedRealm));
  if (session) {
    redirect(callbackUrl || "/")
  }
  return (
    <div className='flex flex-col space-y-3 justify-center items-center h-screen'>
      {error && <div>
        {signinErrors[error.toLowerCase()]}
      </div>}
      <Login />
    </div>
  )
}
