import React, { useState } from "react";
import { runCommand } from "../api/config"; 

export default function Commit() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const handleCommit = async () => {
    if (!message.trim()) return;

    try {
      setResponse("Committing changes...");
      const res = await runCommand("commit", [message]);
      setResponse(res || "Commit successful!");
      setMessage("");
    } catch (error) {
      console.error("Commit error:", error);
      setResponse("Error committing changes");
    }
  };

  return (
    <div className="mx-5 my-5">
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Commit message"
        className="border text-green-400 px-2 py-1 mr-2 w-1/2"
      />
      <button
        onClick={handleCommit}
        className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
        disabled={!message.trim()}
      >
        Commit
      </button>

      {response && (
        <p className="text-sm text-gray-300 mt-2 bg-gray-800 p-2 rounded">
          {response}
        </p>
      )}
    </div>
  );
}
