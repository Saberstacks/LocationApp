import axios from "axios";

const SERPSTACK_API_KEY = process.env.SERPSTACK_API_KEY;

export default async function handler(req, res) {
  try {
    const { query } = req.query;

    // Validate the query parameter
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required." });
    }

    // Validate the API key
    if (!SERPSTACK_API_KEY) {
      return res.status(500).json({ error: "API key is missing in environment variables." });
    }

    // Make the request to Serpstack API
    const response = await axios.get("https://api.serpstack.com/search", {
      params: {
        access_key: SERPSTACK_API_KEY,
        query: query,
        google_domain: "google.com",
        gl: "us",
        hl: "en",
        location: "Cincinnati, Ohio",
        num: 10, // Limit to 10 results
      },
    });

    // Handle API response errors
    if (response.data.success === false) {
      throw new Error(response.data.error.info);
    }

    // Filter results to prioritize Cincinnati-based snippets
    const filteredResults = response.data.organic_results.filter((result) =>
      result.snippet && result.snippet.toLowerCase().includes("cincinnati")
    );

    // Return filtered results
    return res.status(200).json({ results: filteredResults });
  } catch (error) {
    console.error("API Error:", error.message); // Log error for debugging
    return res.status(500).json({
      error: error.message || "Failed to fetch data from Serpstack API.",
    });
  }
}
