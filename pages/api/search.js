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
        gl: "us", // U.S. geo-targeting
        hl: "en", // Language English
        google_domain: "google.com", // Explicit Google domain
        auto_location: 0, // Force manual location
        type: "web", // Standard web search
        num: 10, // Limit to 10 results
      },
    });

    if (response.data && !response.data.success) {
      throw new Error(response.data.error?.info || "API error occurred");
    }

    const results = response.data?.organic_results || [];
    const detectedLocation = response.data?.search_information?.detected_location || "Unknown";

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
    console.error("Error in backend:", error.message);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
}
