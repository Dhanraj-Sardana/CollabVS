export const BACKEND_URL = "https://collabvs.onrender.com";

export async function runCommand(command, args = []) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/command`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command, args }),
    });

    const data = await response.json();
    return data.message || "No response from server";
  } catch (error) {
    console.error("Error:", error);
    return "Backend connection error";
  }
}
