import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

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
      } else {
        setError(data.error || "An error occurred.");
      }
    } catch {
      setError("Failed to fetch results.");
    }
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <h1>Search Results for Cincinnati, Ohio</h1>
      <input
        type="text"
        placeholder="Enter search query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ padding: "10px", width: "300px" }}
      />
      <button onClick={handleSearch} style={{ marginLeft: "10px", padding: "10px" }}>
        Search
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {results.length > 0 && (
        <ul>
          {results.map((result, index) => (
            <li key={index} style={{ margin: "10px 0" }}>
              <a href={result.url} target="_blank" rel="noopener noreferrer">
                {result.title}
              </a>
              <p>{result.snippet}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
