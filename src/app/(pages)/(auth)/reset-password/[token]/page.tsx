"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { emailValidator, nameValidator, passwordValidator } from "@/lib/utils";
import { httpCodes } from "@/lib/refDictionary";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const default_fData = {
  oldName: "",
  name: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ResetPassword({
  params,
  searchParams,
}: {
  params: { token: string };
  searchParams: { [key: string]: string };
}) {
  const { token } = params;
  const { email } = searchParams; // /token?email=email@mail.com
  const router = useRouter();
  const [fData, setfData] = useState(default_fData);

  // onMount
  useEffect(() => {
    (async () => {
      if (!email || !token || emailValidator(email))
        router.push("/reset-password");
      try {
        //
        console.log("email: ", email);
        console.log("token: ", token);
        // API call to confirm user,token,expiry
        const fetchOptions = {
          method: "GET",
        };

        const response = await fetch(
          `/api/auth/reset-password?email=${email}&token=${token}`,
          fetchOptions
        ).then(async (res_) => {
          if (res_.ok) {
            return await res_.json();
          } else {
            console.log(`ERROR: ` + JSON.stringify(res_));
            if (res_.status && res_.status in httpCodes) {
              throw new Error(httpCodes[res_.status]);
            } else {
              throw new Error("Unknown Error, try again later");
            }
          }
        });

        //validate reseting password
        if (response?.success) {
          toast.success(response.success);
          setfData((prev) => ({ ...prev, oldName: response.name }));
        } else {
          toast.error(
            response.failed ||
              response.error ||
              "Unknown error, try again later"
          );
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          // Handle other types of errors
          toast.error("Unknown error, try again later");
        }
      }
    })();
  }, [email, token, router]);

  // handle Submit
  async function handleSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    // if name error
    if (!fData.oldName) {
      const nameError_ = nameValidator(fData.name);
      if (nameError_) {
        toast.error(nameError_);
        return;
      }
    }
    // if password error
    const passwordError_ = passwordValidator(
      fData.newPassword,
      fData.confirmPassword
    );
    if (passwordError_) {
      toast.error(passwordError_);
      return;
    }

    // API CALL
    try {
      const fetchOptions = {
        method: "PUT",
        body: JSON.stringify({
          email,
          token,
          name: fData.oldName || fData.name,
          password: fData.newPassword,
        }),
      };

      const response = await fetch(
        "/api/auth/reset-password",
        fetchOptions
      ).then(async (res_) => {
        if (res_.ok) {
          return await res_.json();
        } else {
          console.log(`ERROR: ` + JSON.stringify(res_));
          if (res_.status && res_.status in httpCodes) {
            return { error: httpCodes[res_.status] };
          } else {
            return { error: "Unknown Error, try again later" }; // unknown errors
          }
        }
      });
      //validate reseting password
      if (response?.success) {
        toast.success(response.success);
        router.push(`/sign-in`);
      } else {
        toast.error(response.failed || response.error || "Unknown error");
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        // Handle other types of errors
        toast.error("Unknown error, try again later");
      }
    }
  }
  // Render
  return (
    <Card className="mx-auto w-[400px]">
      <CardHeader>
        <CardTitle className="text-xl">
          {fData.oldName ? "Update Password" : "Create New Password"}
        </CardTitle>
        <CardDescription>
          {fData.oldName
            ? "Enter a new password"
            : "Enter your name and new password"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">
              Prefered Name <span className="text-foreground/50">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Your name"
              value={fData.oldName || fData.name}
              disabled={!!fData.oldName}
              onChange={(e) =>
                setfData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="placeholder:italic"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="new-password">
              New Password <span className="text-foreground/50">*</span>
            </Label>
            <Input
              id="new-password"
              type="password"
              placeholder="_ _ _ _"
              value={fData.newPassword}
              onChange={(e) =>
                setfData((prev) => ({ ...prev, newPassword: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">
              Re-type Password <span className="text-foreground/50">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              value={fData.confirmPassword}
              placeholder="_ _ _ _"
              onChange={(e) =>
                setfData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
            />
          </div>
          <Button type="submit" className="w-full" onClick={handleSubmit}>
            {fData.oldName ? "Update Password" : "Sign Up"}
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/sign-in" className="underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
