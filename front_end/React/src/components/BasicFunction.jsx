import React, { useState } from "react";
import OutputWindow from "./OutputWindow";
import Stashing from "./Stashing";

export default function BasicFunction() {
  const [logs, setLogs] = useState([]);
  const [output, setOutput] = useState("");

  // ✅ Render backend URL
  const BACKEND_URL = "https://collabvs.onrender.com/api/command";

  const isElectron = !!window.electronAPI;

  // Main function to run commands
  const run = async (command, isLog = false) => {
    try {
      setOutput("Running command...");

      // ✅ If running inside Electron app (desktop)
      if (isElectron) {
        const out = await window.electronAPI.runCommand(command);
        setOutput(out?.trim() || "No output");
        return;
      }

      // ✅ If running in browser (Vercel)
      const [cmd, ...args] = command.split(" ");
      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: cmd, args }),
      });

      const data = await res.json();

      if (!res.ok) {
        setOutput(`Error: ${data.error || "Command failed"}`);
        return;
      }

      const resultText = data.message || "No output";
      setOutput(resultText);

      if (isLog && resultText) {
        const parsed = resultText
          .trim()
          .split("\n")
          .map((line) => {
            const match = line.match(/^Commit (\w+): (.+)$/);
            return match ? { id: match[1], msg: match[2] } : null;
          })
          .filter(Boolean);
        setLogs(parsed);
      }
    } catch (err) {
      console.error(err);
      setOutput(`Request failed: ${err.message}`);
    }
  };

  const handleCheckout = (commitID) => {
    run(`checkout ${commitID}`);
  };

  return (
    <div>
      <OutputWindow logs={logs} handleCheckout={handleCheckout} output={output} />

      <div className="flex justify-center gap-14 mt-5">
        <button
          onClick={() => run("log", true)}
          className="bg-gray-500 text-white hover:bg-gray-700 px-4 py-2 rounded"
        >
          Log
        </button>

        <button
          onClick={() => run("init")}
          className="bg-gray-500 text-white px-8 hover:bg-gray-800 py-2 rounded"
        >
          Init
        </button>

        <button
          onClick={() => run("status", true)}
          className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
        >
          Status
        </button>
      </div>

      <Stashing run={run} />
    </div>
  );
}
