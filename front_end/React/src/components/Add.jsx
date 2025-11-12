import React, { useState } from "react";
import { runCommand } from "../api/config";

export default function Add() {
  const [filename, setFilename] = useState("");
  const [message, setMessage] = useState("");

  const handleAdd = async () => {
    if (!filename) return;
    setMessage("Staging file...");
    const response = await runCommand("add", [filename]);
    setMessage(response);
    setFilename("");
  };

  return (
    <div className="mx-5 my-5">
      <input
        value={filename}
        onChange={(e) => setFilename(e.target.value)}
        placeholder="Filename"
        className="border px-2 text-green-400 py-1 mr-2 w-1/2"
      />
      <button
        onClick={handleAdd}
        className="bg-gray-500 text-white px-4 py-2 hover:bg-gray-700 rounded"
        disabled={!filename}
      >
        Add
      </button>

      {message && (
        <p className="text-sm text-gray-300 mt-2 bg-gray-800 p-2 rounded">
          {message}
        </p>
      )}
    </div>
  );
}
