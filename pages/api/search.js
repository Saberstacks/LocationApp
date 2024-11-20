import axios from "axios";

export default async function handler(req, res) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required." });
  }

  const SERPSTACK_API_KEY = "YOUR_SERPSTACK_API_KEY";

  try {
    const response = await axios.get("https://api.serpstack.com/search", {
      params: {
        access_key: SERPSTACK_API_KEY,
        query: query,
        location: "Cincinnati, Ohio",
        num: 10
      }
    });

    if (response.data.success === false) {
      throw new Error(response.data.error.info);
    }

    const results = response.data.organic_results;
    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch data." });
  }
}
