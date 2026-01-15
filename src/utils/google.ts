import { createRemoteJWKSet, jwtVerify } from "jose";

const googleJwks = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

export async function verifyGoogleIdToken(idToken: string) {
  const { payload } = await jwtVerify(idToken, googleJwks, {
    issuer: ["https://accounts.google.com", "accounts.google.com"],
    audience: process.env.GOOGLE_CLIENT_ID!,
  });

  return {
    sub: String(payload.sub),
    email: String(payload.email),
    name: payload.name ? String(payload.name) : undefined,
    picture: payload.picture ? String(payload.picture) : undefined,
  };
}
