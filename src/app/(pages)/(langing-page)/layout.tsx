"use client";
import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: userSession, status: authStatus } = useSession();
  const router = useRouter();

  // AUTH check
  // router memoized
  const routeToUserCB = useCallback(() => {
    router.push("/user");
  }, []);
  //if AUTHENTICATED
  useEffect(() => {
    if (authStatus === "authenticated") routeToUserCB();
  }, [routeToUserCB, authStatus]);

  // render
  return children;
}
