import { createServer } from "node:http";
import { normalizePath, render } from "./src/lib/server.js";
import { resolve } from "node:path";
import { createPublicHandler } from "./src/lib/public.js";
import { html } from "./public/scripts/import/utils.js";

const port = process.env.PORT || 3000;

const server = createServer(async (req, res) => {
  const normalizedPath = normalizePath(req);

  // Route: `/public
  if (normalizedPath.match(/^\/public/)) {
    return createPublicHandler({
      staticDir: resolve(`./public`),
      staticPath: "public",
    })(req, res);
  }

  // Route `/`
  if (normalizedPath.match(/^\/$/)) {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(
      render(html`<h1>Pizze</h1>
        <custom-pizze>Loading...</custom-pizze>`)
    );

    return;
  }

  // 404
  res.statusCode = 404;
  res.setHeader("Content-Type", "text/html");
  res.end(render(html`<h1>404</h2><p>Not found</p>`));

  return;
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
