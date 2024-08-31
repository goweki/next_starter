"use client";
import React, { useEffect, useState, createContext } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster as ReactHotToaster } from "react-hot-toast";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import LoaderHourglass from "./loader";
import { TooltipProvider } from "../ui/tooltip";
import { httpCodes } from "@/lib/refDictionary";

import Link from "next/link";

export const DataContext = createContext<{}>({});

const _def_UIstate: {
  splash: boolean;
  splashLag: boolean;
  data: boolean;
  error: string;
} = {
  splash: true,
  splashLag: true,
  data: true,
  error: "",
};

export function RootProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [data, setData] = useState<{}>({});
  const [UIstate, setUIstate] = useState<{
    splash: boolean;
    splashLag: boolean;
    data: boolean;
    error: string;
  }>({ splash: true, splashLag: true, data: true, error: "" });

  // onMount
  useEffect(() => {
    setTimeout(() => {
      setUIstate((prev) => ({ ...prev, splash: false }));
    }, 4000);
  }, []);

  // fetch data
  useEffect(() => {
    try {
      (async () => {
        const fetchOptions = {
          method: "GET",
        };
        const res_UIdata = await fetch("/api/data", fetchOptions).then(
          async (res_) => {
            if (res_.ok) {
              return await res_.json();
            } else {
              console.error(`ERROR: ` + JSON.stringify(res_));
              return { error: httpCodes[res_.status] };
            }
          }
        );
        if (res_UIdata?.success) {
          setData(res_UIdata.success);
        } else {
          // update UIstate.
          setUIstate((prev) => ({
            ...prev,
            error: res_UIdata.error || "unknown error",
          }));
        }
        setUIstate((prev) => ({ ...prev, data: false }));
      })();
    } catch (error) {}

    return () => {
      // Cleanup logic here
    };
  }, []);

  // render
  return (
    <React.StrictMode>
      <ThemeProvider defaultTheme="system" attribute="class">
        <SessionProvider>
          <TooltipProvider>
            {UIstate.splashLag ? (
              <LoaderHourglass
                isLoading={UIstate.splash || UIstate.data}
                onExited={() =>
                  setUIstate((prev) => ({ ...prev, splashLag: false }))
                }
              />
            ) : UIstate.error ? (
              <div className="text-center p-4 m-auto">
                ERROR encountered.{" "}
                <Link href="/" className="font-bold">
                  {" "}
                  Click here{" "}
                </Link>{" "}
                to go back to home, or try again later.{" "}
              </div>
            ) : (
              <DataContext.Provider value={data}>
                {children}
              </DataContext.Provider>
            )}
          </TooltipProvider>
          <ReactHotToaster />
          <Toaster />
        </SessionProvider>
      </ThemeProvider>
    </React.StrictMode>
  );
}
