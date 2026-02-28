<p align="center">
    <img src="./public/icons/logo.png" width="256" alt="logo">
</p>
<h1 align="center">ResumeDex - AI Resume Analyzer</h1>

A serverless, AI-powered Applicant Tracking System (ATS) and resume analyzer. **ResumeDex** helps jobseekers optimize their resumes by analyzing them against specific job descriptions using advanced AI models (Claude, GPT, etc.) entirely for free via Puter.js.

![Resumedex Screenshot](/public/images/sample.png)

## 🚀 Features

-   **Smart Resume Analysis:** Upload your resume (PDF) and a job description to get instant, AI-driven feedback.
-   **ATS Scoring:** Get a real-time compatibility score (0-100) to see how well you match the job.
-   **AI Cover Letter Assistant:** Instantly generate professional, tailored cover letters that highlight your strengths relative to the specific job description. Supports regeneration and easy copying.
-   **Detailed Feedback:** Receive actionable insights across four key categories:
    -   **Tone & Style:** Ensure your resume sounds professional and passionate.
    -   **Content:** Check for quantifiable achievements and clarity.
    -   **Structure:** Verify standard sections and formatting.
    -   **Skills:** Identify missing keywords and skills required by the job post.
-   **Zero-Backend Architecture:** Built completely serverless using **Puter.js** for Authentication, File Storage, Key-Value Database, and AI execution.
-   **Privacy Focused:** Your files are stored securely on your own personal cloud via Puter.

## 🛠️ Tech Stack

-   **Framework:** React 19 (via React Router v7)
-   **Language:** TypeScript
-   **Styling:** Tailwind CSS v4 + Tailwind Animate
-   **State Management:** Zustand
-   **Cloud & AI:** [Puter.js](https://docs.puter.com/) (Auth, FS, KV, AI)
-   **PDF Processing:** PDF.js (`pdfjs-dist`)
-   **Build Tool:** Vite

## ⚙️ Prerequisites

1.  **Node.js** (v18 or later) installed on your machine.
2.  A free account on [Puter.com](https://puter.com) (required for Auth and AI features).

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ThangHoang54/ai-resume-analyser.git
    cd resumedex
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

    *Note: If you run into issues with `pdfjs-dist`, ensure you are using the correct version compatible with the code (e.g., v5.3.93).*

3.  **Start the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the app:**
    Visit `http://localhost:5173` in your browser.

## Configuration

### AI Model
This app uses Puter.js AI to analyze resumes. Set your preferred model in the code:
```ts
// In puter.ts or wherever CURRENT_AI_MODEL is defined
export const CURRENT_AI_MODEL = "openai/gpt-4o-mini";  // Recommended: fast + vision support

// Other good options:
// "google/gemini-2.0-flash"          → Excellent multimodal / PDF understanding
// "anthropic/claude-3-5-sonnet-latest" → Great reasoning & feedback style
// "qwen/qwen2.5-vl-32b-instruct"     → Strong vision-language at lower cost
// "openai/gpt-4o"                    → Highest quality (more expensive/slower)
```

## 🏃‍♂️ How to Use

1.  **Log In:** Click the "Log In" button. This will authenticate you via your Puter.com account.
2.  **Upload:**
    * Enter the **Company Name** and **Job Title**.
    * Paste the full **Job Description** from the job listing.
    * Upload your Resume (PDF format, max 20MB).
3.  **Analyze:** Click "Analyze Resume". The app will:
    * Upload your resume to your Puter cloud storage.
    * Convert the first page to an image for preview.
    * Send the text and job description to the AI model.
4.  **Review:** You will be redirected to a feedback page showing your score and specific tips to improve your application.
5.  **Generate Cover Letter:** Click "Write Cover Letter" in the navbar to draft a personalized letter based on the analysis.

## ☁️ Deployment

This app is designed to be hosted on **Puter.com** but can be deployed anywhere that supports static sites (Vercel, Netlify) with minor adjustments.

**To deploy on Puter:**
1.  Set `ssr: false` in `react-router.config.ts`.
2.  Run `npm run build`.
3.  Upload the contents of the `dist/client` (or `build/client`) folder to your Puter.com file system.
4.  Launch it as a web app!

**Puter Model** list: https://developer.puter.com/ai/models/
Built with ❤️ using React Router & Puter.js.