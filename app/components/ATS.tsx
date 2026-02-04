import React from "react";

interface Suggestion {
    type: "good" | "improve";
    tip: string;
}

interface ATSProps {
    score: number;
    suggestions: Suggestion[];
}

const Ats: React.FC<ATSProps> = ({ score, suggestions }) => {
    const isSafe = score > 79;
    const isRisk = score < 59;

    // Gradient logic
    const gradient = isSafe
        ? "from-emerald-400 to-teal-500"
        : isRisk ? "from-rose-400 to-red-500" : "from-amber-400 to-orange-500";

    const statusText = isSafe ? "ATS Optimized" : isRisk ? "High Risk" : "Needs Work";
    const bgStyle = isSafe ? "bg-emerald-50" : isRisk ? "bg-rose-50" : "bg-amber-50";
    const borderStyle = isSafe ? "border-emerald-100" : isRisk ? "border-rose-100" : "border-amber-100";

    const topSuggestions = suggestions.slice(0, 4);

    return (
        <div className={`h-full w-full rounded-2xl border ${borderStyle} ${bgStyle} p-5 flex flex-col relative overflow-hidden shadow-sm hover:shadow-md transition-shadow`}>
            {/* Header Section */}
            <div className="flex items-center justify-between mb-4 z-10 shrink-0">
                <div>
                    <h2 className="text-base lg:text-lg font-bold text-slate-800 flex items-center gap-2">
                        <span className="text-xl"></span> ATS Scoring
                    </h2>
                    <div className={`px-3 py-1 rounded-full text-[10px] lg:text-xs font-bold text-white shadow-sm bg-gradient-to-r ${gradient}`}>
                        {statusText}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                        This score represents how well your resume is likely to perform in Applicant Tracking Systems used by employers
                    </p>
                </div>
            </div>

                {/* Content Row */}
                <div className="flex-1 flex flex-col md:flex-row gap-4 lg:gap-6 items-center z-10 overflow-hidden min-h-0">

                    {/* Big Score Number */}
                    <div className="flex flex-col items-center justify-center min-w-[80px] lg:min-w-[100px] shrink-0">
                    <span className={`text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br ${gradient}`}>
                        {score}
                    </span>
                        <span className="text-[10px] lg:text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">/ 100 Points</span>
                    </div>

                    {/* Suggestions List*/}
                    <div className="flex-1 w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300/50 scrollbar-track-transparent pr-2">
                        <div className="flex flex-col gap-2 pb-2">
                            {topSuggestions.map((s, i) => (
                                <div key={i} className="flex items-start gap-2 text-sm bg-white/60 p-2 rounded-lg border border-white/50 shadow-sm transition-transform hover:scale-[1.01]">
                                    <img src={s.tip === "good" ? "/icons/check.svg" : "/icons/warning.svg"} className="mt-0.5" />
                                    <span className="text-slate-700 leading-tight line-clamp-2">{s.tip}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            {/* Decorative background blob */}
            <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10 blur-3xl ${bgStyle}`}></div>
            <p className="text-gray-500 italic text-sm mt-2 ">
                Keep refining your resume to improve your chances of getting past ATS filters and into the hands of recruiters
            </p>
        </div>
    )
}
export default Ats;