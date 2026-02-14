import type { JSX } from "react";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { cn } from "~/lib/utils";

const Navbar = (): JSX.Element => {
    const { auth } = usePuterStore();

    const userInitial =
        auth.user?.username?.charAt(0).toUpperCase() ?? "U";

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

                {/* Brand */}
                <Link
                    to="/"
                    className="flex items-center gap-3 group transition-transform hover:scale-[1.01]"
                >
                    <img
                        src="/icons/logo.png"
                        alt="Resumedex logo"
                        className="h-18 w-auto transition-transform group-hover:scale-105"
                    />

                    <div className="flex flex-col leading-tight">
                        <span className="text-base font-semibold tracking-tight text-slate-800 transition-colors group-hover:text-indigo-600">
                            RESUMEDEX
                        </span>

                        <span className="text-[11px] text-slate-400">
                            Developed by Hoang Minh Thang
                        </span>
                    </div>
                </Link>

                {/* Right side */}
                <div className="flex items-center gap-3">

                    {/* Upload button desktop */}
                    <Link
                        to="/upload"
                        className={cn(
                            "hidden sm:flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white",
                            "bg-slate-900 hover:bg-slate-800",
                            "transition-all shadow-sm hover:shadow-md active:scale-95"
                        )}
                    >
                        Upload Resume
                        <svg
                            className="w-4 h-4 text-slate-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    </Link>

                    {/* Upload button mobile */}
                    <Link
                        to="/upload"
                        className="sm:hidden flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm transition active:scale-95"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                    </Link>

                    {/* Divider */}
                    <div className="h-6 w-px bg-slate-200" />

                    {/* Auth */}
                    {auth.isAuthenticated ? (
                        <div className="flex items-center gap-3">

                            {/* Username */}
                            <div className="hidden md:flex flex-col items-end">
                                <span className="text-xs font-semibold text-slate-700">
                                    {auth.user?.username}
                                </span>

                                <span className="text-[10px] text-slate-400">
                                    Free Plan
                                </span>
                            </div>

                            {/* Avatar */}
                            <button className="relative flex h-9 w-9 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 text-sm font-bold text-indigo-700 shadow-sm transition-all hover:scale-105 active:scale-95 hover:ring-2 hover:ring-indigo-100">
                                {userInitial}

                                {/* Online indicator */}
                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                            </button>

                        </div>
                    ) : (
                        <Link
                            to="/auth"
                            className="text-sm font-semibold text-slate-600 transition-colors hover:text-indigo-600"
                        >
                            Sign In
                        </Link>
                    )}

                </div>
            </div>
        </nav>
    );
};

export default Navbar;