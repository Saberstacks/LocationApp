import axios from "axios";

const SERPSTACK_API_KEY = process.env.SERPSTACK_API_KEY;

export default async function handler(req, res) {
  const { query } = req.query;

  // Validate the query parameter
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required." });
  }

  // Validate the API key
  if (!SERPSTACK_API_KEY) {
    return res.status(500).json({ error: "API key is missing in environment variables." });
  }

  try {
    // Make a request to the Serpstack API
    const response = await axios.get("https://api.serpstack.com/search", {
      params: {
        access_key: SERPSTACK_API_KEY,
        query: query,
        google_domain: "google.com", // Use the US Google domain
        gl: "us", // Country code for the United States
        hl: "en", // Language set to English
        location: "Cincinnati, Ohio", // Attempt location targeting
        num: 10, // Limit results to 10
      },
    });

    // Handle API errors
    if (response.data.success === false) {
      throw new Error(response.data.error.info);
    }

    // Filter results to ensure relevance to Cincinnati
    const results = response.data.organic_results.filter((result) =>
      result.snippet.toLowerCase().includes("cincinnati")
    );

    // Send filtered results back to the user
    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({
      error: error.message || "Failed to fetch data from Serpstack API.",
    });
  }
}
