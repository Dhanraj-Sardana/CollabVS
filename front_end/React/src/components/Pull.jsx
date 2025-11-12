import React, { useState } from "react";

export default function Pull({ run, setGlobalLoading, remoteURL, reponame }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handlePull = async () => {
    if (!remoteURL || !reponame) return;
    try {
      setLoading(true);
      setGlobalLoading(true);
      setErrorMsg("");

      await run(`node ../../backend/cvs.js pull ${remoteURL} ${reponame}`);
    } catch (error) {
      console.error("Pull failed:", error);
      setErrorMsg(" Failed to pull from remote repository. Check connection or URL.");
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  return (
    <div className="mx-5 my-5">
      <button
        onClick={handlePull}
        className={`px-4 py-2 rounded text-white transition-all ${
          loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-gray-500 hover:bg-gray-700"
        }`}
        disabled={loading || !remoteURL || !reponame}
      >
        {loading ? "Pulling..." : "Pull"}
      </button>

      {errorMsg && (
        <div className="mt-2 text-red-400 text-sm">
          {errorMsg}
        </div>
      )}
    </div>
  );
}
