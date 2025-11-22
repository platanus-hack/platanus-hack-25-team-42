"use client";

import { signIn, useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <button
        onClick={() => signIn("my-provider")}
        className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition duration-200 mb-4"
      >
        Sign in
      </button>
      {session ? (
        <>
          <div className="mt-4 text-gray-900 dark:text-white">
            Welcome {JSON.stringify(session)}
          </div>
          <button
            onClick={() => signOut()}
            className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold shadow transition duration-200 mt-4"
          >
            Sign out
          </button>
        </>
      ) : null}
    </div>
  );
}
