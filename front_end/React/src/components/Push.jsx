import  { useState } from "react";

export default function Push({ run, setGlobalLoading, remoteURL, reponame }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handlePush = async () => {
    if (!remoteURL || !reponame) return;
    try {
      setLoading(true);
      setGlobalLoading(true);
      setErrorMsg("");
      setSuccessMsg("");

      await run(`node ../../backend/cvs.js push ${remoteURL} ${reponame}`);
      setSuccessMsg(" Push completed successfully!");
    } catch (error) {
      console.error("Push failed:", error);
      setErrorMsg(" Push failed. Check your connection or repository access.");
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  return (
    <div className="mx-5 my-5">
      <button
        onClick={handlePush}
        className={`px-4 py-2 rounded text-white transition-all ${
          loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-gray-500 hover:bg-gray-700"
        }`}
        disabled={loading || !remoteURL || !reponame}
      >
        {loading ? "Pushing..." : "Push"}
      </button>

      {errorMsg && <div className="mt-2 text-red-400 text-sm">{errorMsg}</div>}
      {successMsg && <div className="mt-2 text-green-400 text-sm">{successMsg}</div>}
    </div>
  );
}
