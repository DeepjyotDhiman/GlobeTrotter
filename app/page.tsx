import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
      <div className="z-10 max-w-5xl w-full flex flex-col items-center justify-center font-sans">
        <h1 className="text-5xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400">
          GlobeTrotter 🌍
        </h1>
        <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
          Plan, track, and share your adventures. Your ultimate travel companion with smart itineraries, budget tracking, and community explorer.
        </p>
        <div className="mt-10 flex gap-4">
          <Link href="/dashboard" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all">
            Go to Dashboard
          </Link>
          <Link href="/login" className="px-6 py-3 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-800 font-medium rounded-lg transition-all">
            Sign In
          </Link>
        </div>
      </div>
    </main>
  );
}
