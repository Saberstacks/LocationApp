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
        auto_location: 0, // Disable auto-location
        gl: "us", // U.S. location targeting
        hl: "en", // English language
        google_domain: "google.com", // Explicit Google domain
        num: 10, // Limit to 10 results
      },
    });

    if (!response.data || !response.data.organic_results) {
      res.status(500).json({ error: "No results found or API error occurred" });
      return;
    }

    const results = response.data.organic_results.map((result) => ({
      title: result.title,
      url: result.url,
      snippet: result.snippet || "No snippet available",
      domain: result.domain,
    }));

    const detectedLocation = response.data.search_information?.detected_location || "Unknown";

    res.status(200).json({ detectedLocation, results });
  } catch (error) {
    console.error("Error in backend:", error.message);
    res.status(500).json({ error: "API request failed. Please check your API key and configuration." });
  }
}
