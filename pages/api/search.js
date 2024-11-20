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
        location: "Cincinnati, Ohio",
        gl: "us",
        hl: "en",
        google_domain: "google.com",
      },
    });

    if (!response.data || !response.data.organic_results) {
      res.status(404).json({ error: "No results found for Cincinnati." });
      return;
    }

    res.status(200).json({
      results: response.data.organic_results.map((result) => ({
        title: result.title,
        url: result.url,
        snippet: result.snippet,
      })),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
