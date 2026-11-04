import { createRemoteJWKSet, jwtVerify } from "jose";

import { env } from "../config/env.js";
import { ApiError } from "./error.js";

const jwksUrl = new URL("/api/auth/jwks", env.betterAuthUrl);

const jwks = createRemoteJWKSet(jwksUrl, {
  cooldownDuration: 30_000,
  cacheMaxAge: 10 * 60_000,
});

const verifyOptions = {
  issuer: env.betterAuthUrl,
  audience: env.betterAuthUrl,
  algorithms: ["EdDSA"],
};

function extractBearerToken(req) {
  const header = req.headers.authorization;

  if (typeof header !== "string" || !header.startsWith("Bearer ")) {
    return null;
  }

  const token = header.slice("Bearer ".length).trim();
  return token || null;
}

async function verifyToken(token) {
  const { payload } = await jwtVerify(token, jwks, verifyOptions);

  if (typeof payload.sub !== "string" || !payload.sub) {
    throw new Error("The token does not contain a subject.");
  }

  return {
    id: payload.sub,
    email: typeof payload.email === "string" ? payload.email : "",
    name: typeof payload.name === "string" ? payload.name : "",
    image: typeof payload.image === "string" ? payload.image : "",
  };
}

export async function requireAuth(req, _res, next) {
  const token = extractBearerToken(req);

  if (!token) {
    throw new ApiError(401, "You must be signed in to do that.");
  }

  try {
    req.user = await verifyToken(token);
  } catch {
    throw new ApiError(
      401,
      "Your session has expired or is invalid. Please sign in again.",
    );
  }

  next();
}

export async function optionalAuth(req, _res, next) {
  const token = extractBearerToken(req);
  req.user = null;

  if (token) {
    try {
      req.user = await verifyToken(token);
    } catch {
      req.user = null;
    }
  }

  next();
}
