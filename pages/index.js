import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [detectedLocation, setDetectedLocation] = useState("");
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setResults([]);
    setDetectedLocation("");

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error(`API error occurred: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setDetectedLocation(data.detectedLocation);
        setResults(data.results);
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  return (
    <div>
      <h1>Search Cincinnati</h1>
      <input
        type="text"
        placeholder="Enter search query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {detectedLocation && <p>Detected Location: {detectedLocation}</p>}

      <ul>
        {results.map((result, index) => (
          <li key={index}>
            <h3>{result.title}</h3>
            <p>{result.snippet}</p>
            <a href={result.url} target="_blank" rel="noopener noreferrer">
              {result.url}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
