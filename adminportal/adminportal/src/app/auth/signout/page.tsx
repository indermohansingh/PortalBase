import { getAuthOptions } from "@/app/api/auth/[...nextauth]/route";
import Logout from "@/components/Logout";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Cookies from 'js-cookie';

export default async function SignoutPage() {
  const selectedRealm = Cookies.get('selectedRealm') || "mainapprlm";
  const session = await getServerSession(getAuthOptions(selectedRealm));
  
  if (session) {
    return (
      <div className="flex flex-col space-y-3 justify-center items-center h-screen">
        <div className="text-xl font-bold">Signout</div>
        <div>Are you sure you want to sign out?</div>
        <div>
          <Logout />
        </div>
      </div>
    )
  }
  return redirect("/api/auth/signin")
}
