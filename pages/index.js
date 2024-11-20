import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [detectedLocation, setDetectedLocation] = useState("");

  const handleSearch = async () => {
    if (!query) {
      setError("Please enter a search query.");
      return;
    }

    setError("");
    setResults([]);

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (response.ok) {
        setResults(data.results);
        setDetectedLocation(data.detectedLocation);
      } else {
        setError(data.error || "An error occurred while fetching results.");
      }
    } catch (err) {
      setError("Failed to fetch results. Please try again.");
    }
  };

  return (
    <div>
      <h1>Search Cincinnati</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter search query"
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <h3>Detected Location: {detectedLocation || "Unknown"}</h3>
        {results.length > 0 ? (
          results.map((result, index) => (
            <div key={index} style={{ marginBottom: "10px" }}>
              <a href={result.url} target="_blank" rel="noopener noreferrer">
                <h3>{result.title}</h3>
              </a>
              <p>{result.snippet}</p>
              <p style={{ color: "gray" }}>{result.domain}</p>
            </div>
          ))
        ) : (
          <p>No results yet.</p>
        )}
      </div>
    </div>
  );
}
