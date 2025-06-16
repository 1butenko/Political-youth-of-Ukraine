export const prerender = false;

import type { APIRoute } from "astro";
import { app } from "../../../firebase/server";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const auth = getAuth(app);
  const db = getFirestore();

  const idToken = request.headers.get("Authorization")?.split("Bearer ")[1];
  if (!idToken) {
    return new Response("No token found", { status: 401 });
  }

  let decodedToken;
  try {
    decodedToken = await auth.verifyIdToken(idToken);
  } catch (error) {
    return new Response("Invalid token", { status: 401 });
  }

  const uid = decodedToken.uid;

  const userRef = db.collection("users").doc(uid);
  const userSnap = await userRef.get();

  let firstLogin = false;

  if (!userSnap.exists) {
    await userRef.set({
      firstLogin: true,
      createdAt: Date.now(),
    });
    firstLogin = true;
  } else {
    const data = userSnap.data();
    firstLogin = data?.firstLogin === true;
  }

  const fiveDays = 60 * 60 * 24 * 5 * 1000;
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: fiveDays,
  });

  cookies.set("__session", sessionCookie, {
    path: "/",
    httpOnly: true,
    secure: true,
    maxAge: fiveDays / 1000,
  });

  return redirect(firstLogin ? "/onboarding" : "/publisher");
};
