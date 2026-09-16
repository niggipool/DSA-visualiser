import { Link, Navigate, Route, Routes } from "react-router-dom";
import AlgorithmsPage from "./pages/AlgorithmsPage";

function Home() {
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="mb-3 font-mono text-sm uppercase tracking-[.28em] text-neon">
          Data structures · algorithms
        </p>
        <h1 className="text-4xl font-bold text-white sm:text-6xl">
          See every step.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-zinc-400">
          Explore algorithms through deliberate, animated visual explanations.
        </p>
        <Link
          to="/algorithms"
          className="mt-8 inline-flex rounded-md border border-neon bg-crimson px-5 py-3 font-semibold text-white shadow-neon transition hover:bg-neon"
        >
          Open visualizer
        </Link>
      </div>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/algorithms" element={<AlgorithmsPage />} />
      <Route path="*" element={<Navigate to="/algorithms" replace />} />
    </Routes>
  );
}
