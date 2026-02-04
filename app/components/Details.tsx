import { useState } from "react";
import { cn } from "~/lib/utils";

const Details = ({ feedback }: { feedback: Feedback }) => {
    const tabs = [
        { id: 'tone', label: 'Tone & Style', data: feedback.toneAndStyle },
        { id: 'content', label: 'Content', data: feedback.content },
        { id: 'structure', label: 'Structure', data: feedback.structure },
        { id: 'skills', label: 'Skills', data: feedback.skills },
    ];

    const [activeTab, setActiveTab] = useState(tabs[0]);

    return (
        <div className="h-full w-full bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            {/* Header */}
            <div className="border-b border-slate-100 p-2 bg-slate-50/50 flex justify-between items-center shrink-0">
                <span className="text-xs text-slate-400 font-medium hidden sm:block">Select a category</span>
            </div>

            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                <div className="shrink-0 w-full lg:w-1/4 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-row lg:flex-col gap-2 p-2 overflow-x-auto lg:overflow-y-auto scrollbar-hide">
                    {tabs.map((tab) => {
                        const isActive = activeTab.id === tab.id;
                        const score = tab.data.score;
                        const scoreColor = score > 79 ? 'text-emerald-600' : score > 59 ? 'text-amber-600' : 'text-rose-600';

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "flex-shrink-0 lg:shrink text-left p-2 lg:p-3 rounded-lg lg:rounded-xl transition-all duration-200 flex flex-col gap-1 group relative overflow-hidden min-w-[100px] lg:min-w-0 border lg:border-none",
                                    isActive ? "bg-white shadow-sm ring-1 ring-slate-200 border-slate-200" : "hover:bg-slate-100 border-transparent text-slate-500"
                                )}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 font-semibold text-xs lg:text-sm text-slate-700">
                                        {tab.label}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-0.5 lg:mt-1">
                                    <span className={cn("text-[10px] lg:text-xs font-bold", isActive ? scoreColor : "text-slate-400")}>
                                        {score}/100
                                    </span>
                                    {isActive && <div className="hidden lg:block w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>}
                                </div>
                                {isActive && <div className="hidden lg:block absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-r-full"></div>}
                            </button>
                        );
                    })}
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white p-4 overflow-y-auto relative scrollbar-thin scrollbar-thumb-slate-200">
                    <div className="max-w-3xl mx-auto space-y-4 pb-10 animate-in fade-in slide-in-from-right-4 duration-300" key={activeTab.id}>
                        <div className="flex items-center justify-between mb-4 sticky top-0 bg-white/95 backdrop-blur-sm p-2 z-10 border-b border-slate-50">
                            <h3 className="text-lg font-bold text-slate-800">{activeTab.label}</h3>
                            <div className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold border",
                                activeTab.data.score > 79 ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                                    activeTab.data.score > 59 ? "bg-amber-50 border-amber-200 text-amber-700" :
                                        "bg-rose-50 border-rose-200 text-rose-700"
                            )}>
                                Score: {activeTab.data.score}
                            </div>
                        </div>

                        {activeTab.data.tips.map((tip, idx) => (
                            <div key={idx} className={cn("p-3 lg:p-4 rounded-xl border flex gap-3 transition-all hover:scale-[1.03]",
                                tip.type === 'good' ? "border-emerald-100 bg-emerald-50/30" : "border-amber-100 bg-amber-50/30"
                            )}>
                                <div className={cn("shrink-0 w-5 h-5 lg:w-6 lg:h-6 rounded-full flex items-center justify-center mt-0.5",
                                    tip.type === 'good' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                                )}>
                                    <img src={tip.type === 'good' ? "/icons/check.svg" : "/icons/warning.svg"} className="h-4 w-4" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 mb-1">{tip.tip}</p>
                                    <p className="text-xs lg:text-sm text-slate-600 leading-relaxed">{tip.explanation}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Details;