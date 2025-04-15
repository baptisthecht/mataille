// src/app/(auth)/login/page.tsx
import { LoginForm } from "@/components/auth/login-form";
import { MeasuringTapeIcon } from "@/components/shared/icons";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="container relative flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Link href="/" className="flex items-center gap-2">
            <MeasuringTapeIcon className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Sayz</span>
          </Link>
          
          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}