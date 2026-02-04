import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job!" },
  ];
}

export default function Home() {
    const { auth, kv, isLoading } = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loadingResumes, setLoadingResumes] = useState(false);

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate('/auth?next=/')
    }, [auth.isAuthenticated, isLoading, navigate])

    useEffect(() => {
        const loadResumes = async () => {
            setLoadingResumes(true);

            const resumes = (await kv.list('resume:*', true)) as KVItem[];
            const parsedResumes = resumes?.map((resume) => (
                JSON.parse(resume.value) as Resume
            ))

            setResumes(parsedResumes.reverse() || [])
            setLoadingResumes(false);
        }
        if (!isLoading) { loadResumes() }
    }, [isLoading, auth.isAuthenticated, kv]);

    if (isLoading) return null;

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
            <Navbar />

            <section className="main-section fade-in">

                <div className="page-heading py-12 md:py-16 animate-in slide-in-from-bottom-4 duration-700">
                    <h1>Track Your Application <br className="hidden md:block" /> & Resume Ratings</h1>
                    <h2 className="mt-4 max-w-2xl mx-auto opacity-80 text-lg md:text-2xl">
                        Review your submissions and check AI-powered feedback
                    </h2>
                </div>

                {loadingResumes ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <img src="/images/resume-scan-2.gif" className="w-[150px] md:w-[200px] opacity-90 mix-blend-multiply"  alt="Loading..."/>
                        <p className="text-gray-500 font-medium animate-pulse mt-4">Syncing your data...</p>
                    </div>
                ) : (
                    <>
                        {resumes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center mt-6 p-10 bg-white/60 backdrop-blur-md rounded-3xl border border-white shadow-lg max-w-2xl w-full text-center animate-in zoom-in-95 duration-500">
                                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                                    <img src="/icons/info.svg" className="w-8 h-8 opacity-40" alt="Info" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">No resumes analyzed yet</h3>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                    Upload your resume along with a job description to get instant, AI-driven feedback and a compatibility score.
                                </p>
                                <Link to="/upload" className="primary-button w-auto px-8 py-3 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                                    Upload Resume
                                </Link>
                            </div>
                        ) : (

                            <div className="w-full max-w-[1400px] animate-in fade-in duration-700">
                                <div className="flex items-center justify-between mb-6 px-2 md:px-4">
                                    <h3 className="text-xl font-bold text-gray-700">Recent Analyses ({resumes.length})</h3>
                                    <Link to="/upload" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1">
                                        Start New Analysis
                                    </Link>
                                </div>

                                <div className="resumes-section">
                                    {resumes.map((resume) => (
                                        <ResumeCard key={resume.id} resume={resume} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </section>
        </main>
    );
}
