import React, { useState, useRef } from "react";
import OutputWindow from "./OutputWindow";
import BasicFunction from "./BasicFunction";
import Rebase from "./Rebase";
import Merge from "./Merge";
import SwitchBranch from "./SwitchBranch";
import Branch from "./Branch";
import Commit from "./Commit";
import Add from "./Add";

export default function StarterGUI() {
  const [output, setOutput] = useState("");
  const [logs, setLogs] = useState([]);
  const [isConflict, setIsConflict] = useState(false);
  const [conflictContent, setConflictContent] = useState("");
  const moreFunctionsRef = useRef(null);

  
  const isElectron = !!window.electronAPI;

const run = async (command, isLog = false) => {
  let out = "";

  try {
    if (window.electronAPI) {
     
      out = await window.electronAPI.runCommand(command);
    } else {
      
      const response = await fetch("/api/run-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });
      const data = await response.json();
      out = data.output || "No output";
    }
  } catch (err) {
    out = `Error: ${err.message}`;
  }

  const outputText = out?.trim() || "No output";
  setOutput(outputText);

  if (out.includes("<<<<<<<") || out.includes("CONFLICT") || out.includes("=======")) {
    setIsConflict(true);
    setConflictContent(out);

    if (window.electronAPI?.openConflictWindow) {
      window.electronAPI.openConflictWindow(out);
    }
  }

  if (isLog && out) {
    const parsed = out
      .trim()
      .split("\n")
      .map((line) => {
        const match = line.match(/^Commit (\w+): (.+)$/);
        return match ? { id: match[1], msg: match[2] } : null;
      })
      .filter(Boolean);
    setLogs(parsed);
  }
};


  const handleCheckout = (commitID) => {
    const command = `node ../../backend/cvs.js checkout ${commitID}`;
    run(command);
  };

  const openRemoteWindow = () => {
    if (isElectron && window.electronAPI?.openRemoteWindow) {
      window.electronAPI.openRemoteWindow();
    } else {
     
      window.open("/remote", "_blank");
    }
  };

  return (
    <div className="m-0 h-full space-y-4 font-mono bg-[#031B2B]">
     
      <div className="flex items-center gap-20 bg-[#031B2B]">
        <img className="w-45" src="/logo.jpeg" alt="CollabVS Logo" />
        <h1 className="font-extrabold text-4xl bg-gradient-to-r from-[#41f478] to-[#3ac15d] text-transparent bg-clip-text">
          Collaborative Version Control System
        </h1>
      </div>

  
      <BasicFunction />

     
      <div className="flex justify-center mt-15">
        <div className="flex flex-col space-y-4">
          <button
            onClick={openRemoteWindow}
            className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Remote Operations
          </button>
          <button
            onClick={() => moreFunctionsRef.current?.scrollIntoView({ behavior: "smooth" })}
            className="bg-gray-500 hover:bg-gray-700 mt-5 text-white px-4 py-2 rounded"
          >
            More Functions
          </button>
        </div>
      </div>

      
      <div
        ref={moreFunctionsRef}
        className="pt-56 px-4 sm:px-8 max-w-screen-lg mx-auto"
      >
        <OutputWindow logs={logs} handleCheckout={handleCheckout} output={output} />

        <Add run={run} />
        <Commit run={run} />
        <Branch run={run} />
        <SwitchBranch run={run} />
        <Merge run={run} />
        <Rebase run={run} />
      </div>

     
      {!isElectron && isConflict && (
        <div className="p-4 bg-red-900 text-white mt-4 rounded">
          <h3 className="font-bold">Merge Conflict Detected:</h3>
          <pre className="whitespace-pre-wrap text-green-300">{conflictContent}</pre>
        </div>
      )}
    </div>
  );
}
