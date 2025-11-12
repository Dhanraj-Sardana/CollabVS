import React, { useEffect, useState } from "react";

export default function Conflict() {
  const [conflictText, setConflictText] = useState("");
  const [isElectron, setIsElectron] = useState(false);

  useEffect(() => {
    if (window.electronAPI?.onConflictData) {
      setIsElectron(true);
      window.electronAPI.onConflictData((data) => {
        setConflictText(data);
      });
    } else {
      
      const storedConflict = sessionStorage.getItem("conflictText");
      if (storedConflict) {
        setConflictText(storedConflict);
      } else {
        setConflictText("No conflict data available.");
      }
    }
  }, []);

  const handleClose = () => {
    if (isElectron && window.electronAPI?.closeConflictWindow) {
      window.electronAPI.closeConflictWindow();
    } else {
     
      alert("Conflict window closed (web mode)");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-red-600">Merge Conflict</h2>

      <pre className="bg-black text-green-300 p-4 overflow-auto max-h-96 whitespace-pre-wrap rounded">
        {conflictText}
      </pre>

      <button
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        onClick={handleClose}
      >
        Close Conflict Window
      </button>
    </div>
  );
}
