import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import {CURRENT_AI_MODEL, usePuterStore} from "~/lib/puter";

export const meta = () => ([
    { title: 'ResumeDex | Cover Letter' },
    { name: 'description', content: 'AI Generated Cover Letter' }
]);

const CoverLetter = () => {
    const { auth, isLoading, kv, ai } = usePuterStore();
    const { id } = useParams();
    const navigate = useNavigate();

    const [resumeData, setResumeData] = useState<any>(null);
    const [content, setContent] = useState<string>("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [copyStatus, setCopyStatus] = useState("Copy Text");

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/cover-letter/${id}`);
    }, [isLoading]);

    useEffect(() => {
        const loadData = async () => {
            const data = await kv.get(`resume:${id}`);
            if (data) {
                const parsed = JSON.parse(data);
                setResumeData(parsed);
                if (parsed.coverLetter) {
                    setContent(parsed.coverLetter);
                }
            }
        };
        if (!isLoading) loadData();
    }, [id, kv, isLoading]);

    const handleGenerate = async () => {
        if (!resumeData) return;
        setIsGenerating(true);

        try {
            const prompt = `
                You are an expert career coach. Write a compelling, professional cover letter based on the attached resume.
                
                Target Company: ${resumeData.companyName}
                Target Job Title: ${resumeData.jobTitle}
                Job Description context: ${resumeData.jobDescription}
                
                The tone should be professional yet enthusiastic. Highlight matches between the resume skills and the job description.
                Do not include placeholders like "[Your Name]" - use the name from the resume if found, or generic placeholders if absolutely necessary.
                Return ONLY the body of the letter (no markdown code blocks).
            `;

            const response = await ai.feedback(
                resumeData.resumePath,
                prompt
            );

            if (!response || !response.message) {
                throw new Error("Invalid response from AI service");
            }

            const generatedText = typeof response.message.content === 'string'
                ? response.message.content
                : response.message.content[0].text;

            // Clean up
            const cleanText = generatedText.replace(/^"|"$/g, '').replace(/```/g, '');

            const updatedData = { ...resumeData, coverLetter: cleanText };
            await kv.set(`resume:${id}`, JSON.stringify(updatedData));

            setContent(cleanText);
            setResumeData(updatedData);
        } catch (e: any) {
            const errorMessage = e?.error || e?.message || "Unknown error occurred";
            console.log(`Generate cover letter failed using model: ${CURRENT_AI_MODEL}\n\nError: ${errorMessage}`);
            alert(`Generate cover letter failed using model: ${CURRENT_AI_MODEL}\n\nError: ${errorMessage}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDelete = async () => {
        const updatedData = { ...resumeData };
        delete updatedData.coverLetter;

        await kv.set(`resume:${id}`, JSON.stringify(updatedData));
        navigate(`/resume/${id}`);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopyStatus("Copied!");
        setTimeout(() => setCopyStatus("Copy Text"), 2000);
    };

    if (isLoading || !resumeData) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 gap-4">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium">Loading workspace...</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Header */}
            <nav className="h-16 shrink-0 border-b border-slate-200 bg-white/80 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between z-30 sticky top-0">
                <Link to={`/resume/${id}`} className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors group">
                    <div className="p-1.5 rounded-lg bg-slate-50 group-hover:bg-indigo-50 transition-colors">
                        <img src="/icons/back.svg" alt="Back" className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm">Back to Analysis</span>
                </Link>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex flex-col items-end mr-2">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Targeting</span>
                        <span className="text-sm font-bold text-slate-800">{resumeData.companyName}</span>
                    </div>
                    {content && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleDelete}
                                className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                title="Delete Draft"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                            <div className="h-6 w-px bg-slate-200 mx-1"></div>
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating}
                                className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors flex items-center gap-2"
                            >
                                <span>↻</span> Regenerate
                            </button>
                            <button
                                onClick={handleCopy}
                                className="px-4 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-md shadow-sm transition-all flex items-center gap-2"
                            >
                                {copyStatus === "Copied!" ? "✓" : "❐"} {copyStatus}
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Workspace */}
            <div className="flex-1 flex flex-col items-center justify-start p-4 md:p-8 gap-6 w-full max-w-5xl mx-auto">

                {/* Page Title */}
                <div className="w-full md:hidden flex flex-col gap-1">
                    <h1 className="text-2xl font-bold text-slate-800">Cover Letter</h1>
                    <p className="text-sm text-slate-500">AI-drafted for {resumeData.jobTitle}</p>
                </div>

                {/* Content Area */}
                {content ? (
                    <div className="relative w-full max-w-[850px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 group perspective-1000">  {/* Added perspective for better 3D feel */}

                        {/* Stacked Paper Effects — softer, more realistic */}
                        <div className="absolute inset-0 bg-[#f8f9fa] border border-slate-200/40 rounded-lg shadow-[0_8px_25px_rgba(0,0,0,0.08)] -z-20 rotate-[1.2deg] scale-[0.98] transition-transform duration-700 group-hover:rotate-[2deg] group-hover:scale-[0.99]"></div>
                        <div className="absolute inset-0 bg-[#fdfdfd] border border-slate-200/30 rounded-lg shadow-[0_12px_35px_rgba(0,0,0,0.06)] -z-10 rotate-[0.6deg] scale-[0.99] transition-transform duration-700 group-hover:rotate-[-0.8deg] group-hover:scale-100"></div>

                        {/* The "Paper" — main sheet with subtle inner shadow + optional faint texture */}
                        <div className="premium-letter-paper relative z-10 bg-[#fdfdfd] rounded-lg shadow-xl overflow-hidden transition-all duration-500 group-hover:shadow-2xl">

                            {isGenerating && (
                                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-lg border border-white/30">
                                    <div className="w-12 h-12 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin mb-5 shadow-[0_0_20px_rgba(139,92,246,0.3)]"></div>
                                    <p className="text-slate-700 font-medium tracking-wide animate-pulse text-lg">Crafting your professional letter...</p>
                                </div>
                            )}

                            {/* Letter Content */}
                            <div className="premium-letter-text px-10 py-12 md:px-16 md:py-16 min-h-[700px] bg-[linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[length:100%_1.8rem]">  {/* Optional: very faint ruled-line texture */}
                                {content ? (
                                    <>
                                        {/* Realistic header */}
                                        <div className="text-right mb-10 text-sm text-slate-600 font-medium">
                                            {new Date().toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })} – {Intl.DateTimeFormat().resolvedOptions().timeZone.split('/')[0] || 'International'}
                                        </div>

                                        {/* Auto-paragraph + classic formatting */}
                                        {content.split(/\n\s*\n/).map((paragraph, idx) => (
                                            <p
                                                key={idx}
                                                className={`mb-6 text-justify last:mb-0 ${idx === 0 ? 'first-letter-drop' : ''}`}
                                            >
                                                {paragraph.trim()}
                                            </p>
                                        ))}

                                        {/* Classic closing */}
                                        <div className="mt-12 pt-8 border-t border-slate-200/50">
                                            <p className="font-medium">Sincerely,</p>
                                            <p className="mt-6">{auth.user?.username.toUpperCase()}</p>  {/* Replace with parsed name later if available */}
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-slate-400 italic text-center py-20">Letter content will appear here...</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-full flex-1 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-300 p-8 md:p-12 min-h-[500px] shadow-sm animate-in zoom-in-95 duration-500">
                        {isGenerating ? (
                            <div className="flex flex-col items-center max-w-md text-center">
                                <div className="relative">
                                    <div className="absolute inset-0 blur-2xl opacity-20 rounded-full animate-pulse"></div>
                                    <img src="/images/resume-scan-2.gif" className="w-48 relative z-10 mix-blend-multiply opacity-90" alt="Generating" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mt-8 mb-2">Drafting your letter...</h3>
                                <p className="text-slate-500 text-sm md:text-base">
                                    We're analyzing your skills against the <span className="font-semibold text-indigo-600">{resumeData.jobTitle}</span> role at <span className="font-semibold text-indigo-600">{resumeData.companyName}</span>.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-center max-w-lg gap-6">
                                <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full flex items-center justify-center shadow-inner border border-indigo-100">
                                    <img src="/icons/pin.svg" className="w-16 h-16"/>
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">Ready to write?</h2>
                                    <p className="text-slate-500 leading-relaxed text-sm md:text-base">
                                        Generate a professional, tailored cover letter in seconds. We match your resume's strengths directly to the job description for <strong>{resumeData.companyName}</strong>.
                                    </p>
                                </div>
                                <button
                                    onClick={handleGenerate}
                                    className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-slate-900 px-8 font-medium text-white transition-all duration-300 hover:bg-slate-800 hover:w-full hover:shadow-xl hover:-translate-y-1"
                                >
                                    <span className="font-bold">Generate Cover Letter</span>
                                    <div className="absolute inset-0 -z-10 w-full h-full bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    );
};

export default CoverLetter;