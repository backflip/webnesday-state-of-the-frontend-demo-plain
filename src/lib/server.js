import { dirname, normalize, resolve } from "node:path";
import { html } from "../../public/scripts/import/utils.js";
import { fileURLToPath } from "node:url";
import { readFileSync, readdirSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Use package version for asset cache busting
const packageJson = JSON.parse(
  readFileSync(resolve(__dirname, "../../package.json"), "utf-8")
);
const assetVersion = packageJson.version;

// List of scripts to add to importmap
const scriptsDir = "../../public/scripts/import";
const scripts = readdirSync(resolve(__dirname, scriptsDir)).map(
  (script) => `${scriptsDir}/${script}`
);
const importMap = scripts.reduce((acc, script) => {
  acc[script] = `${script}?v=${assetVersion}`;

  return acc;
}, {});

// Environment variables to expose to client
const env = {
  SUPABASE_ANON_TOKEN: process.env.SUPABASE_ANON_TOKEN,
};

/**
 * Normalize request path
 * @param {import("node:http").IncomingMessage} req
 * @returns {string}
 */
export function normalizePath(req) {
  const requestUrl = new URL(req.url || "", `http://${req.headers.host}`);
  const normalizedPath = normalize(requestUrl.pathname);

  return normalizedPath;
}

/**
 * Render HTML
 * @param {string} content
 * @returns {string}
 */
export function render(content) {
  return html`<!DOCTYPE html>
    <html lang="de">
      <head>
        <title>Pizze</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="/public/styles/main.css?v=${assetVersion}"
        />
        <script>
          window.env = ${JSON.stringify(env)};
        </script>
        <script type="importmap">
          {
            "imports": ${JSON.stringify(importMap)}
          }
        </script>
        ${scripts
          .map(
            (script) => html`
              <link rel="modulepreload" href="${script}?v=${assetVersion}" />
            `
          )
          .join("")}
        <script
          src="/public/scripts/main.js?v=${assetVersion}"
          type="module"
        ></script>
      </head>
      <body>
        ${content}
      </body>
    </html> `;
}
