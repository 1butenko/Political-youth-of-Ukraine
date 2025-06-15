export const prerender = false;

import type { APIRoute } from "astro";
import { app } from "../../../firebase/server";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore(app);
const usersRef = db.collection("users");

export const POST: APIRoute = async ({ params, redirect, request }) => {
  const formData = await request.formData();
  const fname = formData.get("firstName")?.toString();
  const sname = formData.get("secondName")?.toString();
  const bio = formData.get("bio")?.toString();

  if (!fname || !sname || !bio) {
    return new Response("Missing required fields", {
      status: 400,
    });
  }

  if (!params.id) {
    return new Response("Cannot find friend", {
      status: 404,
    });
  }

  try {
    await usersRef.doc(params.id).update({
      fname,
      sname,
      bio,
    });
  } catch (error) {
    return new Response("Something went wrong", {
      status: 500,
    });
  }
  return redirect("/publisher");
};

export const DELETE: APIRoute = async ({ params, redirect }) => {
  if (!params.id) {
    return new Response("Cannot find friend", {
      status: 404,
    });
  }

  try {
    await usersRef.doc(params.id).delete();
  } catch (error) {
    return new Response("Something went wrong", {
      status: 500,
    });
  }
  return redirect("/publisher");
};