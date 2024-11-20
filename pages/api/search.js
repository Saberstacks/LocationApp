import axios from "axios";

const SERPSTACK_API_KEY = process.env.SERPSTACK_API_KEY;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { query } = req.query;

  if (!query) {
    res.status(400).json({ error: "Missing search query" });
    return;
  }

  try {
    const response = await axios.get("https://api.serpstack.com/search", {
      params: {
        access_key: SERPSTACK_API_KEY,
        query,
        location: "Cincinnati, Ohio, United States", // Hardcoded location
        gl: "us", // U.S. targeting
        hl: "en", // English language
        google_domain: "google.com", // Explicit U.S. Google domain
        auto_location: 0, // Disables auto-location
        type: "web", // Ensures it's web search only
        num: 10, // Limits results to 10 for clarity
      },
    });

    const results = response.data.organic_results || [];

    // Append detected location for debugging
    const detectedLocation = response.data.search_information?.detected_location || "Unknown";

    res.status(200).json({
      detectedLocation,
      results: results.map((result) => ({
        title: result.title,
        url: result.url,
        snippet: result.snippet,
        domain: result.domain,
      })),
    });
  } catch (error) {
    console.error("Error fetching results:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}
