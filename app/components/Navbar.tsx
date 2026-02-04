import type { JSX } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useState } from "react";
import { cn } from "~/lib/utils";

const Navbar: () => JSX.Element = () => {
    const { auth } = usePuterStore();

    // Get user initial or fallback
    const userInitial = auth.user?.username ? auth.user.username.charAt(0).toUpperCase() : "U";

    return (
        <nav className="rounded-full p-2 md:p-3 w-[95%] md:w-full px-6 md:px-10 max-w-[1200px] mx-auto sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md transition-all">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* 1. Brand / Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md transition-transform group-hover:scale-105">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">
                        RESUMIND
                    </span>
                </Link>

                {/* 2. Right Side Actions */}
                <div className="flex items-center gap-4">
                    <Link to="/upload" className={cn(
                            "hidden sm:flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold text-white transition-all shadow-sm hover:shadow-md",
                            "bg-slate-900 hover:bg-slate-800"
                        )}
                    >
                        <span>Upload Resume</span>
                        <svg className="w-4 h-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </Link>

                    <Link to="/upload" className="sm:hidden flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white shadow-sm">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </Link>

                    {/* Divider */}
                    <div className="h-6 w-px bg-slate-200"></div>

                    {/* User Profile / Auth State */}
                    {auth.isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col items-end md:flex">
                                <span className="text-xs font-bold text-slate-700">{auth.user?.username}</span>
                                <span className="text-[10px] text-slate-400">Free Plan</span>
                            </div>
                            <button className="relative flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold shadow-sm transition-transform hover:scale-105 active:scale-95 ring-2 ring-transparent hover:ring-indigo-100">
                                {userInitial}
                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                            </button>
                        </div>
                    ) : (
                        <Link to="/auth" className="text-sm font-bold text-slate-600 hover:text-indigo-600">
                            Sign In
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;