import axios from "axios";

const SERPSTACK_API_KEY = process.env.SERPSTACK_API_KEY;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Missing search query" });
  }

  try {
    const response = await axios.get("https://api.serpstack.com/search", {
      params: {
        access_key: SERPSTACK_API_KEY,
        query,
        location: "Cincinnati, Ohio, United States", // Hardcoded location
        auto_location: 0,
        gl: "us",
        hl: "en",
        google_domain: "google.com",
        num: 10, // Limit to 10 results
      },
      timeout: 10000, // Set timeout to 10 seconds
    });

    const { organic_results, search_information } = response.data || {};

    if (!organic_results || organic_results.length === 0) {
      return res.status(500).json({
        error: "No results found. Ensure the API key and location are configured correctly.",
      });
    }

    const results = organic_results.map((result) => ({
      title: result.title,
      url: result.url,
      snippet: result.snippet || "No snippet available",
      domain: result.domain,
    }));

    const detectedLocation = search_information?.detected_location || "Unknown";

    res.status(200).json({ detectedLocation, results });
  } catch (error) {
    console.error("Error in backend:", error.message);

    // Log raw response for debugging if available
    if (error.response) {
      console.error("Raw API response:", error.response.data);
    }

    res.status(500).json({
      error: error.response?.data?.error?.info || "An unknown error occurred.",
    });
  }
}
