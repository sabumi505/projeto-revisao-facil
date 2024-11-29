"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

export function LogoutComponent() {

  useEffect(() => {
    const handleSignOut = async () => {
      await signOut({ callbackUrl: '/auth' });
    };

    handleSignOut();
  }, []);

  return (<></>);
}