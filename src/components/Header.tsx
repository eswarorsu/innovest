"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Header() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setEmail(data.session?.user?.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setEmail(s?.user?.email ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
          Innovest
        </Link>

        <nav className="flex items-center gap-6">
          <Link href="/ideas" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
            Ideas
          </Link>
          <Link href="/ideas/new" className="text-gray-700 dark:text-gray-300 hover:text-blue-500">
            Post Idea
          </Link>

          {!email ? (
            <Link
              href="/login"
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700 text-sm"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={signOut}
              className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
              title={email}
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
