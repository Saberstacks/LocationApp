import axios from "axios";

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  const SERPSTACK_API_KEY = "YOUR_SERPSTACK_API_KEY";

  try {
    const response = await axios.get("https://api.serpstack.com/search", {
      params: {
        access_key: SERPSTACK_API_KEY,
        query,
        location: "Cincinnati, Ohio",
        num: 10
      }
    });

    const results = response.data.organic_results;
    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data from serpstack." });
  }
}
