import { spawn } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const vitePackagePath = require.resolve("vite/package.json");
const viteBin = path.join(path.dirname(vitePackagePath), "bin", "vite.js");
const esbuildPackagePath = require.resolve("esbuild/package.json");
const esbuildDir = path.dirname(esbuildPackagePath);

const env = { ...process.env };

if (process.platform === "win32") {
  const localEsbuildBinary = path.join(esbuildDir, "esbuild.exe");
  if (existsSync(localEsbuildBinary)) {
    const targetDir = path.join(os.tmpdir(), "kanvera-tools");
    mkdirSync(targetDir, { recursive: true });
    const targetBinary = path.join(targetDir, "esbuild.exe");
    copyFileSync(localEsbuildBinary, targetBinary);
    env.ESBUILD_BINARY_PATH = targetBinary;
  }
}

const child = spawn(process.execPath, [viteBin, ...process.argv.slice(2)], {
  stdio: "inherit",
  env,
  shell: false
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});

child.on("error", (error) => {
  console.error("Failed to start Vite", error);
  process.exit(1);
});
