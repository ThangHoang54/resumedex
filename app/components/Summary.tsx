import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({ title, score }: { title: string; score: number }) => {
    const isGood = score > 79;
    const isMid = score > 59;
    const color = isGood ? 'bg-emerald-500' : isMid ? 'bg-amber-500' : 'bg-rose-500';

    return (
        <div className="flex items-center gap-2 lg:gap-3 w-full">
            <span className="text-[10px] lg:text-xs font-semibold w-12 lg:w-16 text-slate-500">{title}</span>
            <div className="flex-1 h-1.5 lg:h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color} transition-all duration-1000`} style={{ width: `${score}%` }}></div>
            </div>
            <span className="text-[10px] lg:text-xs font-bold w-5 lg:w-6 text-right text-slate-700">{score}</span>
        </div>
    )
}

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="h-full w-full bg-white rounded-2xl border border-slate-200 p-4 lg:p-5 flex flex-col relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-2 z-10 shrink-0">
                <h2 className="text-base lg:text-lg font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    Overall Quality
                </h2>
                <span className="px-2 py-1 rounded-md bg-slate-100 text-[10px] lg:text-xs font-bold text-slate-600">AI Score</span>
            </div>

            <div className="flex-1 flex flex-col sm:flex-row items-center justify-around gap-4 lg:gap-6 z-10 overflow-y-auto lg:overflow-visible">
                {/* Gauge Area */}
                <div className="shrink-0 relative py-2">
                    <ScoreGauge score={feedback.overallScore} />
                    <div className="absolute -bottom-1 lg:-bottom-4 left-0 right-0 text-center text-[10px] lg:text-xs text-slate-400">
                        Top {feedback.overallScore > 80 ? '10%' : '30%'} of applicants
                    </div>
                </div>

                {/* Vertical Divider (Desktop) / Horizontal (Mobile) */}
                <div className="w-full h-px sm:w-px sm:h-24 bg-slate-100"></div>

                {/* Quick Stats */}
                <div className="flex-1 w-full sm:max-w-[200px] flex flex-col justify-center gap-2 lg:gap-3">
                    <Category title="Tone" score={feedback.toneAndStyle.score} />
                    <Category title="Content" score={feedback.content.score} />
                    <Category title="Structure" score={feedback.structure.score} />
                    <Category title="Skills" score={feedback.skills.score} />
                </div>
            </div>

            {/* Decor BG */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        </div>
    )
}
export default Summary;