const http = require("http");
const fs = require("fs");
const path = require("path");
const { request } = require("http");

const root = path.join(__dirname, "..", "client", "dist");
const port = 4173;
const apiTargetPort = 4000;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api")) {
    const proxyRequest = request(
      {
        hostname: "localhost",
        port: apiTargetPort,
        path: req.url,
        method: req.method,
        headers: req.headers,
      },
      (proxyResponse) => {
        res.writeHead(proxyResponse.statusCode || 502, proxyResponse.headers);
        proxyResponse.pipe(res, { end: true });
      },
    );

    proxyRequest.on("error", () => {
      res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ message: "Backend unavailable" }));
    });

    req.pipe(proxyRequest, { end: true });
    return;
  }

  const requestPath = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  let filePath = path.join(root, requestPath);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(root, "index.html");
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(500);
      res.end("Server error");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
    });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`Static frontend running on http://localhost:${port}`);
});
