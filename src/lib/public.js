import { createReadStream } from "node:fs";
import { extname, join, normalize } from "node:path";
import { pipeline } from "node:stream";
import { createBrotliCompress } from "node:zlib";

/**
 * Serve static files from file system
 * @param {{ staticDir: string; staticPath: string; }} options
 * @returns {(req: import("node:http").IncomingMessage, res: import("node:http").ServerResponse) => void}
 */
export function createPublicHandler({ staticDir, staticPath }) {
  return async (req, res) => {
    const requestUrl = new URL(req.url || "", `http://${req.headers.host}`);
    const normalizedPath = normalize(requestUrl.pathname).replace(
      new RegExp(`^/${staticPath}`),
      ""
    );
    const relativePath = join(staticDir, normalizedPath);
    const extension = extname(relativePath);

    const acceptEncoding = req.headers["accept-encoding"]?.toString() || "";

    const onError = (err) => {
      if (err) {
        console.error(err);

        res.end();
      }
    };

    const raw = createReadStream(relativePath);

    let contentType = "";

    switch (extension) {
      case ".css":
        contentType = "text/css";
        break;
      case ".js":
        contentType = "application/javascript";
        break;
    }

    res.setHeader("Vary", "Accept-Encoding");
    res.setHeader("Content-Type", contentType);

    // Cache for a year
    res.setHeader("Cache-Control", "max-age=31536000");

    // Compress with Brotli if supported by client
    if (/\bbr\b/.test(acceptEncoding)) {
      res.setHeader("Content-Encoding", "br");

      pipeline(raw, createBrotliCompress(), res, onError);

      return;
    }

    pipeline(raw, res, onError);
  };
}
