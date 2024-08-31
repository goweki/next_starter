import { Suspense } from "react";
import { SignInTabs } from "../_components/signInTabs";

export default function SignIn() {
  return (
    <Suspense>
      {/* wrapped in suspense due to using useSearchParams in SignIn tabs */}
      <SignInTabs />
    </Suspense>
  );
}
