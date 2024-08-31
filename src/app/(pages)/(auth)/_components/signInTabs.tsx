"use client";
import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { House } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import { emailValidator, passwordValidator } from "@/lib/utils";
import { httpCodes } from "@/lib/refDictionary";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const pin_css_classes = "w-10 text-center";

const qParamsErrors: { [key: string]: string } = {
  OAuthSignin: "Error in constructing an authorization URL",
  OAuthCallback: "Error in handling the response from OAuth provider",
  OAuthCreateAccount: "Could not create user",
  EmailCreateAccount: "Could not create user",
  Callback: "Error in the OAuth callback handler route",
  OAuthAccountNotLinked:
    "Email is already linked, but not with this OAuth account",
  EmailSignin: "Sending the e-mail with verification token failed",
  CredentialsSignin: "Invalid credentials",
  SessionRequired: "The content of this page requires you to be signed in",
  Default: "An error occured",
};

export function SignInTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParams = searchParams.get("tab");
  const [fData, setFData] = useState<{
    email: string;
    password: string;
    pin: { [key: number]: string };
  }>({
    email: "",
    password: "",
    pin: { 1: "", 2: "", 3: "", 4: "" },
  });
  const [activeTab, setActiveTab] = useState<"sign-up" | "sign-in">(
    tabParams === "sign-up" ? "sign-up" : "sign-in"
  );
  const callbackUrl = searchParams.get("callbackUrl");

  // onMount
  useEffect(() => {
    if (searchParams.has("error")) {
      const error_ = searchParams.get("error") as string;
      toast.error(qParamsErrors[error_]);
    }
  }, [searchParams]);

  // Move cursor to next input - PIN
  function focusNextInput(
    el: HTMLInputElement,
    prevId: string,
    nextId: string
  ) {
    if (el.value.length === 0) {
      if (prevId) {
        const prevElement = document.getElementById(prevId) as HTMLInputElement;
        if (prevElement) {
          prevElement.focus();
        }
      }
    } else {
      if (nextId) {
        const nextElement = document.getElementById(nextId) as HTMLInputElement;
        if (nextElement) {
          nextElement.focus();
        }
      }
    }
  }
  //change in pin digits
  const handlePinChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    pinIndex: number
  ) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) {
      setFData((prev) => ({
        ...prev,
        pin: { ...prev.pin, [pinIndex]: value },
      }));
      const prevId = e.target.getAttribute("data-focus-input-prev") || "";
      const nextId = e.target.getAttribute("data-focus-input-next") || "";
      focusNextInput(e.target, prevId, nextId);
    } else {
      toast.error("only NUMBERS allowed in OTP");
    }
  };

  // func Sign In
  async function handleSignIn(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();

    //
    const email = fData.email;
    const password = fData.password;

    // validate inputs: email & password
    const emailError_ = emailValidator(email);
    const passwordError_ = passwordValidator(password);
    if (emailError_ || passwordError_) {
      toast.error(emailError_ || passwordError_);
      return;
    }
    console.log(
      `CHECKPOINT: validating user\n > ${email} , ${password}\n..................`
    );
    // signIn API call
    const res = await signIn("credentials", {
      email: email,
      password: password,
      redirect: false,
      callbackUrl: callbackUrl || "/dashboard",
    });
    // signIn Response
    if (res?.ok && !res.error) {
      router.push("/user");
    } else {
      console.log(
        `........................\n > FAILED: user not validated\n > ${JSON.stringify(
          res
        )}\n`
      );
      const errKey = res?.error;
      const error = errKey ? qParamsErrors[errKey] : "Unknown error";
      toast.error(error);
    }
  }

  // func Sign Up
  async function handleSignUp(e: React.MouseEvent<HTMLElement>) {
    e.preventDefault();
    // if (!fData.email) {
    //   toast.error("confirm email entered");
    // }
    const email = fData.email;
    // validate inputs: email & password
    const emailError_ = emailValidator(email);
    if (emailError_) {
      toast.error("invalid email address");
      return;
    }

    // API call
    console.log(
      "CHECKPOINT: call to SignUp API...\n > ",
      email,
      "\n.................."
    );
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify({ email, action: "signUp" }),
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
      router.push(`/`);
    } else {
      toast.error(
        response.failed || response.error || "Unknown error, try again later"
      );
    }
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={(val) => {
        setFData({
          email: "",
          password: "",
          pin: { 1: "", 2: "", 3: "", 4: "" },
        });
        setActiveTab(val as "sign-up" | "sign-in");
      }}
      className="w-[400px] m-auto"
    >
      <TabsList className="grid w-full grid-cols-2 bg-muted">
        <TabsTrigger
          value="sign-in"
          className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-50"
        >
          Sign In
        </TabsTrigger>
        <TabsTrigger
          value="sign-up"
          className="data-[state=active]:bg-slate-800 data-[state=active]:text-slate-50"
        >
          Sign Up
        </TabsTrigger>
      </TabsList>

      <TabsContent
        value="sign-in"
        className={!(activeTab === "sign-in") ? "hidden" : ""}
      >
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Use your credentials to sign in if you already have an active
              account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="email">
                Email <span className="text-foreground/50">*</span>
              </Label>
              <Input
                id="email"
                placeholder="email@example.com"
                value={fData.email}
                onChange={(e) => {
                  const val = e.target.value;
                  setFData((prev) => ({ ...prev, email: val }));
                }}
                className="placeholder:italic"
              />
            </div>
            <div className="space-y-1">
              {/* <Label htmlFor="password">
                Password <span className="text-foreground/50">*</span>
              </Label> */}
              <div className="flex items-center">
                <Label htmlFor="password">
                  Password <span className="text-foreground/50">*</span>
                </Label>
                <Link
                  href="/reset-password"
                  className="ml-auto inline-block text-sm italic hover:text-primary"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="***"
                value={fData.password}
                onChange={(e) => {
                  const val = e.target.value;
                  setFData((prev) => ({ ...prev, password: val }));
                }}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button
              disabled={!fData.email || !fData.password}
              onClick={handleSignIn}
            >
              Sign In
            </Button>

            <Link href="/" className="hover:text-primary">
              <House size={20} />
            </Link>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent
        value="sign-up"
        className={!(activeTab === "sign-up") ? "hidden" : ""}
      >
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>
              Enter your email adress and we will send you a link to get you
              started!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="tel">
                Email Address <span className="text-foreground/50">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={fData.email}
                placeholder="email@example.com"
                onChange={(e) =>
                  setFData((prev) => ({
                    ...prev,
                    email: e.target.value.toLowerCase(),
                  }))
                }
                className="placeholder:italic"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="pin">
                Referal code{" "}
                <span className="text-foreground/50">(optional)</span>
              </Label>
              <div id="pin" className="flex flex-row space-x-4">
                <Input
                  type="text"
                  value={fData.pin[1]}
                  maxLength={1}
                  data-focus-input-init
                  data-focus-input-next="pin-2"
                  id="pin-1"
                  className={pin_css_classes}
                  onChange={(e) => handlePinChange(e, 1)}
                />
                <Input
                  type="text"
                  value={fData.pin[2]}
                  maxLength={1}
                  data-focus-input-init
                  data-focus-input-prev="pin-1"
                  data-focus-input-next="pin-3"
                  id="pin-2"
                  className={pin_css_classes}
                  onChange={(e) => handlePinChange(e, 2)}
                />
                <Input
                  type="text"
                  value={fData.pin[3]}
                  maxLength={1}
                  data-focus-input-init
                  data-focus-input-prev="pin-2"
                  data-focus-input-next="pin-4"
                  id="pin-3"
                  className={pin_css_classes}
                  onChange={(e) => handlePinChange(e, 3)}
                />
                <Input
                  type="text"
                  value={fData.pin[4]}
                  maxLength={1}
                  data-focus-input-init
                  data-focus-input-prev="pin-3"
                  id="pin-4"
                  className={pin_css_classes}
                  onChange={(e) => handlePinChange(e, 4)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button
              disabled={!fData.email || fData.email.length < 4}
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
            <Link href="/" className="hover:text-primary">
              <House size={20} />
            </Link>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
