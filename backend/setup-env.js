#!/usr/bin/env node
/**
 * Interactive .env generator for the backend.
 *
 * Run this from inside the backend/ folder:
 *   node setup-env.js
 *
 * It asks for:
 *   1. The path to the Firebase service-account JSON file you downloaded
 *      (Firebase Console -> Project Settings -> Service Accounts ->
 *       Generate new private key).
 *   2. Your Gemini API key.
 *
 * It then writes backend/.env with everything formatted exactly the way
 * the backend expects — this avoids the most common manual mistake, which
 * is pasting the private key with the wrong quoting/line breaks.
 *
 * Nothing you type here is sent anywhere. This script only reads your local
 * JSON file and writes a local .env file.
 */

import readline from "node:readline";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function fail(message) {
  console.error(`\n❌ ${message}\n`);
  rl.close();
  process.exit(1);
}

console.log("\n=== Nova backend .env setup ===\n");

rl.question(
  "Path to your Firebase service-account JSON file (drag & drop the file into this window, then press Enter): ",
  (rawPath) => {
    const jsonPath = rawPath.trim().replace(/^["']|["']$/g, "");

    if (!jsonPath || !existsSync(jsonPath)) {
      fail(`Could not find a file at: ${jsonPath}\nRe-run "node setup-env.js" and try again.`);
      return;
    }

    let serviceAccount;
    try {
      serviceAccount = JSON.parse(readFileSync(jsonPath, "utf8"));
    } catch {
      fail(
        "That file isn't valid JSON. Make sure you selected the service-account\n" +
          "file Firebase downloaded, not some other file."
      );
      return;
    }

    const { project_id, client_email, private_key } = serviceAccount;
    if (!project_id || !client_email || !private_key) {
      fail(
        "That JSON file is missing project_id / client_email / private_key.\n" +
          "Make sure it's the file from 'Generate new private key'."
      );
      return;
    }

    rl.question(
      "\nYour Gemini API key (from https://aistudio.google.com/apikey): ",
      (rawKey) => {
        const geminiKey = rawKey.trim();
        if (!geminiKey) {
          fail("Gemini API key can't be empty.");
          return;
        }

        rl.question(
          "\nFrontend URL [press Enter to use http://localhost:5173]: ",
          (rawOrigin) => {
            const clientOrigin = rawOrigin.trim() || "http://localhost:5173";
            rl.close();

            // JSON.stringify escapes real newlines in the private key back
            // into the literal "\n" text our env.js expects, and wraps the
            // value in quotes — the exact formatting that goes wrong most
            // often when typed by hand.
            const envContents = `PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=${clientOrigin}

AI_API_KEY=${geminiKey}
AI_MODEL=gemini-2.0-flash

FIREBASE_PROJECT_ID=${project_id}
FIREBASE_CLIENT_EMAIL=${client_email}
FIREBASE_PRIVATE_KEY=${JSON.stringify(private_key)}

RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=60
`;

            const outPath = resolve(process.cwd(), ".env");
            writeFileSync(outPath, envContents, "utf8");

            console.log(`\n✅ Wrote ${outPath}`);
            console.log("You can now run: npm run dev\n");
          }
        );
      }
    );
  }
);
