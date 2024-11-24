"use client"
import React, { useState, useEffect } from 'react';
import Login from '../components/Login'
import Logout from '../components/Logout'
import { useSession } from 'next-auth/react';

export default function ShowLoginOrLogout() {
    const [session, setSession] = useState(useSession() || {});

    let x = useSession();
    if (x?.data?.accessToken!=session?.data?.accessToken ) setSession(x);

    useEffect(() => {
    }, [session]);

    if (session?.data?.accessToken) {
      return <div>
        <div>Your name is {session?.data?.user?.name}</div>
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
