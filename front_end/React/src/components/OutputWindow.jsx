
export default function OutputWindow({ logs = [], handleCheckout, output = "" }) {
  const hasLogs = logs.length > 0;

  return (
    <div className="bg-black text-green-400 p-4 overflow-auto h-64 whitespace-pre-wrap rounded-lg border border-gray-700 shadow-inner font-mono text-sm">
      {hasLogs ? (
        logs.map((entry, index) => (
          <div key={entry.id || index} className="mb-1">
            <span
              onClick={() => handleCheckout(entry.id)}
              className="cursor-pointer text-cyan-300 hover:text-cyan-400 hover:underline"
            >
              {entry.id}
            </span>
            <span className="text-gray-400"> : </span>
            <span>{entry.msg}</span>
          </div>
        ))
      ) : (
        <pre className="text-green-300">{output || "No output yet..."}</pre>
      )}
    </div>
  );
}
