const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const {
  initRepo,
  addFile,
  commit,
  logCommits,
  checkout,
  createBranch,
  switchBranch,
  mergeBranch,
  pushToServer,
  clone,
  pull,
  fetch,
  status,
  rebase,
  stash,
  stashPop
} = require("./cvsCommands"); 

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CollabVS backend running successfully on Render");
});


app.post("/api/command", async (req, res) => {
  try {
    const { command, args } = req.body;

    switch (command) {
      case "init":
        initRepo();
        break;
      case "add":
        addFile(...args);
        break;
      case "commit":
        commit(args.join(" "));
        break;
      case "log":
        logCommits();
        break;
      case "checkout":
        checkout(args[0]);
        break;
      case "branch":
        createBranch(args[0]);
        break;
      case "switchBranch":
        switchBranch(args[0]);
        break;
      case "merge":
        mergeBranch(args[0]);
        break;
      case "push":
        pushToServer(args[0], args[1]);
        break;
      case "pull":
        pull(args[0], args[1]);
        break;
      case "fetch":
        fetch(args[0], args[1]);
        break;
      case "clone":
        clone(args[0], args[1]);
        break;
      case "status":
        status();
        break;
      case "rebase":
        rebase(args[0]);
        break;
      case "stash":
        stash();
        break;
      case "stash-pop":
        stashPop();
        break;
      default:
        return res.status(400).json({ message: "Unknown command" });
    }

    res.json({ message: `Executed ${command} successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`CollabVS backend live on port ${PORT}`));
