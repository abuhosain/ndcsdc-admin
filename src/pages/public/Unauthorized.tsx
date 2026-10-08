import { useNavigate } from "react-router";

export default function Unauthorized() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(225,29,72,0.15),rgba(255,255,255,0))] p-4 font-sans text-slate-100">
            {/* Container Card */}
            <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/80 p-8 sm:p-10 text-center shadow-2xl backdrop-blur-xl transition-all duration-300">

                {/* Error Code Badge */}
                <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3.5 py-1 text-xs font-semibold text-rose-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                    Error 403
                </div>

                {/* Lock / Warning Icon */}
                <div className="mx-auto my-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-rose-600 to-amber-500 shadow-xl shadow-rose-500/20">
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
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>

                {/* Header & Body */}
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Access Denied
                </h1>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed sm:text-base">
                    You don't have permission to access this page. Please contact your administrator if you believe this is a mistake.
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
                        className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition-all duration-200 hover:from-rose-600 hover:to-amber-700 hover:shadow-rose-500/30 active:scale-[0.98]"
                    >
                        Return Home
                    </button>
                </div>
            </div>
        </div>
    );
}
