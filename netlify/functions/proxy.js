// Netlify Function: Proxy requests to the course backend while bypassing
// upstream's expired TLS certificate. Use at your own risk.
//
// Usage (production):
// - Deploy this function on Netlify
// - Set env TARGET=https://wallet.b.goit.study
// - Set env ALLOW_ORIGIN=https://aurora-fintech.github.io (or your Pages origin)
// - Set VITE_API_BASE_URL on GH Actions to https://<netlify-site>.netlify.app/.netlify/functions/proxy

import axios from "axios";
import https from "https";

const agent = new https.Agent({ rejectUnauthorized: false });

const hopByHopHeaders = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
]);

export async function handler(event) {
  const origin = process.env.ALLOW_ORIGIN || "*";
  const targetBase = (process.env.TARGET || "https://wallet.b.goit.study").replace(/\/?$/, "");

  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "access-control-allow-origin": origin,
        "access-control-allow-methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
        "access-control-allow-headers": event.headers["access-control-request-headers"] || "*",
        "access-control-allow-credentials": "true",
      },
      body: "",
    };
  }

  const method = event.httpMethod.toUpperCase();
  const path = event.path.replace(/^\/.netlify\/functions\/proxy/, "");
  const qs = event.rawQuery ? `?${event.rawQuery}` : "";
  const url = `${targetBase}${path}${qs}`;

  // Build headers, drop hop-by-hop
  const outgoingHeaders = {};
  for (const [k, v] of Object.entries(event.headers || {})) {
    const key = k.toLowerCase();
    if (!hopByHopHeaders.has(key)) {
      outgoingHeaders[key] = v;
    }
  }
  // Ensure host header matches target
  delete outgoingHeaders["host"];

  const isJson = (event.headers?.["content-type"] || "").includes("application/json");
  const data = event.body && isJson && event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;

  try {
    const resp = await axios({
      url,
      method,
      headers: outgoingHeaders,
      data,
      httpAgent: agent,
      httpsAgent: agent,
      validateStatus: () => true,
    });

    const resHeaders = {};
    for (const [k, v] of Object.entries(resp.headers || {})) {
      const key = k.toLowerCase();
      if (!hopByHopHeaders.has(key)) resHeaders[key] = v;
    }
    resHeaders["access-control-allow-origin"] = origin;
    resHeaders["access-control-allow-credentials"] = "true";

    const body = typeof resp.data === "string" ? resp.data : JSON.stringify(resp.data);

    return {
      statusCode: resp.status,
      headers: resHeaders,
      body,
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: {
        "access-control-allow-origin": origin,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        message: "Proxy error",
        error: err.message,
      }),
    };
  }
}

