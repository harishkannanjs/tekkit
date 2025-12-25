import { db } from "../../lib/firebaseAdmin.js";

export async function handler(event) {
  // Handle CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }

  const { email } = JSON.parse(event.body || "{}");

  if (!email || !email.includes("@")) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Invalid email" }),
    };
  }

  try {
    const existing = await db
      .collection("subscribers")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existing.empty) {
      return {
        statusCode: 409,
        body: JSON.stringify({ message: "Email already subscribed" }),
      };
    }

    await db.collection("subscribers").add({
      email,
      createdAt: new Date(),
      source: "footer",
    });

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message: "Subscribed successfully" }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error" }),
    };
  }
}
