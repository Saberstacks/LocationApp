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
        google_domain: "google.com",
        gl: "us",
        hl: "en",
        num: 10, // Limit results to 10
      },
    });

    const { organic_results } = response.data;

    if (!organic_results || organic_results.length === 0) {
      return res.status(200).json({
        message: "No results found for Cincinnati.",
        results: [],
      });
    }

    const results = organic_results.map((result) => ({
      title: result.title,
      url: result.url,
      snippet: result.snippet || "No snippet available",
    }));

    res.status(200).json({ results });
  } catch (error) {
    console.error("API Error:", error.message);

    res.status(500).json({
      error: error.response?.data?.error?.info || "API error occurred.",
    });
  }
}
