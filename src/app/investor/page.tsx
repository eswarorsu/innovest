"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header";
import IdeaCard from "@/components/IdeaCard";

type Idea = {
  id: string;
  title: string;
  short_pitch: string;
  tags: string[] | null;
  score: number | null;
  created_at: string;
};

export default function InvestorDashboard() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [tagQuery, setTagQuery] = useState("");
  const [sort, setSort] = useState<"score_desc" | "newest" | "title_asc">(
    "score_desc"
  );
  const [myBookmarks, setMyBookmarks] = useState<Record<string, boolean>>({});
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // get current user
    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user?.id ?? null;
      setUserId(uid);
      if (uid) loadBookmarks(uid);
    });

    // load ideas
    supabase
      .from("ideas")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setIdeas((data as any) || []);
        setLoading(false);
      });
  }, []);

  const loadBookmarks = async (uid: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("idea_id")
      .eq("user_id", uid);
    const map: Record<string, boolean> = {};
    (data || []).forEach((r: any) => (map[r.idea_id] = true));
    setMyBookmarks(map);
  };

  const filteredAndSorted = useMemo(() => {
    let list = ideas;

    // filter by tag query (comma or space separated)
    const q = tagQuery.trim().toLowerCase();
    if (q) {
      const parts = q.split(/[,\s]+/).filter(Boolean);
      list = list.filter((idea) => {
        const tags = (idea.tags || []).map((t) => t.toLowerCase());
        return parts.every((p) => tags.some((t) => t.includes(p)));
      });
    }

    // sort
    if (sort === "score_desc") {
      list = [...list].sort(
        (a, b) => (b.score ?? -1) - (a.score ?? -1)
      );
    } else if (sort === "newest") {
      list = [...list].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sort === "title_asc") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [ideas, tagQuery, sort]);

  const toggleBookmark = async (ideaId: string) => {
    if (!userId) {
      alert("Please login to save ideas.");
      return;
    }
    const isSaved = !!myBookmarks[ideaId];
    // optimistic update
    setMyBookmarks((m) => ({ ...m, [ideaId]: !isSaved }));
    if (isSaved) {
      await supabase.from("bookmarks").delete().eq("user_id", userId).eq("idea_id", ideaId);
    } else {
      await supabase.from("bookmarks").insert({ user_id: userId, idea_id: ideaId });
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Investor Dashboard
          </h1>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <input
              placeholder="Filter by tags (e.g., ai, fintech)"
              className="p-2 rounded border bg-white dark:bg-gray-800 dark:text-gray-100"
              value={tagQuery}
              onChange={(e) => setTagQuery(e.target.value)}
            />
            <select
              className="p-2 rounded border bg-white dark:bg-gray-800 dark:text-gray-100"
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
            >
              <option value="score_desc">Top Score</option>
              <option value="newest">Newest</option>
              <option value="title_asc">Title A→Z</option>
            </select>
            <a
              href="/ideas"
              className="p-2 rounded border text-center bg-white dark:bg-gray-800 dark:text-gray-100"
            >
              Go to Ideas →
            </a>
          </div>

          {loading ? (
            <p className="mt-8 text-gray-700 dark:text-gray-300">Loading…</p>
          ) : filteredAndSorted.length === 0 ? (
            <p className="mt-8 text-gray-700 dark:text-gray-300">No ideas found.</p>
          ) : (
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              {filteredAndSorted.map((idea) => (
                <div key={idea.id} className="relative">
                  {/* Save / Unsave button */}
                  <button
                    onClick={() => toggleBookmark(idea.id)}
                    className={`absolute right-4 top-4 text-sm rounded px-3 py-1 ${
                      myBookmarks[idea.id]
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    }`}
                    title={myBookmarks[idea.id] ? "Saved" : "Save"}
                  >
                    {myBookmarks[idea.id] ? "Saved ✓" : "Save"}
                  </button>

                  <IdeaCard idea={idea} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
