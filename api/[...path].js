// Vercel Serverless Function: catch-all proxy under /api/*
// Proxies to https://wallet.b.goit.study/api/* with TLS verification disabled upstream.
// CORS allows your GH Pages origin.

import axios from "axios";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });
const TARGET = (process.env.TARGET || "https://wallet.b.goit.study").replace(/\/?$/, "");
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN || "https://aurora-fintech.github.io";

const hopByHop = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
]);

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res
      .status(204)
      .setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN)
      .setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
      .setHeader(
        "Access-Control-Allow-Headers",
        req.headers["access-control-request-headers"] || "Content-Type, Authorization"
      )
      .setHeader("Access-Control-Allow-Credentials", "true")
      .setHeader("Vary", "Origin")
      .end();
    return;
  }

  const subpath = Array.isArray(req.query.path) ? `/${req.query.path.join('/')}` : "";
  const qs = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
  // Upstream expects /api prefix
  const url = `${TARGET}/api${subpath}${qs}`;

  const outgoingHeaders = {};
  for (const [k, v] of Object.entries(req.headers || {})) {
    const key = k.toLowerCase();
    if (!hopByHop.has(key) && key !== "host") outgoingHeaders[key] = v;
  }

  try {
    const resp = await axios({
      url,
      method: req.method,
      headers: outgoingHeaders,
      data: req.body,
      httpAgent: agent,
      httpsAgent: agent,
      validateStatus: () => true,
    });

    for (const [k, v] of Object.entries(resp.headers || {})) {
      const key = k.toLowerCase();
      if (!hopByHop.has(key)) res.setHeader(k, v);
    }
    res.setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");

    const body = typeof resp.data === "string" ? resp.data : JSON.stringify(resp.data);
    res.status(resp.status).send(body);
  } catch (e) {
    res
      .status(502)
      .setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN)
      .setHeader("Access-Control-Allow-Credentials", "true")
      .setHeader("Vary", "Origin")
      .json({ message: "Proxy error", error: e.message });
  }
}

