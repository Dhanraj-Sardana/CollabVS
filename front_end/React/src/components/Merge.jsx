import React, { useState } from "react";
import { runCommand } from "../api/config"; 

export default function Merge({ run }) {
  const [mergeBranch, setMergeBranch] = useState("");
  const [message, setMessage] = useState("");

  const handleMerge = async () => {
    if (!mergeBranch) return;

    try {
      setMessage("Merging branch...");
      
      if (window.electronAPI) {
      
        await run(`node ../../backend/cvs.js merge ${mergeBranch}`);
        setMessage(`Merge completed successfully (Electron mode).`);
      } else {
       
        const response = await runCommand("merge", [mergeBranch]);
        setMessage(response || "Merge completed successfully (Web mode).");
      }
    } catch (error) {
      console.error("Merge failed:", error);
      setMessage("Merge failed. Please check logs.");
    }
  };

  return (
    <div className="mx-5 my-5">
      <input
        value={mergeBranch}
        onChange={(e) => setMergeBranch(e.target.value)}
        placeholder="Branch to merge into current"
        className="border px-2 py-1 mr-2 w-1/2 text-green-400"
      />
      <button
        onClick={handleMerge}
        className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
        disabled={!mergeBranch}
      >
        Merge Branch
      </button>

      {message && (
        <p className="mt-2 text-sm text-gray-300 bg-gray-800 p-2 rounded">
          {message}
        </p>
      )}
    </div>
  );
}
