import React, { useState } from "react";
import { runCommand } from "../api/config"; 

export default function Branch() {
  const [newBranch, setNewBranch] = useState("");
  const [message, setMessage] = useState("");

  const handleCreateBranch = async () => {
    if (!newBranch) return;
    setMessage("Creating new branch...");
    
    
    const response = await runCommand("branch", [newBranch]);
    setMessage(response);

    setNewBranch("");
  };

  return (
    <div className="mx-5 my-5">
      <input
        value={newBranch}
        onChange={(e) => setNewBranch(e.target.value)}
        placeholder="New branch name"
        className="border text-green-400 px-2 py-1 mr-2 w-1/2"
      />
      <button
        onClick={handleCreateBranch}
        className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
        disabled={!newBranch}
      >
        Create Branch
      </button>

      {message && (
        <p className="text-sm text-gray-300 mt-2 bg-gray-800 p-2 rounded">
          {message}
        </p>
      )}
    </div>
  );
}
