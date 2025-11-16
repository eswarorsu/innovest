import Link from "next/link";

import Header from "@/components/Header";


export default function Home() {
  return (
     <>
      <Header />
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Innovest
        </h1>

        <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Connect innovative ideas with investors, mentors, and collaborators.
          AI-powered idea scoring, matching, and discovery — all in one platform.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/ideas"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Browse Ideas
          </Link>

          <Link
            href="/ideas/new"
            className="px-6 py-3 border border-gray-400 dark:border-gray-600 rounded-lg text-gray-800 dark:text-gray-200"
          >
            Post an Idea
          </Link>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white text-center">
            How Innovest Works
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mt-10">
            <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                1. Post Your Idea
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Share your startup idea with the world in minutes.
              </p>
            </div>

            <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                2. Get AI Insights
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Let AI score your idea and give suggestions to improve it.
              </p>
            </div>

            <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200">
                3. Connect & Grow
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Find investors, partners, and collaborators who match your idea.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
      </>
  );
}


