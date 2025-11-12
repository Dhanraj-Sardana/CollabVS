import React, { useState } from "react";
import { runCommand } from "../api/config"; 

export default function Fetch({ run, setGlobalLoading, remoteURL, reponame }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFetch = async () => {
    if (!remoteURL || !reponame) return;

    try {
      setLoading(true);
      setGlobalLoading(true);
      setMessage("Fetching repository...");

      if (window.electronAPI) {
        
        await run(`node ../../backend/cvs.js fetch ${remoteURL} ${reponame}`);
        setMessage("Fetch completed successfully (Electron mode).");
      } else {
        
        const response = await runCommand("fetch", [remoteURL, reponame]);
        setMessage(response || "Fetch completed successfully (Web mode).");
      }
    } catch (error) {
      console.error("Fetch failed:", error);
      setMessage("Fetch failed. Please check logs.");
    } finally {
      setLoading(false);
      setGlobalLoading(false);
    }
  };

  return (
    <div className="mx-5 my-5 pb-10">
      <button
        onClick={handleFetch}
        className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
        disabled={loading || !remoteURL || !reponame}
      >
        {loading ? "Fetching..." : "Fetch"}
      </button>

      {message && (
        <p className="mt-2 text-sm text-gray-300 bg-gray-800 p-2 rounded">
          {message}
        </p>
      )}
    </div>
  );
}
