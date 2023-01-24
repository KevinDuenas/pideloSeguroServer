import { readdirSync } from "fs";
import { join } from "path";
import { spawn } from "child_process";
import { scripts } from "@config/loggers";

const childProcess = (command, args) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: ["ignore", "ignore", "ignore"],
    });
    child.on("close", (code) => {
      if (code !== 0) reject();
      else resolve();
    });
  });

const updateTemplates = async () => {
  scripts.await("📧  Updating templates");

  const templates = readdirSync(join(__dirname, "../templates"));
  const updates = templates.map((template) => {
    //console.log(`file://${join(__dirname, "../templates", template)}`);
    return childProcess("aws", [
      "ses",
      "update-template",
      "--cli-input-json",
      `file://${join(__dirname, "../templates", template)}`,
    ]);
  });
  await Promise.all(updates);
  scripts.success("✨  Templates updated");
};

updateTemplates();
