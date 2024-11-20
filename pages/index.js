import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [detectedLocation, setDetectedLocation] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Please enter a search query.");
      return;
    }

    setError("");
    setResults([]);

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An unknown error occurred.");
      }

      const data = await response.json();
      setResults(data.results);
      setDetectedLocation(data.detectedLocation || "Unknown");
    } catch (err) {
      console.error("Error fetching results:", err.message);
      setError(err.message || "Failed to fetch results.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Search Cincinnati</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter search query"
        style={{ marginRight: "10px" }}
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <h3>Detected Location: {detectedLocation}</h3>
        {results.length > 0 ? (
          results.map((result, index) => (
            <div key={index} style={{ margin: "10px 0" }}>
              <a href={result.url} target="_blank" rel="noopener noreferrer">
                <h4>{result.title}</h4>
              </a>
              <p>{result.snippet}</p>
              <p style={{ color: "gray" }}>{result.domain}</p>
            </div>
          ))
        ) : (
          <p>No results yet. Try a new query.</p>
        )}
      </div>
    </div>
  );
}
