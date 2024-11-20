"use client"
import { signIn } from "next-auth/react";
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Login() {
  const [email, setEmail] = useState<string>('');

  const handleSave = () => {
    //get realm based on email
    let isWY = false;
    isWY = email.endsWith("@wy.com");
    let realm = ""
    if (isWY) realm = "WYSSO"
    Cookies.set('selectedRealm', realm, { expires: 7 }); 
    signIn("keycloak", { realm: realm })
  }

  return (
    <div>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter Email to Login"
        style={{ padding: '8px', width: '70%' }}
      />
      <button
        onClick={handleSave}
        className={`bg-sky-500 hover:bg-sky-700 px-5 py-2 text-sm leading-5 rounded-full font-semibold text-white
          disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400`}
        disabled={!email.trim()} 
      >
        Signin with keycloak
      </button>
    </div>
  )
}
