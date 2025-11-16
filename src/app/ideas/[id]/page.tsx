"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";

export default function IdeaDetailPage() {
  const { id } = useParams();
  const [idea, setIdea] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchIdea = async () => {
      const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) {
        setIdea(data);
      }
      setLoading(false);
    };

    fetchIdea();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Loading...
      </main>
    );
  }

  if (!idea) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-300">
        Idea not found.
      </main>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {idea.title}
        </h1>

        <p className="mt-4 text-gray-700 dark:text-gray-300">
          {idea.short_pitch}
        </p>

        <div className="mt-6">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200">
            Tags
          </h2>

          <div className="mt-4 flex gap-2 flex-wrap">
            {(idea.tags || []).map((t: string) => (
              <span
                key={t}
                className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200">
            AI Score:
          </h2>
          <span className="text-blue-600 dark:text-blue-400 text-xl font-bold">
            {idea.score || "—"}
          </span>
        </div>
      </main>
    </>
  );
}

