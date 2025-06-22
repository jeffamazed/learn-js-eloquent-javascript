import { createServer } from "node:http";
import { resolve, sep } from "node:path";
import { createReadStream, createWriteStream } from "node:fs";
import { stat, readdir, rmdir, unlink, mkdir } from "node:fs/promises";
import { lookup } from "mime-types";

const methods = Object.create(null);

methods.GET = async function (request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    else return { status: 404, body: "File not found" };
  }

  if (stats.isDirectory()) {
    // Try to serve index.html inside the directory
    const indexPath = resolve(path, "index.html");
    try {
      const indexStats = await stat(indexPath);
      if (indexStats.isFile()) {
        return { body: createReadStream(indexPath), type: lookup(indexPath) };
      }
    } catch {
      // No index.html, maybe return directory listing or 403 Forbidden
      return { status: 403, body: "Forbidden" };
    }
  } else {
    return { body: createReadStream(path), type: lookup(path) };
  }
};

methods.DELETE = async function (request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    else return { status: 204 };
  }

  if (stats.isDirectory()) await rmdir(path);
  else await unlink(path);
  return { status: 204 };
};

methods.MKCOL = async function (request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await mkdir(path);
    return { status: 204 };
  }

  if (stats.isDirectory()) return { status: 204 };
  else return { status: 400, body: "Bad request" };
};

function pipeStream(from, to) {
  return new Promise((resolve, reject) => {
    from.on("error", reject);
    to.on("error", reject);
    to.on("finish", resolve);
    from.pipe(to);
  });
}

methods.PUT = async function (request) {
  let path = urlPath(request.url);
  await pipeStream(request, createWriteStream(path));
  return { status: 204 };
};

async function notAllowed(request) {
  return {
    status: 405,
    body: `Method ${request.method} not allowed.`,
  };
}

const baseDirectory = resolve(process.cwd(), "public");

function urlPath(url) {
  let { pathname } = new URL(url, "http://d");
  let path = resolve(baseDirectory, decodeURIComponent(pathname).slice(1));

  if (path !== baseDirectory && !path.startsWith(baseDirectory + sep)) {
    throw { status: 403, body: "Forbidden" };
  }

  return path;
}

createServer((request, response) => {
  let handler = methods[request.method] || notAllowed;
  handler(request)
    .catch((error) => {
      if (error.status != null) return error;
      return { body: String(error), status: 500 };
    })
    .then(({ body, status = 200, type = "text/plain" }) => {
      response.writeHead(status, { "Content-Type": type });
      if (body?.pipe) body.pipe(response);
      else response.end(body);
    });
}).listen(8000);

console.log("Server runs! Listening on port (8000).");
