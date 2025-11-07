import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.OMBARO_GOOGLE_CLIENT_ID!);

export const  verifyGoogleToken = async (token: string)  => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
}


export const fetchUserInfoFromGoogle = async (token: string)  => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch user info from Google");
  }
  return response.json();
}

export const google = async (token: string) => {
  let payload;
  try {
    payload = await verifyGoogleToken(token);
  } catch (error) {
    payload = await fetchUserInfoFromGoogle(token);
  }
  return payload
}