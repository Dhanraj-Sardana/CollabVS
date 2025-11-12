import React, { useState } from "react";

export default function Rebase({ run }) {
  const [targetBranch, setTargetBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRebase = async () => {
    if (!targetBranch.trim()) return;
    try {
      setLoading(true);
      setMessage("");
      await run(`node ../../backend/cvs.js rebase "${targetBranch}"`);
      setMessage(` Successfully rebased onto "${targetBranch}"`);
    } catch (error) {
      console.error("Rebase failed:", error);
      setMessage(" Rebase failed — check for merge conflicts or errors.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-5 my-5 pb-10">
      <input
        value={targetBranch}
        onChange={(e) => setTargetBranch(e.target.value)}
        placeholder="Target branch"
        className="border text-green-400 px-2 py-1 mr-2 w-1/2"
      />
      <button
        onClick={handleRebase}
        className={`px-4 py-2 rounded text-white transition-all ${
          loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-gray-500 hover:bg-gray-700"
        }`}
        disabled={loading || !targetBranch.trim()}
      >
        {loading ? "Rebasing..." : "Rebase"}
      </button>

      {message && (
        <div
          className={`mt-2 text-sm ${
            message.startsWith("✅")
              ? "text-green-400"
              : "text-red-400"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
