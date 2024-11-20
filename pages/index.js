import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    setResults([]);
    setError(null);

    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.results);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div>
      <h1>Search for Cincinnati Results</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter your query"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <button type="submit">Search</button>
      </form>

      {error && <p>Error: {error}</p>}

      <div>
        {results.length > 0 &&
          results.map((result, index) => (
            <div key={index}>
              <h3>
                <a href={result.url} target="_blank" rel="noopener noreferrer">
                  {result.title}
                </a>
              </h3>
              <p>{result.snippet || "No description available."}</p>
            </div>
          ))}
        {results.length === 0 && !error && <p>No results yet. Try searching!</p>}
      </div>
    </div>
  );
}
