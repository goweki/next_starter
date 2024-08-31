"use client";
import Link from "next/link";
import { House } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { emailValidator } from "@/lib/utils";
import toast from "react-hot-toast";
import { httpCodes } from "@/lib/refDictionary";
import { useRouter } from "next/navigation";

export function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");

  // func Sign Up
  async function handleRestPass(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();

    // validate inputs: email & password
    const emailError_ = emailValidator(email);
    if (emailError_) {
      toast.error("invalid email address");
      return;
    }

    // API call
    console.log(
      "CHECKPOINT: call to reset password API...\n > ",
      email,
      "\n.................."
    );
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify({ email, action: "reset" }),
    };

    const response = await fetch("/api/auth/reset-password", fetchOptions).then(
      async (res_) => {
        if (res_.ok) {
          return await res_.json();
        } else {
          // toast ERROR
          if (res_.status && res_.status in httpCodes) {
            return { error: httpCodes[res_.status] };
          } else {
            return { error: "Unknown Error, try again later" }; // unknown errors
          }
        }
      }
    );
    //validate sending reset link
    if (response?.success) {
      toast.success(response.success);
    } else {
      toast.error(
        response.failed || response.error || "Unknown error, try again later"
      );
    }
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot Password?</CardTitle>
        <CardDescription>
          It happens. Provide your email to we&apos;ll send you a link to reset
          it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2 mb-8">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="placeholder:italic"
              required
            />
          </div>
          <Button type="submit" className="w-full" onClick={handleRestPass}>
            Send Reset-Link
          </Button>
        </div>
        <div className="flex flex-row justify-between items-center mt-4">
          <Link href="/" className="hover:text-primary">
            <House size={20} />
          </Link>
          <div className="text-center text-sm">
            <span className="text-xs italic">Don&apos;t have an account? </span>
            <Link
              href="/sign-in?tab=sign-up"
              className="underline hover:text-primary"
            >
              Sign up
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
