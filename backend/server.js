const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("CollabVS backend running successfully on Render");
});


app.post("/api/command", async (req, res) => {
  try {
    const { command, args = [] } = req.body;

    if (!command) {
      return res.status(400).json({ error: "Command is required" });
    }

    
    const cvsPath = path.join(__dirname, "cvs.js");
    const fullCommand = `node ${cvsPath} ${command} ${args.join(" ")}`;

    console.log("⚙️ Executing:", fullCommand);

    exec(fullCommand, { cwd: __dirname }, (error, stdout, stderr) => {
      if (error) {
        console.error("❌ Command Error:", error);
        return res.status(500).json({
          error: stderr || error.message || "Unknown execution error",
        });
      }

      const output = stdout || stderr || "✅ Command executed successfully";
      console.log("📦 Output:", output);
      res.json({ message: output });
    });
  } catch (error) {
    console.error("🔥 Server Error:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(` CollabVS backend live on port ${PORT}`)
);
