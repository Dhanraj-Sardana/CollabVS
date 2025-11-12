import React, { useState } from "react";
import { runCommand } from "../api/config"; 

export default function Clone({ setGlobalLoading, remoteURL, reponame }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleClone = async () => {
    if (!remoteURL || !reponame) return;

    try {
      setLoading(true);
      setGlobalLoading?.(true);
      setMessage("Cloning repository...");

    
      const response = await runCommand("clone", [remoteURL, reponame]);
      setMessage(response || "Clone operation completed!");
    } catch (error) {
      console.error("Error cloning:", error);
      setMessage("Error during cloning process");
    } finally {
      setLoading(false);
      setGlobalLoading?.(false);
    }
  };

  return (
    <div className="mx-5 my-5">
      <button
        onClick={handleClone}
        className={`bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded ${
          loading ? "opacity-70 cursor-not-allowed" : ""
        }`}
        disabled={loading || !remoteURL || !reponame}
      >
        {loading ? "Cloning..." : "Clone"}
      </button>

      {message && (
        <p className="text-sm text-gray-300 mt-3 bg-gray-800 p-2 rounded">
          {message}
        </p>
      )}
    </div>
  );
}
