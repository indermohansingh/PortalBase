"use client"
import React, { useState, useEffect } from 'react';
import Login from '../components/Login'
import Logout from '../components/Logout'
import { useSession } from 'next-auth/react';
import { jwtDecode }  from "jwt-decode";

export default function ShowLoginOrLogout() {
    const [session, setSession] = useState(useSession() || {});

    let x = useSession();
    if (x?.data?.accessToken!=session?.data?.accessToken ) setSession(x);

    useEffect(() => {
    }, [session]);

    if (session?.data?.accessToken) {
      const decodedToken = jwtDecode(session?.data?.accessToken || "");
      return <div>
        <div>Your name is {session?.data?.user?.name} and your role details are {JSON.stringify(decodedToken?.cprolesbytenant)}</div>
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
