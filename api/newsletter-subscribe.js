import { db } from "../lib/firebaseAdmin.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email } = req.body;

  if (!email || !email.includes("@")) {
    return res.status(400).json({ message: "Invalid email" });
  }

  try {
    const existing = await db
      .collection("subscribers")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (!existing.empty) {
      return res.status(409).json({ message: "Email already subscribed" });
    }

    await db.collection("subscribers").add({
      email,
      createdAt: new Date(),
      source: "footer",
    });

    return res.status(200).json({ message: "Subscribed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
