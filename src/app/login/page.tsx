"use client";

import { supabase } from "@/lib/supabaseClient";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Header from "@/components/Header";

export default function LoginPage() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow max-w-md w-full">
          <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Sign In to Innovest
          </h1>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={["google"]}
            theme="dark"
          />
        </div>
      </main>
    </>
  );
}
