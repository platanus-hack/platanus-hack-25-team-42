"use client";

import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <button onClick={() => signIn("my-provider")}>Sign in</button>
    </div>
  );
}
