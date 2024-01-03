export default async function handler(req, res) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/add`, {
      method: "POST",
      body: req.body,
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
