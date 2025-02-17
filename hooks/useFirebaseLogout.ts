import React from "react";
import { auth } from "lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { useProfile } from "providers/profile";
import { useUI } from "providers/ui";

export default function useFirebaseLogout() {
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { closeSidebar } = useUI();
  const { reset: resetProfile } = useProfile();

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      resetProfile();
      localStorage.clear();
      closeSidebar();
      router.push("/");
    } catch (error) {
      alert("Error logging out");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading };
}
