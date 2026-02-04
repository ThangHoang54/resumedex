import React, {type FormEvent, useCallback, useState} from "react";
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions} from "../../constants";

export const meta = () => ([
    { title: 'Resumind | Upload ' },
    { name: 'description', content: 'Upload your resume to view feedback' },
])

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [progressStep, setProgressStep] = useState(0);
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, file }: { companyName: string, jobTitle: string, jobDescription: string, file: File }) => {
        setIsProcessing(true);

        try {
            // Step 1: Upload PDF
            setProgressStep(1);
            const uploadedFile = await fs.upload([file]);
            if (!uploadedFile) throw new Error('Error: Failed to upload file');

            // Step 2: Convert to Image
            setProgressStep(2);
            const imageFile = await convertPdfToImage(file);
            if (!imageFile.file) throw new Error('Error: Failed to convert PDF to image');

            // Step 3: Upload Image
            setProgressStep(3);
            const uploadedImage = await fs.upload([imageFile.file]);
            if (!uploadedImage) throw new Error('Error: Failed to upload image');

            // Step 4: AI Analysis
            setProgressStep(4);
            const uuid = generateUUID();
            const data = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName, jobTitle, jobDescription,
                feedback: '',
                createdAt: new Date().toISOString(),
            }
            await kv.set(`resume:${uuid}`, JSON.stringify(data));

            const feedback = await ai.feedback(
                uploadedFile.path,
                prepareInstructions({jobTitle, jobDescription})
            )
            if (!feedback) throw new Error('Error: Failed to analyze resume');

            const feedbackText = typeof feedback.message.content === 'string'
                ? feedback.message.content
                : feedback.message.content[0].text;

            data.feedback = JSON.parse(feedbackText);
            await kv.set(`resume:${uuid}`, JSON.stringify(data));
            setProgressStep(5);

            setTimeout(() => navigate(`/resume/${uuid}`), 500);
        } catch (e) {
            console.error(e);
            alert("An error occurred during analysis. Please try again");
            setIsProcessing(false);
            setProgressStep(0);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;
        handleAnalyze({ companyName, jobTitle, jobDescription, file});
    }

    const Step = ({ num, label }: { num: number, label: string }) => (
        <div className={`flex items-center gap-3 transition-opacity duration-300 ${progressStep >= num ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${progressStep > num ? 'bg-green-500 text-white' : progressStep === num ? 'bg-blue-600 text-white animate-pulse' : 'bg-gray-200 text-gray-500'}`}>
                {progressStep > num ? '✓' : num}
            </div>
            <span className={`font-medium ${progressStep === num ? 'text-blue-700' : 'text-gray-700'}`}>{label}</span>
        </div>
    );

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen pd-20">
            <Navbar/>

            <section className="main-section px-4">
                <div className="page-heading py-10 md:py-16">
                    <h1>Smart Feedback for your Dream Job</h1>
                    <h2 className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto">
                        Drop your resume for an ATS score and improvement tips
                    </h2>
                </div>

                <div className="w-full max-w-3xl">
                    {isProcessing ? (
                        <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl p-8 md:p-12 animate-in zoom-in-95 duration-500">
                            <div className="flex flex-col items-center mb-8">
                                <img src="/images/resume-scan-2.gif" className="w-32 md:w-48 mb-6 mix-blend-multiply" alt="Processing" />
                                <h3 className="text-2xl font-bold text-gray-800">Analyzing your profile...</h3>
                            </div>
                            <div className="space-y-4 max-w-xs mx-auto">
                                <Step num={1} label="Uploading secure files" />
                                <Step num={2} label="Processing PDF content" />
                                <Step num={3} label="Analyzing job match" />
                                <Step num={4} label="Generating feedback report" />
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="bg-white/70 backdrop-blur-lg border border-white shadow-xl rounded-3xl p-6 md:p-10 flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="form-div">
                                    <label htmlFor="company-name" className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1 ml-1">Company</label>
                                    <input required type="text" name="company-name" placeholder="e.g. Google, Amazon" id="company-name" className="bg-white/80 border border-gray-100 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"/>
                                </div>
                                <div className="form-div">
                                    <label htmlFor="job-title" className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1 ml-1">Job Title</label>
                                    <input required type="text" name="job-title" placeholder="Your job title" id="job-title" className="bg-white/80 border border-gray-100 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm"/>
                                </div>
                            </div>

                            <div className="form-div">
                                <label htmlFor="job-description" className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1 ml-1">Job Description</label>
                                <textarea required rows={6} name="job-description" placeholder="Paste the full job description here..."
                                          id="job-description" className="bg-white/80 border border-gray-100 hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm resize-none"/>
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader" className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-1 ml-1">Resume (PDF)</label>
                                <FileUploader
                                    onFileSelect={handleFileSelect}
                                    selectedFile={file}
                                />
                            </div>

                            <button
                                className="primary-button text-lg font-bold shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all mt-4"
                                type="submit"
                                disabled={!file}
                            >
                                {file ? "Start Analysis" : "Upload Resume to Start"}
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload;