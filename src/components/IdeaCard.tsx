import Link from "next/link";

export default function IdeaCard({ idea }: { idea: any }) {
  return (
    <div className="border rounded-lg p-5 bg-white dark:bg-gray-800 shadow">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        {idea.title}
      </h2>

      <p className="mt-2 text-gray-600 dark:text-gray-300">
        {idea.short_pitch}
      </p>

      <div className="mt-3 flex gap-2 flex-wrap">
        {idea.tags.map((tag: string) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Score: {idea.score}
        </span>

        <Link
          href={`/ideas/${idea.id}`}
          className="text-blue-600 dark:text-blue-400 text-sm"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
