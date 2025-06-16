export const prerender = false;

import type { APIRoute } from "astro";
import { app } from "../../../firebase/server";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const fname = formData.get("firstName")?.toString();
  const sname = formData.get("secondName")?.toString();
  const bio = formData.get("bio")?.toString();

  if (!fname || !sname || !bio) {
    return new Response("Missing required fields", { status: 400 });
  }

  const sessionCookie = cookies.get("__session")?.value;
  if (!sessionCookie) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const auth = getAuth(app);
    const decodedToken = await auth.verifySessionCookie(sessionCookie, true);
    const uid = decodedToken.uid;

    const db = getFirestore(app);
    const userRef = db.collection("users").doc(uid);

    await userRef.set(
      {
        fname,
        sname,
        bio,
        firstLogin: false,
      },
      { merge: true }
    );

    return redirect(`/publisher`);
  } catch (err) {
    console.error("User form submission error:", err);
    return new Response("Unauthorized or Firebase error", { status: 401 });
  }
};
