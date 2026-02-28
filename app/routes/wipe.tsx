import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
    const { auth, isLoading, error, fs, kv } = usePuterStore();
    const navigate = useNavigate();
    const [files, setFiles] = useState<FSItem[]>([]);
    const [isWiping, setIsWiping] = useState(false);
    const [wipeError, setWipeError] = useState<string | null>(null);

    const loadFiles = async () => {
        try {
            const files = (await fs.readDir("./")) as FSItem[];
            setFiles(files || []);
        } catch (err) {
            console.error("Failed to load files:", err);
            setFiles([]);
        }
    };

    useEffect(() => {
        if (!isLoading) {
            loadFiles();
        }
    }, [isLoading, fs]);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [isLoading, auth.isAuthenticated, navigate]);

    const handleDelete = async () => {
        if (!confirm("Are you sure? This will delete all app data permanently.")) return;

        setIsWiping(true);
        setWipeError(null);

        try {
            for (const file of files) {
                await fs.delete(file.path);
            }
            await kv.flush();
            await loadFiles();  // Reload to show empty state
            alert("Data wiped successfully!");
            navigate("/");  // Redirect to home after wipe
        } catch (err: any) {
            const errorMsg = err?.message || "Wipe failed. Try again.";
            setWipeError(errorMsg);
            console.error("Wipe error:", err);
        } finally {
            setIsWiping(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <main className="min-h-screen bg-white p-8">
            <h1 className="text-2xl font-bold mb-4">Wipe App Data</h1>
            <p className="mb-4">Authenticated as: {auth.user?.username}</p>

            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Existing Files:</h2>
                {files.length === 0 ? (
                    <p className="text-gray-500">No files found.</p>
                ) : (
                    <ul className="list-disc pl-6">
                        {files.map((file) => (
                            <li key={file.id}>{file.name}</li>
                        ))}
                    </ul>
                )}
            </div>

            {wipeError && <p className="text-red-500 mb-4">{wipeError}</p>}

            <button
                className="bg-red-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-red-600 disabled:opacity-50"
                onClick={handleDelete}
                disabled={isWiping || files.length === 0}
            >
                {isWiping ? "Wiping..." : "Wipe App Data"}
            </button>
        </main>
    );
};

export default WipeApp;