import React, { useState } from "react";
import Push from "./Push";
import OutputWindow from "./OutputWindow";
import Clone from "./Clone";
import Fetch from "./Fetch";
import Loading from "./Loading";
import Pull from "./Pull";


export default function Remote() {
  const [logs, setLogs] = useState([]);
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remoteURL, setRemoteURL] = useState("");
  const [reponame, setReponame] = useState("");
  const [isConflict, setIsConflict] = useState(false);
  const [conflictContent, setConflictContent] = useState("");


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

  return (
    <div className="min-h-screen m-0 space-y-4 font-mono bg-[#031B2B]">
   
      <div className="flex items-center gap-20 bg-[#031B2B]">
        <img className="w-45" src="/logo.jpeg" alt="CollabVS Logo" />
        <h1 className="font-extrabold text-4xl bg-gradient-to-r from-[#41f478] to-[#3ac15d] text-transparent bg-clip-text">
          Collaborative Version Control System
        </h1>
      </div>

    
      {loading ? (
        <Loading loading={loading} />
      ) : (
        <OutputWindow logs={logs} handleCheckout={handleCheckout} output={output} />
      )}

      
      <div className="flex justify-center">
        <input
          value={remoteURL}
          onChange={(e) => setRemoteURL(e.target.value)}
          placeholder="Remote URL"
          className="border text-green-400 px-2 py-1 w-1/4 mr-2"
        />
        <input
          value={reponame}
          onChange={(e) => setReponame(e.target.value)}
          placeholder="Repo Name"
          className="border text-green-400 px-2 w-1/4 py-1 mr-2"
        />
      </div>

      <div className="flex justify-center">
        <div className="flex">
          <Clone run={run} setGlobalLoading={setLoading} remoteURL={remoteURL} reponame={reponame} />
          <Push run={run} setGlobalLoading={setLoading} remoteURL={remoteURL} reponame={reponame} />
          <Fetch run={run} setGlobalLoading={setLoading} remoteURL={remoteURL} reponame={reponame} />
          <Pull run={run} setGlobalLoading={setLoading} remoteURL={remoteURL} reponame={reponame} />
        </div>
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