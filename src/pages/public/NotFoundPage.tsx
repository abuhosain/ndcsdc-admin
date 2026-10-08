import { useNavigate } from "react-router";

export default function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))] p-4 font-sans text-slate-100">
            {/* Container Card */}
            <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/80 p-8 sm:p-10 text-center shadow-2xl backdrop-blur-xl transition-all duration-300">

                {/* Error Code Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                    Error 404
                </div>

                {/* Visual 404 Graphic / Compass Icon */}
                <div className="mx-auto my-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 to-cyan-500 shadow-xl shadow-indigo-500/20">
                    <svg
                        className="h-10 w-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.8}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>

                {/* Big 404 Heading */}
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                    Page Not Found
                </h1>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed sm:text-base">
                    Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
                </p>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full sm:w-auto rounded-xl border border-slate-700 bg-slate-800/80 px-5 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-700 hover:text-white active:scale-[0.98]"
                    >
                        Go Back
                    </button>
                    <button
                        onClick={() => navigate("/")}
                        className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-600 hover:to-cyan-600 hover:shadow-indigo-500/35 active:scale-[0.98]"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        </div>
    );
}