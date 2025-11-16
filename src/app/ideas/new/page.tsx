"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";

export default function NewIdeaPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    short_pitch: "",
    tags: "",
  });

  // STEP 9 – Require login
  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;

      if (!data.session) {
        router.replace("/login");
      } else {
        setReady(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, [router]);

  // Submit handler – STEP 10 + STEP 11 (AI Score)
  const submitIdea = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Get logged-in user ID
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      setLoading(false);
      return router.replace("/login");
    }

    const userId = session.user.id;

    // STEP 11 – Get AI Score
    let score: number | undefined = undefined;
    try {
      const resp = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          short_pitch: form.short_pitch,
        }),
      });

      const json = await resp.json();
      if (typeof json.score === "number") score = json.score;
    } catch (err) {
      console.warn("AI scoring failed:", err);
    }

    const tagsArray =
      form.tags.trim() !== "" ? form.tags.split(",").map((t) => t.trim()) : [];

    const { error } = await supabase.from("ideas").insert({
      title: form.title,
      short_pitch: form.short_pitch,
      tags: tagsArray,
      score,
      user_id: userId,
    });

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Error submitting idea");
      return;
    }

    router.push("/ideas");
  };

  if (!ready) return null;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Post a New Idea
        </h1>

        <form
          onSubmit={submitIdea}
          className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow max-w-xl"
        >
          <label className="block mt-4">
            <span className="text-gray-700 dark:text-gray-300">Title</span>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="mt-1 w-full p-2 border rounded bg-transparent"
            />
          </label>

          <label className="block mt-4">
            <span className="text-gray-700 dark:text-gray-300">
              Short Pitch
            </span>
            <textarea
              value={form.short_pitch}
              onChange={(e) =>
                setForm({ ...form, short_pitch: e.target.value })
              }
              required
              rows={3}
              className="mt-1 w-full p-2 border rounded bg-transparent"
            />
          </label>

          <label className="block mt-4">
            <span className="text-gray-700 dark:text-gray-300">
              Tags (comma separated)
            </span>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="mt-1 w-full p-2 border rounded bg-transparent"
            />
          </label>

          <button
            type="submit"
            className="mt-6 px-5 py-3 bg-blue-600 text-white rounded-lg"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Idea"}
          </button>
        </form>
      </main>
    </>
  );
}
