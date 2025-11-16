"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import IdeaCard from "@/components/IdeaCard";
import Header from "@/components/Header";

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIdeas = async () => {
      const { data, error } = await supabase
        .from("ideas")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) {
        setIdeas(data || []);
      }
      setLoading(false);
    };

    fetchIdeas();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-gray-700 dark:text-gray-300">
        Loading ideas...
      </main>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Ideas Marketplace
        </h1>

        {ideas.length === 0 && (
          <p className="text-gray-700 dark:text-gray-300">No ideas yet.</p>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      </main>
    </>
  );
}
