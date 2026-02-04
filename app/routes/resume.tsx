import {Link, useNavigate, useParams} from "react-router";
import {useEffect, useState} from "react";
import {usePuterStore} from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";

export const meta  = () => ([
    { title: 'ResumeDex | Review' },
    { name: 'description', content: 'Detailed overview of your resume'}
])

const Resume = () => {
    const { auth, isLoading, fs, kv } = usePuterStore();
    const { id } = useParams();
    const [imageUrl, setImageUrl] = useState('');
    const [resumeUrl, setResumeUrl] = useState('');
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    const [hasCoverLetter, setHasCoverLetter] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
    }, [isLoading]);

    useEffect(() => {
        const loadResume = async () => {
            const resume = await kv.get(`resume:${id}`);

            if(!resume) return;

            const data = JSON.parse(resume);

            if (data.coverLetter) { setHasCoverLetter(true); }

            const  resumeBlob = await fs.read(data.resumePath);
            if(!resumeBlob) return;

            const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
            const resumeUrl = URL.createObjectURL(pdfBlob);
            setResumeUrl(resumeUrl);

            const  imageBlob = await fs.read(data.imagePath);
            if(!imageBlob) return;
            const imageUrl = URL.createObjectURL(imageBlob);
            setImageUrl(imageUrl);

            setFeedback(data.feedback);
        }

        loadResume();
    }, [id, kv, fs]);

    return (
        <main className="lg:h-screen w-full flex flex-col bg-slate-50 lg:overflow-hidden overflow-y-auto">
            {/* 1. Slim Navigation Bar */}
            <nav className="h-16 shrink-0 border-b border-slate-200 bg-white px-4 lg:px-6 flex items-center justify-between z-20 shadow-sm sticky top-0 lg:static">
                <Link to="/" className="flex items-center gap-2.5 text-slate-600 hover:text-slate-900 transition-colors">
                    <div className="p-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50">
                        <img src="/icons/back.svg" alt="Back" className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm hidden sm:block">Return to Homepage</span>
                </Link>
                <div className="flex items-center gap-3">
                    <Link to={`/cover-letter/${id}`}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm border flex items-center gap-2 ${
                              hasCoverLetter
                                  ? "bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                  : "bg-indigo-600 text-white border-transparent hover:bg-indigo-700 shadow-indigo-200"
                          }`}
                    >
                        {hasCoverLetter ? (
                            <>
                                <span className="text-black text-xs font-bold">Preview Cover Letter</span>
                            </>
                        ) : (
                            <>
                                <span className="text-white text-xs font-bold">Write Cover Letter</span>
                            </>
                        )}
                    </Link>
                    {resumeUrl && (
                        <a href={resumeUrl} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-all shadow-md hover:shadow-lg">
                            Download PDF
                        </a>
                    )}
                </div>
            </nav>

            {/* 2. Main Dashboard Content (Split View) */}
            <div className="flex-1 flex flex-col lg:flex-row lg:overflow-hidden p-4 gap-4">

                {/* Resume Preview */}
                <section className="bg-[url('/images/bg-main.svg')] flex shrink-0 h-[500px] lg:h-auto lg:w-[35%] rounded-2xl border border-slate-200 overflow-hidden relative items-center justify-center p-2 lg:p-4">
                    {imageUrl ? (
                        <div className="h-full w-full shadow-inner rounded-xl overflow-hidden bg-white relative group border border-slate-200">
                            <a href={resumeUrl} target="_blank" rel="noreferrer" className="block h-full w-full overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300">
                                <img
                                    src={imageUrl}
                                    className="w-full h-auto object-contain min-h-full"
                                    alt="Resume Preview"
                                />
                            </a>
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                Click to open PDF
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-3 opacity-40">
                            <div className="w-8 h-8 border-2 border-gray-400 border-t-indigp-500 rounded-full animate-spin"></div>
                            <p className="text-xs font-medium">Rendering Preview...</p>
                        </div>
                    )}
                </section>

                {/* Feedback Dashboard */}
                <section className="flex-1 flex flex-col gap-4 h-full overflow-x-hidden">
                    {feedback ? (
                        <>
                            {/* Top Row: Summary & ATS */}
                            <div className="flex flex-col md:flex-row gap-4 lg:h-[40%] shrink-0">
                                <div className="flex-1 min-h-[250px]">
                                    <Summary feedback={feedback} />
                                </div>
                                <div className="flex-1 min-h-[250px]">
                                    <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
                                </div>
                            </div>

                            {/* Bottom Row: Detailed Breakdown */}
                            <div className="flex-1 min-h-[500px] lg:min-h-0">
                                <Details feedback={feedback} />
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-300 min-h-[400px]">
                            <div className="relative">
                                <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
                                <img src="/images/resume-scan-2.gif" className="w-32 lg:w-48 relative z-10 mix-blend-multiply opacity-80" alt="Scanning..." />
                            </div>
                            <h3 className="text-lg font-bold text-slate-700 mt-6 animate-pulse">Analyzing Resume...</h3>
                            <p className="text-slate-400 text-sm">This AI magic takes about 10 seconds.</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}
export default Resume;