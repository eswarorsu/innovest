import IdeaCard from "@/components/IdeaCard";

const mockIdeas = [
  {
    id: "1",
    title: "AI Resume Scoring Platform",
    short_pitch: "An AI tool that evaluates resumes and gives instant feedback.",
    tags: ["AI", "careers"],
    score: 82,
  },
  {
    id: "2",
    title: "Campus Food Delivery at Night",
    short_pitch: "A student-run night food delivery inside college campus.",
    tags: ["food", "startup"],
    score: 75,
  },
];

export default function IdeasPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Ideas Marketplace
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {mockIdeas.map((idea) => (
          <IdeaCard key={idea.id} idea={idea} />
        ))}
      </div>
    </main>
  );
}
